<script lang="ts">
	import { Map, Layer, Feature, Interaction, Overlay } from 'svelte-openlayers';
	import { createCircleStyle, createReactiveCollection } from 'svelte-openlayers/utils';
	import type { Feature as OlFeature } from 'ol';
	import { Collection } from 'ol';
	import Input from '$lib/components/ui/input/input.svelte';
	import ToolTipHover from '$lib/examples/tooltip-hover.svelte';
	import TooltipSelect from '$lib/examples/tooltip-select.svelte';

	const DEFAULT_CENTER: [number, number] = [-73.98513, 40.758896]; // Times Square, NYC
	let center: number[] = $state(DEFAULT_CENTER);
	let zoom = $state(13);
	let search = $state('');
	let filteredLocations = $state<(typeof locations)[0][]>([]);

	let selectInteraction = $state<any>(null);
	let selectedFeatures = $state<Collection<OlFeature>>(new Collection());
	let hoveredId = $state<string | null>(null);

	// Create reactive wrapper
	const reactiveSelection = $derived(createReactiveCollection(selectedFeatures));

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: '#4338ca',
		stroke: '#ffffff',
		strokeWidth: 2
	});

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: '#ef4444',
		stroke: '#991b1b',
		strokeWidth: 3
	});

	const hoverStyle = createCircleStyle({
		radius: 8,
		fill: '#10b981',
		stroke: '#ffffff',
		strokeWidth: 2
	});

	const locations = [
		{
			id: 'cp',
			name: 'Central Park',
			coords: [-73.965355, 40.782865],
			visitors: '42M/year',
			feature: null as OlFeature | null
		},
		{
			id: 'ts',
			name: 'Times Square',
			coords: [-73.98513, 40.758896],
			visitors: '50M/year',
			feature: null as OlFeature | null
		},
		{
			id: 'bb',
			name: 'Brooklyn Bridge',
			coords: [-73.996864, 40.711174],
			visitors: '13M/year',
			feature: null as OlFeature | null
		},
		{
			id: 'sl',
			name: 'Statue of Liberty',
			coords: [-74.044502, 40.689247],
			visitors: '4.5M/year',
			feature: null as OlFeature | null
		},
		{
			id: 'es',
			name: 'Empire State',
			coords: [-73.985664, 40.748433],
			visitors: '4M/year',
			feature: null as OlFeature | null
		},
		{
			id: 'hs',
			name: 'High Line',
			coords: [-74.00479, 40.74787],
			visitors: '8M/year',
			feature: null as OlFeature | null
		}
	];

	function selectFromTable(locationId: string) {
		selectedFeatures.clear();

		const location = locations.find((l) => l.id === locationId);
		if (location && location.feature) {
			selectedFeatures.push(location.feature);

			// Trigger the select event to notify TooltipManager
			if (selectInteraction) {
				selectInteraction.dispatchEvent({
					type: 'select',
					selected: [location.feature],
					deselected: []
				});
			}
			// center = location.coords; // Set center if desired when using Interaction.Select
		}
	}

	function clearSelection() {
		selectedFeatures.clear();
		center = DEFAULT_CENTER;

		// Trigger the select event to notify TooltipManager of clearing
		if (selectInteraction) {
			selectInteraction.dispatchEvent({
				type: 'select',
				selected: [],
				deselected: []
			});
		}
	}

	function isSelected(locationId: string): boolean {
		return reactiveSelection.hasId(locationId);
	}

	function getFeatureStyle(location: (typeof locations)[0]) {
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
			<Map.Root class="h-full w-full">
				<Map.View bind:center bind:zoom />
				<Layer.Tile
					source="xyz"
					url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
					attributions="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
				/>

				<Layer.Vector style={pointStyle}>
					{#each locations as location}
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

				<!-- Using Interaction.Select

				<Interaction.Select
					bind:interaction={selectInteraction}
					bind:selectedFeatures
					style={selectedStyle}
					multi={false}
				/>

				-->

				<!-- Using TooltipManager -->
				<Overlay.TooltipManager
					bind:selectInteraction
					bind:selectedFeatures
					selectStyle={selectedStyle}
					hoverClass="!bg-transparent !shadow-none"
					selectClass="!bg-transparent !shadow-none"
					multi={false}
				>
					{#snippet hoverSnippet(feature)}
						{@const props = feature.getProperties()}
						<ToolTipHover name={props.name} type={props.type} />
					{/snippet}
					{#snippet selectSnippet(feature)}
						{@const props = feature.getProperties()}
						<TooltipSelect {...props} />
					{/snippet}
				</Overlay.TooltipManager>
			</Map.Root>
		</div>
		<div class="text-muted-foreground mt-4 text-sm">
			{#if reactiveSelection.length > 0}
				{@const selected = reactiveSelection.array[0]}
				Selected: {selected.get('name')} ({selected.get('visitors')})
			{:else}
				Click on map markers or table rows to select
			{/if}
		</div>
	</div>
</div>
