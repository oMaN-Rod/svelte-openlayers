<script lang="ts">
	import { getView } from '$lib/components/view/context.js';
	import type { MapProps } from './types.js';
	import { Map } from 'ol';
	import { defaults as defaultControls } from 'ol/control.js';
	import { defaults as defaultInteractions } from 'ol/interaction.js';
	import { onMount } from 'svelte';
	import { setMap } from './context.js';

	let {
		class: className = null,
		view,
		controls = {},
		interactions = {},
		pixelRatio,
		keyboardEventTarget,
		maxTilesLoading = 16,
		moveTolerance = 1,
		click,
		dblclick,
		pointerdrag,
		pointermove,
		pointerdown,
		pointerup,
		pointerover,
		pointerout,
		pointerenter,
		pointerleave,
		pointercancel,
		postrender,
		movestart,
		moveend,
		loadstart,
		loadend,
		precompose,
		postcompose,
		rendercomplete,
		children,
		map = $bindable(null),
		...restProps
	}: MapProps = $props();

	let mapContainer: HTMLDivElement;

	onMount(() => {
		if (mapContainer) {
			map = setMap(
				new Map({
					target: mapContainer,
					view: view ? view : getView(),
					controls: defaultControls(controls),
					interactions: defaultInteractions(interactions),
					pixelRatio,
					keyboardEventTarget,
					maxTilesLoading,
					moveTolerance
				})
			);

			// Register MapBrowserEvent handlers
			if (click) map.on('click', click);
			if (dblclick) map.on('dblclick', dblclick);
			if (pointerdrag) map.on('pointerdrag', pointerdrag);
			if (pointermove) map.on('pointermove', pointermove);
			if (pointerdown) map.on('pointerdown', pointerdown);
			if (pointerup) map.on('pointerup', pointerup);
			if (pointerover) map.on('pointerover', pointerover);
			if (pointerout) map.on('pointerout', pointerout);
			if (pointerenter) map.on('pointerenter', pointerenter);
			if (pointerleave) map.on('pointerleave', pointerleave);
			if (pointercancel) map.on('pointercancel', pointercancel);

			// Register MapEvent handlers
			if (postrender) map.on('postrender', postrender);
			if (movestart) map.on('movestart', movestart);
			if (moveend) map.on('moveend', moveend);
			if (loadstart) map.on('loadstart', loadstart);
			if (loadend) map.on('loadend', loadend);

			// Register RenderEvent handlers
			if (precompose) map.on('precompose', precompose);
			if (postcompose) map.on('postcompose', postcompose);
			if (rendercomplete) map.on('rendercomplete', rendercomplete);
		}
		return () => {
			if (!map) {
				return;
			}
			//Overwrite functions to prevent creation of new layers etc
			map.addLayer = function () {};
			map.addInteraction = function () {};
			map.addControl = function () {};
			map.addInteraction = function () {};
			// Tear down all Layers etc.
			map.getAllLayers().forEach((layer) => map?.removeLayer(layer));
			map.getInteractions().forEach((interaction) => map?.removeInteraction(interaction));
			map.getControls().forEach((control) => map?.removeControl(control));
			map.getOverlays().forEach((overlay) => map?.removeOverlay(overlay));
			// Unregister all event handlers
			if (click) map.un('click', click);
			if (dblclick) map.un('dblclick', dblclick);
			if (pointerdrag) map.un('pointerdrag', pointerdrag);
			if (pointermove) map.un('pointermove', pointermove);
			if (pointerdown) map.un('pointerdown', pointerdown);
			if (pointerup) map.un('pointerup', pointerup);
			if (pointerover) map.un('pointerover', pointerover);
			if (pointerout) map.un('pointerout', pointerout);
			if (pointerenter) map.un('pointerenter', pointerenter);
			if (pointerleave) map.un('pointerleave', pointerleave);
			if (pointercancel) map.un('pointercancel', pointercancel);
			if (postrender) map.un('postrender', postrender);
			if (movestart) map.un('movestart', movestart);
			if (moveend) map.un('moveend', moveend);
			if (loadstart) map.un('loadstart', loadstart);
			if (loadend) map.un('loadend', loadend);
			if (precompose) map.un('precompose', precompose);
			if (postcompose) map.un('postcompose', postcompose);
			if (rendercomplete) map.un('rendercomplete', rendercomplete);
			map.setTarget(undefined);
			map.dispose();
			map = null;
			map = null;
		};
	});
	$effect(() => {
		if (map) {
			map.updateSize();
		}
	});
</script>

<div bind:this={mapContainer} class="ol-map-root {className}" {...restProps}>
	{#if children && map}
		{@render children()}
	{/if}
</div>
