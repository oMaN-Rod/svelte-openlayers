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

Displays vector data like points, lines, and polygons. Container for Feature components.

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

> **Coming Soon:** Additional layer types including Layer.VectorTile and Layer.Image are planned for future releases.
