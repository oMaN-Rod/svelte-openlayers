<script lang="ts">
	import { Map, Layer, Feature } from 'svelte-openlayers';
	import { createIconStyle } from 'svelte-openlayers/utils';
	import { Icon, Style } from 'ol/style';
	import { mapSources } from './sources';

	// Load SVG icons using Vite's glob import
	const icons = import.meta.glob('/src/lib/components/icons/*.svg', {
		query: '?raw',
		import: 'default',
		eager: true
	});

	// Extract icon URLs
	const mapPinIcon = icons['/src/lib/components/icons/map-pin.svg'] as string;
	const houseIcon = icons['/src/lib/components/icons/house.svg'] as string;
	const schoolIcon = icons['/src/lib/components/icons/school.svg'] as string;
	const hospitalIcon = icons['/src/lib/components/icons/hospital.svg'] as string;
	const buildingIcon = icons['/src/lib/components/icons/building.svg'] as string;

	// Location data with different categories
	const locations = [
		{
			coords: [-0.1276, 51.5074],
			name: 'London Hospital',
			type: 'hospital',
			icon: hospitalIcon,
			color: '#ef4444' // red
		},
		{
			coords: [2.3522, 48.8566],
			name: 'Sorbonne University',
			type: 'school',
			icon: schoolIcon,
			color: '#3b82f6' // blue
		},
		{
			coords: [-74.006, 40.7128],
			name: 'Empire State Building',
			type: 'building',
			icon: buildingIcon,
			color: '#8b5cf6' // purple
		},
		{
			coords: [13.405, 52.52],
			name: 'Residential Area',
			type: 'house',
			icon: houseIcon,
			color: '#10b981' // green
		},
		{
			coords: [139.6503, 35.6762],
			name: 'Tokyo Tower',
			type: 'landmark',
			icon: mapPinIcon,
			color: '#f97316' // orange
		}
	];

	// Function to modify SVG for proper color support
	async function createColorableSvgDataUrl(icon: string, color: string): Promise<string> {
		try {
			const modifiedSvg = icon.replace(/currentColor/g, color);
			const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvg)}`;
			return iconUrl;
		} catch (error) {
			console.warn('Failed to load SVG, using original URL:', error);
			return icon;
		}
	}

	// Size control
	let iconScale = $state(1);

	// Color mode
	let useCustomColors = $state(true);

	// Store processed styles to avoid recreating on every render
	let processedStyles = $state<Record<string, Style>>({});

	// Function to get or create style
	async function getIconStyle(icon: string, color: string, scale: number, useCustomColor: boolean) {
		const key = `${icon}-${color}-${scale}-${useCustomColor}`;

		if (processedStyles[key]) {
			return processedStyles[key];
		}

		let iconSrc = await createColorableSvgDataUrl(icon, useCustomColor ? '#fff' : 'currentColor');
		const style = createIconStyle({
			src: iconSrc,
			scale,
			color: useCustomColor ? color : undefined,
			anchor: [0.5, 1],
			anchorXUnits: 'fraction',
			anchorYUnits: 'fraction'
		});
		processedStyles[key] = style;
		return style;
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
	<div class="h-[500px] overflow-hidden rounded-lg border">
		<Map.Root class="h-full w-full">
			<Map.View center={[20, 30]} zoom={3} />
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector>
				{#each locations as location}
					{#await getIconStyle(location.icon, useCustomColors ? location.color : '#4338ca', iconScale, useCustomColors)}
						<!-- Loading placeholder -->
						<Feature.Point coordinates={location.coords} properties={location} />
					{:then style}
						<Feature.Point coordinates={location.coords} properties={location} {style} />
					{/await}
				{/each}
			</Layer.Vector>
		</Map.Root>
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
						{@html location.icon}
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
