import type { Map, MapBrowserEvent } from 'ol';
import { Feature } from 'ol';
import type Layer from 'ol/layer/Layer.js';
import type { FeatureEventRegistry } from '$lib/components/features/event-context.js';
import {
	createFeatureEventState,
	createThrottleState,
	createThrottledHandler,
	cancelThrottle,
	processHoverTransition,
	processSelectionToggle,
	handleHoverEnd,
	updateFeatureStyle,
	type FeatureEventState,
	type ThrottleState
} from '$lib/components/features/feature-event-handler.js';

export interface InteractiveLayerOptions {
	map: Map;
	layer: Layer<any>;
	registry: FeatureEventRegistry;
	hitTolerance?: number;
	/**
	 * When true, skip hover handling (handled by HoverCoordinator instead)
	 */
	skipHover?: boolean;
	/**
	 * When true, skip click/selection handling (handled by HoverCoordinator instead)
	 */
	skipClick?: boolean;
}

export interface InteractiveLayerController {
	/**
	 * Start listening for events
	 */
	setup(): void;

	/**
	 * Stop listening and cleanup
	 */
	cleanup(): void;

	/**
	 * Deselect the currently selected feature (if any)
	 */
	deselectCurrent(): void;
}

/**
 * Creates an interactive layer controller that handles hover and click events
 * for features registered with the event registry.
 */
export function createInteractiveLayerController(
	options: InteractiveLayerOptions
): InteractiveLayerController {
	const { map, layer, registry, hitTolerance = 0, skipHover = false, skipClick = false } = options;

	let isDestroyed = false;
	const state: FeatureEventState = createFeatureEventState();
	const throttle: ThrottleState<MapBrowserEvent<PointerEvent>> = createThrottleState();

	let moveHandler: ((evt: MapBrowserEvent<PointerEvent>) => void) | null = null;
	let clickHandler: ((evt: MapBrowserEvent<PointerEvent>) => void) | null = null;

	/**
	 * Find a feature at the given pixel, filtered to this layer
	 */
	function findFeatureAtPixel(pixel: number[]): Feature | null {
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
				hitTolerance,
				layerFilter: (l: Layer) => l === layer
			}
		);

		return foundFeature;
	}

	function handlePointerMove(evt: MapBrowserEvent<PointerEvent>): void {
		if (isDestroyed || !registry.hasInteractiveFeatures()) return;

		const foundFeature = findFeatureAtPixel(evt.pixel);
		const foundReg = foundFeature ? registry.findByFeature(foundFeature) : undefined;

		processHoverTransition(state, foundReg, evt.coordinate);
	}

	function handleClick(evt: MapBrowserEvent<PointerEvent>): void {
		if (isDestroyed || !registry.hasInteractiveFeatures()) return;

		const foundFeature = findFeatureAtPixel(evt.pixel);
		const foundReg = foundFeature ? registry.findByFeature(foundFeature) : undefined;

		processSelectionToggle(state, foundReg, evt.coordinate);
	}

	return {
		setup(): void {
			if (!map || isDestroyed) return;

			// Only set up click handling if not delegated to coordinator
			if (!skipClick) {
				clickHandler = handleClick;
				map.on('click', clickHandler);
			}

			// Only set up hover handling if not delegated to coordinator
			// Use throttled handler to limit processing to once per frame
			if (!skipHover) {
				moveHandler = createThrottledHandler(
					throttle,
					handlePointerMove,
					() => isDestroyed
				);
				map.on('pointermove', moveHandler);
			}
		},

		cleanup(): void {
			isDestroyed = true;

			// Cancel any pending animation frame
			cancelThrottle(throttle);

			if (map) {
				if (moveHandler) {
					map.un('pointermove', moveHandler);
				}
				if (clickHandler) {
					map.un('click', clickHandler);
				}
			}

			// Clear hover state (only if we were handling hover)
			if (!skipHover && state.currentHoveredReg) {
				handleHoverEnd(state, state.currentHoveredReg);
			}

			// Note: We don't clear selection on cleanup as that might be unexpected

			state.currentHoveredReg = null;
			moveHandler = null;
			clickHandler = null;
		},

		deselectCurrent(): void {
			if (state.currentSelectedReg) {
				const prevReg = state.currentSelectedReg;
				state.currentSelectedReg = null;

				updateFeatureStyle(state, prevReg);

				prevReg.onStateChange({
					isHovered: state.currentHoveredReg?.feature === prevReg.feature,
					isSelected: false,
					clickCoordinate: undefined
				});

				if (prevReg.callbacks.onDeselect) {
					prevReg.callbacks.onDeselect(prevReg.feature);
				}
			}
		}
	};
}