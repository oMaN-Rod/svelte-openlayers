<script lang="ts">
	import { transform } from 'ol/proj';
	import { Map, Layer } from 'svelte-openlayers';

	let mapCenter = $state([0, 0]);
	let mapZoom = $state(2);

	const transformedCoordinates = $derived(transform(mapCenter, 'EPSG:3857', 'EPSG:4326'));
</script>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View bind:center={mapCenter} bind:zoom={mapZoom} />
		<Layer.Tile source="osm" />
	</Map.Root>
</div>
<div class="text-muted-foreground mt-4 flex gap-4 text-sm">
	<div>
		Center: [{transformedCoordinates[0].toFixed(2)}, {transformedCoordinates[1].toFixed(2)}]
	</div>
	<div>Zoom: {mapZoom.toFixed(1)}</div>
</div>
