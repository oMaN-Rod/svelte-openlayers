<script lang="ts">
	import MapExample from '$lib/components/docs/map-example.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { getExampleMeta } from '$lib/examples/sources';

	const webglPoints = 'webgl-points-demo';
	const meta = getExampleMeta(webglPoints);
</script>

<svelte:head>
	<title>{meta?.title} - Example</title>
	<meta name="description" content={meta?.description} />
</svelte:head>

<div class="flex flex-col space-y-4">
	<div>
		<h1 class="text-4xl font-bold">WebGL Rendering</h1>
		<p class="text-muted-foreground text-lg">
			High-performance rendering of large point datasets using WebGL with dynamic, expression-based
			styling. Render thousands of points efficiently with GPU acceleration.
		</p>
	</div>

	<div class="mb-4">
		<MapExample name={webglPoints} />
	</div>

	<div class="bg-muted/50 rounded-lg p-4">
		<h3 class="mb-2 font-semibold">Key Features:</h3>
		<ul class="list-inside list-disc space-y-1 text-sm">
			<li>GPU-accelerated rendering for thousands of points</li>
			<li>Expression-based styling with interpolation and conditionals</li>
			<li>Dynamic style variables that can be updated at runtime</li>
			<li>Support for circles, shapes, and icons</li>
			<li>Hover interactions with style changes</li>
			<li>Time-based animations for rotating elements</li>
		</ul>
	</div>

	<div class="bg-muted/50 rounded-lg p-4">
		<h3 class="mb-2 font-semibold">Style Expressions:</h3>
		<p class="mb-2 text-sm">
			WebGL styles use expressions to dynamically compute visual properties based on feature
			attributes, zoom level, or time:
		</p>
		<ul class="list-inside list-disc space-y-1 text-sm">
			<li>
				<code>['get', 'property']</code> - Access feature properties
			</li>
			<li>
				<code>['interpolate', ['linear'], ...]</code> - Smooth value transitions
			</li>
			<li>
				<code>['match', condition, value1, value2]</code> - Conditional styling
			</li>
			<li>
				<code>['zoom']</code> - Current zoom level for scale-dependent rendering
			</li>
			<li>
				<code>['time']</code> - Animation variable for rotating elements
			</li>
		</ul>
	</div>
</div>
