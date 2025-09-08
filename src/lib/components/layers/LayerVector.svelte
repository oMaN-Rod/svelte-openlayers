<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import VectorLayer from 'ol/layer/Vector.js';
	import VectorSource from 'ol/source/Vector.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type { Snippet } from 'svelte';
	import type { Feature } from 'ol';
	import type { StyleLike } from 'ol/style/Style.js';
	import { LAYER_CONTEXT_KEY, type LayerContext } from '$lib/types.js';

	interface Props {
		opacity?: number;
		visible?: boolean;
		zIndex?: number;
		minZoom?: number;
		maxZoom?: number;
		style?: StyleLike;
		updateWhileAnimating?: boolean;
		updateWhileInteracting?: boolean;
		renderBuffer?: number;
		layer?: VectorLayer<any> | null;
		source?: VectorSource | null;
		children?: Snippet;
	}

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
	}: Props = $props();

	const mapContext = getMapContext();
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
		setStyle: (newStyle: StyleLike) => {
			if (vectorLayer && !isDestroyed) {
				vectorLayer.setStyle(newStyle);
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
			updateWhileAnimating,
			updateWhileInteracting,
			renderBuffer
		};

		if (style) layerOptions.style = style;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		vectorLayer = new VectorLayer(layerOptions);
		layer = vectorLayer;
		mapContext.addLayer(vectorLayer);

		return () => {
			isDestroyed = true;
			if (vectorLayer) {
				mapContext.removeLayer(vectorLayer);
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
