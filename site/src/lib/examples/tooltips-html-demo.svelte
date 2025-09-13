<script lang="ts">
	import type { Geometry } from 'ol/geom';
	import { Feature as OLFeature } from 'ol';
	import { Map, Layer, Feature, Overlay } from 'svelte-openlayers';
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
		fill: '#ef4444',
		stroke: '#991b1b',
		strokeWidth: 3
	});

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: '#4338ca', // Uses --ol-color-primary
		stroke: '#ffffff',
		strokeWidth: 2
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

	const hoverContent = (name: string, type: string) => `
<div style="font-size: 16px; color: #1e40af; margin-bottom: 8px; font-weight: bold;">
	${name || 'Unknown'}
</div>
<div style="color: #6b7280; font-size: 14px;">
	<span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px;">
		${type || 'Feature'}
	</span>
</div>
	`;

	const selectContent = (feature: OLFeature<Geometry>) => {
		const props = feature.getProperties();
		const entries = Object.entries(props)
			.filter(([key]) => key !== 'geometry')
			.map(
				([key, value]) => `
<tr>
	<td style="padding: 4px 8px; color: #6b7280; font-weight: 500;">${key}:</td>
	<td style="padding: 4px 8px;">${value}</td>
</tr>`
			)
			.join('');
		return `
<div style="padding: 4px;">
	<div style="font-size: 18px; color: #1e40af; margin-bottom: 12px; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
		${props.name || 'Feature Details'}
	</div>
	<table style="width: 100%;">
		${entries}
	</table>
</div>`;
	};

	type Landmark = (typeof landmarks)[0];
</script>

<div class="relative h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View center={[5, 50]} zoom={5} />
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
			hoverContent={(feature) => {
				const props = feature.getProperties();
				return hoverContent(props.name, props.type || 'Feature');
			}}
			selectContent={(feature) => selectContent(feature)}
			hoverClass="!bg-white"
			selectClass="!bg-white"
		/>
	</Map.Root>
</div>
<div class="text-muted-foreground mt-4 text-sm">
	{#if tooltipMode === 'hover'}
		Hover over landmarks to see their information
	{:else}
		Click on landmarks to toggle their information
	{/if}
</div>
