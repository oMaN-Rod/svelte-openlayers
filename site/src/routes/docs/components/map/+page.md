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

Map.Root supports comprehensive event handling for map interactions. All events receive the appropriate OpenLayers event object.

#### MapBrowserEvent Handlers {.toc}

Handle pointer and mouse interactions with the map:

```svelte
<Map.Root
	onSingleclick={handleSingleClick}
	onPointermove={handlePointerMove}
	onPointerdown={handlePointerDown}
>
	<Map.View />
</Map.Root>
```

| Event Handler      | Type                              | Description                    |
| ------------------ | --------------------------------- | ------------------------------ |
| `onSingleclick`    | `(evt: MapBrowserEvent) => void`  | Single click event             |
| `onClick`          | `(evt: MapBrowserEvent) => void`  | Click event                    |
| `onDblclick`       | `(evt: MapBrowserEvent) => void`  | Double click event             |
| `onPointerdrag`    | `(evt: MapBrowserEvent) => void`  | Pointer drag event             |
| `onPointermove`    | `(evt: MapBrowserEvent) => void`  | Pointer move event             |
| `onPointerdown`    | `(evt: MapBrowserEvent) => void`  | Pointer down event             |
| `onPointerup`      | `(evt: MapBrowserEvent) => void`  | Pointer up event               |
| `onPointerover`    | `(evt: MapBrowserEvent) => void`  | Pointer over event             |
| `onPointerout`     | `(evt: MapBrowserEvent) => void`  | Pointer out event              |
| `onPointerenter`   | `(evt: MapBrowserEvent) => void`  | Pointer enter event            |
| `onPointerleave`   | `(evt: MapBrowserEvent) => void`  | Pointer leave event            |
| `onPointercancel`  | `(evt: MapBrowserEvent) => void`  | Pointer cancel event           |

#### MapEvent Handlers {.toc}

Handle map lifecycle and navigation events:

```svelte
<Map.Root
	onMovestart={handleMoveStart}
	onMoveend={handleMoveEnd}
	onLoadend={handleLoadEnd}
>
	<Map.View />
</Map.Root>
```

| Event Handler   | Type                         | Description                    |
| --------------- | ---------------------------- | ------------------------------ |
| `onPostrender`  | `(evt: MapEvent) => void`    | After map rendering            |
| `onMovestart`   | `(evt: MapEvent) => void`    | Map movement starts            |
| `onMoveend`     | `(evt: MapEvent) => void`    | Map movement ends              |
| `onLoadstart`   | `(evt: MapEvent) => void`    | Map loading starts             |
| `onLoadend`     | `(evt: MapEvent) => void`    | Map loading ends               |

#### RenderEvent Handlers {.toc}

Handle rendering lifecycle events:

```svelte
<Map.Root
	onPrecompose={handlePreCompose}
	onPostcompose={handlePostCompose}
	onRendercomplete={handleRenderComplete}
>
	<Map.View />
</Map.Root>
```

| Event Handler       | Type                           | Description                    |
| ------------------- | ------------------------------ | ------------------------------ |
| `onPrecompose`      | `(evt: RenderEvent) => void`   | Before layer composition       |
| `onPostcompose`     | `(evt: RenderEvent) => void`   | After layer composition        |
| `onRendercomplete`  | `(evt: RenderEvent) => void`   | Rendering complete             |

#### Event Usage Examples {.toc}

```svelte
<script>
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

<Map.Root
	onSingleclick={handleClick}
	onPointermove={handlePointerMove}
	onMoveend={handleMoveEnd}
>
	<Map.View />
	<!-- layers and other components -->
</Map.Root>
```

## Map.View {.toc}

Controls the map's viewport including center, zoom, rotation, and projection.

### Basic Usage {.toc}

```svelte
<script>
	import { Map } from 'svelte-openlayers';
</script>

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
