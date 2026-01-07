# Control Components

Control components provide UI elements that are overlaid on the map for user interaction. They are automatically added to the map's control container.

## Default Controls {.toc}

OpenLayers provides a set of default controls that are automatically added to the map. You can configure which controls to include using the `controls` prop on the `Map` component.

### Available Default Controls {.toc}

| Control       | Default | Description                                         |
| ------------- | ------- | --------------------------------------------------- |
| `zoom`        | `true`  | Zoom in/out buttons                                 |
| `rotate`      | `true`  | Rotation reset button (appears when map is rotated) |
| `attribution` | `true`  | Layer attribution display                           |

### Configuring Default Controls {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
</script>

<!-- Default: all controls enabled -->
<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>

<!-- Disable specific controls -->
<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full" controls={{ zoom: false, rotate: false }}>
		<Layer.Tile source="osm" />
	</Map>
</View>

<!-- Disable all default controls -->
<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full" controls={{ zoom: false, rotate: false, attribution: false }}>
		<Layer.Tile source="osm" />
	</Map>
</View>
```

### Control Options {.toc}

Each control can be configured with additional options:

```svelte
<Map
	controls={{
		// Boolean to enable/disable
		zoom: true,
		rotate: true,
		// Or pass OpenLayers control options
		attribution: {
			collapsible: true,
			collapsed: true
		}
	}}
>
```

### Adding Additional OpenLayers Controls {.toc}

For controls not exposed through the `controls` prop, you can add them directly to the map instance:

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
	import OlMap from 'ol/Map.js';
	import FullScreen from 'ol/control/FullScreen.js';
	import ScaleLine from 'ol/control/ScaleLine.js';

	let map: OlMap | null = $state(null);

	$effect(() => {
		if (map) {
			map.addControl(new FullScreen());
			map.addControl(new ScaleLine({ units: 'metric' }));
		}
	});
</script>

<View center={[0, 0]} zoom={2}>
	<Map bind:map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>
```

## Control.Draw <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

> **Beta Feature**: This component is functional but may have API changes in future releases.

A comprehensive drawing control that allows users to draw and edit vector features with an integrated toolbar. Supports multiple geometry types, feature selection, and optional properties panel.

### Basic Usage {.toc}

```svelte
<script>
  import { View, Map, Layer, Control } from 'svelte-openlayers';
  import VectorSource from 'ol/source/Vector.js';

  let drawType = $state<'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Select' | null>('Point');
  let vectorSource = new VectorSource();
</script>

<View center={[0, 0]} zoom={2}>
  <Map class="h-96 w-full">
    <Layer.Tile source="osm" />
    <Layer.Vector bind:source={vectorSource}>
      <Control.Draw bind:type={drawType} />
    </Layer.Vector>
  </Map>
</View>
```

### Drawing Modes {.toc}

The control supports the following drawing modes:

- **Point**: Click to place point features
- **LineString**: Click to add vertices, double-click to finish
- **Polygon**: Click to add vertices, double-click to close
- **Circle**: Click and drag to create circles
- **Select**: Select and modify existing features

### Props {.toc}

| Prop                      | Type                                                                                       | Default     | Description                           |
| ------------------------- | ------------------------------------------------------------------------------------------ | ----------- | ------------------------------------- |
| `type`                    | `'Point' &#124; 'LineString' &#124; 'Polygon' &#124; 'Circle' &#124; 'Select' &#124; null` | `null`      | Current drawing mode (bindable)       |
| `source`                  | `VectorSource &#124; null`                                                                 | `null`      | Vector source for drawn features      |
| `style`                   | `StyleLike &#124; FlatStyleLike`                                                           | `undefined` | Style for drawn features              |
| `selectStyle`             | `StyleLike`                                                                                | `undefined` | Style for selected features           |
| `control`                 | `Control &#124; null`                                                                      | `null`      | Bindable control instance (read-only) |
| `selectedFeature`         | `Feature<Geometry> &#124; null`                                                            | `null`      | Currently selected feature (bindable) |
| `showPropertiesPanel`     | `boolean`                                                                                  | `false`     | Show feature properties panel         |
| `propertiesPanelPosition` | `'left' &#124; 'right'`                                                                    | `'right'`   | Position of properties panel          |
| `onDrawStart`             | `(evt: any) => void`                                                                       | `undefined` | Fired when drawing starts             |
| `onDrawEnd`               | `(evt: any) => void`                                                                       | `undefined` | Fired when drawing completes          |
| `onDrawAbort`             | `(evt: any) => void`                                                                       | `undefined` | Fired when drawing is aborted         |
| `onTypeChange`            | `(type: DrawType) => void`                                                                 | `undefined` | Fired when drawing mode changes       |
| `onFeatureSelect`         | `(feature: Feature<Geometry> &#124; null) => void`                                         | `undefined` | Fired when a feature is selected      |
| `onFeatureModified`       | `(feature: Feature<Geometry>) => void`                                                     | `undefined` | Fired when a feature is modified      |
| `onFeatureDelete`         | `(feature: Feature<Geometry>) => void`                                                     | `undefined` | Fired when a feature is deleted       |

### With Properties Panel {.toc}

Enable the properties panel to edit feature styles and properties:

```svelte
<script>
  import { View, Map, Layer, Control } from 'svelte-openlayers';
  import VectorSource from 'ol/source/Vector.js';

  let drawType = $state<'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Select' | null>('Point');
  let vectorSource = new VectorSource();
  let selectedFeature = $state(null);

  function handleFeatureModified(feature) {
    console.log('Feature modified:', feature.getProperties());
  }

  function handleFeatureDelete(feature) {
    console.log('Feature deleted:', feature.get('id'));
  }
</script>

<View center={[0, 0]} zoom={2}>
  <Map class="h-96 w-full">
    <Layer.Tile source="osm" />
    <Layer.Vector bind:source={vectorSource}>
      <Control.Draw
        bind:type={drawType}
        bind:selectedFeature
        showPropertiesPanel
        propertiesPanelPosition="right"
        onFeatureModified={handleFeatureModified}
        onFeatureDelete={handleFeatureDelete}
      />
    </Layer.Vector>
  </Map>
</View>
```

### Events {.toc}

| Event               | Type                                     | Description                     |
| ------------------- | ---------------------------------------- | ------------------------------- |
| `onDrawStart`       | `(evt: DrawEvent) => void`               | Fired when drawing starts       |
| `onDrawEnd`         | `(evt: DrawEvent) => void`               | Fired when drawing completes    |
| `onDrawAbort`       | `(evt: DrawEvent) => void`               | Fired when drawing is aborted   |
| `onTypeChange`      | `(type: DrawType) => void`               | Fired when drawing mode changes |
| `onFeatureSelect`   | `(feature: Feature &#124; null) => void` | Fired when feature is selected  |
| `onFeatureModified` | `(feature: Feature) => void`             | Fired when feature is modified  |
| `onFeatureDelete`   | `(feature: Feature) => void`             | Fired when feature is deleted   |

## Control.FeaturePanel <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

> **Beta Feature**: This component is functional but may have API changes in future releases.

A standalone properties panel for editing feature styles and custom properties. Can be used independently or integrated with Control.Draw.

### Basic Usage {.toc}

```svelte
<script>
  import { View, Map, Layer, Feature, Control } from 'svelte-openlayers';
  import type { Feature as OlFeature } from 'ol';

  let selectedFeature = $state<OlFeature | null>(null);
  let panelVisible = $state(false);

  function handleSelect(feature: OlFeature | null) {
    selectedFeature = feature;
    panelVisible = !!feature;
  }

  function handleStyleChange(feature: OlFeature, style: any) {
    console.log('Style changed:', style);
  }

  function handlePropertyChange(feature: OlFeature, key: string, value: any) {
    console.log('Property changed to:', value);
  }

  function handleDelete(feature: OlFeature) {
    console.log('Feature deleted');
    panelVisible = false;
  }
</script>

<View center={[0, 0]} zoom={2}>
  <Map class="h-96 w-full">
    <Layer.Tile source="osm" />
    <Layer.Vector>
      <Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }} />
      <Interaction.Select onSelect={handleSelect} />
    </Layer.Vector>

    <Control.FeaturePanel
      bind:feature={selectedFeature}
      bind:visible={panelVisible}
      position="right"
      title="Feature Properties"
      onStyleChange={handleStyleChange}
      onPropertyChange={handlePropertyChange}
      onDelete={handleDelete}
    />
  </Map>
</View>
```

### Props {.toc}

| Prop               | Type                                                  | Default                | Description                           |
| ------------------ | ----------------------------------------------------- | ---------------------- | ------------------------------------- |
| `title`            | `string`                                              | `'Feature Properties'` | Panel title                           |
| `feature`          | `Feature<Geometry> &#124; null`                       | `null`                 | Feature to edit (bindable)            |
| `visible`          | `boolean`                                             | `false`                | Panel visibility (bindable)           |
| `position`         | `'left' &#124; 'right'`                               | `'right'`              | Panel position                        |
| `onStyleChange`    | `(feature: Feature, style: any) => void`              | `undefined`            | Fired when style changes              |
| `onPropertyChange` | `(feature: Feature, key: string, value: any) => void` | `undefined`            | Fired when property changes           |
| `onDelete`         | `(feature: Feature) => void`                          | `undefined`            | Fired when delete is requested        |
| `onClose`          | `() => void`                                          | `undefined`            | Fired when panel is closed            |
| `control`          | `Control &#124; null`                                 | `null`                 | Bindable control instance (read-only) |

### Features {.toc}

The Feature Panel provides:

- **Style Editor**: Edit fill color, opacity, stroke color, width, and dash patterns
- **Point Styles**: Customize point radius for point features
- **Property Editor**: Add, edit, and remove custom properties
- **Delete**: Remove the feature from the map
- **Real-time Preview**: See changes immediately on the map

### Panel Styling {.toc}

The panel includes controls for:

- **Fill Color**: Color picker for polygon/point fill
- **Fill Opacity**: Slider for fill transparency
- **Stroke Color**: Color picker for border/line color
- **Stroke Width**: Width of borders and lines
- **Line Style**: Solid, dashed, or dotted lines
- **Point Radius**: Size of point features
- **Custom Dash Patterns**: Configure dash and gap lengths

> **Note:** The panel automatically detects the feature geometry type and shows relevant style controls.
