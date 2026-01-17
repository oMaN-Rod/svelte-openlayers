<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import type TileLayer from 'ol/layer/Tile';
	import type WebGLVectorLayer from 'ol/layer/WebGLVector';
	import { onMount } from 'svelte';
	import { Layer, Map, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import {
		fetchMeteoriteLandings,
		getCurrentYear,
		MAX_YEAR,
		MIN_YEAR,
		validateMaxYear,
		validateMinYear
	} from './data';
	import { createFilteredStyle } from './styles';

	let center = $state([0, 0]);
	let zoom = $state(2);
	let tileLayer = $state<TileLayer | null>(null);
	let webglLayer = $state<WebGLVectorLayer | null>(null);

	let animationPeriod = $state(12);
	let minYear = $state(MIN_YEAR);
	let maxYear = $state(MAX_YEAR);
	let minYearError = $state<string | null>(null);
	let maxYearError = $state<string | null>(null);

	let totalFeatures = $state(0);
	let isLoading = $state(true);

	let animatedYear = $state(MIN_YEAR);
	let animationStartTime = $state(0);

	useThemeMapSource(() => tileLayer);

	// Create the filtered style configuration
	const filteredStyle = $derived(createFilteredStyle(animationPeriod));

	// Style variables for the WebGL layer
	const styleVariables = $derived({
		minYear: minYear,
		maxYear: maxYear
	});

	// Handle input changes with validation
	function handleMinYearChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || MIN_YEAR;
		const error = validateMinYear(value, maxYear);
		minYearError = error;
		if (!error) {
			minYear = value;
		}
	}

	function handleMaxYearChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || MAX_YEAR;
		const error = validateMaxYear(value, minYear);
		maxYearError = error;
		if (!error) {
			maxYear = value;
		}
	}

	async function loadFeatures() {
		if (!webglLayer) return;

		const features = await fetchMeteoriteLandings();
		const source = webglLayer.getSource();
		if (source) {
			source.addFeatures(features);
			totalFeatures = features.length;
		}
		isLoading = false;
	}

	onMount(() => {
		// Start animation loop for pulse effect
		let animationId: number;
		animationStartTime = performance.now();

		const animate = (timestamp: number) => {
			if (webglLayer) {
				const map = (webglLayer as any).getMapInternal?.();
				if (map) {
					map.render();
				}
			}
			animatedYear = getCurrentYear(timestamp, animationStartTime, animationPeriod);
			animationId = requestAnimationFrame(animate);
		};
		animationId = requestAnimationFrame(animate);

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	});

	// Update WebGL style when animation period changes
	$effect(() => {
		if (webglLayer) {
			webglLayer.setStyle(createFilteredStyle(animationPeriod));
		}
	});

	// Update WebGL layer style variables when sliders change
	$effect(() => {
		if (webglLayer) {
			webglLayer.updateStyleVariables(styleVariables);
		}
	});

	// Load features when layer is ready
	$effect(() => {
		if (webglLayer && isLoading) {
			loadFeatures();
		}
	});
</script>

<div class="mb-2 flex flex-col gap-4">
	<div class="bg-card rounded-lg border p-4">
		<!-- Animated year indicator -->
		<div class="bg-muted/50 mb-4 rounded-md p-3">
			<div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
				<span class="text-foreground/70">Showing meteorite impacts between</span>
				<span class="font-bold">{minYear}</span>
				<span class="text-foreground/70">and</span>
				<span class="font-bold">{maxYear}</span>
				{#if totalFeatures > 0}
					<span class="text-foreground/50">({totalFeatures.toLocaleString()} total sites)</span>
				{/if}
			</div>
			<div class="flex items-center gap-3">
				<div class="relative h-3 w-3">
					<span
						class="bg-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
					></span>
					<span class="bg-foreground relative inline-flex h-3 w-3 rounded-full"></span>
				</div>
				<span class="text-foreground/70 text-sm">Currently pulsing:</span>
				<span class="font-mono text-lg font-bold">{animatedYear}</span>
				{#if animatedYear < minYear || animatedYear > maxYear}
					<span class="text-foreground/50 text-xs">(filtered out)</span>
				{/if}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div class="flex flex-col gap-2">
				<label for="animation-period" class="text-foreground/70 text-xs font-medium">
					Animation Period {animationPeriod}s
				</label>
				<Input
					id="animation-period"
					type="range"
					min={5}
					max={300}
					bind:value={animationPeriod}
					aria-invalid={minYearError ? 'true' : undefined}
					class="font-mono"
				/>
				{#if minYearError}
					<span class="text-destructive text-xs">{minYearError}</span>
				{/if}
			</div>
			<div class="flex flex-col gap-2">
				<label for="min-year" class="text-foreground/70 text-xs font-medium"> Minimum Year </label>
				<Input
					id="min-year"
					type="number"
					min={MIN_YEAR}
					max={MAX_YEAR}
					bind:value={minYear}
					oninput={handleMinYearChange}
					aria-invalid={minYearError ? 'true' : undefined}
					class="font-mono"
				/>
				{#if minYearError}
					<span class="text-destructive text-xs">{minYearError}</span>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<label for="max-year" class="text-foreground/70 text-xs font-medium"> Maximum Year </label>
				<Input
					id="max-year"
					type="number"
					min={MIN_YEAR}
					max={MAX_YEAR}
					bind:value={maxYear}
					oninput={handleMaxYearChange}
					aria-invalid={maxYearError ? 'true' : undefined}
					class="font-mono"
				/>
				{#if maxYearError}
					<span class="text-destructive text-xs">{maxYearError}</span>
				{/if}
			</div>
		</div>

		<!-- Quick range presets -->
		<div class="mt-4 flex flex-wrap gap-2">
			<button
				type="button"
				class="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs transition-colors"
				onclick={() => {
					minYear = 1850;
					maxYear = 1900;
					minYearError = null;
					maxYearError = null;
				}}
			>
				1850–1900
			</button>
			<button
				type="button"
				class="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs transition-colors"
				onclick={() => {
					minYear = 1900;
					maxYear = 1950;
					minYearError = null;
					maxYearError = null;
				}}
			>
				1900–1950
			</button>
			<button
				type="button"
				class="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs transition-colors"
				onclick={() => {
					minYear = 1950;
					maxYear = 2000;
					minYearError = null;
					maxYearError = null;
				}}
			>
				1950–2000
			</button>
			<button
				type="button"
				class="bg-muted hover:bg-muted/80 rounded-md px-3 py-1 text-xs transition-colors"
				onclick={() => {
					minYear = 2000;
					maxYear = 2015;
					minYearError = null;
					maxYearError = null;
				}}
			>
				2000–2015
			</button>
			<button
				type="button"
				class="bg-primary/10 text-primary hover:bg-primary/20 rounded-md px-3 py-1 text-xs transition-colors"
				onclick={() => {
					minYear = MIN_YEAR;
					maxYear = MAX_YEAR;
					minYearError = null;
					maxYearError = null;
				}}
			>
				All years
			</button>
		</div>
	</div>
</div>

<div class="map-container">
	<View bind:center bind:zoom>
		<Map class="h-full w-full" controls={{ fullscreen: true }}>
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>
			<Layer.WebGL
				bind:layer={webglLayer}
				style={filteredStyle}
				variables={styleVariables}
				disableHitDetection={true}
			/>
		</Map>
	</View>
</div>
