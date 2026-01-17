<script lang="ts">
	import { transform } from 'ol/proj';
	import { Map, Layer, View } from 'svelte-openlayers';

	let center = $state([0, 0]);
	let zoom = $state(2);

	const transformedCoordinates = $derived(transform(center, 'EPSG:3857', 'EPSG:4326'));
</script>

<div class="map-container">
	<View bind:center bind:zoom>
		<Map controls={{ fullscreen: true }}>
			<Layer.Tile source="osm" />
		</Map>
	</View>
</div>
<div class="text-muted-foreground mt-4 flex gap-4 text-sm">
	<div>
		Center: [{transformedCoordinates[0].toFixed(2)}, {transformedCoordinates[1].toFixed(2)}]
	</div>
	<div>Zoom: {zoom.toFixed(1)}</div>
</div>
