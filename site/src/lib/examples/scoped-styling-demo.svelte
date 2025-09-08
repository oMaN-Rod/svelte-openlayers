<script lang="ts">
	import { Map, Layer, Feature } from 'svelte-openlayers';
	import { createCircleStyle, getCSSVariable } from 'svelte-openlayers/utils';
	import { onMount } from 'svelte';
	import type { Style } from 'ol/style';

	let oceanContainer: HTMLDivElement;
	let sunsetContainer: HTMLDivElement;
	let forestContainer: HTMLDivElement;

	let oceanPointStyle: Style | null = $state(null);
	let sunsetPointStyle: Style | null = $state(null);
	let forestPointStyle: Style | null = $state(null);

	// Function to create theme-specific point styles using CSS variables
	function createThemePointStyle(container: Element, radius: number = 10) {
		const primaryColor = getCSSVariable('--ol-color-primary', container, '#4338ca');

		return createCircleStyle({
			radius,
			fill: primaryColor,
			stroke: '#ffffff',
			strokeWidth: 2
		});
	}

	onMount(() => {
		// Create styles based on CSS variables from each themed container
		oceanPointStyle = createThemePointStyle(oceanContainer, 12);
		sunsetPointStyle = createThemePointStyle(sunsetContainer, 8);
		forestPointStyle = createThemePointStyle(forestContainer, 14);
	});
</script>

<div class="ocean-theme" bind:this={oceanContainer}>
	<h3>Ocean Theme Map</h3>
	<p class="theme-description">
		Point styles dynamically created from CSS variables (large cyan circles)
	</p>
	<div class="map-container">
		<Map.Root zoomControl={true} mousePositionControl={true}>
			<Map.View center={[0, 0]} zoom={2} />
			<Layer.Tile
				source="xyz"
				url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
				attributions="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
			/>
			<Layer.Vector>
				{#if oceanPointStyle}
					<Feature.Point coordinates={[0, 0]} style={oceanPointStyle} />
					<Feature.Point coordinates={[20, 20]} style={oceanPointStyle} />
				{/if}
			</Layer.Vector>
		</Map.Root>
	</div>
</div>

<div class="sunset-theme" bind:this={sunsetContainer}>
	<h3>Sunset Theme Map</h3>
	<p class="theme-description">
		Point styles dynamically created from CSS variables (small orange circles)
	</p>
	<div class="map-container">
		<Map.Root zoomControl={true} mousePositionControl={true}>
			<Map.View center={[-100, 40]} zoom={3} />
			<Layer.Tile
				source="xyz"
				url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
				attributions="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
			/>
			<Layer.Vector>
				{#if sunsetPointStyle}
					<Feature.Point coordinates={[-100, 40]} style={sunsetPointStyle} />
					<Feature.Point coordinates={[-80, 35]} style={sunsetPointStyle} />
				{/if}
			</Layer.Vector>
		</Map.Root>
	</div>
</div>

<div class="forest-theme" bind:this={forestContainer}>
	<h3>Forest Theme Map</h3>
	<p class="theme-description">
		Point styles dynamically created from CSS variables (extra-large green circles)
	</p>
	<div class="map-container">
		<Map.Root zoomControl={true} attributionControl={true}>
			<Map.View center={[10, 50]} zoom={4} />
			<Layer.Tile
				source="xyz"
				url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
				attributions="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
			/>
			<Layer.Vector>
				{#if forestPointStyle}
					<Feature.Point coordinates={[10, 50]} style={forestPointStyle} />
					<Feature.Point coordinates={[15, 55]} style={forestPointStyle} />
				{/if}
			</Layer.Vector>
		</Map.Root>
	</div>
</div>

<style>
	h3 {
		margin: 1.5rem 0 0.5rem 0;
		font-weight: 600;
	}

	.theme-description {
		margin-bottom: 1rem;
		font-style: italic;
		color: var(--ol-color-muted-foreground, #6b7280);
	}

	.map-container {
		height: 400px;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 2rem;
		border: 1px solid var(--ol-color-border);
	}

	/* Ocean theme - uses OpenLayers CSS variables */
	.ocean-theme {
		--ol-color-primary: #0891b2; /* Cyan */
		--ol-zoom-button-bg: var(--ol-color-primary);
		--ol-zoom-button-color: #ffffff;
		--ol-zoom-button-radius: 0.5rem;
		--ol-mouse-position-bg: rgba(8, 145, 178, 0.9);
		--ol-mouse-position-color: #ffffff;
		--ol-attribution-bg: rgba(8, 145, 178, 0.8);
		--ol-attribution-color: #ffffff;
	}

	/* Sunset theme */
	.sunset-theme {
		--ol-color-primary: #f97316; /* Orange */
		--ol-zoom-button-bg: var(--ol-color-primary);
		--ol-zoom-button-color: #ffffff;
		--ol-zoom-button-radius: 9999px; /* Fully rounded */
		--ol-mouse-position-bg: rgba(249, 115, 22, 0.9);
		--ol-mouse-position-color: #ffffff;
		--ol-mouse-position-font-size: 0.875rem;
		--ol-attribution-bg: rgba(249, 115, 22, 0.8);
		--ol-attribution-color: #ffffff;
	}

	/* Forest theme */
	.forest-theme {
		--ol-color-primary: #059669; /* Emerald */
		--ol-zoom-button-bg: var(--ol-color-primary);
		--ol-zoom-button-color: #ffffff;
		--ol-zoom-button-width: 2rem;
		--ol-zoom-button-height: 2rem;
		--ol-zoom-button-margin: 0.25rem 0;
		--ol-attribution-bg: rgba(5, 150, 105, 0.85);
		--ol-attribution-color: #ffffff;
		--ol-attribution-font-size: 0.8125rem;
	}
</style>
