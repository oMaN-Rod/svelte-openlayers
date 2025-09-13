# Layer Components

Layers are the foundation for displaying different types of data on your map. Svelte OpenLayers provides components for raster tiles, vector data, and more.

## Layer.Tile {.toc}

Displays raster tile data from various sources like OpenStreetMap, satellite imagery, or custom tile servers.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer } from 'svelte-openlayers';
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
</Map.Root>
```

### Props {.toc}

| Prop           | Type                               | Default     | Description                         |
| -------------- | ---------------------------------- | ----------- | ----------------------------------- |
| `source`       | `'osm' &#124; 'xyz' &#124; Source` | `'osm'`     | Tile source configuration           |
| `url`          | `string`                           | `undefined` | URL for XYZ source                  |
| `opacity`      | `number`                           | `1`         | Layer opacity (0-1)                 |
| `visible`      | `boolean`                          | `true`      | Layer visibility                    |
| `zIndex`       | `number`                           | `undefined` | Layer stacking order                |
| `minZoom`      | `number`                           | `undefined` | Minimum zoom level                  |
| `maxZoom`      | `number`                           | `undefined` | Maximum zoom level                  |
| `preload`      | `number`                           | `0`         | Preload tiles                       |
| `layer`        | `TileLayer &#124; null`            | `null`      | Bindable layer instance (read-only) |
| `attributions` | `string &#124; string[]`           | `undefined` | Layer attributions                  |
| `crossOrigin`  | `string &#124; null`               | `undefined` | Cross-origin setting                |

### Built-in Sources {.toc}

```svelte
<!-- OpenStreetMap -->
<Layer.Tile source="osm" />

<!-- Custom XYZ source -->
<Layer.Tile
	source="xyz"
	url="https://{a - c}.tile.example.com/{z}/{x}/{y}.png"
	attributions="© Example"
/>

<!-- Using OpenLayers source directly -->
<Layer.Tile source={customTileSource} />
```

> **Note:** Currently only 'osm' and 'xyz' string sources are supported. For other sources like satellite imagery, you'll need to create OpenLayers source instances directly.

## Layer.Vector {.toc}

Displays vector data like points, lines, and polygons using Canvas rendering. Container for Feature components. For high-performance rendering of large datasets, consider using LayerWebGL.

### Basic Usage {.toc}

```svelte
<Map.Root>
	<Map.View />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[0, 0]} />
		<Feature.LineString
			coordinates={[
				[0, 0],
				[10, 10]
			]}
		/>
	</Layer.Vector>
</Map.Root>
```

### Props {.toc}

| Prop                     | Type                       | Default     | Description                          |
| ------------------------ | -------------------------- | ----------- | ------------------------------------ |
| `opacity`                | `number`                   | `1`         | Layer opacity (0-1)                  |
| `visible`                | `boolean`                  | `true`      | Layer visibility                     |
| `zIndex`                 | `number`                   | `undefined` | Layer stacking order                 |
| `minZoom`                | `number`                   | `undefined` | Minimum zoom level                   |
| `maxZoom`                | `number`                   | `undefined` | Maximum zoom level                   |
| `style`                  | `StyleLike`                | `undefined` | Default style for features           |
| `updateWhileAnimating`   | `boolean`                  | `false`     | Update during animations             |
| `updateWhileInteracting` | `boolean`                  | `false`     | Update during interactions           |
| `renderBuffer`           | `number`                   | `100`       | Render buffer in pixels              |
| `layer`                  | `VectorLayer &#124; null`  | `null`      | Bindable layer instance (read-only)  |
| `source`                 | `VectorSource &#124; null` | `null`      | Bindable source instance (read-only) |

## Layer.WebGL {.toc}

High-performance WebGL vector layer for rendering large datasets with hardware acceleration. Uses expression-based styling for dynamic, data-driven visualizations.

### Basic Usage {.toc}

```svelte
<Map.Root>
	<Map.View />
	<Layer.Tile source="osm" />
	<LayerWebGL
		style={{
			'circle-radius': 8,
			'circle-fill-color': '#ff0000',
			'circle-stroke-color': '#000000',
			'circle-stroke-width': 1
		}}
	>
		<!-- Features are added programmatically via the source -->
	</LayerWebGL>
</Map.Root>
```

### Props {.toc}

| Prop                  | Type                           | Default     | Description                           |
| --------------------- | ------------------------------ | ----------- | ------------------------------------- |
| `opacity`             | `number`                       | `1`         | Layer opacity (0-1)                   |
| `visible`             | `boolean`                      | `true`      | Layer visibility                      |
| `zIndex`              | `number`                       | `undefined` | Layer stacking order                  |
| `minZoom`             | `number`                       | `undefined` | Minimum zoom level                    |
| `maxZoom`             | `number`                       | `undefined` | Maximum zoom level                    |
| `style`               | `FlatStyleLike`                | `undefined` | WebGL-compatible style definition     |
| `variables`           | `StyleVariables`               | `undefined` | Variables for dynamic styling         |
| `disableHitDetection` | `boolean`                      | `false`     | Disable feature hit detection         |
| `layer`               | `WebGLVectorLayer &#124; null` | `null`      | Bindable layer instance (read-only)   |
| `source`              | `VectorSource &#124; null`     | `null`      | Bindable source instance (read-only)  |

### WebGL Styling {.toc}

LayerWebGL uses OpenLayers' flat style system with expression-based styling for dynamic visualizations:

#### Basic Styles {.toc}

```svelte
<!-- Simple circle style -->
<LayerWebGL
	style={{
		'circle-radius': 6,
		'circle-fill-color': '#4338ca',
		'circle-opacity': 0.8
	}}
/>

<!-- Icon style -->
<LayerWebGL
	style={{
		'icon-src': '/path/to/icon.png',
		'icon-width': 16,
		'icon-height': 16,
		'icon-color': '#ff0000'
	}}
/>

<!-- Triangle/polygon shapes -->
<LayerWebGL
	style={{
		'shape-points': 3,
		'shape-radius': 10,
		'shape-fill-color': '#10b981',
		'shape-rotate-with-view': true
	}}
/>
```

#### Expression-Based Styling {.toc}

WebGL styles support expressions for data-driven visualization:

```svelte
<LayerWebGL
	style={{
		// Size based on feature property
		'circle-radius': [
			'interpolate',
			['linear'],
			['get', 'population'],
			0, 4,
			1000000, 20
		],
		// Color based on feature property
		'circle-fill-color': [
			'case',
			['>', ['get', 'temperature'], 30], '#ff4444',
			['>', ['get', 'temperature'], 20], '#ffaa00',
			'#4444ff'
		],
		// Opacity based on zoom level
		'circle-opacity': [
			'interpolate',
			['linear'],
			['zoom'],
			5, 0.3,
			15, 0.9
		]
	}}
/>
```

#### Animation Support {.toc}

WebGL layers support time-based animations:

```svelte
<script>
	import { onMount } from 'svelte';

	let webglLayer;

	// Start animation loop
	onMount(() => {
		const animate = () => {
			if (webglLayer?.getMapInternal) {
				const map = webglLayer.getMapInternal();
				if (map) {
					map.render();
				}
			}
			requestAnimationFrame(animate);
		};
		animate();
	});
</script>

<LayerWebGL
	bind:layer={webglLayer}
	style={{
		'shape-rotation': ['*', ['time'], 0.01],  // Rotate over time
		'shape-points': 4,
		'shape-radius': 8,
		'shape-fill-color': '#ff6600'
	}}
/>
```

### Performance Considerations {.toc}

- **Use for large datasets**: WebGL layers excel with thousands of features
- **Expression complexity**: Keep expressions simple for better performance
- **Hit detection**: Disable with `disableHitDetection={true}` for purely visual layers
- **Memory management**: WebGL contexts are properly cleaned up on component destroy

### Common Expression Functions {.toc}

| Function      | Description                           | Example                                 |
| ------------- | ------------------------------------- | --------------------------------------- |
| `get`         | Get feature property                  | `['get', 'population']`                 |
| `interpolate` | Interpolate between values            | `['interpolate', ['linear'], input, ...]` |
| `case`        | Conditional styling                   | `['case', condition, value1, value2]`   |
| `match`       | Match specific values                 | `['match', input, value1, result1, ...]` |
| `zoom`        | Current zoom level                    | `['zoom']`                              |
| `time`        | Current time for animations           | `['time']`                              |
| `*`, `+`, `-` | Mathematical operations               | `['*', ['get', 'size'], 2]`             |

> **Coming Soon:** Additional layer types including Layer.VectorTile and Layer.Image are planned for future releases.
