<script lang="ts">
	import { LAYER_CONTEXT_KEY, type LayerContext, type LayerWebGLProps } from '$lib/types.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type { Feature } from 'ol';
	import WebGLVectorLayer from 'ol/layer/WebGLVector.js';
	import VectorSource from 'ol/source/Vector.js';
	import { onMount, setContext } from 'svelte';

	let {
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		style,
		variables,
		layer = $bindable(null),
		source = $bindable(null),
		children,
		disableHitDetection = false
	}: LayerWebGLProps = $props();

	const mapContext = getMapContext();
	let webglLayer: WebGLVectorLayer<any> | null = null;
	let vectorSource: VectorSource | null = $state(null);
	let isDestroyed = false;

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

	setContext(LAYER_CONTEXT_KEY, layerContext);

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
		mapContext.addLayer(webglLayer);

		return () => {
			isDestroyed = true;
			if (webglLayer) {
				try {
					mapContext.removeLayer(webglLayer);
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
