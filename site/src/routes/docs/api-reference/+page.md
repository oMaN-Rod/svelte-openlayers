# API Reference

Complete API documentation for all Svelte OpenLayers components.

## Map Components {.toc}

### Map.Root {.toc}

Main map container component that creates the OpenLayers Map instance and provides context for child components.

```typescript
interface MapRootProps extends MapProps {
	// Basic styling
	class?: string;
	style?: string;

	// OpenLayers map options
	target?: HTMLElement;
	pixelRatio?: number;
	keyboardEventTarget?: HTMLElement | Document;
	maxTilesLoading?: number;
	moveTolerance?: number;

	// Built-in controls (boolean toggles)
	zoomControl?: boolean; // default: true
	attributionControl?: boolean; // default: true
	rotateControl?: boolean; // default: false
	mousePositionControl?: boolean; // default: false

	// Bindable instances (read-only)
	map?: Map | null; // bindable
	view?: View | null; // bindable

	// Children
	children?: Snippet;
}
```

### Map.View {.toc}

Controls the map viewport including center, zoom, rotation, and projection.

```typescript
interface MapViewProps extends ViewProps {
	// View positioning
	center?: Coordinate; // bindable, default: [0, 0]
	zoom?: number; // bindable, default: 2
	rotation?: number; // bindable, default: 0

	// View constraints
	projection?: ProjectionLike; // default: 'EPSG:3857'
	minZoom?: number; // default: 0
	maxZoom?: number; // default: 28
	extent?: number[];
	constrainRotation?: boolean | number; // default: true
	enableRotation?: boolean; // default: true

	// Event callbacks
	onCenterChange?: (center: Coordinate) => void;
	onZoomChange?: (zoom: number | undefined) => void;
	onRotationChange?: (rotation: number) => void;
	onMoveEnd?: (evt: any) => void;
}
```

## Layer Components {.toc}

### Layer.Tile {.toc}

Displays raster tile layers from various sources.

```typescript
interface LayerTileProps {
	// Source configuration
	source?: 'osm' | 'xyz' | Source; // default: 'osm'
	url?: string; // Required when source='xyz'

	// Layer properties
	opacity?: number; // default: 1 (0-1 range)
	visible?: boolean; // default: true
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;

	// Tile loading
	preload?: number; // default: 0

	// Attribution and CORS
	attributions?: string | string[];
	crossOrigin?: string | null;

	// Bindable instance (read-only)
	layer?: TileLayer<any> | null; // bindable
}
```

**Supported Sources**:

- `'osm'`: OpenStreetMap tiles
- `'xyz'`: Custom XYZ tile server (requires `url` prop)
- OpenLayers Source instance: For advanced use cases

### Layer.Vector {.toc}

Container for vector features with styling and interaction support.

```typescript
interface LayerVectorProps {
	// Layer properties
	opacity?: number; // default: 1 (0-1 range)
	visible?: boolean; // default: true
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;

	// Styling
	style?: StyleLike; // Default style for all features

	// Performance options
	updateWhileAnimating?: boolean; // default: false
	updateWhileInteracting?: boolean; // default: false
	renderBuffer?: number; // default: 100

	// Bindable instances (read-only)
	layer?: VectorLayer<any> | null; // bindable
	source?: VectorSource | null; // bindable

	// Children
	children?: Snippet; // Feature components
}
```

### Coming Soon {.toc}

The following layer types are planned for future releases:

- `Layer.VectorTile` - High-performance vector tiles
- `Layer.Image` - Static georeferenced images
- `Layer.WMS` - Web Map Service layers

## Feature Components {.toc}

All feature components must be placed inside a `Layer.Vector` component.

### Feature.Point {.toc}

Point geometry feature for displaying markers, cities, POIs, etc.

```typescript
interface FeaturePointProps {
	// Geometry
	coordinates: Coordinate; // [longitude, latitude]
	projection?: string; // Coordinate projection

	// Styling
	style?: StyleLike;

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable
}
```

### Feature.LineString {.toc}

Line geometry feature for displaying routes, paths, boundaries, etc.

```typescript
interface FeatureLineStringProps {
	// Geometry
	coordinates: Coordinate[]; // Array of [longitude, latitude] pairs
	projection?: string; // Coordinate projection

	// Styling
	style?: StyleLike;

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable
}
```

### Feature.Polygon {.toc}

Polygon geometry feature for displaying areas, regions, buildings, etc.

```typescript
interface FeaturePolygonProps {
	// Geometry (supports holes)
	coordinates: Coordinate[][]; // [exterior_ring, hole1, hole2, ...]
	projection?: string; // Coordinate projection

	// Styling
	style?: StyleLike;

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable
}
```

**Important**: Feature events (onClick, onPointerEnter, etc.) are **not implemented**. Use `Interaction.Select` and `Interaction.Hover` components for feature interaction.

### More Feature types Coming Soon {.toc}

## Interaction Components {.toc}

### Interaction.Select {.toc}

Enables users to select features by clicking. Provides styling for selected features.

```typescript
interface InteractionSelectProps {
	// Selection behavior
	multi?: boolean; // default: false (single selection)
	hitTolerance?: number; // Hit detection tolerance in pixels

	// Filtering
	layers?: Layer[]; // Limit selection to specific layers
	filter?: any; // Feature filter function

	// Conditions (OpenLayers condition functions)
	addCondition?: any; // Condition for adding to selection
	removeCondition?: any; // Condition for removing from selection
	toggleCondition?: any; // Condition for toggling selection

	// Styling
	style?: StyleLike; // Style for selected features

	// Events
	onSelect?: (features: Feature[]) => void; // Selection change callback

	// Bindable instances (read-only)
	interaction?: any; // bindable Select interaction
	selectedFeatures?: any; // bindable Collection<Feature>
}
```

### Interaction.Hover {.toc}

Detects when the pointer hovers over features. Provides hover callbacks.

```typescript
interface InteractionHoverProps {
	// Event callbacks
	onHover?: (feature: Feature | null, coordinate?: Coordinate) => void;
	onHoverEnd?: () => void;

	// Filtering
	layers?: Layer[]; // Limit hover to specific layers
	hitTolerance?: number; // Hit detection tolerance in pixels

	// Bindable instance (read-only)
	interaction?: any | null; // bindable
}
```

### Coming Soon {.toc}

The following interaction types are planned for future releases:

- `Interaction.Draw` - Drawing new features
- `Interaction.Modify` - Editing existing features
- `Interaction.Translate` - Moving features by dragging
- `Interaction.Snap` - Snapping while drawing/editing

## Overlay Components {.toc}

### Overlay.Tooltip {.toc}

Displays HTML content positioned at map coordinates. Ideal for tooltips and info windows.

```typescript
interface OverlayTooltipProps {
	// Positioning
	position?: Coordinate; // Anchor coordinates
	positioning?: OverlayPositioning; // default: 'bottom-center'
	offset?: [number, number]; // Pixel offset

	// Content
	content?: string; // Text content
	visible?: boolean; // default: true

	// Styling
	class?: string; // CSS class name

	// Behavior
	autoPan?: boolean; // default: false

	// Bindable instance (read-only)
	overlay?: Overlay | null; // bindable

	// Children (alternative to content prop)
	children?: Snippet;
}
```

### TooltipManager {.toc}

High-level component that automatically manages tooltips for hover and select interactions.

```typescript
interface TooltipManagerProps {
	// Feature filtering
	layers?: Layer[]; // Layers to show tooltips for
	hitTolerance?: number; // Hit detection tolerance

	// Tooltip types
	hoverTooltip?: boolean; // Enable hover tooltips
	selectTooltip?: boolean; // Enable selection tooltips

	// Content generation (use either functions or snippets)
	hoverContent?: (feature: Feature) => string;
	selectContent?: (feature: Feature) => string;
	hoverSnippet?: Snippet<[Feature]>; // Svelte snippet for hover content
	selectSnippet?: Snippet<[Feature]>; // Svelte snippet for select content

	// Positioning
	hoverPositioning?: OverlayPositioning; // default: 'top-center'
	selectPositioning?: OverlayPositioning; // default: 'bottom-center'

	// Styling
	hoverClass?: string; // CSS class for hover tooltips
	selectClass?: string; // CSS class for select tooltips
	selectStyle?: StyleLike; // Style for selected features

	// Children
	children?: Snippet;
}
```

## Type Definitions {.toc}

### Positioning {.toc}

```typescript
type OverlayPositioning =
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'
	| 'center-left'
	| 'center-center'
	| 'center-right'
	| 'top-left'
	| 'top-center'
	| 'top-right';
```

### Style Objects {.toc}

Svelte OpenLayers supports simplified style objects that are converted to OpenLayers styles:

```typescript
interface Style {
	fill?: {
		color?: string; // CSS color
	};
	stroke?: {
		color?: string; // CSS color
		width?: number; // Line width in pixels
		lineDash?: number[]; // Dash pattern
		lineCap?: 'butt' | 'round' | 'square';
		lineJoin?: 'round' | 'bevel' | 'miter';
	};
	circle?: {
		radius?: number; // Circle radius in pixels
		fill?: { color?: string };
		stroke?: {
			color?: string;
			width?: number;
		};
	};
	text?: {
		text?: string; // Text content
		font?: string; // CSS font
		fill?: { color?: string };
		stroke?: {
			color?: string;
			width?: number;
		};
		offsetX?: number;
		offsetY?: number;
		textAlign?: 'left' | 'center' | 'right';
		textBaseline?: 'top' | 'middle' | 'bottom';
	};
	image?: {
		src?: string;
		scale?: number;
		opacity?: number;
		rotation?: number;
		anchor?: [number, number];
		anchorXUnits?: 'fraction' | 'pixels';
		anchorYUnits?: 'fraction' | 'pixels';
	};
}

// Style can also be a function
type StyleFunction = (feature: Feature, resolution: number) => Style | Style[];
```

## Context API {.toc}

Components communicate through Svelte's context system:

```typescript
// Map context (available to all child components)
type MapContext = {
	getMap: () => Map | null;
	getView: () => View | null;
	addLayer: (layer: Layer) => void;
	removeLayer: (layer: Layer) => void;
	addInteraction: (interaction: Interaction) => void;
	removeInteraction: (interaction: Interaction) => void;
	addControl: (control: Control) => void;
	removeControl: (control: Control) => void;
	addOverlay: (overlay: Overlay) => void;
	removeOverlay: (overlay: Overlay) => void;
};

// Layer context (available to feature components)
interface LayerContext {
	getSource: () => VectorSource | null;
	getLayer: () => VectorLayer<any> | null;
	addFeature: (feature: Feature) => void;
	removeFeature: (feature: Feature) => void;
	setStyle: (style: StyleLike) => void;
}
```

## Reactive Properties {.toc}

Many component properties are reactive and bindable:

```svelte
<script>
	import { Map, Layer, Feature } from 'svelte-openlayers';

	// Bindable map properties
	let mapInstance = null;
	let viewInstance = null;
	let center = [0, 0];
	let zoom = 2;

	// Bindable layer properties
	let tileLayer = null;
	let vectorLayer = null;
	let vectorSource = null;

	// Bindable feature properties
	let pointFeature = null;

	// Watch for changes
	$inspect('Map center changed:', center);
	$inspect('Zoom level:', zoom);
</script>

<Map.Root bind:map={mapInstance} bind:view={viewInstance}>
	<Map.View bind:center bind:zoom />

	<Layer.Tile bind:layer={tileLayer} source="osm" />

	<Layer.Vector bind:layer={vectorLayer} bind:source={vectorSource}>
		<Feature.Point
			bind:feature={pointFeature}
			coordinates={center}
			properties={{ name: 'Map Center' }}
		/>
	</Layer.Vector>
</Map.Root>
```

## Common Projections {.toc}

- `'EPSG:4326'` - WGS84 Geographic (longitude/latitude)
- `'EPSG:3857'` - Web Mercator (default, used by most web maps)
- `'EPSG:3395'` - World Mercator
