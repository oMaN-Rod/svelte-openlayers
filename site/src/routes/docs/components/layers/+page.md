# Layer Components

Layers are the foundation for displaying different types of data on your map. Svelte OpenLayers provides components for raster tiles, vector data, and more.

## Layer.Tile {.toc}

Displays raster tile data from various sources like OpenStreetMap, satellite imagery, or custom tile servers.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
	</Map>
</View>
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

## Layer.Static {.toc}

Displays a single static image as a map layer with a custom projection and extent. Perfect for annotated maps, diagrams, floor plans, or historical imagery that doesn't use standard geographic coordinates.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
	import { Projection } from 'ol/proj.js';

	const extent = [0, 0, 1024, 968];
	const projection = new Projection({
		code: 'custom-image',
		units: 'pixels',
		extent
	});
</script>

<View center={[512, 484]} zoom={2} {projection}>
	<Map class="h-96 w-full">
		<Layer.Static url="https://example.com/image.png" {extent} attributions="© Example" />
	</Map>
</View>
```

### Props {.toc}

| Prop           | Type                     | Default     | Description                           |
| -------------- | ------------------------ | ----------- | ------------------------------------- |
| `url`          | `string`                 | required    | URL of the static image               |
| `extent`       | `number[]`               | required    | Image extent [minX, minY, maxX, maxY] |
| `projection`   | `ProjectionLike`         | `undefined` | Custom projection for the image       |
| `opacity`      | `number`                 | `1`         | Layer opacity (0-1)                   |
| `visible`      | `boolean`                | `true`      | Layer visibility                      |
| `zIndex`       | `number`                 | `undefined` | Layer stacking order                  |
| `minZoom`      | `number`                 | `undefined` | Minimum zoom level                    |
| `maxZoom`      | `number`                 | `undefined` | Maximum zoom level                    |
| `preload`      | `number`                 | `0`         | Preload the image                     |
| `layer`        | `ImageLayer &#124; null` | `null`      | Bindable layer instance (read-only)   |
| `attributions` | `string &#124; string[]` | `undefined` | Layer attributions                    |
| `crossOrigin`  | `string &#124; null`     | `undefined` | Cross-origin setting for CORS         |

### Use Cases {.toc}

- **Historical Maps**: Display georeferenced historical maps or documents
- **Floor Plans**: Show indoor maps with pixel-based coordinates
- **Diagrams**: Visualize network diagrams, infographics, or annotated images
- **Game Maps**: Display game world maps or level layouts
- **Custom Graphics**: Show any static image that needs pan/zoom interaction

### Custom Projections {.toc}

Static layers typically use custom pixel-based projections:

```svelte
<script>
	import { Projection } from 'ol/proj.js';

	// Define the image dimensions and create projection
	const extent = [0, 0, 1024, 768]; // [left, bottom, right, top]
	const projection = new Projection({
		code: 'pixel-projection',
		units: 'pixels',
		extent: extent
	});
</script>

<View center={[512, 384]} zoom={2} {projection} {extent}>
	<Map class="h-96 w-full">
		<Layer.Static url="/path/to/image.png" {extent} attributions="© Your Attribution" />
	</Map>
</View>
```

## Layer.Vector {.toc}

Displays vector data like points, lines, and polygons using Canvas rendering. Container for Feature components. For high-performance rendering of large datasets, consider using LayerWebGL.

### Basic Usage {.toc}

```svelte
<View>
	<Map class="h-96 w-full">
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
	</Map>
</View>
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
<View>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.WebGL
			style={{
				'circle-radius': 8,
				'circle-fill-color': '#ff0000',
				'circle-stroke-color': '#000000',
				'circle-stroke-width': 1
			}}
		>
			<!-- Features are added programmatically via the source -->
		</Layer.WebGL>
	</Map>
</View>
```

### Props {.toc}

| Prop                  | Type                           | Default     | Description                          |
| --------------------- | ------------------------------ | ----------- | ------------------------------------ |
| `opacity`             | `number`                       | `1`         | Layer opacity (0-1)                  |
| `visible`             | `boolean`                      | `true`      | Layer visibility                     |
| `zIndex`              | `number`                       | `undefined` | Layer stacking order                 |
| `minZoom`             | `number`                       | `undefined` | Minimum zoom level                   |
| `maxZoom`             | `number`                       | `undefined` | Maximum zoom level                   |
| `style`               | `FlatStyleLike`                | `undefined` | WebGL-compatible style definition    |
| `variables`           | `StyleVariables`               | `undefined` | Variables for dynamic styling        |
| `disableHitDetection` | `boolean`                      | `false`     | Disable feature hit detection        |
| `layer`               | `WebGLVectorLayer &#124; null` | `null`      | Bindable layer instance (read-only)  |
| `source`              | `VectorSource &#124; null`     | `null`      | Bindable source instance (read-only) |

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
		'circle-radius': ['interpolate', ['linear'], ['get', 'population'], 0, 4, 1000000, 20],
		// Color based on feature property
		'circle-fill-color': [
			'case',
			['>', ['get', 'temperature'], 30],
			'#ff4444',
			['>', ['get', 'temperature'], 20],
			'#ffaa00',
			'#4444ff'
		],
		// Opacity based on zoom level
		'circle-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 15, 0.9]
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
		'shape-rotation': ['*', ['time'], 0.01], // Rotate over time
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

| Function      | Description                 | Example                                   |
| ------------- | --------------------------- | ----------------------------------------- |
| `get`         | Get feature property        | `['get', 'population']`                   |
| `interpolate` | Interpolate between values  | `['interpolate', ['linear'], input, ...]` |
| `case`        | Conditional styling         | `['case', condition, value1, value2]`     |
| `match`       | Match specific values       | `['match', input, value1, result1, ...]`  |
| `zoom`        | Current zoom level          | `['zoom']`                                |
| `time`        | Current time for animations | `['time']`                                |
| `*`, `+`, `-` | Mathematical operations     | `['*', ['get', 'size'], 2]`               |

## Layer.VectorTile {.toc}

Displays vector tile data using Canvas rendering. Vector tiles are an efficient format that delivers pre-tiled vector data, combining the benefits of vector data (styling flexibility, interaction) with tile-based loading (efficiency, scalability).

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.VectorTile
			url="https://example.com/tiles/{z}/{x}/{y}.pbf"
			style={{
				'fill-color': '#eee',
				'stroke-color': '#666',
				'stroke-width': 1
			}}
		/>
	</Map>
</View>
```

### Props {.toc}

| Prop                     | Type                                   | Default     | Description                                  |
| ------------------------ | -------------------------------------- | ----------- | -------------------------------------------- |
| `url`                    | `string`                               | `undefined` | URL template for vector tiles                |
| `urls`                   | `string[]`                             | `undefined` | Array of URL templates for load balancing    |
| `opacity`                | `number`                               | `1`         | Layer opacity (0-1)                          |
| `visible`                | `boolean`                              | `true`      | Layer visibility                             |
| `zIndex`                 | `number`                               | `undefined` | Layer stacking order                         |
| `minZoom`                | `number`                               | `undefined` | Minimum zoom level                           |
| `maxZoom`                | `number`                               | `undefined` | Maximum zoom level                           |
| `style`                  | `StyleLike &#124; FlatStyleLike`       | `undefined` | Feature styling                              |
| `declutter`              | `boolean &#124; string &#124; number`  | `false`     | Declutter text and icons                     |
| `renderMode`             | `'hybrid' &#124; 'vector'`             | `'hybrid'`  | Rendering mode                               |
| `preload`                | `number`                               | `0`         | Number of zoom levels to preload             |
| `renderBuffer`           | `number`                               | `100`       | Render buffer in pixels                      |
| `updateWhileAnimating`   | `boolean`                              | `false`     | Update during animations                     |
| `updateWhileInteracting` | `boolean`                              | `false`     | Update during interactions                   |
| `background`             | `string`                               | `undefined` | Layer background color                       |
| `format`                 | `FeatureFormat`                        | `MVT`       | Tile format (defaults to MapBox Vector Tile) |
| `projection`             | `ProjectionLike`                       | `undefined` | Source projection                            |
| `tileGrid`               | `TileGrid`                             | `undefined` | Custom tile grid                             |
| `tileSize`               | `number &#124; Size`                   | `undefined` | Tile size                                    |
| `sourceMaxZoom`          | `number`                               | `undefined` | Maximum source zoom level                    |
| `sourceMinZoom`          | `number`                               | `undefined` | Minimum source zoom level                    |
| `overlaps`               | `boolean`                              | `undefined` | Whether geometries may overlap               |
| `attributions`           | `string &#124; string[]`               | `undefined` | Layer attributions                           |
| `wrapX`                  | `boolean`                              | `undefined` | Wrap world horizontally                      |
| `transition`             | `number`                               | `undefined` | Tile opacity transition duration (ms)        |
| `layer`                  | `VectorTileLayer &#124; null`          | `null`      | Bindable layer instance                      |
| `source`                 | `VectorTileSource &#124; null`         | `null`      | Bindable source instance                     |

### Styling Vector Tiles {.toc}

Vector tiles support both traditional OpenLayers styles and flat style syntax:

```svelte
<script>
	// Flat style for countries layer
	const countryStyle = {
		'fill-color': ['match', ['get', 'continent'],
			'Europe', '#4338ca',
			'Asia', '#dc2626',
			'Africa', '#16a34a',
			'#gray'
		],
		'stroke-color': '#333',
		'stroke-width': 1
	};
</script>

<Layer.VectorTile url={tilesUrl} style={countryStyle} />
```

## Layer.WebGLTile {.toc}

WebGL-accelerated tile layer for high-performance raster tile rendering with color manipulation capabilities.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.WebGLTile source="osm" />
	</Map>
</View>
```

### Props {.toc}

| Prop           | Type                               | Default     | Description                                 |
| -------------- | ---------------------------------- | ----------- | ------------------------------------------- |
| `source`       | `'osm' &#124; 'xyz' &#124; Source` | `'osm'`     | Tile source configuration                   |
| `url`          | `string`                           | `undefined` | URL for XYZ source                          |
| `urls`         | `string[]`                         | `undefined` | Array of URLs for load balancing            |
| `opacity`      | `number`                           | `1`         | Layer opacity (0-1)                         |
| `visible`      | `boolean`                          | `true`      | Layer visibility                            |
| `zIndex`       | `number`                           | `undefined` | Layer stacking order                        |
| `minZoom`      | `number`                           | `undefined` | Minimum zoom level                          |
| `maxZoom`      | `number`                           | `undefined` | Maximum zoom level                          |
| `preload`      | `number`                           | `0`         | Number of zoom levels to preload            |
| `style`        | `WebGLTileStyle`                   | `undefined` | WebGL style for color manipulation          |
| `cacheSize`    | `number`                           | `512`       | Internal texture cache size                 |
| `layer`        | `WebGLTileLayer &#124; null`       | `null`      | Bindable layer instance                     |
| `attributions` | `string &#124; string[]`           | `undefined` | Layer attributions                          |
| `crossOrigin`  | `string &#124; null`               | `undefined` | Cross-origin setting                        |

### WebGL Tile Styling {.toc}

Apply color manipulation to tiles using WebGL expressions:

```svelte
<Layer.WebGLTile
	source="osm"
	style={{
		color: [
			'color',
			['band', 1],  // Red channel
			['band', 2],  // Green channel
			['band', 3],  // Blue channel
			['band', 4]   // Alpha channel
		],
		brightness: 0.1,
		contrast: 1.2,
		saturation: 0.8
	}}
/>
```

## Layer.WebGLVectorTile {.toc}

WebGL-accelerated vector tile layer for maximum performance rendering of vector tile data. Ideal for large-scale visualizations with data-driven styling.

> <strong>Note:</strong> Hit detection (hover/click) is not yet implemented for WebGLVectorTileLayer in OpenLayers. For interactive features, use the regular <code>Layer.VectorTile</code> component instead.

### Basic Usage {.toc}

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';

	const style = {
		'fill-color': ['interpolate', ['linear'], ['get', 'population'],
			0, '#ffffcc',
			1000000, '#ff0000'
		],
		'stroke-color': '#333',
		'stroke-width': 0.5
	};
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.WebGLVectorTile
			url="https://example.com/tiles/{z}/{x}/{y}.pbf"
			{style}
		/>
	</Map>
</View>
```

### Props {.toc}

| Prop                  | Type                           | Default     | Description                                  |
| --------------------- | ------------------------------ | ----------- | -------------------------------------------- |
| `url`                 | `string`                       | `undefined` | URL template for vector tiles                |
| `urls`                | `string[]`                     | `undefined` | Array of URL templates for load balancing    |
| `opacity`             | `number`                       | `1`         | Layer opacity (0-1)                          |
| `visible`             | `boolean`                      | `true`      | Layer visibility                             |
| `zIndex`              | `number`                       | `undefined` | Layer stacking order                         |
| `minZoom`             | `number`                       | `undefined` | Minimum zoom level                           |
| `maxZoom`             | `number`                       | `undefined` | Maximum zoom level                           |
| `style`               | `FlatStyleLike`                | `undefined` | WebGL-compatible style (required)            |
| `variables`           | `StyleVariables`               | `undefined` | Variables for dynamic styling                |
| `preload`             | `number`                       | `0`         | Number of zoom levels to preload             |
| `background`          | `string`                       | `undefined` | Layer background color                       |
| `format`              | `FeatureFormat`                | `MVT`       | Tile format (defaults to MapBox Vector Tile) |
| `projection`          | `ProjectionLike`               | `undefined` | Source projection                            |
| `tileGrid`            | `TileGrid`                     | `undefined` | Custom tile grid                             |
| `tileSize`            | `number &#124; Size`           | `undefined` | Tile size                                    |
| `sourceMaxZoom`       | `number`                       | `undefined` | Maximum source zoom level                    |
| `sourceMinZoom`       | `number`                       | `undefined` | Minimum source zoom level                    |
| `overlaps`            | `boolean`                      | `undefined` | Whether geometries may overlap               |
| `attributions`        | `string &#124; string[]`       | `undefined` | Layer attributions                           |
| `wrapX`               | `boolean`                      | `undefined` | Wrap world horizontally                      |
| `transition`          | `number`                       | `undefined` | Tile opacity transition duration (ms)        |
| `disableHitDetection` | `boolean`                      | `false`     | Disable hit detection for performance        |
| `layer`               | `WebGLVectorTileLayer &#124; null` | `null`  | Bindable layer instance                      |
| `source`              | `VectorTileSource &#124; null` | `null`      | Bindable source instance                     |

### Dynamic Styling with Variables {.toc}

Use style variables to create interactive, data-driven visualizations:

```svelte
<script>
	let minYear = $state(1900);
	let maxYear = $state(2000);

	const style = {
		filter: ['all',
			['>=', ['get', 'year'], ['var', 'minYear']],
			['<=', ['get', 'year'], ['var', 'maxYear']]
		],
		'circle-radius': 6,
		'circle-fill-color': '#ff6600'
	};

	const variables = $derived({
		minYear,
		maxYear
	});
</script>

<Layer.WebGLVectorTile
	url={tilesUrl}
	{style}
	{variables}
/>

<input type="range" bind:value={minYear} min={1800} max={2024} />
<input type="range" bind:value={maxYear} min={1800} max={2024} />
```

### Performance Considerations {.toc}

- **Use for large datasets**: WebGL vector tiles excel with millions of features
- **Style variables**: Use `variables` prop for dynamic filtering without re-rendering
- **Hit detection**: Disable with `disableHitDetection={true}` for purely visual layers
- **Preloading**: Use `preload` to load surrounding tiles for smoother panning
