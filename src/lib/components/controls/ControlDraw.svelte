<script lang="ts">
	import InteractionDraw from '$lib/components/interactions/InteractionDraw.svelte';
	import { getMap } from '$lib/components/map/context.js';
	import { type ControlDrawProps } from './types.js';
	import Circle from '@lucide/svelte/icons/circle';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Pentagon from '@lucide/svelte/icons/pentagon';
	import Spline from '@lucide/svelte/icons/spline';
	import Control from 'ol/control/Control.js';
	import { onMount } from 'svelte';

	let {
		type = $bindable('Point'),
		source = $bindable(null),
		onDrawStart,
		onDrawEnd,
		onDrawAbort,
		onTypeChange,
		style,
		control = $bindable(null)
	}: ControlDrawProps = $props();

	const map = getMap();

	let controlElement: HTMLDivElement;
	let olControl: Control | null = null;
	let isDestroyed = false;

	const drawTypes: Array<'Point' | 'LineString' | 'Polygon' | 'Circle'> = [
		'Point',
		'LineString',
		'Polygon',
		'Circle'
	];

	// Icons and labels for each draw type
	const drawConfig = {
		Point: { icon: MapPin, label: 'Point', description: 'Draw points' },
		LineString: { icon: Spline, label: 'Line', description: 'Draw lines' },
		Polygon: { icon: Pentagon, label: 'Polygon', description: 'Draw polygons' },
		Circle: { icon: Circle, label: 'Circle', description: 'Draw circles' }
	};

	function handleTypeChange(newType: 'Point' | 'LineString' | 'Polygon' | 'Circle') {
		type = newType;
		if (onTypeChange) {
			onTypeChange(newType);
		}
	}

	onMount(() => {
		// Create the OpenLayers Control
		olControl = new Control({
			element: controlElement
		});

		// Add control to map
		map?.addControl(olControl);
		control = olControl;

		return () => {
			isDestroyed = true;

			// Clean up control
			if (olControl) {
				map?.removeControl(olControl);
				olControl = null;
				control = null;
			}
		};
	});
</script>

<div
	bind:this={controlElement}
	class="ol-control ol-control-draw"
	role="toolbar"
	aria-label="Drawing tools"
>
	{#each drawTypes as drawType}
		{@const config = drawConfig[drawType]}
		{@const Icon = config.icon}
		<button
			class="ol-control-draw-button"
			class:active={drawType === type}
			onclick={() => handleTypeChange(drawType)}
			title={config.description}
			aria-label={config.description}
			aria-pressed={drawType === type}
			type="button"
		>
			<Icon class="ol-control-draw-icon" size={16} />
		</button>
	{/each}
</div>

<InteractionDraw bind:type bind:source {style} {onDrawStart} {onDrawEnd} {onDrawAbort} />

<style>
	.ol-control-draw {
		top: var(--ol-draw-control-top, auto);
		right: var(--ol-draw-control-right, auto);
		bottom: var(--ol-draw-control-bottom, auto);
		left: var(--ol-draw-control-left, auto);
		background-color: transparent !important;
		margin: var(--ol-space-2);
		pointer-events: none !important;
	}

	.ol-control-draw-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--ol-draw-button-gap);
		padding: var(--ol-draw-button-padding);
		border: none;
		background: var(--ol-draw-button-bg);
		border-radius: var(--ol-draw-button-border-radius);
		cursor: pointer;
		font-size: var(--ol-draw-button-font-size);
		font-family: var(--ol-draw-button-font-family);
		font-weight: var(--ol-draw-button-font-weight);
		color: var(--ol-draw-button-color);
		transition: all var(--ol-draw-button-transition) ease;
		width: var(--ol-draw-button-width);
		height: var(--ol-draw-button-height);
		min-width: var(--ol-draw-button-min-width);
		text-align: center;
		white-space: nowrap;
		outline: none;
		position: relative;
		box-sizing: border-box;
		pointer-events: auto;
	}

	.ol-control-draw-button:hover {
		background: var(--ol-draw-button-bg-hover);
		color: var(--ol-draw-button-color-hover);
	}

	.ol-control-draw-button.active {
		background: var(--ol-draw-button-bg-active);
		color: var(--ol-draw-button-color-active);
	}

	.ol-control-draw-button.active:hover {
		background: var(--ol-draw-button-bg-active);
		opacity: 0.9;
	}

	:global(.ol-control-draw-icon) {
		font-size: var(--ol-draw-icon-size);
		font-weight: var(--ol-draw-icon-weight);
		width: var(--ol-draw-icon-width, 16px);
		height: var(--ol-draw-icon-height, 16px);
		text-align: center;
		flex-shrink: 0;
		color: inherit;
	}

	:global(.ol-control-draw-icon svg) {
		color: inherit;
		fill: currentColor;
		stroke: currentColor;
	}

	@media (max-width: 640px) {
		.ol-control-draw {
			--ol-draw-control-padding: var(--ol-space-0-5, 2px);
			--ol-draw-button-padding: var(--ol-space-1-5, 6px) var(--ol-space-2, 8px);
			--ol-draw-button-min-width: 36px;
		}
	}
</style>
