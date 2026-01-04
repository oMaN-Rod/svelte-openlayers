<script lang="ts">
	import { transform, transformExtent } from 'ol/proj.js';
	import { Map, View, Layer } from '$lib/index.js';

	let mapCenter = $state([0, 0]);
	let mapZoom = $state(2);
	let view = $state(null);
	let bbox = $state([0, 0, 0, 0]);
	let controls = { zoom: false, attribution: false, rotate: false };
	const transformedCenterCoordinates = $derived(transform(mapCenter, 'EPSG:3857', 'EPSG:4326'));
	const transformedBboxCoordinates = $derived(transformExtent(bbox, 'EPSG:3857', 'EPSG:4326'));
</script>

<div class="container">
	<div>
		Center: [{transformedCenterCoordinates[0].toFixed(2)}, {transformedCenterCoordinates[1].toFixed(
			2
		)}]
	</div>
	<div>Zoom: {mapZoom.toFixed(1)}</div>
	<div>
		Bbox: [{transformedBboxCoordinates[0]?.toFixed(2)}, {transformedBboxCoordinates[1]?.toFixed(2)}, {transformedBboxCoordinates[2]?.toFixed(
			2
		)}, {transformedBboxCoordinates[3]?.toFixed(2)}]
	</div>
</div>
<div>
	<View bind:center={mapCenter} bind:zoom={mapZoom} bind:view bind:bbox />
	<div class="container">
		<Map {view} style="height: 45vh; width: 100%" {controls}>
			<Layer.Tile source="osm" />
		</Map>
		<Map {view} style="height: 45vh; width: 100%" {controls}>
			<Layer.Tile source="osm" />
		</Map>
	</div>

	<View zoom={2} center={[0, 0]}>
		<Map style="height: 45vh; width: 100%; margin-top: 40px;" {controls}>
			<Layer.Tile source="osm" />
		</Map>
	</View>
</div>

<style>
	.container {
		display: flex;
		gap: 2.5rem;
	}
</style>
