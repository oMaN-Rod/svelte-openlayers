<script lang="ts">
	import MapExampleTabs from '$lib/components/docs/map-example-tabs.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.meta?.title} - Example | svelte-openlayers</title>
	<meta name="description" content={data.meta?.description} />
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">{data.meta?.title}</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		{data.meta?.description}
	</p>

	<MapExampleTabs exampleId={data.slug} />
</div>
