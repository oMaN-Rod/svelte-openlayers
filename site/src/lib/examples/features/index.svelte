<script lang="ts">
	import TooltipHover from '../_shared/components/tooltip-hover.svelte';
	import TooltipSelect from '../_shared/components/tooltip-select.svelte';
	import { mapSources } from '../_shared/data/map-sources';
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import {
		locations,
		tourRoute,
		centralParkBoundary,
		DEFAULT_CENTER,
		DEFAULT_ZOOM
	} from './data';
	import { pointStyle, selectedStyle, lineStyle, polygonStyle } from './styles';

	let center = $state(DEFAULT_CENTER);
	let zoom = $state(DEFAULT_ZOOM);
	let selectedFeature = $state<string | null>(null);
</script>

<div class="h-105 w-full overflow-hidden rounded-lg border">
	<View bind:center bind:zoom>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<!-- Vector layer containing all Markers -->
			<Layer.Vector>
				<Feature.LineString
					coordinates={tourRoute}
					style={lineStyle}
					properties={{
						name: 'Tour Route',
						type: 'LineString',
						length: '3.5 km'
					}}
				/>

				<Feature.Polygon
					coordinates={centralParkBoundary}
					style={polygonStyle}
					properties={{
						name: 'Central Area',
						type: 'Polygon',
						area: '2.3 sq km'
					}}
				/>
			</Layer.Vector>

			<Layer.Vector style={pointStyle}>
				{#each locations as location}
					<Feature.Point
						coordinates={location.coords}
						style={pointStyle}
						properties={{
							name: location.name,
							type: location.type,
							image: location.image,
							rating: location.rating,
							reviews: location.reviews,
							hours: location.hours,
							address: location.address,
							phone: location.phone,
							website: location.website
						}}
					/>
				{/each}
			</Layer.Vector>
			<Overlay.TooltipManager
				hoverTooltip={true}
				selectTooltip={true}
				selectStyle={selectedStyle}
				hoverClass="!bg-transparent !shadow-none"
				selectClass="!bg-transparent !shadow-none"
			>
				{#snippet hoverSnippet(feature)}
					{@const props = feature.getProperties()}
					<TooltipHover name={props.name} type={props.type} />
				{/snippet}
				{#snippet selectSnippet(feature)}
					{@const props = feature.getProperties()}
					<TooltipSelect {...props} />
				{/snippet}
			</Overlay.TooltipManager>
		</Map>
	</View>
</div>
{#if selectedFeature}
	<div class="bg-muted mt-4 rounded-lg p-3">
		<strong>Selected:</strong>
		{selectedFeature}
	</div>
{/if}
