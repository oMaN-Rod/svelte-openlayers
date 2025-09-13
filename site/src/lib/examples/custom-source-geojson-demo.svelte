<script lang="ts">
	import { Map, Layer } from 'svelte-openlayers';
	import VectorSource from 'ol/source/Vector';
	import GeoJSON from 'ol/format/GeoJSON';
	import { mapSources } from './sources';
	import { Overlay } from 'svelte-openlayers';

	let center = $state([0, 0]);
	let zoom = $state(1);
	let vectorSource = new VectorSource({
		url: 'https://openlayers.org/data/vector/ecoregions.json',
		format: new GeoJSON()
	});
</script>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View bind:center bind:zoom />
		<Layer.Tile
			source="xyz"
			url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
			attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
		/>

		{#if vectorSource}
			<Layer.Vector
				source={vectorSource}
				visible={true}
				opacity={1}
				style={{
					'fill-color': ['string', ['get', 'COLOR'], '#eee']
				}}
			/>
		{/if}

		<Overlay.TooltipManager />
	</Map.Root>
</div>
