<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import type { OverlayTooltipProps } from '$lib/types.js';
	import { Overlay } from 'ol';
	import { onMount } from 'svelte';

	let {
		position = $bindable(),
		content = '',
		visible = $bindable(false),
		offset = [15, 0],
		positioning = 'center-left' as OverlayTooltipProps['positioning'],
		class: className = '',
		autoPan = false,
		overlay = $bindable(null),
		children
	}: OverlayTooltipProps = $props();

	const map = getMap();
	let tooltipElement: HTMLDivElement;
	let olOverlay: Overlay | null = null;
	let isDestroyed = false;

	onMount(() => {
		if (overlay instanceof Overlay) {
			olOverlay = overlay;
		} else {
			olOverlay = new Overlay({
				element: tooltipElement,
				offset,
				positioning,
				autoPan: autoPan ? { animation: { duration: 250 } } : false,
				className: `ol-tooltip ${className}`
			});
			overlay = olOverlay;
		}

		map?.addOverlay(olOverlay);

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

	$effect(() => {
		if (!olOverlay || isDestroyed) return;

		if (visible && position) {
			olOverlay.setPosition(position);
		} else {
			olOverlay.setPosition(undefined);
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

<div
	bind:this={tooltipElement}
	class="tooltip-container {className}"
	style:display={visible ? 'block' : 'none'}
>
	{#if children}
		{@render children()}
	{:else if content}
		{@html content}
	{/if}
</div>
