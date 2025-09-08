<script lang="ts">
	import { onMount } from 'svelte';
	import { View } from 'ol';
	import { fromLonLat, transformExtent } from 'ol/proj.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type { ViewProps } from '$lib/types.js';
	import type { Coordinate } from 'ol/coordinate.js';

	interface Props extends ViewProps {}

	let {
		center = $bindable([0, 0]),
		zoom = $bindable(2),
		projection = 'EPSG:3857',
		minZoom = 0,
		maxZoom = 28,
		rotation = $bindable(0),
		extent,
		constrainRotation = true,
		enableRotation = true,
		onCenterChange,
		onZoomChange,
		onRotationChange,
		onMoveEnd
	}: Props = $props();

	const mapContext = getMapContext();
	let view: View | null = null;

	const transformCenter = (c: Coordinate): Coordinate => {
		if (projection === 'EPSG:3857' && c.length === 2) {
			if (Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 90) {
				return fromLonLat(c);
			}
		}
		return c;
	};

	onMount(() => {
		const viewOptions: any = {
			center: transformCenter(center),
			zoom,
			projection,
			minZoom,
			maxZoom,
			rotation,
			constrainRotation,
			enableRotation
		};

		if (extent) {
			viewOptions.extent =
				projection === 'EPSG:3857' ? transformExtent(extent, 'EPSG:4326', 'EPSG:3857') : extent;
		}

		view = new View(viewOptions);
		const map = mapContext.getMap();

		if (map) {
			map.setView(view);

			view.on('change:center', () => {
				const newCenter = view?.getCenter();
				if (newCenter) {
					center = newCenter;
					onCenterChange?.(newCenter);
				}
			});

			view.on('change:resolution', () => {
				const newZoom = view?.getZoom();
				if (newZoom !== undefined) {
					zoom = newZoom;
					onZoomChange?.(newZoom);
				}
			});

			view.on('change:rotation', () => {
				const newRotation = view?.getRotation();
				if (newRotation !== undefined) {
					rotation = newRotation;
					onRotationChange?.(newRotation);
				}
			});

			if (onMoveEnd) {
				map.on('moveend', onMoveEnd);
			}
		}

		return () => {
			if (view) {
				view.dispose();
				view = null;
			}
		};
	});

	$effect(() => {
		if (view) {
			const transformedCenter = transformCenter(center);
			const currentCenter = view.getCenter();
			if (
				currentCenter &&
				(currentCenter[0] !== transformedCenter[0] || currentCenter[1] !== transformedCenter[1])
			) {
				view.setCenter(transformedCenter);
			}
		}
	});

	$effect(() => {
		if (view && view.getZoom() !== zoom) {
			view.setZoom(zoom);
		}
	});

	$effect(() => {
		if (view && view.getRotation() !== rotation) {
			view.setRotation(rotation);
		}
	});
</script>
