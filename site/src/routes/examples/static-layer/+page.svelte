<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const exampleName = 'static-layer-demo';
	const meta = getExampleMeta(exampleName);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">Static Image Layer</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		Render a single static image using a custom pixel-based projection and constrained extent. This
		is useful for annotated maps, diagrams, or historical imagery that doesn't use standard
		geographic coordinates.
	</p>

	<MapExample name={exampleName} />
</div>
