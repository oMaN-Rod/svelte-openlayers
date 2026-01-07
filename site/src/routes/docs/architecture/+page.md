---
title: Architecture
---

# Architecture

Svelte OpenLayers follows an **event-driven architecture** where OpenLayers events are the source of truth, ensuring predictable behavior and preventing circular dependencies.

## Core Principles {.toc}

### 1. Composable Design {.toc}

Components follow consistent patterns with independently importable, tree-shakeable modules:

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

### 2. Event-Driven Updates {.toc}

OpenLayers events drive Svelte state updates, not the other way around.

### 3. Context-Based Communication {.toc}

Components communicate through Svelte's context API:

- Simple `getMap()` and `getView()` context functions
- Auto-registration with parent contexts
- Consistent interfaces across component types

## Component Hierarchy {.toc}

```
View                         # Controls viewport (center, zoom, rotation), provides ViewContext
└── Map                      # Main container, provides map context
    ├── Layer.Tile           # Tile layers (OSM, XYZ sources)
    ├── Layer.Vector         # Vector layers container
    │   ├── Feature.Point    # Point geometries
    │   ├── Feature.LineString # Line geometries
    │   └── Feature.Polygon  # Polygon geometries
    ├── Layer.WebGL          # High-performance WebGL vector layers
    ├── Interaction.Select   # Feature selection
    ├── Interaction.Hover    # Feature hover detection
    ├── Interaction.Draw     # Drawing new features
    ├── Control.Draw         # Drawing control toolbar
    └── Overlay.TooltipManager # Helper component for tooltips
```
