<script lang="ts">
	import ToolTipHover from '$lib/examples/tooltip-hover.svelte';
	import TooltipSelect from '$lib/examples/tooltip-select.svelte';
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { createCircleStyle } from 'svelte-openlayers/utils';
	import { mapSources } from './sources';

	let {
		tooltipMode = $bindable<'hover' | 'select'>('hover'),
		hoveredFeature = $bindable<Landmark | null>(null),
		selectedFeature = $bindable<Landmark | null>(null)
	}: {
		tooltipMode?: 'hover' | 'select';
		hoveredFeature?: Landmark | null;
		selectedFeature?: Landmark | null;
	} = $props();

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: { color: '#ef4444' },
		stroke: { color: '#991b1b', width: 3 }
	});

	const landmarks = [
		{
			id: 1,
			name: 'Eiffel Tower',
			coordinates: [2.2945, 48.8584],
			description: 'Iconic iron lattice tower in Paris',
			height: '330m',
			built: '1889',
			visitors: '7M annually'
		},
		{
			id: 2,
			name: 'Big Ben',
			coordinates: [-0.1246, 51.4994],
			description: 'Famous clock tower in London',
			height: '96m',
			built: '1859',
			visitors: '5M annually'
		},
		{
			id: 3,
			name: 'Brandenburg Gate',
			coordinates: [13.3777, 52.5163],
			description: 'Neoclassical monument in Berlin',
			height: '26m',
			built: '1791',
			visitors: '3M annually'
		}
	];

	type Landmark = (typeof landmarks)[0];

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: { color: '#4338ca' }, // Uses --ol-color-primary
		stroke: { color: '#ffffff', width: 2 }
	});
</script>

<div class="relative h-96 w-full overflow-hidden rounded-lg border">
	<View center={[5, 50]} zoom={5} >
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector style={pointStyle}>
				{#each landmarks as landmark}
					{@const { id, coordinates, ...rest } = landmark}
					<Feature.Point {coordinates} properties={rest} />
				{/each}
			</Layer.Vector>

			<Overlay.TooltipManager
				hoverTooltip={true}
				selectTooltip={true}
				selectStyle={selectedStyle}
				hoverClass="!bg-transparent !shadow-none"
				selectClass="!bg-transparent !shadow-none"
			>
				{#snippet hoverSnippet(feature)}
					{@const props = feature.getProperties()}
					<ToolTipHover name={props.name} type={props.type} />
				{/snippet}
				{#snippet selectSnippet(feature)}
					{@const props = feature.getProperties()}
					<TooltipSelect {...props} />
				{/snippet}
			</Overlay.TooltipManager>
		</Map>
	</View>
</div>
<div class="text-muted-foreground mt-4 text-sm">
	{#if tooltipMode === 'hover'}
		Hover over landmarks to see their information
	{:else}
		Click on landmarks to toggle their information
	{/if}
</div>
