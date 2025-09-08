<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import { getExampleComponent } from '$lib/examples/sources';
	import { Button } from '$lib/components/ui/button';

	const baseDemoName = 'tooltips-basic-demo';
	const htmlDemoName = 'tooltips-html-demo';
	const componentDemoName = 'tooltips-component-demo';
	const TooltipsBasicDemo = getExampleComponent(baseDemoName);
	const TooltipsHtmlDemo = getExampleComponent(htmlDemoName);
	const TooltipsComponentDemo = getExampleComponent(componentDemoName);

	const landmarks = [
		{
			id: 1,
			name: 'Eiffel Tower',
			coordinates: [2.2945, 48.8584],
			description: 'Iconic iron lattice tower in Paris',
			height: '330m',
			built: '1889',
			visitors: '7M annually'
		},
		{
			id: 2,
			name: 'Big Ben',
			coordinates: [-0.1246, 51.4994],
			description: 'Famous clock tower in London',
			height: '96m',
			built: '1859',
			visitors: '5M annually'
		},
		{
			id: 3,
			name: 'Brandenburg Gate',
			coordinates: [13.3777, 52.5163],
			description: 'Neoclassical monument in Berlin',
			height: '26m',
			built: '1791',
			visitors: '3M annually'
		}
	];

	type Landmark = (typeof landmarks)[0];

	let tooltipMode = $state<'hover' | 'select'>('hover');
	let hoveredFeature = $state<Landmark | null>(null);
	let selectedFeature = $state<Landmark | null>(null);

	function handleFeatureHover(landmark: Landmark) {
		if (tooltipMode === 'hover') {
			hoveredFeature = landmark;
		}
	}

	function handleFeatureLeave() {
		if (tooltipMode === 'hover') {
			hoveredFeature = null;
		}
	}

	function handleFeatureClick(landmark: Landmark) {
		if (tooltipMode === 'select') {
			selectedFeature = selectedFeature?.id === landmark.id ? null : landmark;
		} else {
			selectedFeature = landmark;
		}
	}
</script>

<svelte:head>
	<title>Tooltips - Examples</title>
	<meta
		name="description"
		content="Different approaches to displaying contextual information when interacting with map features."
	/>
</svelte:head>

<div class="container py-8">
	<h1 class="mb-4 text-4xl font-bold">Interactive Tooltips</h1>
	<p class="text-muted-foreground mb-8 text-lg">
		Different approaches to displaying contextual information when interacting with map features.
	</p>

	<h2 class="mb-4 text-3xl font-bold" data-toc>Basic Tooltips</h2>
	<MapExample name={baseDemoName}>
		{#snippet customPreview()}
			<TooltipsBasicDemo bind:tooltipMode bind:hoveredFeature bind:selectedFeature />
		{/snippet}
	</MapExample>

	<h2 class="my-4 text-3xl font-bold" data-toc>HTML Tooltips</h2>
	<MapExample name={htmlDemoName}>
		{#snippet customPreview()}
			<TooltipsHtmlDemo />
		{/snippet}
	</MapExample>

	<h2 class="my-4 text-3xl font-bold" data-toc>Component Tooltips</h2>
	<MapExample name={componentDemoName}>
		{#snippet customPreview()}
			<TooltipsComponentDemo />
		{/snippet}
	</MapExample>
</div>
