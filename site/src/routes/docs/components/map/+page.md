# Map Components

Map components provide the foundation for all mapping functionality. The `View` component controls the viewport and provides context, while the `Map` component renders the map container.

## View {.toc}

The View component controls the map's viewport including center, zoom, rotation, and projection. It wraps the Map component and provides context for all child components.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>
```

### Props {.toc}

| Prop                | Type                                      | Default       | Description                         |
| ------------------- | ----------------------------------------- | ------------- | ----------------------------------- |
| `center`            | `[number, number]`                        | `[0, 0]`      | View center coordinates (bindable)  |
| `zoom`              | `number`                                  | `5`           | Zoom level (bindable)               |
| `projection`        | `ProjectionLike`                          | `'EPSG:3857'` | Map projection                      |
| `minZoom`           | `number`                                  | `0`           | Minimum zoom level                  |
| `maxZoom`           | `number`                                  | `28`          | Maximum zoom level                  |
| `rotation`          | `number`                                  | `0`           | View rotation in radians (bindable) |
| `extent`            | `number[]`                                | `undefined`   | Constraining extent                 |
| `bbox`              | `Extent`                                  | `null`        | Current view extent (bindable)      |
| `constrainRotation` | `boolean &#124; number`                   | `true`        | Constrain rotation                  |
| `enableRotation`    | `boolean`                                 | `true`        | Enable rotation                     |
| `view`              | `View &#124; null`                        | `null`        | Bindable OpenLayers View instance   |
| `onCenterChange`    | `(center: Coordinate) => void`            | `undefined`   | Center change callback              |
| `onZoomChange`      | `(zoom: number &#124; undefined) => void` | `undefined`   | Zoom change callback                |
| `onRotationChange`  | `(rotation: number) => void`              | `undefined`   | Rotation change callback            |
| `onMoveEnd`         | `(evt: any) => void`                      | `undefined`   | Move end event callback             |

### Reactive Binding Example {.toc}

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';
	import { transform } from 'ol/proj';

	let center = $state([0, 0]);
	let zoom = $state(2);

	const transformedCoordinates = $derived(transform(center, 'EPSG:3857', 'EPSG:4326'));
</script>

<View bind:center bind:zoom>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>

<div>
	Center: [{transformedCoordinates[0].toFixed(2)}, {transformedCoordinates[1].toFixed(2)}]
	Zoom: {zoom.toFixed(1)}
</div>
```

### Sharing a View Across Multiple Maps {.toc}

You can share a single view across multiple Map components in two ways:

#### Option 1: View wrapping Maps {.toc}

The View component can wrap multiple Map components. Each Map receives the view from context automatically:

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';

	let center = $state([0, 0]);
	let zoom = $state(2);
</script>

<View bind:center bind:zoom>
	<div class="grid grid-cols-2 gap-4">
		<Map>
			<Layer.Tile source="osm" />
		</Map>
		<Map>
			<Layer.Tile source="xyz" url="..." />
		</Map>
	</div>
</View>
```

#### Option 2: View outside Maps {.toc}

Alternatively, the View can be defined separately (without children) and the view instance passed to each Map:

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';
	import type { View as OLView } from 'ol';

	let view: OLView | null = $state(null);
	let center = $state([0, 0]);
	let zoom = $state(2);
</script>

<!-- View defined separately -->
<View bind:center bind:zoom bind:view />

<div class="grid grid-cols-2 gap-4">
	<Map {view}>
		<Layer.Tile source="osm" />
	</Map>
	<Map {view}>
		<Layer.Tile source="xyz" url="..." />
	</Map>
</div>
```

Both patterns synchronize pan, zoom, and rotation across all maps sharing the view.

## Map {.toc}

The main map container that creates the OpenLayers map instance. It must be placed inside a View component (or receive a view prop directly).

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';
</script>

<View center={[-74.0, 40.7]} zoom={10}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>
```

### Props {.toc}

| Prop                  | Type                          | Default     | Description                          |
| --------------------- | ----------------------------- | ----------- | ------------------------------------ |
| `class`               | `string`                      | `undefined` | CSS classes for the map container    |
| `view`                | `View`                        | `undefined` | OpenLayers View instance (optional)  |
| `controls`            | `ControlOptions`              | `{}`        | Default controls configuration       |
| `interactions`        | `InteractionOptions`          | `{}`        | Default interactions configuration   |
| `pixelRatio`          | `number`                      | `undefined` | Device pixel ratio                   |
| `keyboardEventTarget` | `HTMLElement &#124; Document` | `undefined` | Keyboard event target                |
| `maxTilesLoading`     | `number`                      | `16`        | Maximum tiles loading simultaneously |
| `moveTolerance`       | `number`                      | `1`         | Move tolerance in pixels             |
| `map`                 | `Map &#124; null`             | `null`      | Bindable OpenLayers Map instance     |

### Events {.toc}

Map supports comprehensive event handling for map interactions. All events receive the appropriate OpenLayers event object.

#### MapBrowserEvent Handlers {.toc}

Handle pointer and mouse interactions with the map:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map
		click={handleClick}
		pointermove={handlePointerMove}
		pointerdown={handlePointerDown}
	>
		<Layer.Tile source="osm" />
	</Map>
</View>
```

| Event Handler   | Type                             | Description          |
| --------------- | -------------------------------- | -------------------- |
| `click`         | `(evt: MapBrowserEvent) => void` | Click event          |
| `dblclick`      | `(evt: MapBrowserEvent) => void` | Double click event   |
| `pointerdrag`   | `(evt: MapBrowserEvent) => void` | Pointer drag event   |
| `pointermove`   | `(evt: MapBrowserEvent) => void` | Pointer move event   |
| `pointerdown`   | `(evt: MapBrowserEvent) => void` | Pointer down event   |
| `pointerup`     | `(evt: MapBrowserEvent) => void` | Pointer up event     |
| `pointerover`   | `(evt: MapBrowserEvent) => void` | Pointer over event   |
| `pointerout`    | `(evt: MapBrowserEvent) => void` | Pointer out event    |
| `pointerenter`  | `(evt: MapBrowserEvent) => void` | Pointer enter event  |
| `pointerleave`  | `(evt: MapBrowserEvent) => void` | Pointer leave event  |
| `pointercancel` | `(evt: MapBrowserEvent) => void` | Pointer cancel event |

#### MapEvent Handlers {.toc}

Handle map lifecycle and navigation events:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map
		movestart={handleMoveStart}
		moveend={handleMoveEnd}
		loadend={handleLoadEnd}
	>
		<Layer.Tile source="osm" />
	</Map>
</View>
```

| Event Handler | Type                      | Description         |
| ------------- | ------------------------- | ------------------- |
| `postrender`  | `(evt: MapEvent) => void` | After map rendering |
| `movestart`   | `(evt: MapEvent) => void` | Map movement starts |
| `moveend`     | `(evt: MapEvent) => void` | Map movement ends   |
| `loadstart`   | `(evt: MapEvent) => void` | Map loading starts  |
| `loadend`     | `(evt: MapEvent) => void` | Map loading ends    |

#### RenderEvent Handlers {.toc}

Handle rendering lifecycle events:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map
		precompose={handlePreCompose}
		postcompose={handlePostCompose}
		rendercomplete={handleRenderComplete}
	>
		<Layer.Tile source="osm" />
	</Map>
</View>
```

| Event Handler    | Type                         | Description              |
| ---------------- | ---------------------------- | ------------------------ |
| `precompose`     | `(evt: RenderEvent) => void` | Before layer composition |
| `postcompose`    | `(evt: RenderEvent) => void` | After layer composition  |
| `rendercomplete` | `(evt: RenderEvent) => void` | Rendering complete       |

#### Event Usage Examples {.toc}

```svelte
<script>
	import { Map, Layer, View } from 'svelte-openlayers';

	function handleClick(evt) {
		const coordinate = evt.coordinate;
		console.log('Clicked at:', coordinate);
	}

	function handlePointerMove(evt) {
		// Update cursor or highlight features
		const pixel = evt.pixel;
		// Check for features at pixel
	}

	function handleMoveEnd(evt) {
		const map = evt.target;
		const view = map.getView();
		const center = view.getCenter();
		const zoom = view.getZoom();
		console.log('New view:', { center, zoom });
	}
</script>

<View center={[0, 0]} zoom={2}>
	<Map
		click={handleClick}
		pointermove={handlePointerMove}
		moveend={handleMoveEnd}
	>
		<Layer.Tile source="osm" />
		<!-- layers and other components -->
	</Map>
</View>
```

## Built-in Controls {.toc}

Map includes built-in controls that can be configured via the `controls` prop.

### Control Configuration {.toc}

```svelte
<View center={[0, 0]} zoom={2}>
	<Map controls={{ zoom: true, attribution: true, rotate: false }}>
		<Layer.Tile source="osm" />
	</Map>
</View>
```

### Control.Draw {.toc}

A drawing control toolbar for creating features on the map. See the [Interactions documentation](/docs/components/interactions) for the `Interaction.Draw` component.

```svelte
<script>
	import { Map, Layer, View, Control } from 'svelte-openlayers';
	import VectorSource from 'ol/source/Vector.js';

	let drawType = $state('Point');
	let vectorSource: VectorSource | null = $state(null);
</script>

<View center={[0, 0]} zoom={2}>
	<Map>
		<Layer.Tile source="osm" />
		<Layer.Vector bind:source={vectorSource}>
			<Control.Draw
				bind:type={drawType}
				source={vectorSource}
				onDrawEnd={(evt) => console.log('Drew:', evt.feature)}
			/>
		</Layer.Vector>
	</Map>
</View>
```

| Prop           | Type                                                           | Default     | Description                      |
| -------------- | -------------------------------------------------------------- | ----------- | -------------------------------- |
| `type`         | `'Point' &#124; 'LineString' &#124; 'Polygon' &#124; 'Circle'` | `'Point'`   | Drawing type (bindable)          |
| `source`       | `VectorSource`                                                 | `null`      | Vector source for drawn features |
| `style`        | `StyleLike &#124; FlatStyleLike`                               | `undefined` | Style for sketch features        |
| `onDrawStart`  | `(evt: DrawEvent) => void`                                     | `undefined` | Drawing started callback         |
| `onDrawEnd`    | `(evt: DrawEvent) => void`                                     | `undefined` | Drawing completed callback       |
| `onDrawAbort`  | `(evt: DrawEvent) => void`                                     | `undefined` | Drawing aborted callback         |
| `onTypeChange` | `(type: string) => void`                                       | `undefined` | Type changed callback            |
