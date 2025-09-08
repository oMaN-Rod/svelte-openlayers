<script lang="ts">
	import type { InteractionHoverProps } from '$lib/types.js';
	import { getMapContext } from '$lib/utils/context.js';
	import type { MapBrowserEvent } from 'ol';
	import { Feature } from 'ol';
	import { onMount } from 'svelte';

	let {
		onHover,
		onHoverEnd,
		layers,
		hitTolerance = 0,
		interaction = $bindable(null)
	}: InteractionHoverProps = $props();

	const mapContext = getMapContext();
	let isDestroyed = false;
	let currentFeature: Feature | null = null;
	let moveHandler: ((evt: MapBrowserEvent<PointerEvent>) => void) | null = null;

	onMount(() => {
		const map = mapContext.getMap();
		if (!map) return;

		moveHandler = (evt: MapBrowserEvent<PointerEvent>) => {
			if (isDestroyed) return;

			const pixel = evt.pixel;
			const coordinate = evt.coordinate;

			const features: Feature[] = [];
			const opts: any = {
				hitTolerance
			};

			if (layers && layers.length > 0) {
				opts.layerFilter = (layer: Layer) => layers.includes(layer);
			}

			map.forEachFeatureAtPixel(
				pixel,
				(feature) => {
					if (feature instanceof Feature) {
						features.push(feature);
					}
					return false;
				},
				opts
			);

			const hoveredFeature = features.length > 0 ? features[0] : null;

			if (hoveredFeature !== currentFeature) {
				if (currentFeature && !hoveredFeature) {
					if (onHoverEnd) {
						onHoverEnd();
					}
				}

				currentFeature = hoveredFeature;

				if (onHover) {
					onHover(hoveredFeature, hoveredFeature ? coordinate : undefined);
				}
			} else if (hoveredFeature && onHover) {
				onHover(hoveredFeature, coordinate);
			}
		};

		map.on('pointermove', moveHandler);

		interaction = { type: 'hover' };

		return () => {
			isDestroyed = true;
			if (map && moveHandler) {
				map.un('pointermove', moveHandler);
			}
			if (onHoverEnd && currentFeature) {
				onHoverEnd();
			}
			currentFeature = null;
			moveHandler = null;
			interaction = null;
		};
	});
</script>
