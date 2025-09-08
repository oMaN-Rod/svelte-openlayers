<script lang="ts">
	import { LAYER_CONTEXT_KEY, type FeaturePolygonProps, type LayerContext } from '$lib/types.js';
	import { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { Polygon } from 'ol/geom.js';
	import { fromLonLat } from 'ol/proj.js';
	import { getContext, onMount } from 'svelte';

	let {
		coordinates = $bindable([]),
		projection = 'EPSG:3857',
		style,
		properties = {},
		feature = $bindable(null)
	}: FeaturePolygonProps = $props();

	const layerContext = getContext<LayerContext>(LAYER_CONTEXT_KEY);

	if (!layerContext) {
		throw new Error('FeaturePolygon must be used within LayerVector');
	}

	let polygonFeature: Feature | null = null;
	let isDestroyed = false;

	const transformCoordinates = (coords: Coordinate[][]): Coordinate[][] => {
		if (
			projection === 'EPSG:3857' &&
			coords.length > 0 &&
			coords[0].length > 0 &&
			coords[0][0].length === 2
		) {
			if (Math.abs(coords[0][0][0]) <= 180 && Math.abs(coords[0][0][1]) <= 90) {
				return coords.map((ring) => ring.map((c) => fromLonLat(c)));
			}
		}
		return coords;
	};

	onMount(() => {
		const geometry = new Polygon(transformCoordinates(coordinates));
		polygonFeature = new Feature({ geometry });
		feature = polygonFeature;

		if (properties) {
			Object.entries(properties).forEach(([key, value]) => {
				polygonFeature?.set(key, value);
			});
		}

		if (style) {
			polygonFeature.setStyle(style);
		}

		layerContext.addFeature(polygonFeature);

		return () => {
			isDestroyed = true;
			if (polygonFeature) {
				layerContext.removeFeature(polygonFeature);
				polygonFeature = null;
				feature = null;
			}
		};
	});

	$effect(() => {
		if (polygonFeature && !isDestroyed) {
			const geometry = polygonFeature.getGeometry() as Polygon;
			geometry.setCoordinates(transformCoordinates(coordinates));
		}
	});

	$effect(() => {
		if (polygonFeature && !isDestroyed && style !== undefined) {
			polygonFeature.setStyle(style);
		}
	});

	$effect(() => {
		if (polygonFeature && !isDestroyed && properties) {
			Object.entries(properties).forEach(([key, value]) => {
				polygonFeature?.set(key, value);
			});
		}
	});
</script>
