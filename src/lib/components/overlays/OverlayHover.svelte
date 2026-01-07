<script lang="ts">
	import { getFeatureStateContext } from '$lib/components/features/feature-context.js';
	import OverlayTooltip from './OverlayTooltip.svelte';
	import type { OverlayHoverProps } from './types.js';

	let {
		offset = [15, 0],
		positioning = 'center-left' as OverlayHoverProps['positioning'],
		class: className = '',
		autoPan = false,
		children
	}: OverlayHoverProps = $props();

	const featureState = getFeatureStateContext();

	if (!featureState) {
		console.warn(
			'Overlay.Hover must be used within a Feature component (Feature.Point, Feature.LineString, or Feature.Polygon)'
		);
	}

	let visible = $derived(featureState?.isHovered ?? false);
	let position = $derived(featureState?.hoverCoordinate);
</script>

{#if featureState}
	<OverlayTooltip
		{position}
		{visible}
		{offset}
		{positioning}
		class="hover-tooltip {className} !bg-transparent !shadow-none"
		{autoPan}
	>
		{#if children}
			{@render children()}
		{/if}
	</OverlayTooltip>
{/if}

<style>
	:global(.hover-tooltip) {
		z-index: 99;
	}
</style>
