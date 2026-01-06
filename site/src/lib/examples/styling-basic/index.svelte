<script lang="ts">
	import { Feature, Layer, Map, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { cities, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { pointStyle } from '../_shared/styles';
</script>

<div class="h-100 overflow-hidden rounded-lg border">
	<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
		<Map>
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector style={pointStyle}>
				{#each cities as city}
					<Feature.Point coordinates={city.coordinates} properties={{ name: city.name }} />
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>
