<script lang="ts">
	import { LAYER_CONTEXT_KEY, type FeatureLineStringProps, type LayerContext } from '$lib/types.js';
	import { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { LineString } from 'ol/geom.js';
	import { fromLonLat } from 'ol/proj.js';
	import { getContext, onMount } from 'svelte';

	let {
		coordinates = $bindable([]),
		projection = 'EPSG:3857',
		style,
		properties = {},
		feature = $bindable(null)
	}: FeatureLineStringProps = $props();

	const layerContext = getContext<LayerContext>(LAYER_CONTEXT_KEY);

	if (!layerContext) {
		throw new Error('FeatureLineString must be used within LayerVector');
	}

	let lineFeature: Feature | null = null;
	let isDestroyed = false;

	const transformCoordinates = (coords: Coordinate[]): Coordinate[] => {
		if (projection === 'EPSG:3857' && coords.length > 0 && coords[0].length === 2) {
			if (Math.abs(coords[0][0]) <= 180 && Math.abs(coords[0][1]) <= 90) {
				return coords.map((c) => fromLonLat(c));
			}
		}
		return coords;
	};

	onMount(() => {
		const geometry = new LineString(transformCoordinates(coordinates));
		lineFeature = new Feature({ geometry });
		feature = lineFeature;

		if (properties) {
			Object.entries(properties).forEach(([key, value]) => {
				lineFeature?.set(key, value);
			});
		}

		if (style) {
			lineFeature.setStyle(style);
		}

		layerContext.addFeature(lineFeature);

		return () => {
			isDestroyed = true;
			if (lineFeature) {
				layerContext.removeFeature(lineFeature);
				lineFeature = null;
				feature = null;
			}
		};
	});

	$effect(() => {
		if (lineFeature && !isDestroyed) {
			const geometry = lineFeature.getGeometry() as LineString;
			geometry.setCoordinates(transformCoordinates(coordinates));
		}
	});

	$effect(() => {
		if (lineFeature && !isDestroyed && style !== undefined) {
			lineFeature.setStyle(style);
		}
	});

	$effect(() => {
		if (lineFeature && !isDestroyed && properties) {
			Object.entries(properties).forEach(([key, value]) => {
				lineFeature?.set(key, value);
			});
		}
	});
</script>
