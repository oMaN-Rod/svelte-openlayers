<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import { getFeatureInfo } from '$lib/utils';
	import type { Feature } from 'ol';
	import type { Geometry } from 'ol/geom';
	import VectorSource from 'ol/source/Vector.js';
	import { Control, Layer, Map, View } from 'svelte-openlayers';
	import { createStyle } from 'svelte-openlayers/utils';
	import { mapSources } from './sources';

	let center = $state([-74.006, 40.7128]);
	let zoom = $state(10);
	let drawType = $state<'Point' | 'LineString' | 'Polygon' | 'Circle'>('Point');
	let isDrawing = $state(false);
	let drawnFeatures = $state<Feature<Geometry>[]>([]);

	// Create a vector source to store drawn features
	let vectorSource: VectorSource | null = $state(null);

	// Style for drawn features
	const drawStyle = createStyle({
		fill: {
			color: 'rgba(59, 130, 246, 0.3)'
		},
		stroke: {
			color: '#2563eb',
			width: 2
		},
		image: {
			radius: 6,
			fill: '#2563eb',
			stroke: '#ffffff',
			strokeWidth: 2
		}
	});

	// Style for drawing interaction (preview)
	const sketchStyle = createStyle({
		fill: {
			color: 'rgba(16, 185, 129, 0.2)'
		},
		stroke: {
			color: '#10b981',
			width: 2,
			lineDash: [10, 10]
		},
		image: {
			radius: 6,
			fill: '#10b981',
			stroke: '#ffffff',
			strokeWidth: 2
		}
	});

	function handleDrawStart(evt: any) {
		isDrawing = true;
	}

	function handleDrawEnd(evt: any) {
		if (!vectorSource) return;
		isDrawing = false;
		const feature = evt.feature;
		drawnFeatures = [...drawnFeatures, feature];
	}

	function handleDrawAbort() {
		isDrawing = false;
		console.log('Drawing aborted');
	}

	function clearFeatures() {
		if (!vectorSource) return;
		vectorSource.clear();
		drawnFeatures = [];
	}
</script>

<div class="space-y-4">
	<!-- Control Panel -->
	<Card.Root class="p-4">
		<div class="flex flex-col justify-between md:flex-row">
			<div class="flex items-center gap-2">
				<Badge variant="secondary">Active: {drawType}</Badge>
				<Badge variant={isDrawing ? 'default' : 'secondary'}>
					{isDrawing ? 'Drawing...' : 'Ready'}
				</Badge>
				<Button
					variant="outline"
					size="sm"
					onclick={clearFeatures}
					disabled={drawnFeatures.length === 0}
				>
					Clear All ({drawnFeatures.length})
				</Button>
			</div>
		</div>
	</Card.Root>

	<!-- Map -->
	<div class="h-96 w-full overflow-hidden rounded-lg border">
		<View bind:center bind:zoom >
			<Map class="h-full w-full">
				<Layer.Tile
					source="xyz"
					url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
					attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
				/>

				<!-- Layer for drawn features -->
				<Layer.Vector bind:source={vectorSource} style={drawStyle}>
					<Control.Draw
						bind:type={drawType}
						source={vectorSource}
						style={sketchStyle}
						onDrawStart={handleDrawStart}
						onDrawEnd={handleDrawEnd}
						onDrawAbort={handleDrawAbort}
					/>
				</Layer.Vector>
			</Map>
		</View>
	</div>

	<!-- Feature List -->
	{#if drawnFeatures.length > 0}
		<Card.Root class="p-4">
			<h3 class="mb-3 text-lg font-semibold">Drawn Features ({drawnFeatures.length})</h3>
			<ScrollArea class="h-48">
				{#each drawnFeatures as feature, index}
					{@const info = getFeatureInfo(feature)}
					<div class="bg-muted mb-2 flex items-center justify-between rounded-lg p-2">
						<div>
							<Badge variant="outline" class="mr-2">{info.type}</Badge>
							<span class="text-sm">{info.details}</span>
						</div>
						<span class="text-muted-foreground text-xs">#{index + 1}</span>
					</div>
				{/each}
			</ScrollArea>
		</Card.Root>
	{/if}
</div>
