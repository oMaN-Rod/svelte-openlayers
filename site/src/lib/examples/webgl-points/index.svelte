<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import TooltipHover from '../_shared/components/tooltip-hover.svelte';
	import TooltipSelect from '../_shared/components/tooltip-select.svelte';
	import { onMount } from 'svelte';
	import { Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import type TileLayer from 'ol/layer/Tile';
	import {
		generateStyles,
		stylePresets,
		themeNames,
		type StylePreset,
		type ThemeName
	} from './styles';
	import { fetchWorldCities } from './data';

	let center = $state([0, 0]);
	let zoom = $state(2);
	let selectedStyle = $state<StylePreset>('circles');
	let selectedTheme = $state<ThemeName>('default');
	let styleError = $state<string | null>(null);
	let selectedFeature = $state<any>(null);
	let webglLayer: any = $state(null);
	let tileLayer = $state<TileLayer | null>(null);

	useThemeMapSource(() => tileLayer);

	const predefinedStyles = $derived(generateStyles(selectedTheme));
	let currentStyle = $derived(predefinedStyles[selectedStyle]);

	onMount(() => {
		// Start animation loop for rotating bars style
		if (typeof window !== 'undefined') {
			const animate = () => {
				if (webglLayer && webglLayer.getMapInternal) {
					const map = webglLayer.getMapInternal();
					if (map) {
						map.render();
					}
				}
				requestAnimationFrame(animate);
			};
			animate();
		}
	});

	function handleStyleChange() {
		styleError = null;
	}

	function handleThemeChange() {
		styleError = null;
	}

	function handlePointerMove(evt: any) {
		if (!webglLayer) return;

		const map = evt.map;
		const pixel = evt.pixel;

		// Reset previous selection
		if (selectedFeature) {
			selectedFeature.set('hover', 0);
			selectedFeature = null;
		}

		// Find feature at pixel
		map.forEachFeatureAtPixel(pixel, (feature: any) => {
			feature.set('hover', 1);
			selectedFeature = feature;
			return true;
		});
	}
</script>

<div class="flex flex-col gap-4 overflow-y-auto p-4 sm:flex-row">
	<div class="flex flex-col gap-2">
		<span class="text-foreground/70 text-xs font-medium">Style Type:</span>
		<Select.Root
			type="single"
			onValueChange={(value) => {
				selectedStyle = value as StylePreset;
				handleStyleChange();
			}}
			value={selectedStyle}
		>
			<Select.Trigger class="w-64">{stylePresets[selectedStyle]}</Select.Trigger>
			<Select.Content>
				{#each Object.entries(stylePresets) as [key, label]}
					<Select.Item value={key}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex flex-col gap-2">
		<span class="text-foreground/70 text-xs font-medium">Color Theme:</span>
		<Select.Root
			type="single"
			onValueChange={(value) => {
				selectedTheme = value as ThemeName;
				handleThemeChange();
			}}
			value={selectedTheme}
		>
			<Select.Trigger class="w-48">{themeNames[selectedTheme]}</Select.Trigger>
			<Select.Content>
				{#each Object.entries(themeNames) as [key, label]}
					<Select.Item value={key}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>

<div class="map-container">
	<View bind:center bind:zoom>
		<Map class="h-full w-full" pointermove={handlePointerMove}>
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>
			<Layer.WebGL bind:layer={webglLayer} style={currentStyle}>
				{#await fetchWorldCities() then features}
					{#each features as feature}
						{#snippet children()}
							{(() => {
								webglLayer?.getSource()?.addFeature(feature);
								return '';
							})()}
						{/snippet}
						{@render children()}
					{/each}
				{/await}
			</Layer.WebGL>
			<Overlay.TooltipManager
				hoverClass="!bg-transparent !shadow-none"
				selectClass="!bg-transparent !shadow-none"
			>
				{#snippet hoverSnippet(feature)}
					{@const props = feature.getProperties()}
					<TooltipHover name={props.city} type={props.type} />
				{/snippet}
				{#snippet selectSnippet(feature)}
					{@const props = feature.getProperties()}
					<TooltipSelect
						type={props.type}
						name={props.city}
						population={props.population?.toLocaleString()}
					/>
				{/snippet}
			</Overlay.TooltipManager>
		</Map>
	</View>
</div>
