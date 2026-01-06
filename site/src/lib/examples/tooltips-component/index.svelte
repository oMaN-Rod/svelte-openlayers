<script lang="ts">
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { TooltipHover, TooltipSelect } from '../_shared';
	import { pointStyle, hoverStyle, selectedStyle } from '../_shared/styles';
	import type TileLayer from 'ol/layer/Tile';
	import { locationsEU, DEFAULT_CENTER_EU, DEFAULT_ZOOM } from '../_shared/data/locations';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);
</script>

<div class="map-container">
	<View center={DEFAULT_CENTER_EU} zoom={DEFAULT_ZOOM}>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>

			<Layer.Vector>
				{#each locationsEU as landmark}
					<Feature.Point
						coordinates={landmark.coords}
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
							<TooltipSelect {...landmark} />
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
