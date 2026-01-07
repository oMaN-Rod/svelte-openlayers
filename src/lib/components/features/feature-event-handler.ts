/**
 * Shared logic for feature event handling.
 * Used by both interactive-layer.ts (single-layer) and hover-coordinator.ts (multi-layer).
 */

import { Feature } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { FeatureRegistrationWithState, FeatureStateUpdate } from './event-context.js';

/**
 * Mutable state for tracking hover and selection across features
 */
export interface FeatureEventState {
	currentHoveredReg: FeatureRegistrationWithState | null;
	currentSelectedReg: FeatureRegistrationWithState | null;
	/** WeakMap to store original styles for restoration */
	originalStyles: WeakMap<Feature, StyleLike | FlatStyleLike | undefined>;
}

/**
 * Create a new feature event state object
 */
export function createFeatureEventState(): FeatureEventState {
	return {
		currentHoveredReg: null,
		currentSelectedReg: null,
		originalStyles: new WeakMap()
	};
}

/**
 * Apply a style to a feature (only if style is defined)
 */
export function applyStyle(feature: Feature, style: StyleLike | FlatStyleLike | undefined): void {
	if (style !== undefined) {
		feature.setStyle(style as StyleLike);
	}
}

/**
 * Update a feature's style based on current hover/selection state
 */
export function updateFeatureStyle(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState
): void {
	const { feature, styles } = reg;

	// Store original style if not already stored
	if (!state.originalStyles.has(feature)) {
		state.originalStyles.set(feature, feature.getStyle() as StyleLike | undefined);
	}

	// Determine which style to apply (priority: selected > hover > original)
	const isSelected = state.currentSelectedReg?.feature === feature;
	const isHovered = state.currentHoveredReg?.feature === feature;

	if (isSelected && styles.selectedStyle) {
		applyStyle(feature, styles.selectedStyle);
	} else if (isHovered && styles.hoverStyle) {
		applyStyle(feature, styles.hoverStyle);
	} else {
		// Restore original style
		const originalStyle = state.originalStyles.get(feature);
		applyStyle(feature, originalStyle);
	}
}

/**
 * Notify a feature's state change handler with current state
 */
export function notifyStateChange(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState,
	update: Partial<FeatureStateUpdate>
): void {
	const isHovered = state.currentHoveredReg?.feature === reg.feature;
	const isSelected = state.currentSelectedReg?.feature === reg.feature;

	reg.onStateChange({
		isHovered,
		isSelected: update.isSelected !== undefined ? update.isSelected : isSelected,
		hoverCoordinate: update.hoverCoordinate,
		clickCoordinate: update.clickCoordinate
	});
}

/**
 * Handle hover end for a feature (style update, notification, callback)
 */
export function handleHoverEnd(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState
): void {
	updateFeatureStyle(state, reg);
	notifyStateChange(state, reg, { hoverCoordinate: undefined });

	if (reg.callbacks.onHoverEnd) {
		reg.callbacks.onHoverEnd(reg.feature);
	}
}

/**
 * Handle hover start for a feature (style update, notification, callback)
 */
export function handleHoverStart(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState,
	coordinate: Coordinate
): void {
	updateFeatureStyle(state, reg);
	notifyStateChange(state, reg, { hoverCoordinate: coordinate });

	if (reg.callbacks.onHover) {
		reg.callbacks.onHover(reg.feature, coordinate);
	}
}

/**
 * Handle hover coordinate update (same feature, position changed)
 */
export function handleHoverMove(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState,
	coordinate: Coordinate
): void {
	notifyStateChange(state, reg, { hoverCoordinate: coordinate });

	if (reg.callbacks.onHover) {
		reg.callbacks.onHover(reg.feature, coordinate);
	}
}

/**
 * Handle feature deselection (style update, notification, callback)
 */
export function handleDeselect(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState
): void {
	updateFeatureStyle(state, reg);
	notifyStateChange(state, reg, { isSelected: false, clickCoordinate: undefined });

	if (reg.callbacks.onDeselect) {
		reg.callbacks.onDeselect(reg.feature);
	}
}

/**
 * Handle feature selection (style update, notification, callback)
 */
export function handleSelect(
	state: FeatureEventState,
	reg: FeatureRegistrationWithState,
	coordinate: Coordinate
): void {
	updateFeatureStyle(state, reg);
	notifyStateChange(state, reg, { isSelected: true, clickCoordinate: coordinate });

	if (reg.callbacks.onSelect) {
		reg.callbacks.onSelect(reg.feature);
	}
}

/**
 * Handle onClick callback (separate from selection)
 */
export function handleClick(
	reg: FeatureRegistrationWithState,
	coordinate: Coordinate
): void {
	if (reg.callbacks.onClick) {
		reg.callbacks.onClick(reg.feature, coordinate);
	}
}

/**
 * Process hover state transition
 * Returns the new hovered registration (or null if none)
 */
export function processHoverTransition(
	state: FeatureEventState,
	newReg: FeatureRegistrationWithState | undefined,
	coordinate: Coordinate
): void {
	const currentReg = state.currentHoveredReg;

	if (newReg !== currentReg) {
		// Previous feature is no longer hovered
		if (currentReg) {
			state.currentHoveredReg = null;
			handleHoverEnd(state, currentReg);
		}

		// New feature is being hovered
		if (newReg) {
			state.currentHoveredReg = newReg;
			handleHoverStart(state, newReg, coordinate);
		}
	} else if (newReg) {
		// Same feature, but coordinate changed
		handleHoverMove(state, newReg, coordinate);
	}
}

/**
 * Process selection toggle
 */
export function processSelectionToggle(
	state: FeatureEventState,
	clickedReg: FeatureRegistrationWithState | undefined,
	coordinate: Coordinate
): void {
	// Call onClick for clicked feature (always fires)
	if (clickedReg) {
		handleClick(clickedReg, coordinate);
	}

	if (clickedReg) {
		if (state.currentSelectedReg === clickedReg) {
			// Clicking same feature - deselect
			state.currentSelectedReg = null;
			handleDeselect(state, clickedReg);
		} else {
			// Selecting new feature - deselect previous first
			if (state.currentSelectedReg) {
				const prevReg = state.currentSelectedReg;
				state.currentSelectedReg = null;
				handleDeselect(state, prevReg);
			}

			// Select new feature
			state.currentSelectedReg = clickedReg;
			handleSelect(state, clickedReg, coordinate);
		}
	} else {
		// Clicked empty space - deselect current
		if (state.currentSelectedReg) {
			const prevReg = state.currentSelectedReg;
			state.currentSelectedReg = null;
			handleDeselect(state, prevReg);
		}
	}
}

/**
 * Throttle state for requestAnimationFrame-based throttling
 */
export interface ThrottleState<T> {
	pendingEvent: T | null;
	rafId: number | null;
}

/**
 * Create throttle state
 */
export function createThrottleState<T>(): ThrottleState<T> {
	return {
		pendingEvent: null,
		rafId: null
	};
}

/**
 * Create a throttled event handler using requestAnimationFrame
 * Returns the throttled handler and a cancel function
 */
export function createThrottledHandler<T>(
	throttle: ThrottleState<T>,
	handler: (evt: T) => void,
	isDestroyed: () => boolean
): (evt: T) => void {
	return (evt: T) => {
		// Store the latest event (overwrites previous pending event)
		throttle.pendingEvent = evt;

		// Schedule processing if not already scheduled
		if (throttle.rafId === null) {
			throttle.rafId = requestAnimationFrame(() => {
				throttle.rafId = null;
				if (throttle.pendingEvent && !isDestroyed()) {
					handler(throttle.pendingEvent);
					throttle.pendingEvent = null;
				}
			});
		}
	};
}

/**
 * Cancel any pending throttled event
 */
export function cancelThrottle<T>(throttle: ThrottleState<T>): void {
	if (throttle.rafId !== null) {
		cancelAnimationFrame(throttle.rafId);
		throttle.rafId = null;
	}
	throttle.pendingEvent = null;
}