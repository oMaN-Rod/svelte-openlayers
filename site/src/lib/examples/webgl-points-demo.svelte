<script lang="ts">
	import mapPin from '$lib/components/icons/map-pin.png';
	import * as Select from '$lib/components/ui/select/index.js';
	import ToolTipHover from '$lib/examples/tooltip-hover.svelte';
	import TooltipSelect from '$lib/examples/tooltip-select.svelte';
	import GeoJSON from 'ol/format/GeoJSON.js';
	import type { FlatStyleLike } from 'ol/style/flat.js';
	import { onMount } from 'svelte';
	import { Layer, LayerWebGL, Map, Overlay } from 'svelte-openlayers';
	import { mapSources } from './sources';

	let center = $state([0, 0]);
	let zoom = $state(2);
	let selectedStyle = $state<keyof typeof layers>('circles');
	let selectedTheme = $state<keyof typeof themes>('default');
	let styleJson = $state('');
	let styleError = $state<string | null>(null);
	let selectedFeature = $state<any>(null);
	let webglLayer: any = $state(null);

	const layers = {
		icons: 'Icons',
		triangles: 'Triangles (color by population)',
		'triangles-latitude': 'Triangles (color by latitude)',
		circles: 'Circles (size by population)',
		'circles-zoom': 'Circles (size by zoom)',
		'rotating-bars': 'Rotating bars'
	};

	const themes = {
		default: 'Default',
		ocean: 'Ocean Blue',
		sunset: 'Sunset Orange',
		forest: 'Forest Green',
		monochrome: 'Monochrome'
	};

	// Color schemes for different themes
	const colorSchemes = {
		default: {
			primary: '#4338ca',
			secondary: '#ff3f3f',
			accent: '#10b981',
			gradient: ['#5aca5b', '#ff6a19'],
			latitude: ['#ff14c3', '#ff621d', '#ffed02', '#00ff67'],
			rotating: ['#ffdc00', '#ff5b19']
		},
		ocean: {
			primary: '#0ea5e9',
			secondary: '#06b6d4',
			accent: '#3b82f6',
			gradient: ['#0ea5e9', '#1e40af'],
			latitude: ['#0891b2', '#0ea5e9', '#3b82f6', '#1d4ed8'],
			rotating: ['#06b6d4', '#0284c7']
		},
		sunset: {
			primary: '#f97316',
			secondary: '#ef4444',
			accent: '#eab308',
			gradient: ['#f59e0b', '#dc2626'],
			latitude: ['#f59e0b', '#f97316', '#ef4444', '#dc2626'],
			rotating: ['#fbbf24', '#f97316']
		},
		forest: {
			primary: '#059669',
			secondary: '#10b981',
			accent: '#84cc16',
			gradient: ['#10b981', '#047857'],
			latitude: ['#84cc16', '#65a30d', '#059669', '#047857'],
			rotating: ['#22c55e', '#16a34a']
		},
		monochrome: {
			primary: '#6b7280',
			secondary: '#374151',
			accent: '#9ca3af',
			gradient: ['#9ca3af', '#374151'],
			latitude: ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280'],
			rotating: ['#d1d5db', '#9ca3af']
		}
	};

	// Generate styles based on current theme
	function generateStyles(theme: keyof typeof colorSchemes): Record<string, FlatStyleLike> {
		const colors = colorSchemes[theme];

		return {
			icons: {
				'icon-src': mapPin,
				'icon-width': 14,
				'icon-height': 14,
				'icon-color': colors.primary,
				'icon-rotate-with-view': false,
				'icon-displacement': [0, 9]
			},
			triangles: {
				'shape-points': 3,
				'shape-radius': 9,
				'shape-fill-color': [
					'interpolate',
					['linear'],
					['get', 'population'],
					20000,
					colors.gradient[0],
					300000,
					colors.gradient[1]
				],
				'shape-rotate-with-view': true
			},
			'triangles-latitude': {
				'shape-points': 3,
				'shape-radius': ['interpolate', ['linear'], ['get', 'population'], 40000, 6, 2000000, 12],
				'shape-fill-color': [
					'interpolate',
					['linear'],
					['get', 'latitude'],
					-60,
					colors.latitude[0],
					-20,
					colors.latitude[1],
					20,
					colors.latitude[2],
					60,
					colors.latitude[3]
				],
				'shape-opacity': 0.95
			},
			circles: {
				'circle-radius': ['interpolate', ['linear'], ['get', 'population'], 40000, 4, 2000000, 14],
				'circle-fill-color': ['match', ['get', 'hover'], 1, colors.secondary, colors.primary],
				'circle-rotate-with-view': false,
				'circle-displacement': [0, 0],
				'circle-opacity': [
					'interpolate',
					['linear'],
					['get', 'population'],
					40000,
					0.6,
					2000000,
					0.92
				]
			},
			'circles-zoom': {
				'circle-radius': [
					'interpolate',
					['exponential', 2],
					['zoom'],
					5,
					1.5,
					15,
					1.5 * Math.pow(2, 10)
				],
				'circle-fill-color': ['match', ['get', 'hover'], 1, colors.secondary, colors.primary],
				'circle-displacement': [0, 0],
				'circle-opacity': 0.95
			},
			'rotating-bars': {
				'shape-rotation': ['*', ['time'], 0.13],
				'shape-points': 4,
				'shape-radius': 4,
				'shape-radius2': 4 * Math.sqrt(2),
				'shape-scale': [
					'array',
					1,
					['interpolate', ['linear'], ['get', 'population'], 20000, 1, 300000, 7]
				],
				'shape-fill-color': [
					'interpolate',
					['linear'],
					['get', 'population'],
					20000,
					colors.rotating[0],
					300000,
					colors.rotating[1]
				],
				'shape-displacement': [
					'array',
					0,
					['interpolate', ['linear'], ['get', 'population'], 20000, 2, 300000, 14]
				]
			}
		};
	}

	const predefinedStyles = $derived(generateStyles(selectedTheme));
	let currentStyle = $state(predefinedStyles[selectedStyle]);

	onMount(() => {
		updateStyleEditor();
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

	function updateStyleEditor() {
		styleJson = JSON.stringify(currentStyle, null, 2);
	}

	function handleStyleChange() {
		currentStyle = predefinedStyles[selectedStyle];
		updateStyleEditor();
		styleError = null;
	}

	function handleThemeChange() {
		currentStyle = predefinedStyles[selectedStyle];
		updateStyleEditor();
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

	async function getGeoJSONFeatures() {
		const response = await fetch(
			'https://raw.githubusercontent.com/openlayers/openlayers/main/examples/data/geojson/world-cities.geojson'
		);
		const data = await response.json();
		const format = new GeoJSON();
		return format.readFeatures(data, {
			dataProjection: 'EPSG:4326',
			featureProjection: 'EPSG:3857'
		});
	}
</script>

<div class="flex flex-col gap-4 overflow-y-auto p-4 sm:flex-row">
	<div class="flex flex-col gap-2">
		<span class="text-foreground/70 text-xs font-medium">Style Type:</span>
		<Select.Root
			type="single"
			onValueChange={(value) => {
				selectedStyle = value as keyof typeof layers;
				handleStyleChange();
			}}
			value={selectedStyle}
		>
			<Select.Trigger class="w-64">{layers[selectedStyle]}</Select.Trigger>
			<Select.Content>
				{#each Object.entries(layers) as [key, label]}
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
				selectedTheme = value as keyof typeof themes;
				handleThemeChange();
			}}
			value={selectedTheme}
		>
			<Select.Trigger class="w-48">{themes[selectedTheme]}</Select.Trigger>
			<Select.Content>
				{#each Object.entries(themes) as [key, label]}
					<Select.Item value={key}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
</div>

<div class="relative h-[500px] w-full overflow-hidden rounded-lg border">
	<Map.Root class="h-full w-full" onPointermove={handlePointerMove}>
		<Map.View bind:center bind:zoom />
		<Layer.Tile
			source="xyz"
			url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
			attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
		/>
		<Layer.WebGL bind:layer={webglLayer} style={currentStyle}>
			{#await getGeoJSONFeatures()}
				<span>...Loading</span>
			{:then features}
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
				<ToolTipHover name={props.city} type={props.type} />
			{/snippet}
			{#snippet selectSnippet(feature)}
				{@const props = feature.getProperties()}
				<TooltipSelect
					city={props.city}
					lat={props.latitude?.toFixed(2)}
					lng={props.longitude?.toFixed(2)}
					population={props.population?.toLocaleString()}
				/>
			{/snippet}
		</Overlay.TooltipManager>
	</Map.Root>
</div>
