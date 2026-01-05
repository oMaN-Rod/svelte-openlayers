<script lang="ts">
	import { mapSources } from '../_shared/data/map-sources';
	import type TileLayer from 'ol/layer/Tile';
	import XYZ from 'ol/source/XYZ.js';
	import { Feature, Layer, Map, View } from 'svelte-openlayers';
	import { sampleData, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { airportStyle } from './styles';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';

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

	$effect(() => {
		if (tileLayer) {
			const url = mapSources.find((s) => s.id === activeBaseLayer)?.url;
			const attributions = mapSources.find((provider) => provider.url === url)?.attributions;
			tileLayer.setSource(
				new XYZ({
					url: url,
					attributions: attributions ? attributions : []
				})
			);
		}
	});
</script>

<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
	<!-- Base Layer Selection -->
	<div class="space-y-3">
		<h3 class="text-lg font-semibold">Base Layer</h3>
		<div class="grid grid-cols-2 gap-2">
			{#each mapSources as source}
				<Button
					variant={activeBaseLayer === source.id ? 'default' : 'outline'}
					size="sm"
					onclick={() => (activeBaseLayer = source.id)}
				>
					{source.name}
				</Button>
			{/each}
		</div>
	</div>

	<!-- Layer Visibility Controls -->
	<div class="space-y-3">
		<h3 class="text-lg font-semibold">Data Layers</h3>
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<label for="airports-toggle">Airports</label>
				<Switch id="airports-toggle" bind:checked={layersVisible.airports} />
			</div>
			<div class="flex items-center justify-between">
				<label for="railways-toggle">Railways</label>
				<Switch id="railways-toggle" bind:checked={layersVisible.railways} />
			</div>
			<div class="flex items-center justify-between">
				<label for="regions-toggle">Regions</label>
				<Switch id="regions-toggle" bind:checked={layersVisible.regions} />
			</div>
		</div>
	</div>
</div>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
		<Map class="h-full w-full">
			<!-- Base Layer -->
			{#if activeBaseLayer === 'osm'}
				<Layer.Tile source="osm" zIndex={0} />
			{:else}
				<Layer.Tile
					source="xyz"
					url={mapSources.find((s) => s.id === activeBaseLayer)?.url}
					attributions={mapSources.find((s) => s.id === activeBaseLayer)?.attributions}
					bind:layer={tileLayer}
					zIndex={0}
				/>
			{/if}

			<!-- Airports Layer -->
			{#if layersVisible.airports}
				<Layer.Vector style={airportStyle} zIndex={1}>
					{#each sampleData.airports as airport}
						<Feature.Point coordinates={airport.coordinates} />
					{/each}
				</Layer.Vector>
			{/if}

			<!-- Railways Layer -->
			{#if layersVisible.railways}
				<Layer.Vector zIndex={1}>
					{#each sampleData.railways as railway}
						<Feature.LineString coordinates={railway.coordinates} />
					{/each}
				</Layer.Vector>
			{/if}

			<!-- Regions Layer -->
			{#if layersVisible.regions}
				<Layer.Vector zIndex={1}>
					{#each sampleData.regions as region}
						<Feature.Polygon coordinates={region.coordinates} />
					{/each}
				</Layer.Vector>
			{/if}
		</Map>
	</View>
</div>
<div class="text-muted-foreground mt-4 text-sm">
	Active layers: {Object.entries(layersVisible)
		.filter(([_, visible]) => visible)
		.map(([name]) => name)
		.join(', ')}
</div>
