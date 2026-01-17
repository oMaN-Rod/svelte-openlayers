<script lang="ts">
	import { Map, Layer, Feature, Overlay, View } from 'svelte-openlayers';
	import { themeMapSource, useThemeMapSource } from '../_shared/data/map-sources.svelte';
	import { pointStyle } from '../_shared/styles';
	import { Badge } from '$lib/components/ui/badge';
	import type TileLayer from 'ol/layer/Tile';
	import {
		locationsEU,
		DEFAULT_CENTER_EU,
		DEFAULT_ZOOM,
		type Location
	} from '../_shared/data/locations';

	let tileLayer = $state<TileLayer | null>(null);
	useThemeMapSource(() => tileLayer);

	let {
		tooltipMode = $bindable<'hover' | 'select'>('hover'),
		hoveredFeature = $bindable<Location | null>(null),
		selectedFeature = $bindable<Location | null>(null)
	}: {
		tooltipMode?: 'hover' | 'select';
		hoveredFeature?: Location | null;
		selectedFeature?: Location | null;
	} = $props();
</script>

<div class="map-container">
	<View center={DEFAULT_CENTER_EU} zoom={DEFAULT_ZOOM}>
		<Map class="h-full w-full" controls={{ fullscreen: true }}>
			<Layer.Tile
				source="xyz"
				url={themeMapSource.current.url}
				attributions={themeMapSource.current.attributions}
				bind:layer={tileLayer}
			/>

			<Layer.Vector style={pointStyle}>
				{#each locationsEU as landmark}
					{@const { name, type, coords, image, ...rest } = landmark}
					<Feature.Point coordinates={coords} properties={rest}>
						<Overlay.Hover>
							<div class="bg-background/90 rounded border p-2">
								<div class="text-foreground mb-2 text-base font-bold">
									{name}
								</div>
								<div>
									<Badge>{type}</Badge>
								</div>
							</div>
						</Overlay.Hover>
						<Overlay.Popup positioning="center-left">
							<div class="bg-background/90 w-96 rounded border p-2">
								<div class="p-1">
									<div class="mb-2 flex flex-col border-b">
										<span class="text-foreground mb-2 text-base font-bold">{name}</span>
										<span class="text-sm">{type}</span>
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
													<td class="text-foreground px-2 py-1">
														{#if key === 'website'}
															{@const webSite = value as string}
															<a
																href={webSite}
																class="pointer-events-auto truncate text-indigo-600 hover:underline"
																target="_blank"
																rel="noopener noreferrer"
															>
																{webSite.replace(/^https?:\/\/(www\.)?/, '')}
															</a>
														{:else}
															{value}
														{/if}
													</td>
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
