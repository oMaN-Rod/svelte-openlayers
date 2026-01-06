<script lang="ts">
	import { getFeatureStateContext } from '$lib/components/features/feature-context.js';
	import { getCenter } from 'ol/extent.js';
	import OverlayTooltip from './OverlayTooltip.svelte';
	import type { OverlayPopupProps } from './types.js';

	let {
		offset = [0, -15],
		positioning = 'bottom-center' as OverlayPopupProps['positioning'],
		class: className = '',
		autoPan = true,
		children
	}: OverlayPopupProps = $props();

	const featureState = getFeatureStateContext();

	if (!featureState) {
		console.warn(
			'Overlay.Click must be used within a Feature component (Feature.Point, Feature.LineString, or Feature.Polygon)'
		);
	}

	let visible = $derived(featureState?.isSelected ?? false);

	let position = $derived.by(() => {
		if (!featureState) return undefined;

		// Prefer click coordinate
		if (featureState.clickCoordinate) {
			return featureState.clickCoordinate;
		}

		// Fall back to feature geometry center
		const feature = featureState.getFeature();
		if (feature) {
			const geometry = feature.getGeometry();
			if (geometry) {
				const extent = geometry.getExtent();
				return getCenter(extent);
			}
		}

		return undefined;
	});
</script>

{#if featureState}
	<OverlayTooltip
		{position}
		{visible}
		{offset}
		{positioning}
		class="click-popup {className} !bg-transparent !shadow-none"
		{autoPan}
	>
		{#if children}
			{@render children()}
		{/if}
	</OverlayTooltip>
{/if}

<style>
	:global(.click-popup) {
		z-index: 100;
	}
</style>
