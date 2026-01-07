# Overlay Components

Overlay components display HTML content positioned on the map at specific coordinates. Currently implemented components include tooltips and tooltip managers.

## Overlay.Tooltip {.toc}

Displays tooltips anchored to map coordinates with HTML content.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer, Feature, Overlay, Interaction } from 'svelte-openlayers';
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

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
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
	</Map>
</View>
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

## Overlay.Hover {.toc}

An overlay component designed to be used as a child of Feature components. It automatically appears when the parent feature is hovered and positions itself at the hover coordinate.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer, Feature, Overlay } from 'svelte-openlayers';

	const cities = [
		{ name: 'New York', coords: [-74.0, 40.7] },
		{ name: 'Los Angeles', coords: [-118.2, 34.0] }
	];
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			{#each cities as city}
				<Feature.Point coordinates={city.coords} properties={city}>
					<Overlay.Hover>
						<div class="rounded bg-black px-2 py-1 text-xs text-white shadow">
							{city.name}
						</div>
					</Overlay.Hover>
				</Feature.Point>
			{/each}
		</Layer.Vector>
	</Map>
</View>
```

### Props {.toc}

| Prop          | Type                                                                                                                                                                                    | Default           | Description                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| `offset`      | `[number, number]`                                                                                                                                                                      | `[0, -10]`        | Offset from hover coordinate             |
| `positioning` | `'bottom-left' &#124; 'bottom-center' &#124; 'bottom-right' &#124; 'center-left' &#124; 'center-center' &#124; 'center-right' &#124; 'top-left' &#124; 'top-center' &#124; 'top-right'` | `'bottom-center'` | Positioning relative to hover coordinate |
| `class`       | `string`                                                                                                                                                                                | `undefined`       | CSS class for overlay container          |
| `autoPan`     | `boolean`                                                                                                                                                                               | `false`           | Auto-pan map to show overlay             |
| `children`    | `Snippet`                                                                                                                                                                               | `undefined`       | Content to display in the overlay        |

> **Note:** `Overlay.Hover` must be placed inside a Feature component with hover event handling enabled.

## Overlay.Popup {.toc}

An overlay component designed to be used as a child of Feature components. It automatically appears when the parent feature is selected and positions itself at the click coordinate.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer, Feature, Overlay } from 'svelte-openlayers';

	const cities = [
		{ name: 'New York', coords: [-74.0, 40.7], population: '8M' },
		{ name: 'Los Angeles', coords: [-118.2, 34.0], population: '4M' }
	];
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			{#each cities as city}
				<Feature.Point coordinates={city.coords} properties={city}>
					<Overlay.Popup>
						<div class="rounded-lg bg-white p-3 shadow-lg">
							<div class="font-semibold">{city.name}</div>
							<div class="text-sm text-gray-600">Population: {city.population}</div>
						</div>
					</Overlay.Popup>
				</Feature.Point>
			{/each}
		</Layer.Vector>
	</Map>
</View>
```

### Props {.toc}

| Prop          | Type                                                                                                                                                                                    | Default           | Description                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------- |
| `offset`      | `[number, number]`                                                                                                                                                                      | `[0, -15]`        | Offset from click coordinate             |
| `positioning` | `'bottom-left' &#124; 'bottom-center' &#124; 'bottom-right' &#124; 'center-left' &#124; 'center-center' &#124; 'center-right' &#124; 'top-left' &#124; 'top-center' &#124; 'top-right'` | `'bottom-center'` | Positioning relative to click coordinate |
| `class`       | `string`                                                                                                                                                                                | `undefined`       | CSS class for overlay container          |
| `autoPan`     | `boolean`                                                                                                                                                                               | `true`            | Auto-pan map to show overlay             |
| `children`    | `Snippet`                                                                                                                                                                               | `undefined`       | Content to display in the overlay        |

> **Note:** `Overlay.Popup` must be placed inside a Feature component with selection event handling enabled.

### Combining Hover and Popup {.toc}

You can use both hover and popup overlays on the same feature:

```svelte
<Feature.Point
	coordinates={[-74.0, 40.7]}
	properties={{ name: 'New York', population: '8M' }}
>
	<!-- Shows on hover -->
	<Overlay.Hover>
		<div class="rounded bg-gray-800 px-2 py-1 text-xs text-white">
			New York
		</div>
	</Overlay.Hover>

	<!-- Shows when selected -->
	<Overlay.Popup>
		<div class="rounded-lg bg-white p-4 shadow-xl">
			<h3 class="font-bold">New York</h3>
			<p>Population: 8M</p>
		</div>
	</Overlay.Popup>
</Feature.Point>
```

## Overlay.TooltipManager {.toc}

A higher-level component that automatically manages tooltips for hover and select interactions.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer, Feature, Overlay } from 'svelte-openlayers';

	const cities = [
		{ name: 'New York', coords: [-74.0, 40.7], population: 8000000 },
		{ name: 'Los Angeles', coords: [-118.2, 34.0], population: 4000000 }
	];

	const selectedStyle = createCircleStyle({
		radius: 10,
		fill: { color: '#ef4444' },
		stroke: { color: '#991b1b', width: 3 }
	});
</script>

<View center={[-96, 38]} zoom={4}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />

		<Layer.Vector>
			{#each cities as city}
				<Feature.Point coordinates={city.coords} properties={city} />
			{/each}
		</Layer.Vector>

		<Overlay.TooltipManager selectStyle={selectedStyle} />
	</Map>
</View>
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

## Performance Considerations {.toc}

When building maps with interactive features, choosing the right overlay strategy is critical for performance.

### Overlay.Hover and Overlay.Popup (Per-Feature Overlays) {.toc}

These overlays are defined as children of Feature components. Each feature with an overlay creates a DOM element that OpenLayers manages.

**Best for:**

- Small to medium datasets
- Features with unique, complex popup content
- Cases where each feature has different overlay behavior

```svelte
<!-- Each city creates its own overlay instances -->
{#each cities as city}
	<Feature.Point coordinates={city.coords} properties={city}>
		<Overlay.Hover>
			<div>{city.name}</div>
		</Overlay.Hover>
		<Overlay.Popup>
			<CityDetails {city} />
		</Overlay.Popup>
	</Feature.Point>
{/each}
```

### Overlay.TooltipManager (Map-Level Centralized Overlay) {.toc}

The `Overlay.TooltipManager` uses a single overlay for each tooltip type (hover and select), dynamically updating content and position based on the current feature.

**Best for:**

- Large datasets (hundreds to thousands of features)
- Features with similar tooltip patterns
- Maximum performance with minimal DOM overhead

```svelte
<!-- Single Overlay.TooltipManager for all features -->
<Layer.Vector>
	{#each thousandsOfCities as city}
		<Feature.Point coordinates={city.coords} properties={city} />
	{/each}
</Layer.Vector>

<Overlay.TooltipManager
	hoverContent={(feature) => feature.get('name')}
	selectContent={(feature) => 'Population: ' + feature.get('population')}
/>
```

**Combining approaches**: You can use both - Overlay.TooltipManager for bulk features and Overlay.Popup for specific features that need unique behavior:

```svelte
<Layer.Vector>
	{#each regularCities as city}
		<Feature.Point coordinates={city.coords} properties={city} />
	{/each}
	<!-- Special feature with unique popup -->
	<Feature.Point coordinates={specialCity.coords} properties={specialCity}>
		<Overlay.Popup>
			<SpecialCityWidget />
		</Overlay.Popup>
	</Feature.Point>
</Layer.Vector>
<Overlay.TooltipManager layers={[regularLayer]} />
```
