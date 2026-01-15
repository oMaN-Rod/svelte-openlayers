<script lang="ts">
	import { getFeatureStateContext } from '$lib/components/features/feature-context.js';
	import { getMap } from '$lib/components/map/context.js';
	import type { OverlayMarkerProps } from './types.js';
	import { Overlay } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import type { Point, Polygon } from 'ol/geom.js';
	import { onMount } from 'svelte';

	let {
		offset = [0, 0],
		positioning = 'center-center' as OverlayMarkerProps['positioning'],
		class: className = '',
		autoPan = false,
		stopEvent = true,
		overlay = $bindable(null),
		children
	}: OverlayMarkerProps = $props();

	const featureState = getFeatureStateContext();
	const map = getMap();

	if (!featureState) {
		console.warn(
			'Overlay.Marker must be used within a Feature component (Feature.Point, Feature.LineString, or Feature.Polygon)'
		);
	}

	let markerElement: HTMLDivElement;
	let olOverlay: Overlay | null = null;
	let isDestroyed = false;
	let isMounted = $state(false);

	function getFeatureCoordinate(): Coordinate | undefined {
		const feature = featureState?.getFeature();
		if (!feature) return undefined;

		const geometry = feature.getGeometry();
		if (!geometry) return undefined;

		const type = geometry.getType();

		if (type === 'Point') {
			return (geometry as Point).getCoordinates();
		} else if (type === 'LineString') {
			// Get center of line
			const extent = geometry.getExtent();
			return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
		} else if (type === 'Polygon') {
			// Get interior point (visual center)
			return (geometry as Polygon).getInteriorPoint().getCoordinates();
		}

		// Fallback to extent center for other geometry types
		const extent = geometry.getExtent();
		return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
	}

	onMount(() => {
		olOverlay = new Overlay({
			element: markerElement,
			offset,
			positioning,
			autoPan: autoPan ? { animation: { duration: 250 } } : false,
			stopEvent,
			className: `ol-overlay-marker ${className}`
		});
		overlay = olOverlay;

		map?.addOverlay(olOverlay);

		// Use requestAnimationFrame to wait for parent Feature's onMount to complete
		// Parent onMount runs after children, so we need to defer to next frame
		requestAnimationFrame(() => {
			if (!isDestroyed) {
				isMounted = true;
			}
		});

		return () => {
			isDestroyed = true;
			if (olOverlay) {
				map?.removeOverlay(olOverlay);
				olOverlay.setMap(null);
				olOverlay = null;
				overlay = null;
			}
		};
	});

	// Update position reactively after mount - triggers when isMounted changes
	// and will re-run when feature coordinates change
	$effect(() => {
		if (!olOverlay || isDestroyed || !isMounted) return;

		const coord = getFeatureCoordinate();
		if (coord) {
			olOverlay.setPosition(coord);
		}
	});

	$effect(() => {
		if (!olOverlay || isDestroyed) return;
		olOverlay.setOffset(offset);
	});

	$effect(() => {
		if (!olOverlay || isDestroyed || !positioning) return;
		olOverlay.setPositioning(positioning);
	});
</script>

<div bind:this={markerElement} class="marker-container {className}">
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.marker-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.ol-overlay-marker) {
		pointer-events: auto;
	}
</style>
