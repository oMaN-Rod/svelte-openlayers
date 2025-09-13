<script lang="ts">
	import { Map, Layer, Feature, Overlay } from 'svelte-openlayers';
	import { createCircleStyle, createStyle } from 'svelte-openlayers/utils';
	import ToolTipHover from '$lib/examples/tooltip-hover.svelte';
	import TooltipSelect from '$lib/examples/tooltip-select.svelte';
	import { mapSources } from './sources';

	let center = $state([-73.98513, 40.758896]);
	let zoom = $state(11);

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: '#4338ca', // Uses --ol-color-primary
		stroke: '#ffffff',
		strokeWidth: 2
	});

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: '#ef4444',
		stroke: '#991b1b',
		strokeWidth: 3
	});

	const lineStyle = createStyle({
		stroke: {
			color: '#10b981',
			width: 3
		}
	});

	const polygonStyle = createStyle({
		fill: {
			color: 'rgba(99, 102, 241, 0.3)'
		},
		stroke: {
			color: '#4338ca',
			width: 2
		}
	});

	const locations = [
		{ name: 'Central Park', coords: [-73.965355, 40.782865] },
		{ name: 'Times Square', coords: [-73.98513, 40.758896] },
		{ name: 'Brooklyn Bridge', coords: [-73.996864, 40.711174] },
		{ name: 'Statue of Liberty', coords: [-74.044502, 40.689247] }
	];

	const lineCoordinates = [
		[-73.965355, 40.782865],
		[-73.98513, 40.758896],
		[-73.996864, 40.711174]
	];

	const polygonCoordinates = [
		[
			[-73.98021871253646, 40.77027200461764],
			[-73.98135532570753, 40.76860169645568],
			[-73.98116483044817, 40.76830306897773],
			[-73.98115801876689, 40.76829482488293],
			[-73.98109760344741, 40.76792115885644],
			[-73.97375288825044, 40.76482052989492],
			[-73.97326503024209, 40.76537580381231],
			[-73.97245835676172, 40.7650023528409],
			[-73.94960315787255, 40.79661308321068],
			[-73.95016363453198, 40.79724072518886],
			[-73.9577904394985, 40.80040799782778],
			[-73.95842880506385, 40.80022593137676],
			[-73.98021871253646, 40.77027200461764]
		]
	];

	let selectedFeature = $state<string | null>(null);
</script>

<div class="h-96 w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full">
		<Map.View bind:center bind:zoom />
		<Layer.Tile
			source="xyz"
			url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
			attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
		/>

		<!-- Vector layer containing all Markers -->
		<Layer.Vector>
			<Feature.LineString
				coordinates={lineCoordinates}
				style={lineStyle}
				properties={{
					name: 'Tour Route',
					type: 'LineString',
					length: '3.5 km'
				}}
			/>

			<Feature.Polygon
				coordinates={polygonCoordinates}
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
						type: 'POI',
						lon: location.coords[0],
						lat: location.coords[1]
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
				<ToolTipHover name={props.name} type={props.type} />
			{/snippet}
			{#snippet selectSnippet(feature)}
				{@const props = feature.getProperties()}
				<TooltipSelect {...props} />
			{/snippet}
		</Overlay.TooltipManager>
	</Map.Root>
</div>
{#if selectedFeature}
	<div class="bg-muted mt-4 rounded-lg p-3">
		<strong>Selected:</strong>
		{selectedFeature}
	</div>
{/if}
