<script lang="ts">
	import { CodeBlock } from '$lib/components/docs';
	import { onMount } from 'svelte';
	import { Map, Layer, Feature, Overlay } from 'svelte-openlayers';
	import { createCircleStyle } from 'svelte-openlayers/utils';
	import { mapSources } from './sources';

	let theme: keyof typeof themes = $state('default');
	let activeCssVariablesCode = $state('');

	const themes = {
		default: {
			primary: '#4338ca',
			tooltipBg: 'rgba(255, 255, 255, 0.9)',
			color: '#181818',
			zoomBg: '#4338ca'
		},
		defaultDark: {
			primary: '#8b5cf6',
			tooltipBg: 'rgba(24, 24, 24, 0.9)',
			color: '#f3f4f6',
			zoomBg: '#8b5cf6'
		},
		ocean: {
			primary: '#0891b2',
			tooltipBg: 'rgba(255, 255, 255, 0.9)',
			color: '#181818',
			zoomBg: '#0891b2'
		},
		oceanDark: {
			primary: '#06b6d4',
			tooltipBg: 'rgba(31, 41, 55, 0.9)',
			color: '#f3f4f6',
			zoomBg: '#06b6d4'
		},
		forest: {
			primary: '#059669',
			tooltipBg: 'rgba(255, 255, 255, 0.9)',
			color: '#181818',
			zoomBg: '#059669'
		},
		forestDark: {
			primary: '#10b981',
			tooltipBg: 'rgba(31, 41, 55, 0.9)',
			color: '#f3f4f6',
			zoomBg: '#10b981'
		},
		sunset: {
			primary: '#f97316',
			tooltipBg: 'rgba(255, 255, 255, 0.9)',
			color: '#181818',
			zoomBg: '#f97316'
		},
		sunsetDark: {
			primary: '#fb923c',
			tooltipBg: 'rgba(31, 41, 55, 0.9)',
			color: '#f3f4f6',
			zoomBg: '#fb923c'
		}
	};

	$effect(() => {
		const root = document.documentElement;
		const selectedTheme = themes[theme];

		// Apply theme colors
		root.style.setProperty('--ol-color-primary', selectedTheme.primary);
		root.style.setProperty('--ol-tooltip-color', selectedTheme.color);
		root.style.setProperty('--ol-tooltip-bg', selectedTheme.tooltipBg);
		root.style.setProperty('--ol-zoom-button-bg', selectedTheme.zoomBg);
		root.style.setProperty('--ol-tooltip-select-accent-color', selectedTheme.primary);
	});

	// Sample features to demonstrate styling
	const features = [
		{ coords: [-0.12755, 51.507222], name: 'London', population: '9M' },
		{ coords: [2.3522, 48.8566], name: 'Paris', population: '2.2M' },
		{ coords: [13.405, 52.52], name: 'Berlin', population: '3.6M' }
	];

	function getFeatureStyle(theme: string) {
		return createCircleStyle({
			radius: 8,
			fill: themes[theme as keyof typeof themes].primary,
			stroke: '#ffffff',
			strokeWidth: 2
		});
	}

	const handleUpdateCssVariablesCode = () => {
		activeCssVariablesCode = `--ol-color-primary: ${themes[theme].primary};
--ol-tooltip-color: ${themes[theme].color};
--ol-tooltip-bg: ${themes[theme].tooltipBg};
--ol-zoom-button-bg: ${themes[theme].zoomBg};
--ol-tooltip-select-accent-color: ${themes[theme].primary};`;
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

	<div class="h-[400px] overflow-hidden rounded-lg border">
		<Map.Root class="h-full w-full" mousePositionControl={false}>
			<Map.View center={[2, 48]} zoom={5} />
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector style={getFeatureStyle(theme)}>
				{#each features as feature}
					<Feature.Point coordinates={feature.coords} properties={feature} />
				{/each}
			</Layer.Vector>

			<Overlay.TooltipManager
				hoverTooltip={true}
				selectTooltip={true}
				hoverContent={(f) => {
					const props = f.getProperties();
					return `<strong style="color: var(--ol-tooltip-select-accent-color)">${props.name}</strong>`;
				}}
				selectContent={(f) => {
					const props = f.getProperties();
					return `
							<div>
								<strong style="color: var(--ol-tooltip-select-accent-color)">${props.name}</strong>
								<div>Population: ${props.population}</div>
							</div>
						`;
				}}
			/>
		</Map.Root>
	</div>

	<!-- Live CSS Variables Display -->
	<CodeBlock language="css" bind:code={activeCssVariablesCode} />
</div>
