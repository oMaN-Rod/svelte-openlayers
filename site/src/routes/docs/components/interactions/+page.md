# Interaction Components

Interaction components handle user input and enable functionality like feature selection, drawing, and editing. They provide a reactive interface to OpenLayers' interaction system with automatic reactivity for seamless bidirectional updates.

## Interaction.Select {.toc}

Allows users to select features by clicking or other methods.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let selectedFeatures: ReactiveCollection | null = $state(null);

	const selectedStyle = createCircleStyle({
		radius: 12,
		fill: '#ef4444',
		stroke: '#ffffff',
		strokeWidth: 3
	});
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
		<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
	</Layer.Vector>

	<Interaction.Select bind:selectedFeatures style={selectedStyle} />
</Map.Root>
```

### Props {.toc}

| Prop               | Type                            | Default     | Description                                                  |
| ------------------ | ------------------------------- | ----------- | ------------------------------------------------------------ |
| `style`            | `StyleLike`                     | `undefined` | Style for selected features                                  |
| `layers`           | `Layer[]`                       | `undefined` | Layers to select from                                        |
| `filter`           | `any`                           | `undefined` | Feature filter function                                      |
| `multi`            | `boolean`                       | `false`     | Allow multiple selection                                     |
| `hitTolerance`     | `number`                        | `undefined` | Hit detection tolerance in pixels                            |
| `addCondition`     | `any`                           | `undefined` | Condition for adding to selection                            |
| `removeCondition`  | `any`                           | `undefined` | Condition for removing from selection                        |
| `toggleCondition`  | `any`                           | `undefined` | Condition for toggling selection                             |
| `onSelect`         | `(features: Feature[]) => void` | `undefined` | Selection callback                                           |
| `interaction`      | `any`                           | `undefined` | Bindable interaction instance (read-only)                    |
| `selectedFeatures` | `ReactiveCollection<Feature>`   | `undefined` | Bindable reactive selected features collection               |
| `reactive`         | `boolean`                       | `true`      | Enable automatic reactivity (set to `false` for performance) |

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
