<script lang="ts">
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { TooltipHover, TooltipSelect } from '../_shared';
	import { landmarks, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { pointStyle, hoverStyle, selectedStyle } from '../_shared/styles';
</script>

<div class="relative h-105 w-full overflow-hidden rounded-lg border">
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
							type: landmark.type,
							description: landmark.description
						}}
					>
						<Overlay.Hover>
							<TooltipHover name={landmark.name} type={landmark.type} />
						</Overlay.Hover>

						<Overlay.Popup positioning="center-left">
							<TooltipSelect
								name={landmark.name}
								type={landmark.type}
								height={landmark.height}
								built={landmark.built}
								visitors={landmark.visitors}
							/>
						</Overlay.Popup>
					</Feature.Point>
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>
<div class="text-muted-foreground mt-4 text-sm">
	Hover to see quick info component, click to see detailed component
</div>
