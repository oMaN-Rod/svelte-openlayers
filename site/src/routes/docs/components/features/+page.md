# Feature Components

Feature components represent vector geometries that can be displayed, styled, and interacted with on the map. They must be placed inside a `Layer.Vector` component.

## Feature.Point {.toc}

Displays point locations on the map.

### Basic Usage {.toc}

```svelte
<script>
	import { Map, Layer, Feature } from 'svelte-openlayers';
</script>

<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[0, 0]} />
	</Layer.Vector>
</Map.Root>
```

### Props {.toc}

| Prop          | Type                  | Default     | Description                             |
| ------------- | --------------------- | ----------- | --------------------------------------- |
| `coordinates` | `[number, number]`    | `[0, 0]`    | Point coordinates [longitude, latitude] |
| `projection`  | `string`              | `undefined` | Coordinate projection                   |
| `style`       | `StyleLike`           | `undefined` | Point styling                           |
| `properties`  | `Record<string, any>` | `{}`        | Feature properties/attributes           |
| `feature`     | `Feature \| null`     | `null`      | Bindable feature instance (read-only)   |

> **Note:** Feature events are not currently implemented. Use interaction components like Interaction.Select and Interaction.Hover for feature interaction handling.

### Styled Points {.toc}

```svelte
<script>
	const cityStyle = {
		circle: {
			radius: 8,
			fill: { color: '#ff6b6b' },
			stroke: { color: 'white', width: 2 }
		}
	};
</script>

<Layer.Vector>
	<Feature.Point
		coordinates={[-74.0, 40.7]}
		properties={{ name: 'New York', population: 8000000 }}
		style={cityStyle}
	/>

	<Feature.Point
		coordinates={[-118.2, 34.0]}
		properties={{ name: 'Los Angeles', population: 4000000 }}
		style={cityStyle}
	/>
</Layer.Vector>
```

> **Note:** For feature interaction (clicks, hovers), use Interaction.Select and Interaction.Hover components.

## Feature.LineString {.toc}

Displays lines and paths on the map.

### Basic Usage {.toc}

```svelte
<Layer.Vector>
	<Feature.LineString
		coordinates={[
			[-74.0, 40.7], // New York
			[-87.6, 41.9], // Chicago
			[-118.2, 34.0] // Los Angeles
		]}
	/>
</Layer.Vector>
```

### Props {.toc}

| Prop          | Type                      | Default     | Description                           |
| ------------- | ------------------------- | ----------- | ------------------------------------- |
| `coordinates` | `Array<[number, number]>` | `[]`        | Line coordinates                      |
| `projection`  | `string`                  | `undefined` | Coordinate projection                 |
| `style`       | `StyleLike`               | `undefined` | Line styling                          |
| `properties`  | `Record<string, any>`     | `{}`        | Feature properties/attributes         |
| `feature`     | `Feature \| null`         | `null`      | Bindable feature instance (read-only) |

### Route Example {.toc}

```svelte
<script>
	const routeCoordinates = [
		[-74.0, 40.7], // Start: NYC
		[-75.1, 39.9], // Philadelphia
		[-77.0, 38.9], // Washington DC
		[-80.8, 35.2], // Charlotte
		[-84.4, 33.7], // Atlanta
		[-81.7, 30.3] // End: Jacksonville
	];

	const routeStyle = {
		stroke: {
			color: '#2196F3',
			width: 4,
			lineDash: [10, 5]
		}
	};
</script>

<Layer.Vector>
	<Feature.LineString
		coordinates={routeCoordinates}
		style={routeStyle}
		properties={{ name: 'East Coast Route', distance: '1200 miles' }}
	/>
</Layer.Vector>
```

## Feature.Polygon {.toc}

Displays areas and boundaries on the map.

### Basic Usage {.toc}

```svelte
<Layer.Vector>
	<Feature.Polygon
		coordinates={[
			[
				[-74.0, 40.6], // Southwest corner
				[-73.9, 40.6], // Southeast corner
				[-73.9, 40.8], // Northeast corner
				[-74.0, 40.8], // Northwest corner
				[-74.0, 40.6] // Close the ring
			]
		]}
	/>
</Layer.Vector>
```

### Props {.toc}

| Prop          | Type                             | Default     | Description                                 |
| ------------- | -------------------------------- | ----------- | ------------------------------------------- |
| `coordinates` | `Array<Array<[number, number]>>` | `[]`        | Polygon coordinates (exterior ring + holes) |
| `projection`  | `string`                         | `undefined` | Coordinate projection                       |
| `style`       | `StyleLike`                      | `undefined` | Polygon styling                             |
| `properties`  | `Record<string, any>`            | `{}`        | Feature properties/attributes               |
| `feature`     | `Feature \| null`                | `null`      | Bindable feature instance (read-only)       |

### Polygon with Hole {.toc}

```svelte
<script>
	// Outer boundary
	const outerRing = [
		[-74.1, 40.6],
		[-73.8, 40.6],
		[-73.8, 40.9],
		[-74.1, 40.9],
		[-74.1, 40.6]
	];

	// Inner hole
	const innerHole = [
		[-74.0, 40.7],
		[-73.9, 40.7],
		[-73.9, 40.8],
		[-74.0, 40.8],
		[-74.0, 40.7]
	];

	const areaStyle = {
		fill: { color: 'rgba(76, 175, 80, 0.3)' },
		stroke: { color: '#4CAF50', width: 2 }
	};
</script>

<Layer.Vector>
	<Feature.Polygon
		coordinates={[outerRing, innerHole]}
		style={areaStyle}
		properties={{ type: 'park', name: 'Central Park' }}
	/>
</Layer.Vector>
```
