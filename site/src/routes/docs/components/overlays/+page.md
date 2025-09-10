# Overlay Components

Overlay components display HTML content positioned on the map at specific coordinates. Currently implemented components include tooltips and tooltip managers.

## Overlay.Tooltip {.toc}

Displays tooltips anchored to map coordinates with HTML content.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Overlay } from 'svelte-openlayers';

	let showTooltip = false;
	let tooltipPosition = [0, 0];
	let tooltipContent = '';

	const handleFeatureHover = (feature, coordinate) => {
		tooltipContent = feature.get('name');
		tooltipPosition = coordinate || [0, 0];
		showTooltip = true;
	};

	const hideTooltip = () => {
		showTooltip = false;
	};
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
	</Layer.Vector>

	<Interaction.Hover onHover={handleFeatureHover} onHoverEnd={hideTooltip} />

	{#if showTooltip}
		<Overlay.Tooltip position={tooltipPosition}>
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

### Feature Tooltips with Interaction {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Overlay, Interaction } from 'svelte-openlayers';

	const cities = [
		{
			name: 'New York',
			coords: [-74.0, 40.7],
			population: 8000000,
			description: 'The largest city in the United States.'
		},
		{
			name: 'Los Angeles',
			coords: [-118.2, 34.0],
			population: 4000000,
			description: 'The entertainment capital of the world.'
		}
	];

	let hoveredFeature = null;
	let tooltipPosition = [0, 0];

	const handleHover = (feature, coordinate) => {
		hoveredFeature = feature;
		tooltipPosition = coordinate || [0, 0];
	};

	const handleHoverEnd = () => {
		hoveredFeature = null;
	};
</script>

<Map.Root>
	<Map.View center={[-96, 38]} zoom={4} />
	<Layer.Tile source="osm" />

	<Layer.Vector>
		{#each cities as city}
			<Feature.Point
				coordinates={city.coords}
				properties={city}
				style={{
					circle: { radius: 8, fill: { color: '#2196F3' }, stroke: { color: 'white', width: 2 } }
				}}
			/>
		{/each}
	</Layer.Vector>

	<Interaction.Hover onHover={handleHover} onHoverEnd={handleHoverEnd} />

	{#if hoveredFeature}
		<Overlay.Tooltip position={tooltipPosition} class="city-tooltip">
			<div class="tooltip-content">
				<strong>{hoveredFeature.get('name')}</strong><br />
				Population: {hoveredFeature.get('population').toLocaleString()}
			</div>
		</Overlay.Tooltip>
	{/if}
</Map.Root>

<style>
	:global(.city-tooltip) {
		background: rgba(0, 0, 0, 0.8);
		color: white;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 12px;
		white-space: nowrap;
		pointer-events: none;
	}
</style>
```

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

	const getHoverContent = (feature) => {
		return feature.get('name') + ' (' + feature.get('population').toLocaleString() + ')';
	};

	const getSelectContent = (feature) => {
		return 'Selected: ' + feature.get('name');
	};
</script>

<Map.Root>
	<Map.View center={[-96, 38]} zoom={4} />
	<Layer.Tile source="osm" />

	<Layer.Vector>
		{#each cities as city}
			<Feature.Point coordinates={city.coords} properties={city} />
		{/each}
	</Layer.Vector>

	<Overlay.TooltipManager
		hoverTooltip={true}
		selectTooltip={true}
		hoverContent={getHoverContent}
		selectContent={getSelectContent}
	/>
</Map.Root>
```

### Props {.toc}

| Prop                | Type                                          | Default           | Description                                 |
| ------------------- | --------------------------------------------- | ----------------- | ------------------------------------------- |
| `layers`            | `Layer[]`                                     | `undefined`       | Layers to show tooltips for                 |
| `hitTolerance`      | `number`                                      | `undefined`       | Hit detection tolerance                     |
| `hoverTooltip`      | `boolean`                                     | `true`            | Enable hover tooltips                       |
| `selectTooltip`     | `boolean`                                     | `true`            | Enable selection tooltips                   |
| `hoverContent`      | `(feature: Feature) => string`                | `undefined`       | Function to generate hover tooltip content  |
| `selectContent`     | `(feature: Feature) => string`                | `undefined`       | Function to generate select tooltip content |
| `hoverSnippet`      | `Snippet<[Feature]>`                          | `undefined`       | Svelte snippet for hover tooltip content    |
| `selectSnippet`     | `Snippet<[Feature]>`                          | `undefined`       | Svelte snippet for select tooltip content   |
| `hoverPositioning`  | Positioning options (same as Overlay.Tooltip) | `'center-left'`   | Hover tooltip positioning                   |
| `selectPositioning` | Positioning options (same as Overlay.Tooltip) | `'center-left'`   | Select tooltip positioning                  |
| `hoverClass`        | `string`                                      | `'hover-tooltip'` | CSS class for hover tooltips                |
| `selectClass`       | `string`                                      | `'select-tooltip'`| CSS class for select tooltips               |
| `selectStyle`       | `StyleLike`                                   | `undefined`       | Style for selected features                 |
| `selectInteraction` | `Interaction`                                 | `null`            | Bindable select interaction instance        |
| `hoverInteraction`  | `Interaction`                                 | `null`            | Bindable hover interaction instance         |
| `selectedFeatures`  | `Collection<Feature>`                         | `null`            | Bindable selected features collection. When provided externally, allows programmatic control of selection. |
| `multi`             | `boolean`                                     | `false`           | Allow multiple selection                    |

### Programmatic Selection Notes {.toc}

When using `TooltipManager` with programmatic selection through the `selectedFeatures` prop:

- The `selectedFeatures` prop accepts an OpenLayers `Collection<Feature>` instance that can be manipulated externally
- When programmatically adding/removing features from the collection, the internal select interaction needs to be notified
- To ensure select tooltips appear when selecting programmatically, dispatch a synthetic `select` event on the bound `selectInteraction`:
  - Event structure: `{ type: 'select', selected: Feature[], deselected: Feature[] }`
- The `selectInteraction` and `hoverInteraction` props are bindable, providing access to the internal interaction instances
- Both hover and select tooltips will automatically position themselves based on feature geometry extent centers
