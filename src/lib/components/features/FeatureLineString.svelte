<script lang="ts">
	import { getLayerContext } from '$lib/components/layers/context.js';
	import { type FeatureLineStringProps } from './types.js';
	import { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { LineString } from 'ol/geom.js';
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
	}: FeatureLineStringProps = $props();

	const layerContext = getLayerContext();

	if (!layerContext) {
		throw new Error('FeatureLineString must be used within LayerVector');
	}

	// Determine at initialization if this feature needs interactivity
	// This check runs once at component creation to avoid unnecessary allocations
	const hasCallbacks = !!(onHover || onHoverEnd || onClick || onSelect || onDeselect);
	const isInteractive = hasCallbacks || !!children;

	// Get the event registry from parent layer (only if interactive)
	const eventRegistry = isInteractive ? getFeatureEventRegistry() : undefined;

	let lineFeature: Feature | null = null;
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
			getFeature: () => lineFeature,
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

		// Register with event registry only for interactive features
		if (eventRegistry && isInteractive && lineFeature) {
			eventRegistry.registerFeature(
				featureId,
				lineFeature,
				{ onHover, onHoverEnd, onClick, onSelect, onDeselect },
				{ hoverStyle, selectedStyle },
				handleStateChange
			);
		}

		return () => {
			isDestroyed = true;

			if (eventRegistry && isInteractive) {
				eventRegistry.unregisterFeature(featureId);
			}

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

{#if children}
	{@render children()}
{/if}
