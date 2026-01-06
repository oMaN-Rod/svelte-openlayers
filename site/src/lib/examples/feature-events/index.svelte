<script lang="ts">
	import TooltipHover from '../_shared/components/tooltip-hover.svelte';
	import TooltipSelect from '../_shared/components/tooltip-select.svelte';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import type TileLayer from 'ol/layer/Tile';
	import {
		pointStyle,
		hoverStyle,
		selectedStyle,
		lineStyle,
		lineHoverStyle,
		lineSelectedStyle
	} from '../_shared/styles';
	import { tourRoute, locations } from './data';

	let center = $state<[number, number]>([-73.98513, 40.758896]);
	let zoom = $state(12);

	// Event log
	let eventLog = $state<string[]>([]);
	const maxLogEntries = 5;

	function logEvent(message: string) {
		const timestamp = new Date().toLocaleTimeString();
		eventLog = [`[${timestamp}] ${message}`, ...eventLog.slice(0, maxLogEntries - 1)];
	}

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);
</script>

<div class="h-105 w-full overflow-hidden rounded-lg border">
	<View bind:center bind:zoom>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>

			<!-- Line with events and overlays -->
			<Layer.Vector>
				<Feature.LineString
					coordinates={tourRoute}
					style={lineStyle}
					hoverStyle={lineHoverStyle}
					selectedStyle={lineSelectedStyle}
					properties={{ name: 'NYC Tour Route', type: 'Route', length: '5.2 km' }}
					onHover={(f) => logEvent(`Hover: ${f.get('name')}`)}
					onHoverEnd={(f) => logEvent(`Hover end: ${f.get('name')}`)}
					onClick={(f) => logEvent(`Click: ${f.get('name')}`)}
					onSelect={(f) => logEvent(`Selected: ${f.get('name')}`)}
					onDeselect={(f) => logEvent(`Deselected: ${f.get('name')}`)}
				>
					<Overlay.Hover offset={[10, 0]} positioning="center-left">
						<div class="rounded bg-emerald-600 px-2 py-1 text-xs text-white shadow">
							Tour Route (5.2 km)
						</div>
					</Overlay.Hover>
					<Overlay.Popup positioning="bottom-center" offset={[0, 10]}>
						<div class="rounded-lg bg-white p-3 shadow-lg">
							<div class="font-semibold">NYC Walking Tour</div>
							<div class="text-sm text-gray-600">Duration: ~2 hours</div>
							<div class="text-sm text-gray-600">Distance: 5.2 km</div>
						</div>
					</Overlay.Popup>
				</Feature.LineString>
			</Layer.Vector>

			<!-- Points with events and child overlays -->
			<Layer.Vector>
				{#each locations as location (location.id)}
					<Feature.Point
						coordinates={location.coords}
						style={pointStyle}
						{hoverStyle}
						{selectedStyle}
						properties={{ name: location.name, type: location.type }}
						onHover={(f) => logEvent(`Hover: ${f.get('name')}`)}
						onHoverEnd={(f) => logEvent(`Hover end: ${f.get('name')}`)}
						onClick={(f, coord) =>
							logEvent(
								`Click: ${f.get('name')} at [${coord[0].toFixed(4)}, ${coord[1].toFixed(4)}]`
							)}
						onSelect={(f) => logEvent(`Selected: ${f.get('name')}`)}
						onDeselect={(f) => logEvent(`Deselected: ${f.get('name')}`)}
					>
						<Overlay.Hover offset={[15, 0]} positioning="center-left">
							<TooltipHover name={location.name} type={location.type} />
						</Overlay.Hover>

						<Overlay.Popup positioning="top-center" offset={[0, -15]} autoPan>
							<TooltipSelect name={location.name} type={location.type} />
						</Overlay.Popup>
					</Feature.Point>
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>

<!-- Event log -->
<div class="bg-muted mt-4 rounded-lg p-3">
	<div class="mb-2 text-sm font-semibold">Event Log</div>
	<div class="space-y-1 font-mono text-xs">
		{#each eventLog as event}
			<div class="text-muted-foreground">{event}</div>
		{:else}
			<div class="text-muted-foreground italic">Hover or click on features to see events...</div>
		{/each}
	</div>
</div>
