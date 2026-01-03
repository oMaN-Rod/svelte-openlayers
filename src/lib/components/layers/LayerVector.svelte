<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import { type LayerContext, type LayerVectorProps } from '$lib/types.js';
	import type { Feature } from 'ol';
	import VectorLayer from 'ol/layer/Vector.js';
	import VectorSource from 'ol/source/Vector.js';
	import type { FlatStyleLike } from 'ol/style/flat.js';
	import type { StyleLike } from 'ol/style/Style.js';
	import { onMount } from 'svelte';
	import { setLayerContext } from './context.js';

	let {
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		style,
		updateWhileAnimating = false,
		updateWhileInteracting = false,
		renderBuffer = 100,
		layer = $bindable(null),
		source = $bindable(null),
		children
	}: LayerVectorProps = $props();

	const map = getMap();
	let vectorLayer: VectorLayer<any> | null = null;
	let vectorSource: VectorSource | null = $state(null);
	let isDestroyed = false;

	const layerContext: LayerContext = {
		getSource: () => vectorSource,
		getLayer: () => vectorLayer,
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
		setStyle: (newStyle: StyleLike | FlatStyleLike) => {
			if (vectorLayer && !isDestroyed) {
				vectorLayer.setStyle(newStyle as StyleLike);
			}
		}
	};

	setLayerContext(layerContext);

	function initLayer() {
		if (source instanceof VectorSource) {
			vectorSource = source;
		} else {
			vectorSource = new VectorSource();
			source = vectorSource;
		}

		const layerOptions: any = {
			source: vectorSource,
			opacity,
			visible,
			updateWhileAnimating,
			updateWhileInteracting,
			renderBuffer
		};

		if (style) layerOptions.style = style;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		return new VectorLayer(layerOptions);
	}

	onMount(() => {
		if (layer && layer instanceof VectorLayer) {
			vectorLayer = layer;
		} else {
			vectorLayer = initLayer();
			layer = vectorLayer;
		}

		map?.addLayer(vectorLayer);

		return () => {
			isDestroyed = true;
			if (vectorLayer) {
				map?.removeLayer(vectorLayer);
				if (vectorSource) {
					vectorSource.clear();
					vectorSource = null;
					source = null;
				}
				vectorLayer.dispose();
				vectorLayer = null;
				layer = null;
			}
		};
	});

	$effect(() => {
		if (vectorLayer && !isDestroyed) {
			vectorLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (vectorLayer && !isDestroyed) {
			vectorLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (vectorLayer && !isDestroyed && zIndex !== undefined) {
			vectorLayer.setZIndex(zIndex);
		}
	});

	$effect(() => {
		if (vectorLayer && !isDestroyed && style !== undefined) {
			vectorLayer.setStyle(style);
		}
	});
</script>

{#if children && vectorSource}
	{@render children()}
{/if}
