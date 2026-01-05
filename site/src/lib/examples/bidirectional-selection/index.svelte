<script lang="ts">
	import { Map, Layer, Feature, Overlay, View } from 'svelte-openlayers';
	import { createCircleStyle, ReactiveCollection } from 'svelte-openlayers/utils';
	import Input from '$lib/components/ui/input/input.svelte';
	import TooltipHover from '../_shared/components/tooltip-hover.svelte';
	import TooltipSelect from '../_shared/components/tooltip-select.svelte';
	import { mapSources } from '../_shared/data/map-sources';
	import { nycLocations, DEFAULT_CENTER, type Location } from './data';

	let center: number[] = $state(DEFAULT_CENTER);
	let zoom = $state(11);
	let search = $state('');
	// Create a mutable copy of the locations for binding features
	let locations = $state<Location[]>(nycLocations.map((loc) => ({ ...loc })));
	let filteredLocations = $state<Location[]>([]);

	let selectedFeatures: ReactiveCollection | null = $state(null);
	let hoveredId = $state<string | null>(null);

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: { color: '#4338ca' },
		stroke: { color: '#ffffff', width: 2 }
	});

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: { color: '#ef4444' },
		stroke: { color: '#991b1b', width: 3 }
	});

	const hoverStyle = createCircleStyle({
		radius: 8,
		fill: { color: '#10b981' },
		stroke: { color: '#ffffff', width: 2 }
	});

	function selectFromTable(locationId: string) {
		if (!selectedFeatures) return;

		const location = filteredLocations.find((l) => l.id === locationId);
		if (!location || !location.feature) return;

		if (selectedFeatures.hasId(locationId)) {
			selectedFeatures.remove(location.feature);
		} else {
			selectedFeatures.push(location.feature);
		}
	}

	function clearSelection() {
		if (!selectedFeatures) return;

		selectedFeatures.clear();
		center = DEFAULT_CENTER;
	}

	function isSelected(locationId: string): boolean {
		if (!selectedFeatures) return false;
		return selectedFeatures.hasId(locationId);
	}

	function getFeatureStyle(location: Location) {
		const selected = isSelected(location.id);
		const hovered = hoveredId === location.id && !selected;
		return selected ? selectedStyle : hovered ? hoverStyle : pointStyle;
	}

	$effect(() => {
		if (search.trim() === '') {
			filteredLocations = locations;
		} else {
			const lowerSearch = search.toLowerCase();
			filteredLocations = locations.filter((loc) => loc.name.toLowerCase().includes(lowerSearch));
		}
	});
</script>

<div class="flex flex-col gap-4 lg:flex-row">
	<!-- Table -->
	<div class="w-full lg:w-1/3">
		<div class="rounded-lg border">
			<div class="flex items-center justify-between border-b p-3">
				<h3 class="font-semibold">NYC Landmarks</h3>
				<Input type="text" placeholder="Search..." class="w-1/2" bind:value={search} />
			</div>
			<div class="max-h-64 overflow-y-auto lg:max-h-96">
				<table class="w-full text-sm">
					<thead class="sticky top-0">
						<tr>
							<th class="px-3 py-2 text-left">Name</th>
							<th class="px-3 py-2 text-right">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredLocations as location}
							{@const selected = isSelected(location.id)}
							<tr
								class="border-b"
								class:bg-muted={selected}
								onmouseenter={() => (hoveredId = location.id)}
								onmouseleave={() => (hoveredId = null)}
							>
								<td class="px-3 py-2">
									<div class="font-medium">{location.name}</div>
									<div class="text-xs text-gray-500">{location.visitors}</div>
								</td>
								<td class="px-3 py-2 text-right">
									<button
										onclick={() => selectFromTable(location.id)}
										class="rounded px-2 py-1 text-xs font-medium text-white transition-colors"
										class:bg-red-600={selected}
										class:hover:bg-red-700={selected}
										class:bg-blue-600={!selected}
										class:hover:bg-blue-700={!selected}
									>
										{selected ? 'Selected' : 'Select'}
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="border-t p-3">
				<button
					onclick={clearSelection}
					class="w-full rounded px-3 py-1.5 text-sm text-white hover:bg-blue-600"
				>
					Clear Selection
				</button>
			</div>
		</div>
	</div>

	<!-- Map -->
	<div class="flex-1">
		<div class="h-96 w-full overflow-hidden rounded-lg border">
			<View bind:center bind:zoom>
				<Map class="h-full w-full">
					<Layer.Tile
						source="xyz"
						url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
						attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
					/>

					<Layer.Vector style={pointStyle}>
						{#each filteredLocations as location}
							<Feature.Point
								coordinates={location.coords}
								style={getFeatureStyle(location)}
								properties={{
									id: location.id,
									name: location.name,
									visitors: location.visitors
								}}
								bind:feature={location.feature}
							/>
						{/each}
					</Layer.Vector>

					<Overlay.TooltipManager
						bind:selectedFeatures
						selectStyle={selectedStyle}
						hoverClass="!bg-transparent !shadow-none"
						selectClass="!bg-transparent !shadow-none"
						multi={false}
					>
						{#snippet hoverSnippet(feature)}
							{@const props = feature.getProperties()}
							<TooltipHover name={props.name} type={props.type} />
						{/snippet}
						{#snippet selectSnippet(feature)}
							{@const props = feature.getProperties()}
							<TooltipSelect {...props} />
						{/snippet}
					</Overlay.TooltipManager>
				</Map>
			</View>
		</div>
		<div class="text-muted-foreground mt-4 text-sm">
			{#if selectedFeatures && selectedFeatures.getLength() > 0}
				{@const selected = selectedFeatures.getArray()[0]}
				Selected: {selected.get('name')} ({selected.get('visitors')})
			{:else}
				Click on map markers or table rows to select
			{/if}
		</div>
	</div>
</div>
