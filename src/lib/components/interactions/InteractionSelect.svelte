<script lang="ts">
	import type { InteractionSelectProps } from '$lib/types.js';
	import { getMapContext } from '$lib/utils/context.js';
	import { ReactiveCollection } from '$lib/utils/reactive-collection.js';
	import { Select } from 'ol/interaction.js';
	import type { Options } from 'ol/interaction/Select.js';
	import Collection from 'ol/Collection.js';
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
		selectedFeatures = $bindable(null),
		reactive = true
	}: InteractionSelectProps = $props();

	const mapContext = getMapContext();
	let selectInteraction: Select | null = null;

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

		if (selectedFeatures) {
			if (reactive && !(selectedFeatures instanceof ReactiveCollection)) {
				if (selectedFeatures instanceof Collection) {
					selectedFeatures = ReactiveCollection.from(selectedFeatures, { reactive });
				}
			}
			selectOptions.features = selectedFeatures;
		} else if (reactive) {
			selectedFeatures = new ReactiveCollection([], { reactive });
			selectOptions.features = selectedFeatures;
		}

		selectInteraction = new Select(selectOptions);
		interaction = selectInteraction;

		if (selectedFeatures instanceof ReactiveCollection) {
			selectedFeatures.bindInteraction(selectInteraction);
		}

		if (!selectedFeatures) {
			selectedFeatures = selectInteraction.getFeatures();
		}

		if (onSelect) {
			selectInteraction.on('select', (evt: any) => {
				onSelect(evt.selected);
			});
		}
		mapContext.addInteraction(selectInteraction);

		return () => {
			if (selectInteraction) {
				if (selectedFeatures instanceof ReactiveCollection) {
					selectedFeatures.unbindInteraction();
				}
				mapContext.removeInteraction(selectInteraction);
				selectInteraction.getFeatures().clear();
				selectInteraction = null;
				interaction = null;
				selectedFeatures = null;
			}
		};
	});
</script>
