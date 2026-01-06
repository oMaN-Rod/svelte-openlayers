<script lang="ts">
	import { Map, Layer, Feature, View } from 'svelte-openlayers';
	import type { Style } from 'ol/style';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { locations, iconMap, DEFAULT_CENTER, DEFAULT_ZOOM, type Location } from './data';
	import { createMarkerStyle } from './styles';
	import type TileLayer from 'ol/layer/Tile';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);

	// Load SVG icons using Vite's glob import
	const icons = import.meta.glob('$lib/components/icons/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	}) as Record<string, string>;

	// Map location types to loaded icons
	function getIconContent(type: Location['type']): string {
		const path = iconMap[type];
		for (const [key, content] of Object.entries(icons)) {
			if (key.includes(path.split('/').pop()?.replace('.svg', '') || '')) {
				return content;
			}
		}
		return icons[Object.keys(icons).find((k) => k.includes('map-pin.svg')) || ''] || '';
	}

	let iconScale = $state(1);
	let useCustomColors = $state(true);

	// Compute styles reactively
	const computedStyles = $derived.by(() => {
		const styles: Record<string, Style> = {};
		for (const location of locations) {
			const iconContent = getIconContent(location.type);
			const key = `${location.type}-${iconScale}-${useCustomColors}`;
			const style = createMarkerStyle(
				iconContent,
				useCustomColors ? location.color : '#4338ca',
				iconScale,
				useCustomColors
			);
			styles[key] = style;
		}
		return styles;
	});

	function getStyleKey(location: Location): string {
		return `${location.type}-${iconScale}-${useCustomColors}`;
	}
</script>

<div class="space-y-4">
	<!-- Controls -->
	<div class="bg-card flex gap-4 rounded-lg border p-4">
		<div class="flex items-center gap-2">
			<label for="icon-scale" class="text-sm font-medium">Icon Size:</label>
			<input
				id="icon-scale"
				type="range"
				min="0.5"
				max="2"
				step="0.1"
				bind:value={iconScale}
				class="w-32"
			/>
			<span class="text-muted-foreground text-sm">{iconScale.toFixed(1)}x</span>
		</div>

		<div class="flex items-center gap-2">
			<input type="checkbox" id="use-colors" bind:checked={useCustomColors} class="rounded" />
			<label for="use-colors" class="text-sm font-medium">Custom Colors</label>
		</div>
	</div>

	<!-- Map -->
	<div class="h-125 overflow-hidden rounded-lg border">
		<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
			<Map class="h-full w-full">
				<Layer.Tile
					source="xyz"
					url={themeMapSource.current.url}
					attributions={themeMapSource.current.attributions}
					bind:layer={tileLayer}
				/>

				<Layer.Vector>
					{#each locations as location}
						{@const styleKey = getStyleKey(location)}
						{#if computedStyles[styleKey]}
							<Feature.Point
								coordinates={location.coordinates}
								properties={location}
								style={computedStyles[styleKey]}
							/>
						{/if}
					{/each}
				</Layer.Vector>
			</Map>
		</View>
	</div>

	<!-- Legend -->
	<div class="bg-muted rounded-lg p-4">
		<h4 class="mb-3 text-sm font-semibold">Location Types</h4>
		<div class="grid grid-cols-2 gap-3 md:grid-cols-5">
			{#each locations as location}
				<div class="flex items-center gap-2">
					<div
						class="flex h-8 w-8 items-center justify-center"
						style="color: {useCustomColors ? location.color : '#4338ca'}"
					>
						{@html getIconContent(location.type)}
					</div>
					<div class="text-sm">
						<div class="font-medium capitalize">{location.type}</div>
						<div class="text-muted-foreground text-xs">{location.name}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
