import { createContext } from 'svelte';
import type { Map, MapBrowserEvent } from 'ol';
import { Feature } from 'ol';
import type Layer from 'ol/layer/Layer.js';
import type { FeatureEventRegistry, FeatureRegistrationWithState } from '$lib/components/features/event-context.js';
import {
	createFeatureEventState,
	createThrottleState,
	createThrottledHandler,
	cancelThrottle,
	updateFeatureStyle,
	handleHoverEnd,
	handleHoverStart,
	handleHoverMove,
	handleDeselect,
	handleSelect,
	handleClick,
	type FeatureEventState,
	type ThrottleState
} from '$lib/components/features/feature-event-handler.js';

/**
 * Registration for a layer with its event registry
 */
export interface LayerRegistration {
	layer: Layer<any>;
	registry: FeatureEventRegistry;
	hitTolerance: number;
}

export interface HoverCoordinator {
	/**
	 * Register a layer with the coordinator
	 * Layers are processed in registration order (later = higher priority)
	 */
	registerLayer(layer: Layer<any>, registry: FeatureEventRegistry, hitTolerance?: number): void;

	/**
	 * Unregister a layer
	 */
	unregisterLayer(layer: Layer<any>): void;

	/**
	 * Start listening for hover events
	 */
	setup(): void;

	/**
	 * Stop listening and cleanup
	 */
	cleanup(): void;
}

/**
 * Creates a hover coordinator that manages exclusive hover and selection state across all layers
 */
export function createHoverCoordinator(map: Map): HoverCoordinator {
	const layerRegistrations: LayerRegistration[] = [];
	let isDestroyed = false;

	// Shared state for hover/selection
	const state: FeatureEventState = createFeatureEventState();
	const throttle: ThrottleState<MapBrowserEvent<PointerEvent>> = createThrottleState();

	// Track which layer the current hovered/selected feature belongs to
	let currentHoveredLayer: Layer<any> | null = null;
	let currentSelectedLayer: Layer<any> | null = null;

	let moveHandler: ((evt: MapBrowserEvent<PointerEvent>) => void) | null = null;
	let clickHandler: ((evt: MapBrowserEvent<PointerEvent>) => void) | null = null;

	/**
	 * Find the topmost feature across all registered layers
	 */
	function findTopmostFeature(
		pixel: number[]
	): { reg: FeatureRegistrationWithState; layer: Layer<any> } | null {
		// Iterate in reverse order (last registered = topmost)
		for (let i = layerRegistrations.length - 1; i >= 0; i--) {
			const layerReg = layerRegistrations[i];

			if (!layerReg.registry.hasInteractiveFeatures()) continue;

			// Find feature at pixel for this layer
			let foundFeature: Feature | null = null;

			map.forEachFeatureAtPixel(
				pixel,
				(feature) => {
					if (feature instanceof Feature) {
						foundFeature = feature;
						return true; // Stop iteration
					}
					return false;
				},
				{
					hitTolerance: layerReg.hitTolerance,
					layerFilter: (l: Layer) => l === layerReg.layer
				}
			);

			if (foundFeature) {
				const reg = layerReg.registry.findByFeature(foundFeature);
				if (reg) {
					return { reg, layer: layerReg.layer };
				}
			}
		}
		return null;
	}

	function handlePointerMove(evt: MapBrowserEvent<PointerEvent>): void {
		if (isDestroyed) return;

		const found = findTopmostFeature(evt.pixel);
		const foundReg = found?.reg;
		const foundLayer = found?.layer ?? null;

		// Handle hover state changes
		if (foundReg !== state.currentHoveredReg) {
			// Previous feature is no longer hovered
			if (state.currentHoveredReg) {
				const prevReg = state.currentHoveredReg;
				state.currentHoveredReg = null;
				currentHoveredLayer = null;
				handleHoverEnd(state, prevReg);
			}

			// New feature is being hovered
			if (foundReg) {
				state.currentHoveredReg = foundReg;
				currentHoveredLayer = foundLayer;
				handleHoverStart(state, foundReg, evt.coordinate);
			}
		} else if (foundReg) {
			// Same feature, but coordinate changed
			handleHoverMove(state, foundReg, evt.coordinate);
		}
	}

	function handleClickEvent(evt: MapBrowserEvent<PointerEvent>): void {
		if (isDestroyed) return;

		const found = findTopmostFeature(evt.pixel);
		const foundReg = found?.reg;
		const foundLayer = found?.layer ?? null;

		// Call onClick for clicked feature (always fires)
		if (foundReg) {
			handleClick(foundReg, evt.coordinate);
		}

		// Handle selection toggle
		if (foundReg) {
			if (state.currentSelectedReg === foundReg) {
				// Clicking same feature - deselect
				state.currentSelectedReg = null;
				currentSelectedLayer = null;
				handleDeselect(state, foundReg);
			} else {
				// Selecting new feature - deselect previous first
				if (state.currentSelectedReg) {
					const prevReg = state.currentSelectedReg;
					state.currentSelectedReg = null;
					currentSelectedLayer = null;
					handleDeselect(state, prevReg);
				}

				// Select new feature
				state.currentSelectedReg = foundReg;
				currentSelectedLayer = foundLayer;
				handleSelect(state, foundReg, evt.coordinate);
			}
		} else {
			// Clicked empty space - deselect current
			if (state.currentSelectedReg) {
				const prevReg = state.currentSelectedReg;
				state.currentSelectedReg = null;
				currentSelectedLayer = null;
				handleDeselect(state, prevReg);
			}
		}
	}

	return {
		registerLayer(layer: Layer<any>, registry: FeatureEventRegistry, hitTolerance = 0): void {
			// Remove existing registration for this layer if any
			const existingIndex = layerRegistrations.findIndex((r) => r.layer === layer);
			if (existingIndex !== -1) {
				layerRegistrations.splice(existingIndex, 1);
			}

			layerRegistrations.push({ layer, registry, hitTolerance });
		},

		unregisterLayer(layer: Layer<any>): void {
			const index = layerRegistrations.findIndex((r) => r.layer === layer);
			if (index !== -1) {
				// If the currently hovered feature belongs to this layer, clear hover
				if (currentHoveredLayer === layer && state.currentHoveredReg) {
					const prevReg = state.currentHoveredReg;
					state.currentHoveredReg = null;
					currentHoveredLayer = null;

					updateFeatureStyle(state, prevReg);
					handleHoverEnd(state, prevReg);
				}

				// If the currently selected feature belongs to this layer, clear selection
				if (currentSelectedLayer === layer && state.currentSelectedReg) {
					const prevReg = state.currentSelectedReg;
					state.currentSelectedReg = null;
					currentSelectedLayer = null;

					updateFeatureStyle(state, prevReg);
					handleDeselect(state, prevReg);
				}

				layerRegistrations.splice(index, 1);
			}
		},

		setup(): void {
			if (isDestroyed) return;

			// Use throttled handler to limit processing to once per frame
			moveHandler = createThrottledHandler(
				throttle,
				handlePointerMove,
				() => isDestroyed
			);
			clickHandler = handleClickEvent;

			map.on('pointermove', moveHandler);
			map.on('click', clickHandler);
		},

		cleanup(): void {
			isDestroyed = true;

			// Cancel any pending animation frame
			cancelThrottle(throttle);

			if (moveHandler) {
				map.un('pointermove', moveHandler);
				moveHandler = null;
			}

			if (clickHandler) {
				map.un('click', clickHandler);
				clickHandler = null;
			}

			// Clear hover state
			if (state.currentHoveredReg) {
				handleHoverEnd(state, state.currentHoveredReg);
			}

			// Clear selection state
			if (state.currentSelectedReg) {
				handleDeselect(state, state.currentSelectedReg);
			}

			state.currentHoveredReg = null;
			state.currentSelectedReg = null;
			currentHoveredLayer = null;
			currentSelectedLayer = null;
			layerRegistrations.length = 0;
		}
	};
}

// Context for Map to provide and layers to consume
const [getCoordinator, setHoverCoordinator] = createContext<HoverCoordinator>();

function getHoverCoordinator(): HoverCoordinator | undefined {
	try {
		return getCoordinator();
	} catch {
		// No coordinator available - exclusiveHover not enabled
		return undefined;
	}
}

export { setHoverCoordinator, getHoverCoordinator };