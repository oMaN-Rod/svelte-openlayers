<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import { getHoverCoordinator } from '$lib/components/map/hover-coordinator.js';
	import { type LayerContext, type LayerWebGLProps } from './types.js';
	import type { Feature } from 'ol';
	import WebGLVectorLayer from 'ol/layer/WebGLVector.js';
	import VectorSource from 'ol/source/Vector.js';
	import { onMount } from 'svelte';
	import { setLayerContext } from './context.js';
	import {
		createLazyFeatureEventRegistry,
		setFeatureEventRegistry
	} from '$lib/components/features/event-context.js';
	import {
		createInteractiveLayerController,
		type InteractiveLayerController
	} from './interactive-layer.js';

	let {
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		style,
		variables,
		hitTolerance = 0,
		layer = $bindable(null),
		source = $bindable(null),
		children,
		disableHitDetection = false
	}: LayerWebGLProps = $props();

	const map = getMap();
	const hoverCoordinator = getHoverCoordinator();
	let webglLayer: WebGLVectorLayer<any> | null = null;
	let vectorSource: VectorSource | null = $state(null);
	let isDestroyed = false;

	// Interactive layer controller - created lazily when first feature registers
	let interactiveController: InteractiveLayerController | null = null;
	let controllerInitialized = false;
	let hasWarnedHitDetection = false;

	/**
	 * Initialize the interactive controller when first interactive feature registers.
	 * This provides zero-cost abstraction when no features use events.
	 */
	function initializeInteractiveController(): void {
		if (controllerInitialized || isDestroyed || !map || !webglLayer) return;
		controllerInitialized = true;

		// Warn if hit detection is disabled
		if (disableHitDetection && !hasWarnedHitDetection) {
			console.warn(
				'LayerWebGL: Interactive features (onHover, onClick, etc.) will not work when disableHitDetection is true.'
			);
			hasWarnedHitDetection = true;
			return; // Don't set up controller if hit detection is disabled
		}

		// Register with hover coordinator if available (exclusiveHover mode)
		if (hoverCoordinator) {
			hoverCoordinator.registerLayer(webglLayer, featureEventRegistry, hitTolerance);
		}

		// Set up interactive layer controller for hover/click events
		// When hover coordinator exists, it handles both hover and click - controller is dormant
		interactiveController = createInteractiveLayerController({
			map,
			layer: webglLayer,
			registry: featureEventRegistry,
			hitTolerance,
			skipHover: !!hoverCoordinator,
			skipClick: !!hoverCoordinator
		});
		interactiveController.setup();
	}

	// Create lazy registry - controller is set up only when first feature registers
	const featureEventRegistry = createLazyFeatureEventRegistry({
		onFirstRegistration: initializeInteractiveController
	});
	setFeatureEventRegistry(featureEventRegistry);

	const layerContext: LayerContext = {
		getSource: () => vectorSource,
		getLayer: () => webglLayer,
		addFeature: (feature: Feature) => {
			if (vectorSource && !isDestroyed) {
				vectorSource.addFeature(feature);
			}
		},
		removeFeature: (feature: Feature) => {
			if (vectorSource && !isDestroyed) {
				vectorSource.removeFeature(feature);
			}
		},
		setStyle: (newStyle: any) => {
			if (webglLayer && !isDestroyed) {
				webglLayer.setStyle(newStyle);
			}
		}
	};

	setLayerContext(layerContext);

	onMount(() => {
		vectorSource = new VectorSource();
		source = vectorSource;

		const layerOptions: any = {
			source: vectorSource,
			opacity,
			visible,
			disableHitDetection
		};

		if (style) layerOptions.style = style;
		if (variables) layerOptions.variables = variables;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		webglLayer = new WebGLVectorLayer(layerOptions);
		layer = webglLayer;
		map?.addLayer(webglLayer);

		return () => {
			isDestroyed = true;

			// Unregister from hover coordinator (only if controller was initialized)
			if (controllerInitialized && hoverCoordinator && webglLayer) {
				hoverCoordinator.unregisterLayer(webglLayer);
			}

			// Clean up interactive controller
			if (interactiveController) {
				interactiveController.cleanup();
				interactiveController = null;
			}

			if (webglLayer) {
				try {
					map?.removeLayer(webglLayer);
					if (vectorSource) {
						vectorSource.clear();
						vectorSource = null;
						source = null;
					}
					webglLayer.dispose();
				} catch (error) {
					// Silently handle WebGL context loss errors during cleanup
				} finally {
					webglLayer = null;
					layer = null;
				}
			}
		};
	});

	$effect(() => {
		if (webglLayer && !isDestroyed) {
			webglLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (webglLayer && !isDestroyed) {
			webglLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (webglLayer && !isDestroyed && zIndex !== undefined) {
			webglLayer.setZIndex(zIndex);
		}
	});

	$effect(() => {
		if (webglLayer && !isDestroyed && style !== undefined) {
			webglLayer.setStyle(style);
		}
	});

	$effect(() => {
		if (webglLayer && !isDestroyed && variables !== undefined) {
			webglLayer.updateStyleVariables(variables);
		}
	});
</script>

{#if children && vectorSource}
	{@render children()}
{/if}
