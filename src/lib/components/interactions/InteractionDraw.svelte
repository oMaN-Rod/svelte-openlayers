<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import { getLayerContext } from '$lib/components/layers/context.js';
	import { type InteractionDrawProps } from './types.js';
	import { Draw } from 'ol/interaction.js';
	import type { Options } from 'ol/interaction/Draw.js';
	import type VectorSource from 'ol/source/Vector.js';
	import { onMount } from 'svelte';

	let {
		type = $bindable('Point'),
		source = $bindable(null),
		features = $bindable(null),
		interaction = $bindable(null),
		clickTolerance = 6,
		snapTolerance = 12,
		stopClick = false,
		maxPoints,
		minPoints,
		finishCondition,
		style,
		geometryFunction,
		geometryName,
		condition,
		freehand = false,
		freehandCondition,
		trace = false,
		traceSource,
		wrapX = false,
		geometryLayout = 'XY',
		onDrawStart,
		onDrawEnd,
		onDrawAbort
	}: InteractionDrawProps = $props();

	const map = getMap();
	const layerContext = getLayerContext();

	let drawInteraction: Draw | null = null;
	let isDestroyed = false;

	function createDrawInteraction() {
		let drawSource: VectorSource | null = source;
		if (!drawSource && layerContext) {
			drawSource = layerContext.getSource();
		}

		if (!drawSource) {
			console.warn('InteractionDraw: No source provided and no layer context available');
			return null;
		}

		const drawOptions: Options = {
			type: type as any,
			source: drawSource,
			clickTolerance,
			snapTolerance,
			stopClick,
			freehand,
			wrapX,
			geometryLayout
		};

		// Add optional properties
		if (features) drawOptions.features = features;
		if (maxPoints !== undefined) drawOptions.maxPoints = maxPoints;
		if (minPoints !== undefined) drawOptions.minPoints = minPoints;
		if (finishCondition) drawOptions.finishCondition = finishCondition;
		if (style) drawOptions.style = style;
		if (geometryFunction) drawOptions.geometryFunction = geometryFunction;
		if (geometryName) drawOptions.geometryName = geometryName;
		if (condition) drawOptions.condition = condition;
		if (freehandCondition) drawOptions.freehandCondition = freehandCondition;
		if (trace !== false) drawOptions.trace = trace;
		if (traceSource) drawOptions.traceSource = traceSource;

		const newInteraction = new Draw(drawOptions);

		if (onDrawStart) {
			newInteraction.on('drawstart', (evt: any) => {
				onDrawStart(evt);
			});
		}

		if (onDrawEnd) {
			newInteraction.on('drawend', (evt: any) => {
				onDrawEnd(evt);
			});
		}

		if (onDrawAbort) {
			newInteraction.on('drawabort', (evt: any) => {
				onDrawAbort(evt);
			});
		}

		return newInteraction;
	}

	function cleanupInteraction() {
		if (drawInteraction) {
			map?.removeInteraction(drawInteraction);
			drawInteraction.setActive(false);
			drawInteraction = null;
			interaction = null;
		}
	}

	onMount(() => {
		drawInteraction = createDrawInteraction();
		if (drawInteraction) {
			interaction = drawInteraction;
			drawInteraction.setActive(true);
			map?.addInteraction(drawInteraction);
		}

		return () => {
			cleanupInteraction();
			isDestroyed = true;
		};
	});

	$effect(() => {
		if (!isDestroyed && drawInteraction && type) {
			cleanupInteraction();

			drawInteraction = createDrawInteraction();
			if (drawInteraction) {
				interaction = drawInteraction;
				drawInteraction.setActive(true);
				map?.addInteraction(drawInteraction);
			}
		}
	});
</script>
