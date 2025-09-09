# Map Components

Map components provide the foundation for all mapping functionality. They handle the core map setup, view management, and provide context for other components.

## Map.Root {.toc}

The main map container that creates the OpenLayers map instance and provides context to all child components.

### Basic Usage {.toc}

```svelte
<script>
	import { Map } from 'svelte-openlayers';
</script>

<Map.Root class="h-96 w-full">
	<Map.View center={[0, 0]} zoom={2} />
</Map.Root>
```

### Props {.toc}

| Prop                   | Type                          | Default     | Description                          |
| ---------------------- | ----------------------------- | ----------- | ------------------------------------ |
| `class`                | `string`                      | `undefined` | CSS classes for the map container    |
| `style`                | `string`                      | `undefined` | Inline styles for the map container  |
| `target`               | `HTMLElement`                 | `undefined` | Target element for the map           |
| `pixelRatio`           | `number`                      | `undefined` | Device pixel ratio                   |
| `keyboardEventTarget`  | `HTMLElement &#124; Document` | `undefined` | Keyboard event target                |
| `maxTilesLoading`      | `number`                      | `undefined` | Maximum tiles loading simultaneously |
| `moveTolerance`        | `number`                      | `undefined` | Move tolerance in pixels             |
| `zoomControl`          | `boolean`                     | `true`      | Show zoom control                    |
| `attributionControl`   | `boolean`                     | `true`      | Show attribution control             |
| `rotateControl`        | `boolean`                     | `false`     | Show rotate control                  |
| `mousePositionControl` | `boolean`                     | `false`     | Show mouse position control          |
| `map`                  | `Map &#124; null`             | `null`      | Bindable OpenLayers Map instance     |
| `view`                 | `View &#124; null`            | `null`      | Bindable OpenLayers View instance    |

### Events {.toc}

_Note: Map events are not currently implemented in Map.Root. Use interactions or map instance directly for event handling._

## Map.View {.toc}

Controls the map's viewport including center, zoom, rotation, and projection.

### Basic Usage {.toc}

```svelte
<Map.Root>
	<Map.View center={[-74.0, 40.7]} zoom={10} rotation={0} />
</Map.Root>
```

### Props {.toc}

| Prop                | Type                                      | Default       | Description                         |
| ------------------- | ----------------------------------------- | ------------- | ----------------------------------- |
| `center`            | `[number, number]`                        | `[0, 0]`      | View center coordinates (bindable)  |
| `zoom`              | `number`                                  | `2`           | Zoom level (bindable)               |
| `projection`        | `ProjectionLike`                          | `'EPSG:3857'` | Map projection                      |
| `minZoom`           | `number`                                  | `0`           | Minimum zoom level                  |
| `maxZoom`           | `number`                                  | `28`          | Maximum zoom level                  |
| `rotation`          | `number`                                  | `0`           | View rotation in radians (bindable) |
| `extent`            | `number[]`                                | `undefined`   | Constraining extent                 |
| `constrainRotation` | `boolean &#124; number`                   | `true`        | Constrain rotation                  |
| `enableRotation`    | `boolean`                                 | `true`        | Enable rotation                     |
| `onCenterChange`    | `(center: Coordinate) => void`            | `undefined`   | Center change callback              |
| `onZoomChange`      | `(zoom: number &#124; undefined) => void` | `undefined`   | Zoom change callback                |
| `onRotationChange`  | `(rotation: number) => void`              | `undefined`   | Rotation change callback            |
| `onMoveEnd`         | `(evt: any) => void`                      | `undefined`   | Move end event callback             |

### Reactive Updates {.toc}

```svelte
<script>
	let viewCenter = [-74.0, 40.7]; // NYC
	let viewZoom = 10;

	// Automatically updates map view
	const flyToLocation = (coords, zoom = 15) => {
		viewCenter = coords;
		viewZoom = zoom;
	};
</script>

<Map.Root>
	<Map.View bind:center={viewCenter} bind:zoom={viewZoom} />
</Map.Root>

<button onclick={() => flyToLocation([-118.2, 34.0])}> Fly to Los Angeles </button>
```

## Built-in Controls {.toc}

Map.Root includes built-in controls that can be enabled/disabled via props. Custom control components are not yet implemented.

### Available Controls {.toc}

- **Zoom Control** - Enable with `zoomControl={true}` (default: true)
- **Attribution Control** - Enable with `attributionControl={true}` (default: true)
- **Rotate Control** - Enable with `rotateControl={true}` (default: false)
- **Mouse Position Control** - Enable with `mousePositionControl={true}` (default: false)

### Control Configuration {.toc}

```svelte
<Map.Root
	zoomControl={true}
	attributionControl={true}
	rotateControl={false}
	mousePositionControl={true}
>
	<Map.View />
	<!-- layers -->
</Map.Root>
```

## Advanced Examples {.toc}

### Custom Map Setup {.toc}

```svelte
<script>
	import { Map, Layer, Control } from 'svelte-openlayers';

	let mapCenter = [2.3522, 48.8566]; // Paris
	let mapZoom = 12;

	const handleMapClick = (event) => {
		const coord = event.detail.coordinate;
		console.log('Clicked at:', coord);
	};
</script>

<Map.Root
	bind:center={mapCenter}
	bind:zoom={mapZoom}
	onClick={handleMapClick}
	class="h-[500px] w-full rounded-lg border shadow-lg"
>
	<Map.View minZoom={3} maxZoom={18} />

	<!-- Base layer -->
	<Layer.Tile source="osm" />

	<!-- Controls -->
	<Map.Controls>
		<Control.Zoom />
		<Control.ScaleLine units="metric" />
		<Control.Attribution collapsible />
	</Map.Controls>
</Map.Root>
```

### Multiple Views {.toc}

```svelte
<script>
	let sharedCenter = [0, 0];
</script>

<!-- Main map -->
<Map.Root bind:center={sharedCenter} zoom={5} class="mb-4 h-96">
	<Map.View />
	<Layer.Tile source="osm" />
</Map.Root>

<!-- Overview map with same center -->
<Map.Root bind:center={sharedCenter} zoom={2} class="h-48">
	<Map.View />
	<Layer.Tile source="osm" />
</Map.Root>
```
