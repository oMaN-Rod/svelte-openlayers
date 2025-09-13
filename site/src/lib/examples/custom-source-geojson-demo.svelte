<script lang="ts">
	import { Map, Layer } from 'svelte-openlayers';
	import VectorSource from 'ol/source/Vector';
	import GeoJSON from 'ol/format/GeoJSON';
	import { Overlay } from 'svelte-openlayers';
	import VectorLayer from 'ol/layer/Vector';

	let center = $state([0, 0]);
	let zoom = $state(1);
	const layer = new VectorLayer({
		background: '#181818',
		source: new VectorSource({
			url: 'https://openlayers.org/data/vector/ecoregions.json',
			format: new GeoJSON()
		}),
		style: {
			'fill-color': ['string', ['get', 'COLOR'], '#eee']
		}
	});
</script>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View bind:center bind:zoom />
		<Layer.Tile source="osm" />

		<Layer.Vector {layer} />

		<Overlay.TooltipManager />
	</Map.Root>
</div>
