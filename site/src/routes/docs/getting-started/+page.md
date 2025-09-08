# Getting Started

Welcome to Svelte OpenLayers! This guide will help you get up and running with interactive maps in your Svelte application.

## Installation {.toc}

Install Svelte OpenLayers using your preferred package manager:

```bash
# Using npm
npm install svelte-openlayers

# Using pnpm
pnpm add svelte-openlayers

# Using bun
bun add svelte-openlayers
```

## Quick Start {.toc}

Here's a simple example to get you started:

```svelte
<script>
	import { Map, Layer } from 'svelte-openlayers';
</script>

<Map.Root class="h-96 w-full">
	<Map.View center={[-74.0, 40.7]} zoom={10} />
	<Layer.Tile source="osm" />
</Map.Root>
```

This creates a basic map centered on New York City with an OpenStreetMap tile layer.

## Core Concepts {.toc}

- **Composable Components**: Build maps using nested Svelte components
- **Reactive Properties**: Map properties automatically sync with Svelte state
- **Context-Based**: Components communicate through Svelte's context API
- **Type-Safe**: Full TypeScript support with proper type inference

## What's Currently Available {.toc}

Svelte OpenLayers is in active development. Here's what's currently implemented:

### Components
- **Map**: `Map.Root`, `Map.View`
- **Layers**: `Layer.Tile`, `Layer.Vector`
- **Features**: `Feature.Point`, `Feature.LineString`, `Feature.Polygon`
- **Interactions**: `Interaction.Select`, `Interaction.Hover`
- **Overlays**: `Overlay.Tooltip`, `TooltipManager`

### Coming Soon
- Additional layer types (VectorTile, Image, WMS)
- Drawing and editing interactions
- Popup overlays and custom markers
- Control components
- Animation utilities
