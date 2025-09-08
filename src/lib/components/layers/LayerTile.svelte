<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TileLayer from 'ol/layer/Tile.js';
	import OSM from 'ol/source/OSM.js';
	import XYZ from 'ol/source/XYZ.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type Source from 'ol/source/Source.js';

	interface Props {
		source?: 'osm' | 'xyz' | Source;
		url?: string;
		opacity?: number;
		visible?: boolean;
		zIndex?: number;
		minZoom?: number;
		maxZoom?: number;
		preload?: number;
		layer?: TileLayer<any> | null;
		attributions?: string | string[];
		crossOrigin?: string | null;
	}

	let {
		source = 'osm',
		url,
		opacity = 1,
		visible = true,
		zIndex,
		minZoom,
		maxZoom,
		preload = 0,
		layer = $bindable(null),
		attributions,
		crossOrigin
	}: Props = $props();

	const mapContext = getMapContext();
	let tileLayer: TileLayer<any> | null = null;
	let isDestroyed = false;

	onMount(() => {
		let layerSource: Source;

		if (typeof source === 'string') {
			if (source === 'osm') {
				layerSource = new OSM({ attributions, crossOrigin });
			} else if (source === 'xyz' && url) {
				layerSource = new XYZ({ url, attributions, crossOrigin });
			} else {
				layerSource = new OSM();
			}
		} else {
			layerSource = source;
		}

		const layerOptions: any = {
			source: layerSource,
			opacity,
			visible,
			preload
		};

		if (zIndex !== undefined) layerOptions.zIndex = zIndex;
		if (minZoom !== undefined) layerOptions.minZoom = minZoom;
		if (maxZoom !== undefined) layerOptions.maxZoom = maxZoom;

		tileLayer = new TileLayer(layerOptions);
		layer = tileLayer;
		mapContext.addLayer(tileLayer);

		return () => {
			isDestroyed = true;
			if (tileLayer) {
				mapContext.removeLayer(tileLayer);
				tileLayer.dispose();
				tileLayer = null;
				layer = null;
			}
		};
	});

	$effect(() => {
		if (tileLayer && !isDestroyed) {
			tileLayer.setOpacity(opacity);
		}
	});

	$effect(() => {
		if (tileLayer && !isDestroyed) {
			tileLayer.setVisible(visible);
		}
	});

	$effect(() => {
		if (tileLayer && !isDestroyed && zIndex !== undefined) {
			tileLayer.setZIndex(zIndex);
		}
	});
</script>