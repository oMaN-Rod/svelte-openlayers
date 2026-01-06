<script lang="ts">
	import { Map, Layer, Feature, Overlay, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { landmarks, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { pointStyle, hoverStyle, selectedStyle } from '../_shared/styles';
</script>

<div class="relative h-96 w-full overflow-hidden rounded-lg border">
	<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector>
				{#each landmarks as landmark}
					<Feature.Point
						coordinates={landmark.coordinates}
						style={pointStyle}
						{hoverStyle}
						{selectedStyle}
						properties={{
							name: landmark.name,
							description: landmark.description
						}}
					/>
				{/each}
			</Layer.Vector>

			<Overlay.TooltipManager />
		</Map>
	</View>
</div>
