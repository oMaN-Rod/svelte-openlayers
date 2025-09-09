# Interaction Components

Interaction components handle user input and enable functionality like feature selection, drawing, and editing. They provide a reactive interface to OpenLayers' interaction system.

## Interaction.Select {.toc}

Allows users to select features by clicking or other methods.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let selectedFeatures = [];

	const handleSelection = (event) => {
		selectedFeatures = event.detail.features;
	};
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
		<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
	</Layer.Vector>

	<Interaction.Select onSelect={handleSelection} />
</Map.Root>

{#if selectedFeatures.length > 0}
	<div class="selection-info">
		<h3>Selected Features:</h3>
		<ul>
			{#each selectedFeatures as feature}
				<li>{feature.get('name')}</li>
			{/each}
		</ul>
	</div>
{/if}
```

### Props {.toc}

| Prop               | Type                            | Default     | Description                               |
| ------------------ | ------------------------------- | ----------- | ----------------------------------------- |
| `style`            | `StyleLike`                     | `undefined` | Style for selected features               |
| `layers`           | `Layer[]`                       | `undefined` | Layers to select from                     |
| `filter`           | `any`                           | `undefined` | Feature filter function                   |
| `multi`            | `boolean`                       | `false`     | Allow multiple selection                  |
| `hitTolerance`     | `number`                        | `undefined` | Hit detection tolerance in pixels         |
| `addCondition`     | `any`                           | `undefined` | Condition for adding to selection         |
| `removeCondition`  | `any`                           | `undefined` | Condition for removing from selection     |
| `toggleCondition`  | `any`                           | `undefined` | Condition for toggling selection          |
| `onSelect`         | `(features: Feature[]) => void` | `undefined` | Selection callback                        |
| `interaction`      | `any`                           | `undefined` | Bindable interaction instance (read-only) |
| `selectedFeatures` | `any`                           | `undefined` | Bindable selected features collection     |

### Advanced Selection {.toc}

```svelte
<script>
	let selectedFeatures = [];
	let selectionMode = 'single';

	const selectionStyle = {
		circle: {
			radius: 10,
			fill: { color: '#FF5722' },
			stroke: { color: 'white', width: 3 }
		},
		stroke: { color: '#FF5722', width: 3 },
		fill: { color: 'rgba(255, 87, 34, 0.3)' }
	};

	// Only allow selection of city features
	const cityFilter = (feature) => {
		return feature.get('type') === 'city';
	};
</script>

<Interaction.Select
	multi={selectionMode === 'multiple'}
	style={selectionStyle}
	filter={cityFilter}
	onSelect={(event) => (selectedFeatures = event.detail.features)}
/>

<div class="controls">
	<label>
		<input type="radio" bind:group={selectionMode} value="single" />
		Single Selection
	</label>
	<label>
		<input type="radio" bind:group={selectionMode} value="multiple" />
		Multiple Selection
	</label>
</div>
```

## Interaction.Hover {.toc}

Detects when the pointer hovers over features and provides callbacks for hover events.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let hoveredFeature = null;

	const handleHover = (feature, coordinate) => {
		hoveredFeature = feature;
	};

	const handleHoverEnd = () => {
		hoveredFeature = null;
	};
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
		<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
	</Layer.Vector>

	<Interaction.Hover onHover={handleHover} onHoverEnd={handleHoverEnd} />
</Map.Root>

{#if hoveredFeature}
	<div class="hover-info">
		Hovering over: {hoveredFeature.get('name')}
	</div>
{/if}
```

### Props {.toc}

| Prop           | Type                                                              | Default     | Description                               |
| -------------- | ----------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `onHover`      | `(feature: Feature &#124; null, coordinate?: Coordinate) => void` | `undefined` | Hover event callback                      |
| `onHoverEnd`   | `() => void`                                                      | `undefined` | Hover end callback                        |
| `layers`       | `Layer[]`                                                         | `undefined` | Layers to detect hover on                 |
| `hitTolerance` | `number`                                                          | `undefined` | Hit detection tolerance in pixels         |
| `interaction`  | `any &#124; null`                                                 | `null`      | Bindable interaction instance (read-only) |

> **Coming Soon:** Additional interaction types including Interaction.Draw, Interaction.Modify, and Interaction.Translate are planned for future releases.

## Combined Interactions {.toc}

### Select and Hover Together {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let selectedFeatures = [];
	let hoveredFeature = null;

	const cities = [
		{ name: 'New York', coords: [-74.0, 40.7] },
		{ name: 'Los Angeles', coords: [-118.2, 34.0] },
		{ name: 'Chicago', coords: [-87.6, 41.9] }
	];

	const handleSelect = (event) => {
		selectedFeatures = event.detail.features;
	};

	const handleHover = (feature) => {
		hoveredFeature = feature;
	};

	const handleHoverEnd = () => {
		hoveredFeature = null;
	};

	const getFeatureStyle = (city) => {
		const isHovered = hoveredFeature && hoveredFeature.get('name') === city.name;
		const isSelected = selectedFeatures.some((f) => f.get('name') === city.name);

		return {
			circle: {
				radius: isHovered ? 12 : 8,
				fill: {
					color: isSelected ? '#FF5722' : '#2196F3'
				},
				stroke: {
					color: 'white',
					width: isSelected ? 3 : 2
				}
			}
		};
	};
</script>

<Map.Root>
	<Map.View center={[-96, 38]} zoom={4} />
	<Layer.Tile source="osm" />

	<Layer.Vector>
		{#each cities as city}
			<Feature.Point coordinates={city.coords} properties={city} style={getFeatureStyle(city)} />
		{/each}
	</Layer.Vector>

	<Interaction.Select multi onSelect={handleSelect} />
	<Interaction.Hover onHover={handleHover} onHoverEnd={handleHoverEnd} />
</Map.Root>

<div class="info-panel">
	{#if hoveredFeature}
		<p>Hovering: {hoveredFeature.get('name')}</p>
	{/if}
	{#if selectedFeatures.length > 0}
		<p>Selected: {selectedFeatures.map((f) => f.get('name')).join(', ')}</p>
	{/if}
</div>
```
