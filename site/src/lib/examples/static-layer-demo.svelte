<script lang="ts">
	import { Map, Layer } from 'svelte-openlayers';
	import { Projection } from 'ol/proj.js';

	let mapCenter = $state([512, 484]);
	let mapZoom = $state(2);

	const extent = [0, 0, 1024, 968];
	const projection = new Projection({
		code: 'xkcd-image',
		units: 'pixels',
		extent
	});
</script>

<div class="h-[60dvh] w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View bind:center={mapCenter} bind:zoom={mapZoom} {projection} />
		<Layer.Static
			attributions="© <a href='https://xkcd.com/license.html'>xkcd</a>"
			url="https://imgs.xkcd.com/comics/online_communities.png"
			{extent}
		/>
	</Map.Root>
</div>
<div class="text-muted-foreground mt-4 flex gap-4 text-sm">
	<div>
		Center: [{mapCenter[0].toFixed(2)}, {mapCenter[1].toFixed(2)}]
	</div>
	<div>Zoom: {mapZoom.toFixed(1)}</div>
</div>
