<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Circle from '@lucide/svelte/icons/circle';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import Pentagon from '@lucide/svelte/icons/pentagon';
	import Spline from '@lucide/svelte/icons/spline';
	import type { Feature } from 'ol';
	import type { Geometry } from 'ol/geom';
	import VectorSource from 'ol/source/Vector.js';
	import { Interaction, Layer, Map } from 'svelte-openlayers';
	import { createStyle } from 'svelte-openlayers/utils';
	import { mapSources } from './sources';
	import { getFeatureInfo } from '$lib/utils';

	let center = $state([-74.006, 40.7128]);
	let zoom = $state(10);
	let drawType = $state<'Point' | 'LineString' | 'Polygon' | 'Circle'>('Point');
	let isDrawing = $state(false);
	let drawnFeatures = $state<Feature<Geometry>[]>([]);

	// Create a vector source to store drawn features
	let vectorSource: VectorSource | null = $state(null);

	const drawTypes = [
		{ type: 'Point', icon: MapPin },
		{ type: 'LineString', icon: Spline },
		{ type: 'Polygon', icon: Pentagon },
		{ type: 'Circle', icon: Circle }
	];

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

	function handleDrawStart() {
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
			<div class="space-y-4">
				<div>
					<div class="flex flex-wrap gap-2">
						{#each drawTypes as type}
							{@const Icon = type.icon}
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger
										><Button
											variant={drawType === type.type ? 'default' : 'outline'}
											size="sm"
											onclick={() => (drawType = type.type as any)}
										>
											<Icon />
										</Button>
									</Tooltip.Trigger>
									<Tooltip.Content>
										{type.type}
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>
						{/each}
						<Button
							variant="outline"
							size="sm"
							onclick={clearFeatures}
							disabled={drawnFeatures.length === 0}
						>
							Clear All ({drawnFeatures.length})
						</Button>
						<Badge variant={isDrawing ? 'default' : 'secondary'}>
							{isDrawing ? 'Drawing...' : 'Ready'}
						</Badge>
					</div>
				</div>
			</div>
		</div>
	</Card.Root>

	<!-- Map -->
	<div class="h-96 w-full overflow-hidden rounded-lg border">
		<Map.Root class="h-full w-full">
			<Map.View bind:center bind:zoom />
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<!-- Layer for drawn features -->
			<Layer.Vector bind:source={vectorSource} style={drawStyle}>
				<Interaction.Draw
					bind:type={drawType}
					source={vectorSource}
					style={sketchStyle}
					onDrawStart={handleDrawStart}
					onDrawEnd={handleDrawEnd}
					onDrawAbort={handleDrawAbort}
				/>
			</Layer.Vector>
		</Map.Root>
	</div>

	<!-- Feature List -->
	{#if drawnFeatures.length > 0}
		<Card.Root class="p-4">
			<h3 class="mb-3 text-lg font-semibold">Drawn Features ({drawnFeatures.length})</h3>
			<ScrollArea class="max-h-48 overflow-auto">
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
