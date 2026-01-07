# Interaction Components

Interaction components handle user input and enable functionality like feature selection, drawing, and editing. They provide a reactive interface to OpenLayers' interaction system with automatic reactivity for seamless bidirectional updates.

## Interaction.Select {.toc}

Allows users to select features by clicking or other methods.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let selectedFeatures: ReactiveCollection | null = $state(null);

	const selectedStyle = createCircleStyle({
		radius: 12,
		fill: { color: '#ef4444' },
		stroke: { color: '#ffffff', width: 3 }
	});
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
			<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
		</Layer.Vector>

		<Interaction.Select bind:selectedFeatures style={selectedStyle} />
	</Map>
</View>
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
	import { View, Map, Layer, Feature, Interaction } from 'svelte-openlayers';

	let hoveredFeature = null;

	const handleHover = (feature, coordinate) => {
		hoveredFeature = feature;
	};

	const handleHoverEnd = () => {
		hoveredFeature = null;
	};
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
			<Feature.Point coordinates={[-118.2, 34.0]} properties={{ name: 'Los Angeles' }} />
		</Layer.Vector>

		<Interaction.Hover onHover={handleHover} onHoverEnd={handleHoverEnd} />
	</Map>
</View>
```

### Props {.toc}

| Prop           | Type                                                              | Default     | Description                               |
| -------------- | ----------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `onHover`      | `(feature: Feature &#124; null, coordinate?: Coordinate) => void` | `undefined` | Hover event callback                      |
| `onHoverEnd`   | `() => void`                                                      | `undefined` | Hover end callback                        |
| `layers`       | `Layer[]`                                                         | `undefined` | Layers to detect hover on                 |
| `hitTolerance` | `number`                                                          | `undefined` | Hit detection tolerance in pixels         |
| `interaction`  | `any &#124; null`                                                 | `null`      | Bindable interaction instance (read-only) |

## Interaction.Draw {.toc}

Enables drawing of vector features (points, lines, polygons, and circles) on the map. The interaction automatically handles user input and provides callbacks for drawing lifecycle events.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Interaction } from 'svelte-openlayers';
	import { createStyle, createCircleStyle } from 'svelte-openlayers/utils';
	import VectorSource from 'ol/source/Vector.js';

	let drawType = $state('Point');
	let drawnFeatures = $state([]);

	// Create a vector source to store drawn features
	const vectorSource = new VectorSource();

	// Style for drawn features
	const drawStyle = createStyle({
		fill: { color: 'rgba(59, 130, 246, 0.3)' },
		stroke: { color: '#2563eb', width: 2 },
		image: createCircleStyle({
			radius: 6,
			fill: { color: '#2563eb' },
			stroke: { color: '#ffffff', width: 2 }
		})
	});

	// Style for drawing preview
	const sketchStyle = createStyle({
		fill: { color: 'rgba(16, 185, 129, 0.2)' },
		stroke: { color: '#10b981', width: 2, lineDash: [10, 10] },
		image: createCircleStyle({
			radius: 6,
			fill: { color: '#10b981' },
			stroke: { color: '#ffffff', width: 2 }
		})
	});

	function handleDrawEnd(evt) {
		drawnFeatures = [...drawnFeatures, evt.feature];
	}
</script>

<View center={[-74.006, 40.7128]} zoom={10}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />

		<Layer.Vector bind:source={vectorSource} style={drawStyle}>
			<Interaction.Draw bind:type={drawType} style={sketchStyle} onDrawEnd={handleDrawEnd} />
		</Layer.Vector>
	</Map>
</View>
```

### Drawing Types {.toc}

- **Point**: Click to place a single point
- **LineString**: Click to start, continue clicking to add points, double-click to finish
- **Polygon**: Click to start, continue clicking to add vertices, double-click to close
- **Circle**: Click and drag to create a circle

### Props {.toc}

| Prop                | Type                                               | Default     | Description                                                    |
| ------------------- | -------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `type`              | `'Point' \| 'LineString' \| 'Polygon' \| 'Circle'` | `'Point'`   | Geometry type to draw (bindable)                               |
| `source`            | `VectorSource`                                     | `null`      | Vector source for drawn features (bindable)                    |
| `style`             | `StyleLike \| FlatStyleLike`                       | `undefined` | Style for drawing preview/sketch features                      |
| `features`          | `Collection<Feature>`                              | `undefined` | Feature collection for drawn features (bindable)               |
| `clickTolerance`    | `number`                                           | `6`         | Click tolerance in pixels                                      |
| `snapTolerance`     | `number`                                           | `12`        | Snap tolerance for finishing drawing                           |
| `stopClick`         | `boolean`                                          | `false`     | Stop click events during drawing                               |
| `maxPoints`         | `number`                                           | `undefined` | Maximum number of points before auto-finish                    |
| `minPoints`         | `number`                                           | `undefined` | Minimum points required (default: 3 for polygons, 2 for lines) |
| `finishCondition`   | `Condition`                                        | `undefined` | Custom condition for finishing drawing                         |
| `geometryFunction`  | `GeometryFunction`                                 | `undefined` | Custom geometry creation function                              |
| `geometryName`      | `string`                                           | `undefined` | Geometry property name for features                            |
| `condition`         | `Condition`                                        | `undefined` | Condition for handling events                                  |
| `freehand`          | `boolean`                                          | `false`     | Enable freehand drawing mode                                   |
| `freehandCondition` | `Condition`                                        | `undefined` | Condition for freehand mode                                    |
| `trace`             | `boolean \| Condition`                             | `false`     | Enable tracing along existing geometries                       |
| `traceSource`       | `VectorSource`                                     | `undefined` | Source for features to trace                                   |
| `wrapX`             | `boolean`                                          | `false`     | Wrap drawing horizontally                                      |
| `geometryLayout`    | `'XY' \| 'XYZ' \| 'XYM' \| 'XYZM'`                 | `'XY'`      | Coordinate layout for geometries                               |
| `interaction`       | `Draw`                                             | `null`      | Bindable interaction instance (read-only)                      |

### Events {.toc}

| Event         | Type                       | Description                    |
| ------------- | -------------------------- | ------------------------------ |
| `onDrawStart` | `(evt: DrawEvent) => void` | Fired when drawing starts      |
| `onDrawEnd`   | `(evt: DrawEvent) => void` | Fired when drawing is finished |
| `onDrawAbort` | `(evt: DrawEvent) => void` | Fired when drawing is aborted  |

> **Note:** The Draw interaction automatically creates its own overlay layer for displaying sketch features while drawing. You only need to provide a vector source for storing the final drawn features.

## Interaction.Modify <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

> **Beta Feature**: This component is functional but may have API changes in future releases.

Enables modification of existing vector features by dragging vertices and segments. Users can move vertices, add new points by dragging segments, and delete vertices (typically with Alt+Click).

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature, Interaction } from 'svelte-openlayers';
	import Collection from 'ol/Collection.js';

	let selectedFeatures = new Collection();
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Feature.Point coordinates={[-74.0, 40.7]} />
			<Feature.LineString coordinates={[[-74.0, 40.7], [-118.2, 34.0]]} />

			<!-- Select features first -->
			<Interaction.Select bind:selectedFeatures multi />

			<!-- Then modify selected features -->
			<Interaction.Modify features={selectedFeatures} />
		</Layer.Vector>
	</Map>
</View>
```

### Modify by Source {.toc}

You can modify all features in a layer source without requiring selection:

```svelte
<script>
	import VectorSource from 'ol/source/Vector.js';

	const vectorSource = new VectorSource();
</script>

<Layer.Vector bind:source={vectorSource}>
	<!-- Features added to the source -->
	<Feature.Polygon coordinates={[/* ... */]} />

	<!-- Modify all features in the source -->
	<Interaction.Modify source={vectorSource} />
</Layer.Vector>
```

### Props {.toc}

| Prop                    | Type                                   | Default     | Description                                          |
| ----------------------- | -------------------------------------- | ----------- | ---------------------------------------------------- |
| `features`              | `Collection<Feature> &#124; Feature[]` | `null`      | Features to modify (bindable)                        |
| `source`                | `VectorSource`                         | `null`      | Source of features to modify (bindable)              |
| `style`                 | `StyleLike`                            | `undefined` | Style for modified features while editing            |
| `pixelTolerance`        | `number`                               | `10`        | Pixel tolerance for selecting vertices               |
| `condition`             | `Condition`                            | `undefined` | Condition for modification                           |
| `deleteCondition`       | `Condition`                            | `undefined` | Condition for deleting vertices (default: Alt+Click) |
| `insertVertexCondition` | `Condition`                            | `undefined` | Condition for inserting vertices                     |
| `hitDetection`          | `boolean \| Layer[]`                   | `undefined` | Enable hit detection on layers                       |
| `onModifyStart`         | `(evt: ModifyEvent) => void`           | `undefined` | Fired when modification starts                       |
| `onModifyEnd`           | `(evt: ModifyEvent) => void`           | `undefined` | Fired when modification ends                         |
| `interaction`           | `Modify &#124; null`                   | `null`      | Bindable interaction instance (read-only)            |

### Modification Controls {.toc}

- **Move vertex**: Click and drag a vertex
- **Delete vertex**: Alt+Click on a vertex (or custom `deleteCondition`)
- **Add vertex**: Click and drag a line segment between vertices
- **Undo**: Press Ctrl+Z while modifying

### Events {.toc}

| Event           | Type                         | Description                      |
| --------------- | ---------------------------- | -------------------------------- |
| `onModifyStart` | `(evt: ModifyEvent) => void` | Fired when modification starts   |
| `onModifyEnd`   | `(evt: ModifyEvent) => void` | Fired when modification finishes |

### Combined with Select {.toc}

The most common pattern is to combine Modify with Select for better UX:

```svelte
<script>
	import { createCircleStyle, createStyle } from 'svelte-openlayers/utils';
	import Collection from 'ol/Collection.js';

	let selectedFeatures = new Collection();

	const selectedStyle = createStyle({
		stroke: { color: '#2563eb', width: 3 },
		fill: { color: 'rgba(37, 99, 235, 0.2)' },
		image: { radius: 8, fill: { color: '#2563eb' }, stroke: { color: '#fff', width: 2 } }
	});

	const modifyStyle = createStyle({
		stroke: { color: '#10b981', width: 3 },
		fill: { color: 'rgba(16, 185, 129, 0.2)' },
		image: { radius: 6, fill: { color: '#10b981' } }
	});
</script>

<Layer.Vector>
	<!-- Your features -->
	<Feature.Polygon coordinates={[/* ... */]} />

	<!-- Select interaction with custom style -->
	<Interaction.Select bind:selectedFeatures multi style={selectedStyle} />

	<!-- Modify interaction on selected features -->
	<Interaction.Modify
		features={selectedFeatures}
		style={modifyStyle}
		onModifyStart={() => console.log('Started modifying')}
		onModifyEnd={(evt) => console.log('Modified:', evt.features)}
	/>
</Layer.Vector>
```

> **Coming Soon:** Additional interaction types including Interaction.Translate are planned for future releases.
