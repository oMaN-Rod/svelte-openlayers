<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const exampleName = 'draw-interaction-demo';
	const meta = getExampleMeta(exampleName);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">Draw Interaction</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		Interactive drawing tools for creating points, lines, polygons, and circles on the map with
		real-time feature tracking and coordinate display.
	</p>

	<MapExample name={exampleName} />
</div>
