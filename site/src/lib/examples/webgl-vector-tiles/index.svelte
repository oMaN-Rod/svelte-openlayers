<script lang="ts">
	import { Map, Layer, View } from 'svelte-openlayers';
	import MVT from 'ol/format/MVT.js';
	import VectorTileSource from 'ol/source/VectorTile.js';
	import type WebGLVectorTileLayer from 'ol/layer/WebGLVectorTile.js';
	import { countryStyle } from './styles';
	import Legend from './legend.svelte';

	let zoom = $state(2);
	let webglLayer: WebGLVectorTileLayer | null = $state(null);
	let showLegend = $state(true);

	// URL must be in a variable to avoid Svelte interpreting {z}/{x}/{y} as expressions
	const tileUrl =
		'https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/' +
		'ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf';

	// Create source with idProperty for identification
	const vectorTileSource = new VectorTileSource({
		maxZoom: 15,
		format: new MVT({ idProperty: 'iso_a2' }),
		url: tileUrl
	});
</script>

<div class="map-container relative">
	<!-- Legend  -->
	{#if showLegend}
		<div class="absolute bottom-4 left-4 z-10">
			<Legend />
		</div>
	{/if}
	<View bind:zoom center={[0, 0]} maxZoom={8}>
		<Map controls={{ fullscreen: true }}>
			<Layer.WebGLVectorTile
				source={vectorTileSource}
				style={countryStyle}
				bind:layer={webglLayer}
			/>
		</Map>
	</View>
</div>

<div class="text-muted-foreground mt-4 flex gap-2 text-sm">
	<div>Zoom: {zoom.toFixed(1)}</div>
	<div class="flex items-center gap-2">
		<input type="checkbox" id="show-pulse" bind:checked={showLegend} class="rounded" />
		<label for="show-pulse" class="text-sm font-medium">Show Legend</label>
	</div>
</div>

<div class="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
	<strong>Note:</strong> Hit detection (hover/click) is not yet implemented for WebGLVectorTileLayer
	in OpenLayers. For interactive features, use the regular <code>Layer.VectorTile</code> component instead.
</div>
