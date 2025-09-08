<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const exampleName = 'styling-customization-demo';
	const meta = getExampleMeta(exampleName);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="container py-8">
	<div class="mb-8">
		<h1 class="mb-2 text-4xl font-bold">{meta?.title}</h1>
		<p class="text-muted-foreground text-lg">{meta?.description}</p>
	</div>

	<MapExample name={exampleName} />
</div>
