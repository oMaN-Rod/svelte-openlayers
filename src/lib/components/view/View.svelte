<script lang="ts">
	import type { ViewProps } from './types.js';
	import { View } from 'ol';
	import { fromLonLat } from 'ol/proj.js';
	import { onMount } from 'svelte';
	import { setView } from './context.js';

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

	onMount(() => {
		view = setView(
			new View({
				center: center ? fromLonLat(center) : undefined,
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
