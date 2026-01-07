# Components Overview

Svelte OpenLayers provides a comprehensive set of components for building interactive maps. All components follow consistent patterns and are fully composable.

## Core Components {.toc}

### Map Components {.toc}

The foundation of every map application:

- **View** - Controls viewport (center, zoom, rotation, projection) and provides context
- **Map** - Main map container that renders the map

### Layer Components {.toc}

Display different types of data on your map:

- **Layer.Tile** - Raster tile layers (OSM, XYZ)
- **Layer.Vector** - Vector data layers with Canvas rendering
- **Layer.WebGL** - High-performance WebGL vector layers for large datasets
- **Layer.Static** - Static image layers with custom projections

### Feature Components {.toc}

Vector geometries that can be displayed and interacted with:

- **Feature.Point** - Point locations
- **Feature.LineString** - Lines and paths
- **Feature.Polygon** - Areas and boundaries

### Interaction Components {.toc}

Handle user interactions with the map:

- **Interaction.Select** - Feature selection
- **Interaction.Hover** - Feature hover detection
- **Interaction.Draw** - Drawing new features
- **Interaction.Modify** - Modify existing features

### Control Components {.toc}

Map control UI components:

- **Control.Draw** - Comprehensive drawing control with toolbar and properties panel
- **Control.FeaturePanel** - Standalone feature properties editor

### Overlay Components {.toc}

Display HTML content positioned on the map:

- **Overlay.Tooltip** - Tooltips anchored to coordinates
- **Overlay.Hover** - Auto-positioned hover overlays for features
- **Overlay.Popup** - Auto-positioned popup overlays for selected features
- **Overlay.TooltipManager** - Automatic tooltip management for hover/select

## Component Patterns {.toc}

### Composable Structure {.toc}

All components follow a consistent, nestable structure:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map>
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Feature.Point coordinates={[0, 0]} />
		</Layer.Vector>
		<!-- High-performance WebGL layer for large datasets -->
		<Layer.WebGL style={{ 'circle-radius': 8, 'circle-fill-color': '#ff0000' }} />
		<Overlay.TooltipManager />
	</Map>
</View>
```

### Reactive Properties {.toc}

Component properties are reactive and bindable:

```svelte
<script>
	let center = $state([0, 0]);
	let zoom = $state(2);
</script>

<View bind:center bind:zoom>
	<Map class="h-full w-full">
		<!-- Map automatically updates when center or zoom change -->
		<Layer.Tile source="osm" />
	</Map>
</View>
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
