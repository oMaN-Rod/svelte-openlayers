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
