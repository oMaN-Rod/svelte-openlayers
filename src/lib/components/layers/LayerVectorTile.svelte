<script lang="ts">
	import type { LayerVectorTileProps } from './types.js';
	import VectorTileLayer from 'ol/layer/VectorTile.js';
	import VectorTileSource from 'ol/source/VectorTile.js';
	import MVT from 'ol/format/MVT.js';
	import { onMount } from 'svelte';
	import { getMap } from '../map/context.js';

	let {
		url,
		urls,
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		style,
		declutter = false,
		renderMode = 'hybrid',
		preload = 0,
		renderBuffer = 100,
		updateWhileAnimating = false,
		updateWhileInteracting = false,
		background,
		format,
		projection,
		tileGrid,
		tileSize,
		sourceMaxZoom,
		sourceMinZoom,
		overlaps,
		attributions,
		wrapX,
		transition,
		layer = $bindable(null),
		source = $bindable(null)
	}: LayerVectorTileProps = $props();

	const map = getMap();
	let vectorTileLayer: VectorTileLayer | null = null;
	let vectorTileSource: VectorTileSource<any> | null = null;
	let isDestroyed = false;

	onMount(() => {
		// Create source if not provided externally
		if (source instanceof VectorTileSource) {
			vectorTileSource = source;
		} else {
			const sourceOptions: any = {
				format: format ?? new MVT()
			};

			if (url) sourceOptions.url = url;
			if (urls) sourceOptions.urls = urls;
			if (projection) sourceOptions.projection = projection;
			if (tileGrid) sourceOptions.tileGrid = tileGrid;
			if (tileSize !== undefined) sourceOptions.tileSize = tileSize;
			if (sourceMaxZoom !== undefined) sourceOptions.maxZoom = sourceMaxZoom;
			if (sourceMinZoom !== undefined) sourceOptions.minZoom = sourceMinZoom;
			if (overlaps !== undefined) sourceOptions.overlaps = overlaps;
			if (attributions) sourceOptions.attributions = attributions;
			if (wrapX !== undefined) sourceOptions.wrapX = wrapX;
			if (transition !== undefined) sourceOptions.transition = transition;

			vectorTileSource = new VectorTileSource(sourceOptions);
			source = vectorTileSource;
		}

		// Create layer options
		const layerOptions: any = {
			source: vectorTileSource,
			opacity,
			visible,
			declutter,
			renderMode,
			preload,
			renderBuffer,
			updateWhileAnimating,
			updateWhileInteracting
		};

		if (style !== undefined) layerOptions.style = style;
		if (background) layerOptions.background = background;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		vectorTileLayer = new VectorTileLayer(layerOptions);
		layer = vectorTileLayer;
		map?.addLayer(vectorTileLayer);

		return () => {
			isDestroyed = true;
			if (vectorTileLayer) {
				map?.removeLayer(vectorTileLayer);
				vectorTileLayer.dispose();
				vectorTileLayer = null;
				vectorTileSource = null;
				layer = null;
				source = null;
			}
		};
	});

	// Reactive effects for property updates
	$effect(() => {
		if (vectorTileLayer && !isDestroyed) {
			vectorTileLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (vectorTileLayer && !isDestroyed) {
			vectorTileLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (vectorTileLayer && !isDestroyed && zIndex !== undefined) {
			vectorTileLayer.setZIndex(zIndex);
		}
	});

	$effect(() => {
		if (vectorTileLayer && !isDestroyed && style !== undefined) {
			vectorTileLayer.setStyle(style);
		}
	});

	$effect(() => {
		if (vectorTileLayer && !isDestroyed) {
			vectorTileLayer.setPreload(preload);
		}
	});
</script>