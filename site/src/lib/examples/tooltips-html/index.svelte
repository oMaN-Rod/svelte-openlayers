<script lang="ts">
	import { Map, Layer, Feature, Overlay, View } from 'svelte-openlayers';
	import { mapSources } from '../_shared/data/map-sources';
	import { landmarks, DEFAULT_CENTER, DEFAULT_ZOOM, type Landmark } from './data';
	import { pointStyle } from '../_shared/styles';
	import { Badge } from '$lib/components/ui/badge';

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
					{@const { id, coordinates, name, ...rest } = landmark}
					<Feature.Point {coordinates} properties={rest}>
						<Overlay.Hover>
							<div class="bg-background/90 rounded p-2">
								<div class="text-foreground mb-2 text-base font-bold">
									{name || 'Unknown'}
								</div>
								<div>
									<Badge>Landmark</Badge>
								</div>
							</div>
						</Overlay.Hover>
						<Overlay.Popup positioning="center-left">
							<div class="bg-background/90 rounded p-2">
								<div class="p-1">
									<div class="text-foreground mb-2 text-base font-bold">
										{name}
									</div>
									<table class="w-full">
										<tbody>
											{#each Object.entries(rest) as [key, value]}
												<tr>
													<td class="text-foreground px-2 py-1 font-medium">
														<Badge variant="outline" class="capitalize">
															{key}
														</Badge>
													</td>
													<td class="text-foreground px-2 py-1">{value}</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</Overlay.Popup>
					</Feature.Point>
				{/each}
			</Layer.Vector>
		</Map>
	</View>
</div>
