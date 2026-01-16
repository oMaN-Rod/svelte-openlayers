<script lang="ts">
	import Hover from '$lib/examples/vector-tiles/hover.svelte';
	import SelectedPanel from '$lib/examples/vector-tiles/selected-panel.svelte';
	import type { FeatureLike } from 'ol/Feature.js';
	import MVT from 'ol/format/MVT.js';
	import VectorTileLayer from 'ol/layer/VectorTile.js';
	import type OLMap from 'ol/Map.js';
	import VectorTileSource from 'ol/source/VectorTile.js';
	import { Layer, Map, Overlay, View } from 'svelte-openlayers';
	import Legend from './legend.svelte';
	import { countryStyle, selectedStyle } from './styles';

	let zoom = $state(2);

	let selection: Record<string, FeatureLike> = $state({});
	let selectedFeature: FeatureLike | null = $state(null);
	let mainLayer: VectorTileLayer | null = $state(null);
	let selectionLayer: VectorTileLayer | null = $state(null);
	let mapInstance: OLMap | null = $state(null);
	let showLegend = $state(true);

	const tileUrl =
		'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
		'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

	const vectorTileSource = new VectorTileSource({
		maxZoom: 15,
		format: new MVT({ idProperty: 'iso_a2' }),
		url: tileUrl
	});

	function selectionStyleFunction(feature: FeatureLike) {
		const fid = feature.getId();
		if (fid !== undefined && fid in selection) {
			return selectedStyle;
		}
		return undefined;
	}

	function handleMapClick(event: any) {
		if (!mainLayer) return;

		mainLayer.getFeatures(event.pixel).then((features: FeatureLike[]) => {
			if (!features.length) {
				selection = {};
				selectedFeature = null;
				selectionLayer?.changed();
				return;
			}

			const feature = features[0];
			if (!feature) return;

			const fid = feature.getId();
			if (fid === undefined) return;

			selection = { [fid]: feature };
			selectedFeature = feature;
			selectionLayer?.changed();
		});
	}

	function clearSelection() {
		selection = {};
		selectedFeature = null;
		selectionLayer?.changed();
	}
</script>

<div class="map-container relative">
	<!-- Legend  -->
	{#if showLegend}
		<div class="absolute bottom-4 left-4 z-10">
			<Legend />
		</div>
	{/if}
	<View bind:zoom center={[0, 0]} maxZoom={5}>
		<Map bind:map={mapInstance} click={handleMapClick}>
			<Layer.VectorTile source={vectorTileSource} style={countryStyle} bind:layer={mainLayer} />

			<Layer.VectorTile
				renderMode="vector"
				source={vectorTileSource}
				style={selectionStyleFunction}
				bind:layer={selectionLayer}
			/>

			<!-- Hover tooltip -->
			<Overlay.TooltipManager
				selectTooltip={false}
				hitTolerance={5}
				hoverClass="!bg-transparent !shadow-none !p-0"
			>
				{#snippet hoverSnippet(feature)}
					{@const props = feature.getProperties()}
					<Hover {...props} />
				{/snippet}
			</Overlay.TooltipManager>
		</Map>
	</View>

	<!-- Selection Panel -->
	{#if selectedFeature}
		{@const props = selectedFeature.getProperties()}
		<SelectedPanel {...props} {clearSelection} />
	{/if}
</div>

<div class="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
	<div>Zoom: {zoom.toFixed(1)}</div>
	<div class="flex items-center gap-2">
		<input type="checkbox" id="show-pulse" bind:checked={showLegend} class="rounded" />
		<label for="show-pulse" class="text-sm font-medium">Show Legend</label>
	</div>

	{#if selectedFeature}
		<span class="text-indigo-600">
			Selected: {selectedFeature.getProperties().name}
		</span>
	{/if}
</div>
