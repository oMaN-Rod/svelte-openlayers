<script lang="ts">
	import type { Style } from 'ol/style';
	import type { View as OLView } from 'ol';
	import { onMount } from 'svelte';
	import { Feature, Layer, Map, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { themes, themeRadii, DEFAULT_CENTER, DEFAULT_ZOOM } from './data';
	import { createThemePointStyle } from './styles';

	let containers: Record<string, HTMLDivElement> = $state({});
	let styles: Record<string, Style> = $state({});
	let view: OLView | null = $state(null);
	let center = $state(DEFAULT_CENTER);
	let zoom = $state(DEFAULT_ZOOM);

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
		<h3 class="mb-2 mt-6 text-lg font-semibold">{theme.name}</h3>
		<p class="text-muted-foreground mb-4 text-sm italic">{theme.description}</p>

		<div class="h-100 overflow-hidden rounded-lg border">
			<Map {view}>
				<Layer.Tile
					source="xyz"
					url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
					attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
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
