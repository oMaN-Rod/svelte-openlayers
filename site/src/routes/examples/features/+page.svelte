<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const features = 'features-demo';
	const meta = getExampleMeta(features);
	const basicStyling = 'styling-basic-demo';
	const svgIcons = 'svg-icons-demo';
	const interactiveFeatures = 'interactive-features-demo';
	const scopedStyling = 'scoped-styling-demo';
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="flex flex-col space-y-4">
	<div>
		<h1 class="text-4xl font-bold">Features</h1>
		<p class="text-muted-foreground text-lg">
			Demonstration of different geometry types: Points, LineStrings, and Polygons with custom
			styling and interactions.
		</p>
	</div>

	<div class="mb-4">
		<h2 class="mb-2 text-2xl font-bold" data-toc>Basic Marker Styling</h2>
		<Separator class="mb-4" />
		<MapExample name={basicStyling} />
	</div>

	<div class="mb-4">
		<h2 class="mb-2 text-2xl font-bold" data-toc>Scoped Styling</h2>
		<Separator class="mb-4" />
		<MapExample name={scopedStyling} />
	</div>

	<div class="mb-4">
		<h2 class="mb-2 text-2xl font-bold" data-toc>Linestrings & Polygons</h2>
		<Separator class="mb-4" />
		<MapExample name={features} />
	</div>

	<div class="mb-4">
		<h2 class="mb-2 text-2xl font-bold" data-toc>SVG Icon Markers</h2>
		<Separator class="mb-4" />
		<MapExample name={svgIcons} />
	</div>
</div>
