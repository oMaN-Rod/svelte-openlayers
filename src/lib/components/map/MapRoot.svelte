<script lang="ts">
	import type { MapContext, MapRootProps } from '$lib/types.js';
	import { setMapContext } from '$lib/utils/context.js';
	import type { Overlay, View } from 'ol';
	import { Map } from 'ol';
	import { defaults as defaultControls, MousePosition } from 'ol/control.js';
	import type Control from 'ol/control/Control.js';
	import { createStringXY } from 'ol/coordinate.js';
	import { defaults as defaultInteractions } from 'ol/interaction.js';
	import type Interaction from 'ol/interaction/Interaction.js';
	import type Layer from 'ol/layer/Layer.js';
	import type { MapOptions } from 'ol/Map.js';
	import { onMount } from 'svelte';

	let {
		class: className = '',
		style = '',
		target,
		pixelRatio,
		keyboardEventTarget,
		maxTilesLoading,
		moveTolerance,
		zoomControl = true,
		attributionControl = true,
		rotateControl = false,
		mousePositionControl = false,
		children,
		map = $bindable(null),
		view = $bindable(null),
		// MapBrowserEvent events
		onSingleclick,
		onClick,
		onDblclick,
		onPointerdrag,
		onPointermove,
		onPointerdown,
		onPointerup,
		onPointerover,
		onPointerout,
		onPointerenter,
		onPointerleave,
		onPointercancel,
		// MapEvent events
		onPostrender,
		onMovestart,
		onMoveend,
		onLoadstart,
		onLoadend,
		// RenderEvent events
		onPrecompose,
		onPostcompose,
		onRendercomplete
	}: MapRootProps = $props();

	let mapContainer: HTMLDivElement;
	let mousePositionControlContainer: HTMLDivElement;
	let olMap: Map | null = $state(null);
	let olView: View | null = $state(null);
	let isDestroyed = false;

	const layers: Set<Layer> = new Set();
	const interactions: Set<Interaction> = new Set();
	const controls: Set<Control> = new Set();
	const overlays: Set<Overlay> = new Set();

	const mapContext: MapContext = {
		getMap: () => olMap,
		getView: () => olView,
		addLayer: (layer: Layer) => {
			if (!olMap || isDestroyed) return;
			layers.add(layer);
			olMap.addLayer(layer);
		},
		removeLayer: (layer: Layer) => {
			if (!olMap || isDestroyed) return;
			layers.delete(layer);
			olMap.removeLayer(layer);
		},
		addInteraction: (interaction: Interaction) => {
			if (!olMap || isDestroyed) return;
			interactions.add(interaction);
			olMap.addInteraction(interaction);
		},
		removeInteraction: (interaction: Interaction) => {
			if (!olMap || isDestroyed) return;
			interactions.delete(interaction);
			olMap.removeInteraction(interaction);
		},
		addControl: (control: Control) => {
			if (!olMap || isDestroyed) return;
			controls.add(control);
			olMap.addControl(control);
		},
		removeControl: (control: Control) => {
			if (!olMap || isDestroyed) return;
			controls.delete(control);
			olMap.removeControl(control);
		},
		addOverlay: (overlay: Overlay) => {
			if (!olMap || isDestroyed) return;
			overlays.add(overlay);
			olMap.addOverlay(overlay);
		},
		removeOverlay: (overlay: Overlay) => {
			if (!olMap || isDestroyed) return;
			overlays.delete(overlay);
			olMap.removeOverlay(overlay);
		}
	};

	setMapContext(mapContext);

	onMount(() => {
		let mouseControl: MousePosition | undefined;
		if (mousePositionControl) {
			mouseControl = new MousePosition({
				coordinateFormat: createStringXY(4),
				projection: 'EPSG:4326',
				target: mousePositionControlContainer
			});
		}

		const mapOptions: MapOptions = {
			target: target || mapContainer,
			controls: defaultControls({
				attribution: attributionControl,
				zoom: zoomControl,
				rotate: rotateControl
			}).extend(mousePositionControlContainer && mouseControl ? [mouseControl] : []),
			interactions: defaultInteractions()
		};

		if (pixelRatio !== undefined) mapOptions.pixelRatio = pixelRatio;
		if (keyboardEventTarget !== undefined) mapOptions.keyboardEventTarget = keyboardEventTarget;
		if (maxTilesLoading !== undefined) mapOptions.maxTilesLoading = maxTilesLoading;
		if (moveTolerance !== undefined) mapOptions.moveTolerance = moveTolerance;

		olMap = new Map(mapOptions);
		map = olMap;

		olMap.on('change:view', () => {
			if (!isDestroyed && olMap) {
				olView = olMap.getView();
				view = olView;
			}
		});

		// Register MapBrowserEvent handlers
		if (onSingleclick) olMap.on('singleclick', onSingleclick);
		if (onClick) olMap.on('click', onClick);
		if (onDblclick) olMap.on('dblclick', onDblclick);
		if (onPointerdrag) olMap.on('pointerdrag', onPointerdrag);
		if (onPointermove) olMap.on('pointermove', onPointermove);
		if (onPointerdown) olMap.on('pointerdown', onPointerdown);
		if (onPointerup) olMap.on('pointerup', onPointerup);
		if (onPointerover) olMap.on('pointerover', onPointerover);
		if (onPointerout) olMap.on('pointerout', onPointerout);
		if (onPointerenter) olMap.on('pointerenter', onPointerenter);
		if (onPointerleave) olMap.on('pointerleave', onPointerleave);
		if (onPointercancel) olMap.on('pointercancel', onPointercancel);

		// Register MapEvent handlers
		if (onPostrender) olMap.on('postrender', onPostrender);
		if (onMovestart) olMap.on('movestart', onMovestart);
		if (onMoveend) olMap.on('moveend', onMoveend);
		if (onLoadstart) olMap.on('loadstart', onLoadstart);
		if (onLoadend) olMap.on('loadend', onLoadend);

		// Register RenderEvent handlers
		if (onPrecompose) olMap.on('precompose', onPrecompose);
		if (onPostcompose) olMap.on('postcompose', onPostcompose);
		if (onRendercomplete) olMap.on('rendercomplete', onRendercomplete);

		return () => {
			isDestroyed = true;

			layers.forEach((layer) => olMap?.removeLayer(layer));
			interactions.forEach((interaction) => olMap?.removeInteraction(interaction));
			controls.forEach((control) => olMap?.removeControl(control));
			overlays.forEach((overlay) => olMap?.removeOverlay(overlay));

			layers.clear();
			interactions.clear();
			controls.clear();
			overlays.clear();

			if (olMap) {
				// Unregister all event handlers
				if (onSingleclick) olMap.un('singleclick', onSingleclick);
				if (onClick) olMap.un('click', onClick);
				if (onDblclick) olMap.un('dblclick', onDblclick);
				if (onPointerdrag) olMap.un('pointerdrag', onPointerdrag);
				if (onPointermove) olMap.un('pointermove', onPointermove);
				if (onPointerdown) olMap.un('pointerdown', onPointerdown);
				if (onPointerup) olMap.un('pointerup', onPointerup);
				if (onPointerover) olMap.un('pointerover', onPointerover);
				if (onPointerout) olMap.un('pointerout', onPointerout);
				if (onPointerenter) olMap.un('pointerenter', onPointerenter);
				if (onPointerleave) olMap.un('pointerleave', onPointerleave);
				if (onPointercancel) olMap.un('pointercancel', onPointercancel);
				if (onPostrender) olMap.un('postrender', onPostrender);
				if (onMovestart) olMap.un('movestart', onMovestart);
				if (onMoveend) olMap.un('moveend', onMoveend);
				if (onLoadstart) olMap.un('loadstart', onLoadstart);
				if (onLoadend) olMap.un('loadend', onLoadend);
				if (onPrecompose) olMap.un('precompose', onPrecompose);
				if (onPostcompose) olMap.un('postcompose', onPostcompose);
				if (onRendercomplete) olMap.un('rendercomplete', onRendercomplete);

				olMap.setTarget(undefined);
				olMap.dispose();
				olMap = null;
				map = null;
			}
		};
	});

	$effect(() => {
		if (olMap) {
			olMap.updateSize();
		}
	});
</script>

<div bind:this={mapContainer} class="ol-map-root {className}" {style}>
	{#if children && olMap}
		{@render children()}
	{/if}
	<div bind:this={mousePositionControlContainer}></div>
</div>

<style>
	.ol-map-root {
		width: var(--ol-map-width, 100%);
		height: var(--ol-map-height, 100%);
		position: var(--ol-map-position, relative);
	}

	:global(.ol-map-root .ol-viewport) {
		position: absolute !important;
		width: 100% !important;
		height: 100% !important;
	}

	:global(.ol-zoom) {
		display: flex;
		flex-direction: column;
		margin-top: var(--ol-control-margin, 0.5rem);
		margin-left: var(--ol-control-margin, 0.5rem);
	}

	:global(.ol-zoom-in, .ol-zoom-out) {
		background-color: var(--ol-zoom-button-bg, var(--ol-color-primary, #4338ca));
		color: var(--ol-zoom-button-color, var(--ol-color-primary-foreground, #ffffff));
		border: var(--ol-zoom-button-border, none);
		border-radius: var(--ol-zoom-button-radius, var(--ol-radius, 0.25rem));
		margin: var(--ol-zoom-button-margin, 0.125rem 0);
		width: var(--ol-zoom-button-width, 1.5rem);
		height: var(--ol-zoom-button-height, 1.5rem);
		font-size: var(--ol-zoom-button-font-size, var(--ol-font-size-sm, 0.875rem));
		font-weight: var(--ol-zoom-button-font-weight, var(--ol-font-weight-medium, 500));
		cursor: pointer;
		transition: background-color var(--ol-transition-duration-fast, 150ms)
			var(--ol-transition-timing-ease, ease);
	}

	:global(.ol-zoom-in:hover, .ol-zoom-out:hover) {
		opacity: var(--ol-opacity-90, 0.9);
	}

	:global(.ol-attribution) {
		position: absolute;
		bottom: 0;
		right: 0;
		display: flex;
		background: var(--ol-attribution-bg, rgba(255, 255, 255, 0.7));
		color: var(--ol-attribution-color, var(--ol-color-muted-foreground, #6b7280));
		font-size: var(--ol-attribution-font-size, var(--ol-font-size-xs, 0.75rem));
		padding: var(--ol-attribution-padding, var(--ol-space-1, 0.25rem) var(--ol-space-2, 0.5rem));
	}

	:global(.ol-mouse-position) {
		position: absolute;
		top: var(--ol-space-2-5, 0.625rem);
		right: var(--ol-space-2-5, 0.625rem);
		background: var(--ol-mouse-position-bg, rgba(255, 255, 255, 0.9));
		color: var(--ol-mouse-position-color, var(--ol-color-foreground, #1f2937));
		padding: var(
			--ol-mouse-position-padding,
			var(--ol-space-1-5, 0.375rem) var(--ol-space-2-5, 0.625rem)
		);
		border-radius: var(--ol-mouse-position-border-radius, var(--ol-radius, 0.25rem));
		font-family: var(--ol-mouse-position-font-family, var(--ol-font-family-mono, monospace));
		font-size: var(--ol-mouse-position-font-size, var(--ol-font-size-xs, 0.75rem));
		box-shadow: var(--ol-mouse-position-shadow, var(--ol-shadow-sm, 0 1px 2px 0 rgb(0 0 0 / 0.05)));
		pointer-events: var(--ol-overlay-pointer-events, none);
		z-index: var(--ol-mouse-position-z-index, var(--ol-z-1000, 1000));
	}
</style>
