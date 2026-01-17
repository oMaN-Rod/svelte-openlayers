<script lang="ts">
	import MVT from 'ol/format/MVT.js';
	import WebGLVectorTileLayer from 'ol/layer/WebGLVectorTile.js';
	import VectorTileSource from 'ol/source/VectorTile.js';
	import { onMount } from 'svelte';
	import { getMap } from '../map/context.js';
	import type { LayerWebGLVectorTileProps } from './types.js';

	let {
		url,
		urls,
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		style,
		variables,
		preload = 0,
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
		disableHitDetection = false,
		layer = $bindable(null),
		source = $bindable(null)
	}: LayerWebGLVectorTileProps = $props();

	const map = getMap();
	let webglVectorTileLayer: WebGLVectorTileLayer<any> | null = null;
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
			preload,
			disableHitDetection
		};

		// Style is required for WebGLVectorTileLayer
		if (style !== undefined) layerOptions.style = style;
		if (variables) layerOptions.variables = variables;
		if (background) layerOptions.background = background;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		webglVectorTileLayer = new WebGLVectorTileLayer(layerOptions);
		layer = webglVectorTileLayer;
		map?.addLayer(webglVectorTileLayer);

		return () => {
			isDestroyed = true;
			if (webglVectorTileLayer) {
				try {
					map?.removeLayer(webglVectorTileLayer);
					webglVectorTileLayer.dispose();
				} catch (error) {
					// Silently handle WebGL context loss errors during cleanup
				} finally {
					webglVectorTileLayer = null;
					vectorTileSource = null;
					layer = null;
					source = null;
				}
			}
		};
	});

	// Reactive effects for property updates
	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed) {
			webglVectorTileLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed) {
			webglVectorTileLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed && zIndex !== undefined) {
			webglVectorTileLayer.setZIndex(zIndex);
		}
	});

	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed && style !== undefined) {
			webglVectorTileLayer.setStyle(style);
		}
	});

	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed && variables !== undefined) {
			webglVectorTileLayer.updateStyleVariables(variables);
		}
	});

	$effect(() => {
		if (webglVectorTileLayer && !isDestroyed) {
			webglVectorTileLayer.setPreload(preload);
		}
	});
</script>
