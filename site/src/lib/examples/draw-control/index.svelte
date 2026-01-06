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
	import type { ControlDrawType } from 'svelte-openlayers';
	import { createStyleFromFeature, setDefaultStyleProperties } from 'svelte-openlayers/utils';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { sketchStyle } from '../_shared/styles';
	import type TileLayer from 'ol/layer/Tile';

	const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];
	const DEFAULT_ZOOM = 10;

	let center = $state(DEFAULT_CENTER);
	let zoom = $state(DEFAULT_ZOOM);
	let drawType = $state<ControlDrawType>(null);
	let isDrawing = $state(false);
	let drawnFeatures = $state<Feature<Geometry>[]>([]);
	let selectedFeature = $state<Feature<Geometry> | null>(null);
	let vectorSource: VectorSource | null = $state(null);
	let tileLayer = $state<TileLayer | null>(null);

	useThemeMapSource(() => tileLayer);

	const isActiveDrawMode = $derived(drawType !== null && drawType !== 'Select');

	function handleDrawStart(evt: any) {
		isDrawing = true;
	}

	function handleDrawEnd(evt: any) {
		if (!vectorSource) return;
		isDrawing = false;
		const feature = evt.feature;

		// Set default style properties on new features (fill, stroke, image at root level)
		setDefaultStyleProperties(feature);

		drawnFeatures = [...drawnFeatures, feature];
	}

	function handleDrawAbort() {
		isDrawing = false;
	}

	function handleFeatureSelect(feature: Feature<Geometry> | null) {
		selectedFeature = feature;
	}

	function handleFeatureModified(feature: Feature<Geometry>) {
		// Force update the feature list to reflect geometry changes
		drawnFeatures = [...drawnFeatures];
	}

	function handleFeatureDelete(feature: Feature<Geometry>) {
		drawnFeatures = drawnFeatures.filter((f) => f !== feature);
		selectedFeature = null;
	}

	function handleTypeChange(newType: ControlDrawType) {
		if (newType !== 'Select') {
			selectedFeature = null;
		}
	}

	function clearFeatures() {
		if (!vectorSource) return;
		vectorSource.clear();
		drawnFeatures = [];
		selectedFeature = null;
	}

	function featureStyleFunction(
		feature: Feature<Geometry> | import('ol/render/Feature.js').default
	) {
		if (!('get' in feature) || !('getGeometry' in feature)) return undefined;
		return createStyleFromFeature(feature as Feature<Geometry>);
	}

	function getModeLabel(mode: ControlDrawType): string {
		if (mode === null) {
			return 'None';
		}
		switch (mode) {
			case 'Select':
				return 'Select & Edit';
			default:
				return `Draw ${mode}`;
		}
	}
</script>

<div class="space-y-4">
	<!-- Control Panel -->
	<Card.Root class="p-4">
		<div class="flex flex-col justify-between gap-2 md:flex-row md:items-center">
			<div class="flex flex-wrap items-center gap-2">
				<Badge
					variant={drawType === 'Select' ? 'default' : drawType === null ? 'outline' : 'secondary'}
				>
					Mode: {getModeLabel(drawType)}
				</Badge>
				{#if isActiveDrawMode}
					<Badge variant={isDrawing ? 'default' : 'outline'}>
						{isDrawing ? 'Drawing...' : 'Ready'}
					</Badge>
					<Badge variant="outline">
						Press <kbd class="bg-muted rounded px-1 py-0.5 text-xs">Esc</kbd> to exit.
					</Badge>
				{:else if drawType === 'Select' && selectedFeature}
					<Badge variant="outline">Feature Selected</Badge>
				{/if}
			</div>
			<Button
				variant="outline"
				size="sm"
				onclick={clearFeatures}
				disabled={drawnFeatures.length === 0}
			>
				Clear All ({drawnFeatures.length})
			</Button>
		</div>
	</Card.Root>

	<!-- Map -->
	<div class="map-container">
		<View bind:center bind:zoom>
			<Map class="h-full w-full">
				<Layer.Tile
					source="xyz"
					url={themeMapSource.current.url}
					attributions={themeMapSource.current.attributions}
					bind:layer={tileLayer}
				/>

				<!-- Layer for drawn features -->
				<Layer.Vector bind:source={vectorSource} style={featureStyleFunction}>
					<Control.Draw
						bind:type={drawType}
						bind:selectedFeature
						source={vectorSource}
						style={sketchStyle}
						propertiesPanelPosition="right"
						onDrawStart={handleDrawStart}
						onDrawEnd={handleDrawEnd}
						onDrawAbort={handleDrawAbort}
						onTypeChange={handleTypeChange}
						onFeatureSelect={handleFeatureSelect}
						onFeatureModified={handleFeatureModified}
						onFeatureDelete={handleFeatureDelete}
					/>
				</Layer.Vector>
			</Map>
		</View>
	</div>

	<!-- Feature List -->
	{#if drawnFeatures.length > 0}
		<Card.Root class="p-4">
			<h3 class="mb-3 text-lg font-semibold">Drawn Features ({drawnFeatures.length})</h3>
			<ScrollArea class="max-h-48">
				{#each drawnFeatures as feature, index}
					{@const info = getFeatureInfo(feature)}
					{@const isSelected = feature === selectedFeature}
					<div
						class="mb-2 flex items-center justify-between rounded-lg p-2 transition-colors {isSelected
							? 'bg-destructive/10 border-destructive border'
							: 'bg-muted'}"
					>
						<div>
							<Badge variant={isSelected ? 'destructive' : 'outline'} class="mr-2">
								{info.type}
							</Badge>
							<span class="text-sm">{info.details}</span>
						</div>
						<span class="text-muted-foreground text-xs">#{index + 1}</span>
					</div>
				{/each}
			</ScrollArea>
		</Card.Root>
	{/if}
</div>
