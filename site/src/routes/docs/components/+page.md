# Components Overview

Svelte OpenLayers provides a comprehensive set of components for building interactive maps. All components follow consistent patterns and are fully composable.

## Core Components {.toc}

### Map Components {.toc}

The foundation of every map application:

- **Map.Root** - Main map container and context provider
- **Map.View** - Controls viewport (center, zoom, rotation)
- **Map.Controls** - Built-in map controls (zoom, scale, etc.)

### Layer Components {.toc}

Display different types of data on your map:

- **Layer.Tile** - Raster tile layers (OSM, XYZ, WMS)
- **Layer.Vector** - Vector data layers with Canvas rendering
- **Layer.WebGL** - High-performance WebGL vector layers for large datasets
- **Layer.VectorTile** - Vector tile layers for performance
- **Layer.Image** - Static image layers

### Feature Components {.toc}

Vector geometries that can be displayed and interacted with:

- **Feature.Point** - Point locations
- **Feature.LineString** - Lines and paths
- **Feature.Polygon** - Areas and boundaries
- **Feature.Circle** - Circular areas
- **Feature.MultiPoint** - Multiple points as one feature

### Interaction Components {.toc}

Handle user interactions with the map:

- **Interaction.Select** - Feature selection
- **Interaction.Draw** - Drawing new features
- **Interaction.Modify** - Editing existing features
- **Interaction.Translate** - Moving features

### Overlay Components {.toc}

Display HTML content positioned on the map:

- **Overlay.Popup** - Information popups
- **Overlay.Tooltip** - Hover tooltips

## Component Patterns {.toc}

### Composable Structure {.toc}

All components follow a consistent, nestable structure:

```svelte
<Map.Root>
	<Map.View center={[0, 0]} zoom={2} />
	<Layer.Tile source="osm" />
	<Layer.Vector>
		<Feature.Point coordinates={[0, 0]} />
	</Layer.Vector>
	<!-- High-performance WebGL layer for large datasets -->
	<Layer.WebGL style={{ 'circle-radius': 8, 'circle-fill-color': '#ff0000' }} />
	<Overlay.TooltipManager />
</Map.Root>
```

### Reactive Properties {.toc}

Component properties are reactive and bindable:

```svelte
<script>
	let center = [0, 0];
	let zoom = 2;
</script>

<Map.Root class="h-full w-full">
	<!-- Map automatically updates when center or zoom change -->
	<Map.View bind:center={mapCenter} bind:zoom={mapZoom} />
	<Layer.Tile source="osm" />
</Map.Root>
```

### Event Handling {.toc}

Components emit standard events with OpenLayers data:

```svelte
<Interaction.Select onSelect={(event) => console.log('Selected:', event.detail.features)} />
```

### Styling {.toc}

Multiple ways to style map features:

```svelte
<!-- Inline styles -->
<Feature.Point coordinates={[0, 0]} style={{ fill: 'red', stroke: { color: 'blue', width: 2 } }} />

<!-- Style functions -->
<Feature.Point coordinates={[0, 0]} style={(feature) => getStyleForFeature(feature)} />

<!-- CSS classes (for overlays) -->
<Overlay.Popup class="custom-popup">Content here</Overlay.Popup>
```

## TypeScript Support {.toc}

All components are fully typed with TypeScript:

```typescript
import type { MapRootProps, FeaturePointProps } from 'svelte-openlayers';

// Props are properly typed
const mapProps: MapRootProps = {
	center: [0, 0],
	zoom: 2,
	projection: 'EPSG:4326'
};
```
