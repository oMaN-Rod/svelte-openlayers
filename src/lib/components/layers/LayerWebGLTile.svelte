<script lang="ts">
	import WebGLTileLayer from 'ol/layer/WebGLTile.js';
	import type DataTileSource from 'ol/source/DataTile.js';
	import OSM from 'ol/source/OSM.js';
	import XYZ from 'ol/source/XYZ.js';
	import { onMount } from 'svelte';
	import { getMap } from '../map/context.js';
	import type { LayerWebGLTileProps } from './types.js';

	let {
		source = 'osm',
		url,
		urls,
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		preload = 0,
		style,
		cacheSize = 512,
		layer = $bindable(null),
		attributions,
		crossOrigin
	}: LayerWebGLTileProps = $props();

	const map = getMap();
	let webglTileLayer: WebGLTileLayer | null = null;
	let isDestroyed = false;

	onMount(() => {
		let layerSource: DataTileSource<any>;

		if (typeof source === 'string') {
			if (source === 'osm') {
				layerSource = new OSM({ attributions, crossOrigin }) as unknown as DataTileSource<any>;
			} else if (source === 'xyz' && (url || urls)) {
				const xyzOptions: any = { attributions, crossOrigin };
				if (url) xyzOptions.url = url;
				if (urls) xyzOptions.urls = urls;
				layerSource = new XYZ(xyzOptions) as unknown as DataTileSource<any>;
			} else {
				layerSource = new OSM() as unknown as DataTileSource<any>;
			}
		} else {
			layerSource = source as DataTileSource<any>;
		}

		const layerOptions: any = {
			source: layerSource,
			opacity,
			visible,
			preload,
			cacheSize
		};

		if (style) layerOptions.style = style;
		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		webglTileLayer = new WebGLTileLayer(layerOptions);
		layer = webglTileLayer;
		map?.addLayer(webglTileLayer);

		return () => {
			isDestroyed = true;
			if (webglTileLayer) {
				try {
					map?.removeLayer(webglTileLayer);
					webglTileLayer.dispose();
				} catch (error) {
					// Silently handle WebGL context loss errors during cleanup
				} finally {
					webglTileLayer = null;
					layer = null;
				}
			}
		};
	});

	$effect(() => {
		if (webglTileLayer && !isDestroyed) {
			webglTileLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (webglTileLayer && !isDestroyed) {
			webglTileLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (webglTileLayer && !isDestroyed && zIndex !== undefined) {
			webglTileLayer.setZIndex(zIndex);
		}
	});

	$effect(() => {
		if (webglTileLayer && !isDestroyed) {
			webglTileLayer.setPreload(preload);
		}
	});

	$effect(() => {
		if (webglTileLayer && !isDestroyed && style !== undefined) {
			webglTileLayer.setStyle(style);
		}
	});
</script>
