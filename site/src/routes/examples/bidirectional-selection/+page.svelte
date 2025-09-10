<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { getExampleComponent, getExampleMeta } from '$lib/examples/sources';

	const demoName = 'bidirectional-selection-demo';
	const BidirectionalSelectionDemo = getExampleComponent(demoName);
	const meta = getExampleMeta(demoName);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">Bidirectional Selection</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		This example demonstrates how to synchronize selection between a table and map features.
		Selecting an item in the table highlights it on the map and vice versa.
	</p>

	<div class="mb-8 rounded-lg border p-4">
		<h3 class="mb-2 font-semibold">Key Features:</h3>
		<ul class="list-disc pl-5">
			<li>Click any row in the table to select and pan to that location on the map</li>
			<li>Click any marker on the map to select it in the table</li>
			<li>Hover over table rows to see visual feedback on the map</li>
			<li>Use the Clear Selection button to deselect all features</li>
		</ul>
	</div>

	<h2 class="mb-4 text-3xl font-bold" data-toc>Interactive Demo</h2>
	<MapExample name={demoName}>
		{#snippet customPreview()}
			<BidirectionalSelectionDemo />
		{/snippet}
	</MapExample>
</div>
