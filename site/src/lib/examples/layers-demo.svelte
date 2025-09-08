<script lang="ts">
	import { Map, Layer, Feature } from 'svelte-openlayers';
	import { createCircleStyle } from 'svelte-openlayers/utils';
	import { mapSources } from '$lib/examples/sources';
	import type TileLayer from 'ol/layer/Tile';
	import { XYZ } from 'ol/source.js';

	type LayersVisible = { airports: boolean; railways: boolean; regions: boolean };

	type Props = {
		layersVisible?: LayersVisible;
		activeBaseLayer?: string;
	};

	let {
		layersVisible = $bindable({ airports: true, railways: true, regions: false }),
		activeBaseLayer = $bindable('osm')
	}: Props = $props();

	let tileLayer: TileLayer | null = $state(null);

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: '#4338ca', // Uses --ol-color-primary
		stroke: '#ffffff',
		strokeWidth: 2
	});

	const sampleData = {
		airports: [
			{ name: 'Heathrow', coordinates: [-0.4614, 51.47], code: 'LHR' },
			{ name: 'Charles de Gaulle', coordinates: [2.5479, 49.0097], code: 'CDG' },
			{ name: 'Schiphol', coordinates: [4.7683, 52.3105], code: 'AMS' }
		],
		railways: [
			{
				name: 'London-Paris',
				coordinates: [
					[-0.1276, 51.5074],
					[2.3522, 48.8566]
				]
			},
			{
				name: 'Paris-Amsterdam',
				coordinates: [
					[2.3522, 48.8566],
					[4.9041, 52.3676]
				]
			}
		],
		regions: [
			{
				name: 'Greater London',
				coordinates: [
					[
						[-0.5, 51.3],
						[0.3, 51.3],
						[0.3, 51.7],
						[-0.5, 51.7],
						[-0.5, 51.3]
					]
				]
			}
		]
	};

	$effect(() => {
		if (tileLayer) {
			const url = mapSources.find((s) => s.id === activeBaseLayer)?.url;
			const attribution = mapSources.find((provider) => provider.url === url)?.name;
			tileLayer.setSource(
				new XYZ({
					url: url,
					attributions: attribution ? [attribution] : []
				})
			);
		}
	});
</script>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View center={[2, 51]} zoom={6} />

		<!-- Base Layer -->
		{#if activeBaseLayer === 'osm'}
			<Layer.Tile source="osm" />
		{:else}
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === activeBaseLayer)?.url}
				bind:layer={tileLayer}
			/>
		{/if}

		<!-- Airports Layer -->
		{#if layersVisible.airports}
			<Layer.Vector style={pointStyle}>
				{#each sampleData.airports as airport}
					<Feature.Point coordinates={airport.coordinates} />
				{/each}
			</Layer.Vector>
		{/if}

		<!-- Railways Layer -->
		{#if layersVisible.railways}
			<Layer.Vector>
				{#each sampleData.railways as railway}
					<Feature.LineString coordinates={railway.coordinates} />
				{/each}
			</Layer.Vector>
		{/if}

		<!-- Regions Layer -->
		{#if layersVisible.regions}
			<Layer.Vector>
				{#each sampleData.regions as region}
					<Feature.Polygon coordinates={region.coordinates} />
				{/each}
			</Layer.Vector>
		{/if}
	</Map.Root>
</div>
<div class="text-muted-foreground mt-4 text-sm">
	Active layers: {Object.entries(layersVisible)
		.filter(([_, visible]) => visible)
		.map(([name]) => name)
		.join(', ')}
</div>
