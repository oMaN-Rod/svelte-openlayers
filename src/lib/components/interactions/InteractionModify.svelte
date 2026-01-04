<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import { getLayerContext } from '$lib/components/layers/context.js';
	import { type InteractionModifyProps } from '$lib/types.js';
	import Collection from 'ol/Collection.js';
	import { Modify } from 'ol/interaction.js';
	import type { Options } from 'ol/interaction/Modify.js';
	import type VectorSource from 'ol/source/Vector.js';
	import { onMount } from 'svelte';

	let {
		features = $bindable(null),
		source = $bindable(null),
		style,
		pixelTolerance = 10,
		condition,
		deleteCondition,
		insertVertexCondition,
		hitDetection,
		onModifyStart,
		onModifyEnd,
		interaction = $bindable(null)
	}: InteractionModifyProps = $props();

	const map = getMap();
	const layerContext = getLayerContext();

	let modifyInteraction: Modify | null = null;
	let isDestroyed = false;

	function createModifyInteraction() {
		const modifyOptions: Options = {
			pixelTolerance
		};

		// Determine what to modify: features collection or source
		if (features) {
			modifyOptions.features = features instanceof Collection ? features : new Collection(features);
		} else {
			let modifySource: VectorSource | null = source;
			if (!modifySource && layerContext) {
				modifySource = layerContext.getSource();
			}

			if (!modifySource) {
				console.warn(
					'InteractionModify: No features or source provided and no layer context available'
				);
				return null;
			}
			modifyOptions.source = modifySource;
		}

		// Add optional properties
		if (style) modifyOptions.style = style;
		if (condition) modifyOptions.condition = condition;
		if (deleteCondition) modifyOptions.deleteCondition = deleteCondition;
		if (insertVertexCondition) modifyOptions.insertVertexCondition = insertVertexCondition;
		if (hitDetection !== undefined) modifyOptions.hitDetection = hitDetection;

		const newInteraction = new Modify(modifyOptions);

		if (onModifyStart) {
			newInteraction.on('modifystart', (evt: any) => {
				onModifyStart(evt);
			});
		}

		if (onModifyEnd) {
			newInteraction.on('modifyend', (evt: any) => {
				onModifyEnd(evt);
			});
		}

		return newInteraction;
	}

	function cleanupInteraction() {
		if (modifyInteraction) {
			map?.removeInteraction(modifyInteraction);
			modifyInteraction.setActive(false);
			modifyInteraction = null;
			interaction = null;
		}
	}

	onMount(() => {
		modifyInteraction = createModifyInteraction();
		if (modifyInteraction) {
			interaction = modifyInteraction;
			modifyInteraction.setActive(true);
			map?.addInteraction(modifyInteraction);
		}

		return () => {
			cleanupInteraction();
			isDestroyed = true;
		};
	});

	// Recreate interaction when features change
	$effect(() => {
		if (!isDestroyed && features) {
			cleanupInteraction();

			modifyInteraction = createModifyInteraction();
			if (modifyInteraction) {
				interaction = modifyInteraction;
				modifyInteraction.setActive(true);
				map?.addInteraction(modifyInteraction);
			}
		}
	});
</script>
