<script lang="ts">
	import { View } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { fromLonLat, get as getProjection } from 'ol/proj.js';
	import { onMount } from 'svelte';
	import { setView } from './context.js';
	import type { ViewProps } from './types.js';

	let {
		view = $bindable(null),
		center = $bindable([0, 0]),
		zoom = $bindable(5),
		bbox = $bindable(null),
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
		onMoveEnd,
		children
	}: ViewProps = $props();

	/**
	 * Transform center coordinates based on projection units.
	 *
	 * - Pixel/tile-pixel projections (custom image projections): never transform
	 * - Degree-based projections (EPSG:4326): no transform needed
	 * - Meter/feet-based projections (EPSG:3857, UTM, etc.): transform if input
	 *   appears to be lon/lat coordinates (within ±180/±90 range)
	 *
	 * Edge case: If you need to pass small meter values (e.g., [50, 30]) to a
	 * meters-based projection, use `fromLonLat()` explicitly in your code or
	 * pass coordinates that fall outside the ±180/±90 range.
	 */
	const transformCenter = (c: Coordinate): Coordinate => {
		const proj = typeof projection === 'string' ? getProjection(projection) : projection;
		if (!proj || c.length < 2) return c;

		const units = proj.getUnits();

		// Pixel/tile-pixel projections: never transform (custom image projections)
		if (units === 'pixels' || units === 'tile-pixels') {
			return c;
		}

		// Degree-based projections: already in correct format
		if (units === 'degrees') {
			return c;
		}

		// Meters/feet-based projections: apply lon/lat heuristic
		if (units === 'm' || units === 'ft' || units === 'us-ft') {
			if (Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 90) {
				return fromLonLat(c, projection);
			}
		}

		return c;
	};

	onMount(() => {
		view = setView(
			new View({
				center: center ? transformCenter(center) : undefined,
				zoom,
				projection,
				minZoom,
				maxZoom,
				rotation,
				extent,
				constrainRotation,
				enableRotation
			})
		);

		bbox = view?.calculateExtent();

		if (!view) {
			return;
		}
		if (onCenterChange) {
			view.on('change:center', onCenterChange);
		}
		if (onZoomChange) {
			view.on('change:zoom', onZoomChange);
		}
		if (onRotationChange) {
			view.on('change:rotation', onRotationChange);
		}
		if (onMoveEnd) {
			view.on('change:move', onMoveEnd);
		}
		view.on('change:center', () => {
			const newCenter = view?.getCenter();
			const newBbox = view?.calculateExtent();
			bbox = newBbox ? newBbox : bbox;
			if (newCenter) {
				center = newCenter;
				onCenterChange?.(newCenter);
			}
		});
		view.on('change:resolution', () => {
			const newZoom = view?.getZoom();
			const newBbox = view?.calculateExtent();
			bbox = newBbox ? newBbox : bbox;
			if (newZoom !== undefined) {
				zoom = newZoom;
				onZoomChange?.(newZoom);
			}
		});

		view.on('change:rotation', () => {
			const newBbox = view?.calculateExtent();
			bbox = newBbox ? newBbox : bbox;
			const newRotation = view?.getRotation();
			if (newRotation !== undefined) {
				rotation = newRotation;
				onRotationChange?.(newRotation);
			}
		});
	});
	$effect(() => {
		if (zoom != view?.getZoom()) {
			view?.animate({ zoom });
		}
	});
</script>

{#if view}
	{@render children?.()}
{/if}
