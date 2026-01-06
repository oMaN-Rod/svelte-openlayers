<script lang="ts">
	import TooltipHover from '../_shared/components/tooltip-hover.svelte';
	import TooltipSelect from '../_shared/components/tooltip-select.svelte';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import type TileLayer from 'ol/layer/Tile';
	import { tourRoute, centralParkBoundary, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import {
		pointStyle,
		hoverStyle,
		selectedStyle,
		lineStyle,
		lineHoverStyle,
		lineSelectedStyle,
		polygonStyle,
		polygonHoverStyle,
		polygonSelectedStyle
	} from '../_shared/styles';
	import { locationsUS } from '../_shared/data/locations';

	let center = $state(DEFAULT_CENTER);
	let zoom = $state(DEFAULT_ZOOM);
	let tileLayer = $state<TileLayer | null>(null);

	useThemeMapSource(() => tileLayer);
</script>

<div class="map-container">
	<View bind:center bind:zoom>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>

			<!-- Vector layer with line and polygon features -->
			<Layer.Vector>
				<Feature.LineString
					coordinates={tourRoute}
					style={lineStyle}
					hoverStyle={lineHoverStyle}
					selectedStyle={lineSelectedStyle}
					properties={{
						name: 'Tour Route',
						type: 'Route',
						length: '3.5 km'
					}}
					onHover={() => {
						console.log('Hovered over tour route');
					}}
				>
					<Overlay.Hover>
						<TooltipHover name="Tour Route" type="Route" />
					</Overlay.Hover>
					<Overlay.Popup>
						<TooltipSelect
							name="Tour Route"
							type="Route"
							description="A scenic walking tour through downtown."
						/>
					</Overlay.Popup>
				</Feature.LineString>

				<Feature.Polygon
					coordinates={centralParkBoundary}
					style={polygonStyle}
					hoverStyle={polygonHoverStyle}
					selectedStyle={polygonSelectedStyle}
					properties={{
						name: 'Central Park',
						type: 'Park',
						area: '3.4 sq km'
					}}
				>
					<Overlay.Hover>
						<TooltipHover name="Central Park" type="Park" />
					</Overlay.Hover>
					<Overlay.Popup>
						<TooltipSelect
							name="Central Park"
							type="Park"
							description="A large public park in the city center."
						/>
					</Overlay.Popup>
				</Feature.Polygon>
			</Layer.Vector>

			<!-- Vector layer with point features -->
			<Layer.Vector>
				{#each locationsUS as location}
					<Feature.Point
						coordinates={location.coords}
						style={pointStyle}
						{hoverStyle}
						{selectedStyle}
						properties={{
							name: location.name,
							type: location.type
						}}
					>
						<Overlay.Hover offset={[15, 0]} positioning="center-left">
							<TooltipHover name={location.name} type={location.type} />
						</Overlay.Hover>

						<Overlay.Popup positioning="center-left" offset={[0, -15]} autoPan>
							<TooltipSelect
								name={location.name}
								type={location.type}
								image={location.image}
								rating={location.rating}
								reviews={location.reviews}
								hours={location.hours}
								address={location.address}
								phone={location.phone}
								website={location.website}
							/>
						</Overlay.Popup>
					</Feature.Point>
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>
