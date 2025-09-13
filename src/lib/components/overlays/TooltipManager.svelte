<script lang="ts">
	import InteractionHover from '$lib/components/interactions/InteractionHover.svelte';
	import InteractionSelect from '$lib/components/interactions/InteractionSelect.svelte';
	import OverlayTooltip from '$lib/components/overlays/OverlayTooltip.svelte';
	import type { TooltipManagerProps } from '$lib/types.js';
	import type { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import { getCenter } from 'ol/extent.js';

	let {
		layers,
		hitTolerance = 0,
		hoverTooltip = true,
		selectTooltip = true,
		hoverContent,
		selectContent,
		hoverSnippet,
		selectSnippet,
		hoverPositioning = 'center-left',
		selectPositioning = 'center-left',
		hoverClass = 'hover-tooltip',
		selectClass = 'select-tooltip',
		selectStyle,
		hoverInteraction = $bindable(null),
		selectInteraction = $bindable(null),
		selectedFeatures = $bindable(null),
		multi = false,
		reactive = true,
		children
	}: TooltipManagerProps = $props();

	let hoverPosition: Coordinate | undefined = $state();
	let hoverVisible = $state(false);
	let hoverText = $state('');
	let hoverFeature: Feature | null = $state(null);

	let selectPosition: Coordinate | undefined = $state();
	let selectVisible = $state(false);
	let selectText = $state('');
	let selectFeature: Feature | null = $state(null);

	function formatProperties(properties: any): string {
		if (!properties) return '';

		const items = Object.entries(properties)
			.filter(([key]) => key !== 'geometry')
			.map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
			.join('');

		return items || 'No properties';
	}

	function handleHover(feature: Feature | null, coordinate?: Coordinate) {
		if (!feature || !hoverTooltip) {
			hoverVisible = false;
			hoverFeature = null;
			return;
		}

		hoverFeature = feature;

		if (!hoverSnippet) {
			if (hoverContent) {
				hoverText = hoverContent(feature);
			} else {
				const properties = feature.getProperties();
				hoverText = formatProperties(properties);
			}
		}

		hoverPosition = coordinate;
		hoverVisible = true;
	}

	function handleHoverEnd() {
		hoverVisible = false;
		hoverFeature = null;
	}

	function handleSelect(features: Feature[]) {
		if (!selectTooltip) return;

		if (features.length === 0) {
			selectVisible = false;
			selectFeature = null;
			return;
		}

		const feature = features[0];
		selectFeature = feature;
		const geometry = feature.getGeometry();

		if (geometry) {
			const extent = geometry.getExtent();
			selectPosition = getCenter(extent);
		}

		if (!selectSnippet) {
			if (selectContent) {
				selectText = selectContent(feature);
			} else {
				const properties = feature.getProperties();
				selectText = formatProperties(properties);
			}
		}

		selectVisible = true;
	}
</script>

{#if hoverTooltip}
	<InteractionHover
		{layers}
		{hitTolerance}
		onHover={handleHover}
		onHoverEnd={handleHoverEnd}
		bind:interaction={hoverInteraction}
	/>
	{#if hoverSnippet && hoverFeature}
		<OverlayTooltip
			bind:position={hoverPosition}
			bind:visible={hoverVisible}
			positioning={hoverPositioning}
			class={hoverClass}
		>
			{#snippet children()}
				{@render hoverSnippet(hoverFeature!)}
			{/snippet}
		</OverlayTooltip>
	{:else}
		<OverlayTooltip
			bind:position={hoverPosition}
			bind:visible={hoverVisible}
			content={hoverText}
			positioning={hoverPositioning}
			class={hoverClass}
		/>
	{/if}
{/if}

{#if selectTooltip}
	<InteractionSelect
		{layers}
		{hitTolerance}
		{multi}
		{reactive}
		style={selectStyle}
		onSelect={handleSelect}
		bind:interaction={selectInteraction}
		bind:selectedFeatures
	/>
	{#if selectSnippet && selectFeature}
		<OverlayTooltip
			bind:position={selectPosition}
			bind:visible={selectVisible}
			positioning={selectPositioning}
			class={selectClass}
			autoPan={true}
		>
			{#snippet children()}
				{@render selectSnippet(selectFeature!)}
			{/snippet}
		</OverlayTooltip>
	{:else}
		<OverlayTooltip
			bind:position={selectPosition}
			bind:visible={selectVisible}
			content={selectText}
			positioning={selectPositioning}
			class={selectClass}
			autoPan={true}
		/>
	{/if}
{/if}

{#if children}
	{@render children()}
{/if}
