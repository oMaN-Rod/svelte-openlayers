# Overlay Components

Overlay components display HTML content positioned on the map at specific coordinates. Currently implemented components include tooltips and tooltip managers.

## Overlay.Tooltip {.toc}

Displays tooltips anchored to map coordinates with HTML content.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Overlay, Interaction } from 'svelte-openlayers';
	import type { Feature as OlFeature } from 'ol';
	import type { Coordinate } from 'ol/coordinate';

	let hoverPosition: Coordinate | undefined = $state();
	let showTooltip = $state(false);
	let tooltipContent = $state('');

	function handleFeatureHover(feature: OlFeature | null, coordinate?: Coordinate) {
		if (!feature) {
			showTooltip = false;
			return;
		}

		tooltipContent = feature.get('name') || 'No name';
		hoverPosition = coordinate;
		showTooltip = true;
	}

	function hideTooltip() {
		showTooltip = false;
	}
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />

	<Layer.Vector>
		<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
		<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
	</Layer.Vector>

	<Interaction.Hover onHover={handleFeatureHover} onHoverEnd={hideTooltip} />

	{#if showTooltip}
		<Overlay.Tooltip position={hoverPosition}>
			{tooltipContent}
		</Overlay.Tooltip>
	{/if}
</Map.Root>
```

### Props {.toc}

| Prop          | Type                                                                                                                                                                                    | Default           | Description                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------- |
| `position`    | `[number, number]`                                                                                                                                                                      | `[0, 0]`          | Tooltip anchor coordinates                  |
| `content`     | `string`                                                                                                                                                                                | `undefined`       | Tooltip text content                        |
| `visible`     | `boolean`                                                                                                                                                                               | `true`            | Tooltip visibility                          |
| `offset`      | `[number, number]`                                                                                                                                                                      | `[0, 0]`          | Offset in pixels                            |
| `positioning` | `'bottom-left' &#124; 'bottom-center' &#124; 'bottom-right' &#124; 'center-left' &#124; 'center-center' &#124; 'center-right' &#124; 'top-left' &#124; 'top-center' &#124; 'top-right'` | `'bottom-center'` | Tooltip positioning relative to anchor      |
| `class`       | `string`                                                                                                                                                                                | `undefined`       | CSS class for tooltip container             |
| `autoPan`     | `boolean`                                                                                                                                                                               | `false`           | Auto-pan map to show tooltip                |
| `overlay`     | `Overlay &#124; null`                                                                                                                                                                   | `null`            | Bindable overlay instance (read-only)       |
| `children`    | `Snippet`                                                                                                                                                                               | `undefined`       | Child content (alternative to content prop) |

## TooltipManager {.toc}

A higher-level component that automatically manages tooltips for hover and select interactions.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Overlay } from 'svelte-openlayers';

	const cities = [
		{ name: 'New York', coords: [-74.0, 40.7], population: 8000000 },
		{ name: 'Los Angeles', coords: [-118.2, 34.0], population: 4000000 }
	];

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: '#ef4444',
		stroke: '#991b1b',
		strokeWidth: 3
	});
</script>

<Map.Root>
	<Map.View center={[-96, 38]} zoom={4} />
	<Layer.Tile source="osm" />

	<Layer.Vector>
		{#each cities as city}
			<Feature.Point coordinates={city.coords} properties={city} />
		{/each}
	</Layer.Vector>

	<Overlay.TooltipManager selectStyle={selectedStyle} />
</Map.Root>
```

### Props {.toc}

| Prop                | Type                                          | Default            | Description                                                  |
| ------------------- | --------------------------------------------- | ------------------ | ------------------------------------------------------------ |
| `layers`            | `Layer[]`                                     | `undefined`        | Layers to show tooltips for                                  |
| `hitTolerance`      | `number`                                      | `undefined`        | Hit detection tolerance                                      |
| `hoverTooltip`      | `boolean`                                     | `true`             | Enable hover tooltips                                        |
| `selectTooltip`     | `boolean`                                     | `true`             | Enable selection tooltips                                    |
| `hoverContent`      | `(feature: Feature) => string`                | `undefined`        | Function to generate hover tooltip content                   |
| `selectContent`     | `(feature: Feature) => string`                | `undefined`        | Function to generate select tooltip content                  |
| `hoverSnippet`      | `Snippet<[Feature]>`                          | `undefined`        | Svelte snippet for hover tooltip content                     |
| `selectSnippet`     | `Snippet<[Feature]>`                          | `undefined`        | Svelte snippet for select tooltip content                    |
| `hoverPositioning`  | Positioning options (same as Overlay.Tooltip) | `'center-left'`    | Hover tooltip positioning                                    |
| `selectPositioning` | Positioning options (same as Overlay.Tooltip) | `'center-left'`    | Select tooltip positioning                                   |
| `hoverClass`        | `string`                                      | `'hover-tooltip'`  | CSS class for hover tooltips                                 |
| `selectClass`       | `string`                                      | `'select-tooltip'` | CSS class for select tooltips                                |
| `selectStyle`       | `StyleLike`                                   | `undefined`        | Style for selected features                                  |
| `selectInteraction` | `Interaction`                                 | `null`             | Bindable select interaction instance                         |
| `hoverInteraction`  | `Interaction`                                 | `null`             | Bindable hover interaction instance                          |
| `selectedFeatures`  | `ReactiveCollection<Feature>`                 | `null`             | Bindable reactive selected features collection               |
| `multi`             | `boolean`                                     | `false`            | Allow multiple selection                                     |
| `reactive`          | `boolean`                                     | `true`             | Enable automatic reactivity (set to `false` for performance) |
