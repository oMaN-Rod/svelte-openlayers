<script lang="ts">
	import type { LayerStaticProps } from './types.js';
	import { onMount } from 'svelte';
	import Static from 'ol/source/ImageStatic.js';
	import ImageLayer from 'ol/layer/Image.js';
	import { getMap } from '$lib/components/map/context.js';

	let {
		url,
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		preload = 0,
		layer = $bindable(null),
		attributions,
		extent,
		projection
	}: LayerStaticProps = $props();

	const map = getMap();
	let isDestroyed = false;

	onMount(() => {
		const layerOptions: any = {
			attributions,
			url,
			projection,
			imageExtent: extent,
			opacity,
			visible,
			preload
		};

		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		layer = new ImageLayer({
			source: new Static(layerOptions)
		});

		map?.addLayer(layer);

		return () => {
			isDestroyed = true;
			if (layer) {
				map?.removeLayer(layer);
				layer.dispose();
				layer = null;
			}
		};
	});

	$effect(() => {
		if (!layer || isDestroyed) return;

		layer.setOpacity(opacity);
		layer.setVisible(visible);

		if (zIndex) layer.setZIndex(zIndex);
	});
</script>
