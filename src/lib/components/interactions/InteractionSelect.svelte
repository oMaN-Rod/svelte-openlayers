<script lang="ts">
	import type { InteractionSelectProps } from '$lib/types.js';
	import { getMapContext } from '$lib/utils/context.js';
	import { Select } from 'ol/interaction.js';
	import type { Options } from 'ol/interaction/Select.js';
	import { onMount } from 'svelte';

	let {
		style,
		layers,
		filter,
		multi = false,
		hitTolerance = 0,
		addCondition,
		removeCondition,
		toggleCondition,
		onSelect,
		interaction = $bindable(null),
		selectedFeatures = $bindable(null)
	}: InteractionSelectProps = $props();

	const mapContext = getMapContext();
	let selectInteraction: Select | null = null;
	let isDestroyed = false;

	onMount(() => {
		const selectOptions: Options = {
			multi,
			hitTolerance
		};

		if (style) selectOptions.style = style;
		if (layers) selectOptions.layers = layers;
		if (filter) selectOptions.filter = filter;
		if (addCondition) selectOptions.addCondition = addCondition;
		if (removeCondition) selectOptions.removeCondition = removeCondition;
		if (toggleCondition) selectOptions.toggleCondition = toggleCondition;

		selectInteraction = new Select(selectOptions);
		interaction = selectInteraction;
		selectedFeatures = selectInteraction.getFeatures();

		if (onSelect) {
			selectInteraction.on('select', (evt: any) => {
				onSelect(evt.selected);
			});
		}

		mapContext.addInteraction(selectInteraction);

		return () => {
			isDestroyed = true;
			if (selectInteraction) {
				mapContext.removeInteraction(selectInteraction);
				selectInteraction.getFeatures().clear();
				selectInteraction = null;
				interaction = null;
				selectedFeatures = null;
			}
		};
	});
</script>
