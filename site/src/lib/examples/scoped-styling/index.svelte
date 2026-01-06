<script lang="ts">
	import type { Style } from 'ol/style';
	import type { View as OLView } from 'ol';
	import { onMount } from 'svelte';
	import { Feature, Layer, Map, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { themes, themeRadii, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { createThemePointStyle } from './styles';
	import type TileLayer from 'ol/layer/Tile';

	let containers: Record<string, HTMLDivElement> = $state({});
	let styles: Record<string, Style> = $state({});
	let view: OLView | null = $state(null);
	let center = $state(DEFAULT_CENTER);
	let zoom = $state(DEFAULT_ZOOM);

	// Pre-initialize with null values for each theme to avoid undefined binding issues
	let tileLayers = $state<Record<string, TileLayer | null>>(
		Object.fromEntries(themes.map((t) => [t.id, null]))
	);

	// Set up theme-aware tile layers for each map
	themes.forEach((theme) => {
		useThemeMapSource(() => tileLayers[theme.id]);
	});

	onMount(() => {
		// Create styles based on CSS variables from each themed container
		themes.forEach((theme) => {
			if (containers[theme.id]) {
				styles[theme.id] = createThemePointStyle(containers[theme.id], themeRadii[theme.id]);
			}
		});
	});
</script>

<View bind:center bind:zoom bind:view />

{#each themes as theme}
	<div
		class="themed-container"
		style={Object.entries(theme.cssVariables)
			.map(([k, v]) => `${k}: ${v}`)
			.join('; ')}
		bind:this={containers[theme.id]}
	>
		<h3 class="mt-6 mb-2 text-lg font-semibold">{theme.name}</h3>
		<p class="text-muted-foreground mb-4 text-sm italic">{theme.description}</p>

		<div class="map-container">
			<Map {view}>
				<Layer.Tile
					source="xyz"
					url={themeMapSource.current.url}
					attributions={themeMapSource.current.attributions}
					bind:layer={tileLayers[theme.id]}
				/>
				<Layer.Vector>
					{#if styles[theme.id]}
						{#each theme.points as point}
							<Feature.Point coordinates={point.coordinates} style={styles[theme.id]} />
						{/each}
					{/if}
				</Layer.Vector>
			</Map>
		</div>
	</div>
{/each}
