<script lang="ts">
	import { getLayerContext } from '$lib/components/layers/context.js';
	import { type FeaturePointProps } from './types.js';
	import { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { Point } from 'ol/geom.js';
	import { fromLonLat } from 'ol/proj.js';
	import { onMount } from 'svelte';
	import { getFeatureEventRegistry, type FeatureStateUpdate } from './event-context.js';
	import { setFeatureStateContext, type FeatureStateContext } from './feature-context.js';

	let {
		coordinates = $bindable([]),
		feature = $bindable(null),
		projection = 'EPSG:3857',
		style,
		properties = {},
		hoverStyle,
		selectedStyle,
		onHover,
		onHoverEnd,
		onClick,
		onSelect,
		onDeselect,
		children
	}: FeaturePointProps = $props();

	const layerContext = getLayerContext();

	if (!layerContext) {
		throw new Error('FeaturePoint must be used within LayerVector');
	}

	// Determine at initialization if this feature needs interactivity
	// This check runs once at component creation to avoid unnecessary allocations
	const hasCallbacks = !!(onHover || onHoverEnd || onClick || onSelect || onDeselect);
	const isInteractive = hasCallbacks || !!children;

	// Get the event registry from parent layer (only if interactive)
	const eventRegistry = isInteractive ? getFeatureEventRegistry() : undefined;

	let pointFeature: Feature | null = null;
	let isDestroyed = false;

	// Only generate UUID for interactive features (expensive operation)
	const featureId = isInteractive ? crypto.randomUUID() : '';

	// Only allocate reactive state for interactive features
	// This provides zero-cost abstraction for static features
	let isHovered = $state(false);
	let isSelected = $state(false);
	let hoverCoordinate: Coordinate | undefined = $state(undefined);
	let clickCoordinate: Coordinate | undefined = $state(undefined);

	// Only provide state context for children if they exist
	if (children) {
		const featureStateContext: FeatureStateContext = {
			getFeature: () => pointFeature,
			get isHovered() {
				return isHovered;
			},
			get isSelected() {
				return isSelected;
			},
			get hoverCoordinate() {
				return hoverCoordinate;
			},
			get clickCoordinate() {
				return clickCoordinate;
			}
		};
		setFeatureStateContext(featureStateContext);
	}

	// Handle state updates from the layer's event system
	// Selection fields are optional - only update when explicitly provided
	function handleStateChange(state: FeatureStateUpdate): void {
		isHovered = state.isHovered;
		if (state.isSelected !== undefined) {
			isSelected = state.isSelected;
		}
		hoverCoordinate = state.hoverCoordinate;
		if (state.clickCoordinate !== undefined) {
			clickCoordinate = state.clickCoordinate;
		}
	}

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

		// Register with event registry only for interactive features
		if (eventRegistry && isInteractive && pointFeature) {
			eventRegistry.registerFeature(
				featureId,
				pointFeature,
				{ onHover, onHoverEnd, onClick, onSelect, onDeselect },
				{ hoverStyle, selectedStyle },
				handleStateChange
			);
		}

		return () => {
			isDestroyed = true;

			// Unregister from event registry
			if (eventRegistry && isInteractive) {
				eventRegistry.unregisterFeature(featureId);
			}

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

{#if children}
	{@render children()}
{/if}
