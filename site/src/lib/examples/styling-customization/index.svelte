<script lang="ts">
	import { CodeBlock } from '$lib/components/docs';
	import { onMount } from 'svelte';
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { createCircleStyle } from 'svelte-openlayers/utils';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { themes, applyTheme, getCssVariables, type ThemeName } from './themes';
	import type TileLayer from 'ol/layer/Tile';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);

	let theme = $state<ThemeName>('default');
	let activeCssVariablesCode = $state('');
	let mapElement: HTMLElement | null = $state(null);

	$effect(() => {
		applyTheme(theme, mapElement || undefined);
	});

	// Sample features to demonstrate styling
	const features = [
		{ coords: [-0.12755, 51.507222], name: 'London', population: '9M' },
		{ coords: [2.3522, 48.8566], name: 'Paris', population: '2.2M' },
		{ coords: [13.405, 52.52], name: 'Berlin', population: '3.6M' }
	];

	function getFeatureStyle(themeName: ThemeName) {
		return createCircleStyle({
			radius: 8,
			fill: { color: themes[themeName].primary },
			stroke: { color: '#ffffff', width: 2 }
		});
	}

	function getHoverStyle(themeName: ThemeName) {
		return createCircleStyle({
			radius: 10,
			fill: { color: themes[themeName].primary },
			stroke: { color: '#ffffff', width: 3 }
		});
	}

	function getSelectedStyle(themeName: ThemeName) {
		return createCircleStyle({
			radius: 12,
			fill: { color: themes[themeName].primary },
			stroke: { color: '#ffffff', width: 4 }
		});
	}

	const handleUpdateCssVariablesCode = () => {
		activeCssVariablesCode = getCssVariables(theme);
	};

	onMount(() => {
		handleUpdateCssVariablesCode();
	});
</script>

<div class="space-y-4">
	<!-- Theme Controls -->
	<div class="bg-card flex gap-4 rounded-lg border p-4">
		<div class="flex items-center gap-2">
			<label for="theme-select" class="text-sm font-medium">Theme:</label>
			<select
				id="theme-select"
				bind:value={theme}
				class="bg-background rounded-md border px-3 py-1 text-sm"
				onchange={handleUpdateCssVariablesCode}
			>
				{#each Object.keys(themes) as themeOption}
					<option value={themeOption}>{themeOption}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="h-100 overflow-hidden rounded-lg border" bind:this={mapElement}>
		<View center={[2, 48]} zoom={5}>
			<Map class="h-full w-full">
				<Layer.Tile
					source="xyz"
					url={themeMapSource.current.url}
					attributions={themeMapSource.current.attributions}
					bind:layer={tileLayer}
				/>

				<Layer.Vector>
					{#each features as feature}
						<Feature.Point
							coordinates={feature.coords}
							style={getFeatureStyle(theme)}
							hoverStyle={getHoverStyle(theme)}
							selectedStyle={getSelectedStyle(theme)}
							properties={feature}
						>
							<Overlay.Hover offset={[10, 0]} positioning="center-left">
								<div
									class="rounded px-2 py-1 text-sm shadow"
									style="background: var(--ol-tooltip-bg); color: var(--ol-tooltip-select-accent-color);"
								>
									<strong>{feature.name}</strong>
								</div>
							</Overlay.Hover>

							<Overlay.Popup positioning="top-center" offset={[0, -10]} autoPan>
								<div
									class="rounded-lg p-3 shadow-lg"
									style="background: var(--ol-tooltip-bg); color: var(--ol-tooltip-color);"
								>
									<strong style="color: var(--ol-tooltip-select-accent-color);"
										>{feature.name}</strong
									>
									<div>Population: {feature.population}</div>
								</div>
							</Overlay.Popup>
						</Feature.Point>
					{/each}
				</Layer.Vector>
			</Map>
		</View>
	</div>

	<!-- Live CSS Variables Display -->
	<CodeBlock language="css" bind:code={activeCssVariablesCode} />
</div>
