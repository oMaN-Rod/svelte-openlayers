<script lang="ts">
	import OverlayTooltip from './OverlayTooltip.svelte';
	import InteractionHover from '../interactions/InteractionHover.svelte';
	import InteractionSelect from '../interactions/InteractionSelect.svelte';
	import type { Feature } from 'ol';
	import type { Coordinate } from 'ol/coordinate.js';
	import type Layer from 'ol/layer/Layer.js';
	import type { StyleLike } from 'ol/style/Style.js';
	import type { Snippet } from 'svelte';
	import { getCenter } from 'ol/extent.js';

	type TooltipPositioning =
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
		| 'center-left'
		| 'center-center'
		| 'center-right'
		| 'top-left'
		| 'top-center'
		| 'top-right';

	interface Props {
		layers?: Layer[];
		hitTolerance?: number;
		hoverTooltip?: boolean;
		selectTooltip?: boolean;
		hoverContent?: (feature: Feature) => string;
		selectContent?: (feature: Feature) => string;
		hoverSnippet?: Snippet<[Feature]>;
		selectSnippet?: Snippet<[Feature]>;
		hoverPositioning?: TooltipPositioning;
		selectPositioning?: TooltipPositioning;
		hoverClassName?: string;
		selectClassName?: string;
		selectStyle?: StyleLike;
		children?: Snippet;
	}

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
		hoverClassName = 'hover-tooltip',
		selectClassName = 'select-tooltip',
		selectStyle,
		children
	}: Props = $props();

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
	<InteractionHover {layers} {hitTolerance} onHover={handleHover} onHoverEnd={handleHoverEnd} />
	{#if hoverSnippet && hoverFeature}
		<OverlayTooltip
			bind:position={hoverPosition}
			bind:visible={hoverVisible}
			positioning={hoverPositioning}
			className={hoverClassName}
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
			className={hoverClassName}
		/>
	{/if}
{/if}

{#if selectTooltip}
	<InteractionSelect {layers} {hitTolerance} style={selectStyle} onSelect={handleSelect} />
	{#if selectSnippet && selectFeature}
		<OverlayTooltip
			bind:position={selectPosition}
			bind:visible={selectVisible}
			positioning={selectPositioning}
			className={selectClassName}
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
			className={selectClassName}
			autoPan={true}
		/>
	{/if}
{/if}

{#if children}
	{@render children()}
{/if}
