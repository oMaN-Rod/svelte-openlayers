<script lang="ts">
	import { LAYER_CONTEXT_KEY, type FeaturePointProps, type LayerContext } from '$lib/types.js';
	import { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { Point } from 'ol/geom.js';
	import { fromLonLat } from 'ol/proj.js';
	import { getContext, onMount } from 'svelte';

	let {
		coordinates = $bindable([0, 0]),
		projection = 'EPSG:3857',
		style,
		properties = {},
		feature = $bindable(null)
	}: FeaturePointProps = $props();

	const layerContext = getContext<LayerContext>(LAYER_CONTEXT_KEY);

	if (!layerContext) {
		throw new Error('FeaturePoint must be used within LayerVector');
	}

	let pointFeature: Feature | null = null;
	let isDestroyed = false;

	const transformCoordinates = (coords: Coordinate): Coordinate => {
		if (projection === 'EPSG:3857' && coords.length === 2) {
			if (Math.abs(coords[0]) <= 180 && Math.abs(coords[1]) <= 90) {
				return fromLonLat(coords);
			}
		}
		return coords;
	};

	onMount(() => {
		const geometry = new Point(transformCoordinates(coordinates));
		pointFeature = new Feature({ geometry });
		feature = pointFeature;

		if (properties) {
			Object.entries(properties).forEach(([key, value]) => {
				pointFeature?.set(key, value);
			});
		}

		if (style) {
			pointFeature.setStyle(style);
		}

		layerContext.addFeature(pointFeature);

		return () => {
			isDestroyed = true;
			if (pointFeature) {
				layerContext.removeFeature(pointFeature);
				pointFeature = null;
				feature = null;
			}
		};
	});

	$effect(() => {
		if (pointFeature && !isDestroyed) {
			const geometry = pointFeature.getGeometry() as Point;
			geometry.setCoordinates(transformCoordinates(coordinates));
		}
	});

	$effect(() => {
		if (pointFeature && !isDestroyed && style !== undefined) {
			pointFeature.setStyle(style);
		}
	});

	$effect(() => {
		if (pointFeature && !isDestroyed && properties) {
			Object.entries(properties).forEach(([key, value]) => {
				pointFeature?.set(key, value);
			});
		}
	});
</script>
