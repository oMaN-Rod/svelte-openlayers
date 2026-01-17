<script lang="ts">
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { markerLocations, typeColors, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import type TileLayer from 'ol/layer/Tile';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);

	// Controls for demo
	let showPulse = $state(true);
	let markerScale = $state(1);
</script>

<div class="space-y-4">
	<!-- Controls -->
	<div class="bg-card flex flex-wrap gap-4 rounded-lg border p-4">
		<div class="flex items-center gap-2">
			<input type="checkbox" id="show-pulse" bind:checked={showPulse} class="rounded" />
			<label for="show-pulse" class="text-sm font-medium">Pulse Animation</label>
		</div>

		<div class="flex items-center gap-2">
			<label for="marker-scale" class="text-sm font-medium">Scale:</label>
			<input
				id="marker-scale"
				type="range"
				min="0.5"
				max="2"
				step="0.1"
				bind:value={markerScale}
				class="w-24"
			/>
			<span class="text-muted-foreground text-sm">{markerScale.toFixed(1)}x</span>
		</div>
	</div>

	<!-- Map -->
	<div class="map-container">
		<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
			<Map class="h-full w-full">
				<Layer.Tile
					source="xyz"
					url={themeMapSource.current.url}
					attributions={themeMapSource.current.attributions}
					bind:layer={tileLayer}
				/>

				<Layer.Vector>
					{#each markerLocations as loc (loc.id)}
						{@const colors = typeColors[loc.type]}
						{@const scaledSize = loc.size * markerScale}
						<Feature.Point
							coordinates={loc.coordinates}
							properties={{ name: loc.name, type: loc.type }}
						>
							<!-- HTML Marker - always visible at feature position -->
							<Overlay.Marker>
								<div class="relative flex items-center justify-center">
									<!-- Outer glow ring -->
									<div
										class="absolute rounded-full {colors.pulse} opacity-30"
										style="width: {scaledSize * 2.5}px; height: {scaledSize * 2.5}px;"
									></div>

									<!-- Pulse animation ring -->
									{#if showPulse && loc.pulse}
										<div
											class="absolute animate-ping rounded-full {colors.pulse}"
											style="width: {scaledSize * 1.8}px; height: {scaledSize *
												1.8}px; animation-duration: 2s;"
										></div>
									{/if}

									<!-- Core marker -->
									<div
										class="relative rounded-full {colors.base} shadow-lg {colors.glow}"
										style="width: {scaledSize}px; height: {scaledSize}px;"
									></div>
								</div>
							</Overlay.Marker>

							<!-- Hover tooltip -->
							<Overlay.Hover>
								<div class="bg-background/95 rounded-lg border p-2 shadow-lg">
									<div class="text-foreground text-sm font-semibold">{loc.name}</div>
									{#if loc.description}
										<div class="text-muted-foreground text-xs">{loc.description}</div>
									{/if}
								</div>
							</Overlay.Hover>
						</Feature.Point>
					{/each}
				</Layer.Vector>
			</Map>
		</View>
	</div>

	<!-- Legend -->
	<div class="bg-muted rounded-lg p-4">
		<h4 class="mb-3 text-sm font-semibold">Marker Types</h4>
		<div class="flex flex-wrap gap-4">
			{#each Object.entries(typeColors) as [type, colors]}
				<div class="flex items-center gap-2">
					<div class="relative flex h-6 w-6 items-center justify-center">
						<div class="absolute h-4 w-4 rounded-full {colors.pulse} animate-ping opacity-50"></div>
						<div class="relative h-2.5 w-2.5 rounded-full {colors.base}"></div>
					</div>
					<span class="text-sm capitalize">{type}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
