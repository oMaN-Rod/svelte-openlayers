<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { getExampleComponent, getExampleMeta } from '$lib/examples/sources';
	import { mapSources } from '$lib/examples/sources';

	const exampleName = 'layers-demo';
	const LayersDemo = getExampleComponent(exampleName);
	const meta = getExampleMeta(exampleName);

	let activeBaseLayer = $state('osm');
	let layersVisible = $state({
		airports: true,
		railways: true,
		regions: false
	});
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">Layer Management</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		Managing multiple map layers with different data sources, base maps, and layer visibility
		controls.
	</p>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Base Layer Selection -->
		<div class="space-y-3">
			<h3 class="text-lg font-semibold">Base Layer</h3>
			<div class="grid grid-cols-2 gap-2">
				{#each mapSources as source}
					<Button
						variant={activeBaseLayer === source.id ? 'default' : 'outline'}
						size="sm"
						onclick={() => (activeBaseLayer = source.id)}
					>
						{source.name}
					</Button>
				{/each}
			</div>
		</div>

		<!-- Layer Visibility Controls -->
		<div class="space-y-3">
			<h3 class="text-lg font-semibold">Data Layers</h3>
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label for="airports-toggle">Airports</label>
					<Switch id="airports-toggle" bind:checked={layersVisible.airports} />
				</div>
				<div class="flex items-center justify-between">
					<label for="railways-toggle">Railways</label>
					<Switch id="railways-toggle" bind:checked={layersVisible.railways} />
				</div>
				<div class="flex items-center justify-between">
					<label for="regions-toggle">Regions</label>
					<Switch id="regions-toggle" bind:checked={layersVisible.regions} />
				</div>
			</div>
		</div>
	</div>

	<MapExample name="layers-demo">
		{#snippet customPreview()}
			<LayersDemo bind:layersVisible bind:activeBaseLayer />
		{/snippet}
	</MapExample>
</div>
