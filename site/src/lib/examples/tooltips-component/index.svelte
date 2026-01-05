<script lang="ts">
	import { Feature, Layer, Map, Overlay, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { TooltipHover, TooltipSelect } from '../_shared';
	import { landmarks, DEFAULT_CENTER, DEFAULT_ZOOM, type Landmark } from './data';
	import { pointStyle, selectedStyle } from './styles';

	let {
		tooltipMode = $bindable<'hover' | 'select'>('hover'),
		hoveredFeature = $bindable<Landmark | null>(null),
		selectedFeature = $bindable<Landmark | null>(null)
	}: {
		tooltipMode?: 'hover' | 'select';
		hoveredFeature?: Landmark | null;
		selectedFeature?: Landmark | null;
	} = $props();
</script>

<div class="relative h-96 w-full overflow-hidden rounded-lg border">
	<View center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM}>
		<Map class="h-full w-full">
			<Layer.Tile
				source="xyz"
				url={mapSources.find((s) => s.id === 'carto-voyager')?.url}
				attributions={mapSources.find((s) => s.id === 'carto-voyager')?.attributions}
			/>

			<Layer.Vector style={pointStyle}>
				{#each landmarks as landmark}
					{@const { id, coordinates, ...rest } = landmark}
					<Feature.Point {coordinates} properties={rest} />
				{/each}
			</Layer.Vector>

			<Overlay.TooltipManager
				hoverTooltip={true}
				selectTooltip={true}
				selectStyle={selectedStyle}
				hoverClass="!bg-transparent !shadow-none"
				selectClass="!bg-transparent !shadow-none"
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
	{#if tooltipMode === 'hover'}
		Hover over landmarks to see their information
	{:else}
		Click on landmarks to toggle their information
	{/if}
</div>
