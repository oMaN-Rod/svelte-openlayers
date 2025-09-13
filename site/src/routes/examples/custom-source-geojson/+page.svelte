<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const customSourceGeoJson = 'custom-source-geojson-demo';
	const meta = getExampleMeta(customSourceGeoJson);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="flex flex-col space-y-4">
	<div>
		<h1 class="text-4xl font-bold">Custom GeoJSON Source</h1>
		<p class="text-muted-foreground text-lg">
			Learn how to load GeoJSON data from remote URLs or inline objects using a custom VectorSource
			with OpenLayers.
		</p>
	</div>

	<div class="mb-4">
		<h2 class="mb-2 text-2xl font-bold" data-toc>Basic Example</h2>
		<Separator class="mb-4" />
		<MapExample name={customSourceGeoJson} />
	</div>
</div>
