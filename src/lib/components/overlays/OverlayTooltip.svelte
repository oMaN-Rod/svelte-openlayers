<script lang="ts">
	import { onMount } from 'svelte';
	import { Overlay } from 'ol';
	import { getMapContext } from '$lib/utils/context.js';
	import type { Coordinate } from 'ol/coordinate.js';
	import type { Snippet } from 'svelte';

	interface Props {
		position?: Coordinate;
		content?: string;
		visible?: boolean;
		offset?: [number, number];
		positioning?:
			| 'bottom-left'
			| 'bottom-center'
			| 'bottom-right'
			| 'center-left'
			| 'center-center'
			| 'center-right'
			| 'top-left'
			| 'top-center'
			| 'top-right';
		className?: string;
		autoPan?: boolean;
		overlay?: Overlay | null;
		children?: Snippet;
	}

	let {
		position = $bindable(),
		content = '',
		visible = $bindable(false),
		offset = [15, 0],
		positioning = 'center-left' as Props['positioning'],
		className = '',
		autoPan = false,
		overlay = $bindable(null),
		children
	}: Props = $props();

	const mapContext = getMapContext();
	let tooltipElement: HTMLDivElement;
	let olOverlay: Overlay | null = null;
	let isDestroyed = false;

	onMount(() => {
		olOverlay = new Overlay({
			element: tooltipElement,
			offset,
			positioning,
			autoPan: autoPan ? { animation: { duration: 250 } } : false,
			className: `ol-tooltip ${className}`
		});
		overlay = olOverlay;

		mapContext.addOverlay(olOverlay);

		return () => {
			isDestroyed = true;
			if (olOverlay) {
				mapContext.removeOverlay(olOverlay);
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
