---
title: Architecture
---

# Architecture

Svelte OpenLayers follows an **event-driven architecture** where OpenLayers events are the source of truth, ensuring predictable behavior and preventing circular dependencies.

## Core Principles {.toc}

### 1. Composable Design {.toc}

Components follow consistent patterns with independently importable, tree-shakeable modules:

```svelte
<Map.Root>
	<Map.View />
	<Layer.Vector>
		<Feature.Point />
	</Layer.Vector>
	<Interaction.Select />
</Map.Root>
```

### 2. Event-Driven Updates {.toc}

OpenLayers events drive Svelte state updates, not the other way around.

### 3. Context-Based Communication {.toc}

Components communicate through Svelte's context API:

- `MapContext` - Shared by all map components
- Auto-registration with parent contexts
- Consistent interfaces across component types

## Component Hierarchy {.toc}

```
Map.Root                     # Main container, provides MapContext
├── Map.View                 # Controls view (center, zoom, rotation)
├── Layer.Tile               # Tile layers (OSM, XYZ sources)
├── Layer.Vector             # Vector layers container
│   ├── Feature.Point        # Point geometries
│   ├── Feature.LineString   # Line geometries
│   └── Feature.Polygon      # Polygon geometries
├── Interaction.Select       # Feature selection
├── Interaction.Hover        # Feature hover
└── TooltipManager           # Helper component that manages selection and hover interactions automatically
```
