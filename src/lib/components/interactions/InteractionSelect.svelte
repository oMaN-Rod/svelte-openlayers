<script lang="ts">
	import { onMount } from 'svelte';
	import { Select } from 'ol/interaction.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type { Feature } from 'ol';
	import type { StyleLike } from 'ol/style/Style.js';
	import type { FilterFunction, Options } from 'ol/interaction/Select.js';
	import type Layer from 'ol/layer/Layer.js';
	import type Collection from 'ol/Collection.js';

	interface Props {
		style?: StyleLike;
		layers?: Layer[];
		filter?: FilterFunction;
		multi?: boolean;
		hitTolerance?: number;
		addCondition?: any;
		removeCondition?: any;
		toggleCondition?: any;
		onSelect?: (features: Feature[]) => void;
		interaction?: Select | null;
		selectedFeatures?: Collection<Feature> | null;
	}

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
	}: Props = $props();

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
