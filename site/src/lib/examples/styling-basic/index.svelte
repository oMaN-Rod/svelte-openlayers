<script lang="ts">
	import { Feature, Layer, Map, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { cities, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { pointStyle } from '../_shared/styles';
	import type TileLayer from 'ol/layer/Tile';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);
</script>

<div class="map-container">
	<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
		<Map controls={{ fullscreen: true }}>
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>

			<Layer.Vector style={pointStyle}>
				{#each cities as city}
					<Feature.Point coordinates={city.coordinates} properties={{ name: city.name }} />
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>
