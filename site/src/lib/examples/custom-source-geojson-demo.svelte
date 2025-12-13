<script lang="ts">
	import GeoJSON from 'ol/format/GeoJSON';
	import VectorLayer from 'ol/layer/Vector';
	import VectorSource from 'ol/source/Vector';
	import { Layer, Map, Overlay, View } from 'svelte-openlayers';

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
	<View bind:center bind:zoom >
		<Map class="h-full w-full">
			<Layer.Tile source="osm" />

			<Layer.Vector {layer} />

			<Overlay.TooltipManager />
		</Map>
	</View>
</div>
