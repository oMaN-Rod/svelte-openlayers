# API Reference

Complete API documentation for all Svelte OpenLayers components.

## Map Components {.toc}

### View {.toc}

The top-level component that provides the OpenLayers View context to all child components. Wraps the Map component and configures projection, center, zoom, rotation, and extent.

```typescript
interface ViewProps {
	// View positioning
	center?: Coordinate; // bindable, default: [0, 0]
	zoom?: number; // bindable, default: 5
	rotation?: number; // bindable, default: 0
	bbox?: Extent | null; // bindable, current view extent

	// View constraints
	projection?: ProjectionLike; // default: 'EPSG:3857'
	minZoom?: number; // default: 0
	maxZoom?: number; // default: 28
	extent?: Extent; // constraining extent
	constrainRotation?: boolean | number; // default: true
	enableRotation?: boolean; // default: true

	// Event callbacks
	onCenterChange?: (center: Coordinate) => void;
	onZoomChange?: (zoom: number | undefined) => void;
	onRotationChange?: (rotation: number) => void;
	onMoveEnd?: (evt: any) => void;

	// Bindable instance (read-only)
	view?: View | null; // bindable

	// Children
	children?: Snippet;
}
```

### Map {.toc}

The map container component that renders the OpenLayers map and provides map context to child components. Can be placed inside a `View` component (receives view from context) or separately with the `view` prop passed explicitly.

```typescript
interface MapProps extends HTMLAttributes<HTMLDivElement> {
	// Basic styling (inherited from HTMLAttributes)
	class?: string;
	style?: string;

	// View configuration
	view?: View | null; // Optional external view (uses context if not provided)

	// Controls and interactions (OpenLayers DefaultsOptions)
	controls?: ControlOptions; // default: {} (uses OpenLayers defaults)
	interactions?: InteractionOptions; // default: {} (uses OpenLayers defaults)

	// OpenLayers map options
	pixelRatio?: number;
	keyboardEventTarget?: HTMLElement | Document;
	maxTilesLoading?: number; // default: 16
	moveTolerance?: number; // default: 1
	exclusiveHover?: boolean; // default: true - only one feature hovered at a time across all layers

	// Bindable instances (read-only)
	map?: Map | null; // bindable

	// Map events (use lowercase, no 'on' prefix)
	click?: (evt: MapBrowserEvent) => void;
	dblclick?: (evt: MapBrowserEvent) => void;
	pointerdrag?: (evt: MapBrowserEvent) => void;
	pointermove?: (evt: MapBrowserEvent) => void;
	pointerdown?: (evt: MapBrowserEvent) => void;
	pointerup?: (evt: MapBrowserEvent) => void;
	pointerover?: (evt: MapBrowserEvent) => void;
	pointerout?: (evt: MapBrowserEvent) => void;
	pointerenter?: (evt: MapBrowserEvent) => void;
	pointerleave?: (evt: MapBrowserEvent) => void;
	pointercancel?: (evt: MapBrowserEvent) => void;

	// MapEvent handlers
	postrender?: (evt: MapEvent) => void;
	movestart?: (evt: MapEvent) => void;
	moveend?: (evt: MapEvent) => void;
	loadstart?: (evt: MapEvent) => void;
	loadend?: (evt: MapEvent) => void;

	// RenderEvent handlers
	precompose?: (evt: RenderEvent) => void;
	postcompose?: (evt: RenderEvent) => void;
	rendercomplete?: (evt: RenderEvent) => void;

	// Children
	children?: Snippet;
}
```

**Controls and Interactions Configuration**:

The `controls` and `interactions` props accept OpenLayers `DefaultsOptions` objects to configure which default controls/interactions to include:

```typescript
// ControlOptions example
<Map controls={{ zoom: true, rotate: false, attribution: true }}>

// InteractionOptions example
<Map interactions={{ doubleClickZoom: false, dragPan: true }}>
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

### Layer.Static {.toc}

Displays a single static image as a map layer with custom projection and extent. Ideal for non-geographic imagery like floor plans, diagrams, or historical maps.

```typescript
interface LayerStaticProps {
	// Image source (required)
	url: string; // URL of the static image

	// Image extent (required)
	extent: number[]; // [minX, minY, maxX, maxY]

	// Projection
	projection?: ProjectionLike; // Custom projection for the image

	// Layer properties
	opacity?: number; // default: 1 (0-1 range)
	visible?: boolean; // default: true
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;

	// Loading
	preload?: number; // default: 0

	// Attribution
	attributions?: string | string[];

	// Bindable instance (read-only)
	layer?: ImageLayer<any> | null; // bindable
}
```

**Usage Example**:

```svelte
<script>
	import { View, Map, Layer } from 'svelte-openlayers';
	import { Projection } from 'ol/proj.js';

	const extent = [0, 0, 1024, 768];
	const projection = new Projection({
		code: 'pixel-projection',
		units: 'pixels',
		extent
	});
</script>

<View center={[512, 384]} zoom={2} {projection} {extent}>
	<Map class="h-96 w-full">
		<Layer.Static url="/path/to/image.png" {extent} attributions="© Attribution" />
	</Map>
</View>
```

**Key Points**:

- Requires `extent` prop to define image boundaries
- Typically used with custom pixel-based projections
- View projection must match the layer's coordinate system
- Perfect for non-geographic imagery that needs pan/zoom interaction

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

### Layer.WebGL {.toc}

High-performance WebGL vector layer for rendering large point datasets with hardware acceleration.

```typescript
interface LayerWebGLProps {
	// Layer properties
	opacity?: number; // default: 1 (0-1 range)
	visible?: boolean; // default: true
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;

	// WebGL-specific styling
	style?: FlatStyleLike; // Expression-based style definition
	variables?: StyleVariables; // Dynamic style variables

	// Performance options
	disableHitDetection?: boolean; // default: false

	// Bindable instances (read-only)
	layer?: WebGLVectorLayer<any> | null; // bindable
	source?: VectorSource | null; // bindable

	// Children
	children?: Snippet; // For programmatic feature addition
}
```

**Key Differences from Layer.Vector**:

- Uses `FlatStyleLike` instead of `StyleLike` for expression-based styling
- Supports `variables` prop for dynamic style parameters
- Includes `disableHitDetection` for performance optimization
- Optimized for large point datasets (thousands of features)
- Hardware-accelerated rendering via WebGL

**Expression-Based Styling**:

LayerWebGL uses OpenLayers' flat style expressions for dynamic styling:

```typescript
// Example style with expressions
const webglStyle: FlatStyleLike = {
	// Data-driven circle radius
	'circle-radius': ['interpolate', ['linear'], ['get', 'population'], 0, 4, 1000000, 20],
	// Conditional fill color
	'circle-fill-color': [
		'case',
		['>', ['get', 'temperature'], 25],
		'#ff4444',
		['>', ['get', 'temperature'], 15],
		'#ffaa00',
		'#4444ff'
	],
	// Zoom-based opacity
	'circle-opacity': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 15, 0.9]
};
```

**Supported Style Properties**:

- Circle: `circle-radius`, `circle-fill-color`, `circle-stroke-color`, `circle-opacity`
- Icon: `icon-src`, `icon-width`, `icon-height`, `icon-color`, `icon-opacity`
- Shape: `shape-points`, `shape-radius`, `shape-fill-color`, `shape-rotation`
- Common: `filter`, `z-index`

### Coming Soon {.toc}

The following layer types are planned for future releases:

- `Layer.VectorTile` - High-performance vector tiles
- `Layer.WMS` - Web Map Service layers

## Feature Components {.toc}

All feature components must be placed inside a `Layer.Vector` component. Features support interactive event handlers and specialized styles for hover and selection states.

### Interactive Feature Props {.toc}

All feature components share these interactive properties:

```typescript
// Event callbacks
onHover?: (feature: Feature, coordinate: Coordinate) => void;
onHoverEnd?: (feature: Feature) => void;
onClick?: (feature: Feature, coordinate: Coordinate) => void;
onSelect?: (feature: Feature) => void;
onDeselect?: (feature: Feature) => void;

// Interactive styles
hoverStyle?: StyleLike; // Style applied when feature is hovered
selectedStyle?: StyleLike; // Style applied when feature is selected

// Child components
children?: Snippet; // Can contain Overlay.Hover and Overlay.Popup
```

### Feature.Point {.toc}

Point geometry feature for displaying markers, cities, POIs, etc.

```typescript
interface FeaturePointProps {
	// Geometry
	coordinates: Coordinate; // [longitude, latitude]
	projection?: string; // Coordinate projection

	// Styling
	style?: StyleLike;
	hoverStyle?: StyleLike; // NEW: Style when hovered
	selectedStyle?: StyleLike; // NEW: Style when selected

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Interactive events NEW
	onHover?: (feature: Feature, coordinate: Coordinate) => void;
	onHoverEnd?: (feature: Feature) => void;
	onClick?: (feature: Feature, coordinate: Coordinate) => void;
	onSelect?: (feature: Feature) => void;
	onDeselect?: (feature: Feature) => void;

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable

	// Child components NEW
	children?: Snippet; // Can contain Overlay.Hover and Overlay.Popup
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
	hoverStyle?: StyleLike; // NEW: Style when hovered
	selectedStyle?: StyleLike; // NEW: Style when selected

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Interactive events NEW
	onHover?: (feature: Feature, coordinate: Coordinate) => void;
	onHoverEnd?: (feature: Feature) => void;
	onClick?: (feature: Feature, coordinate: Coordinate) => void;
	onSelect?: (feature: Feature) => void;
	onDeselect?: (feature: Feature) => void;

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable

	// Child components NEW
	children?: Snippet; // Can contain Overlay.Hover and Overlay.Popup
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
	hoverStyle?: StyleLike; // NEW: Style when hovered
	selectedStyle?: StyleLike; // NEW: Style when selected

	// Data
	properties?: Record<string, any>; // Feature attributes

	// Interactive events NEW
	onHover?: (feature: Feature, coordinate: Coordinate) => void;
	onHoverEnd?: (feature: Feature) => void;
	onClick?: (feature: Feature, coordinate: Coordinate) => void;
	onSelect?: (feature: Feature) => void;
	onDeselect?: (feature: Feature) => void;

	// Bindable instance (read-only)
	feature?: Feature | null; // bindable

	// Child components NEW
	children?: Snippet; // Can contain Overlay.Hover and Overlay.Popup
}
```

**Important**: Feature event handlers and interactive styles are automatically managed by the layer. For advanced selection workflows, you can also use `Interaction.Select` and `Interaction.Hover` components separately.

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

### Interaction.Draw {.toc}

Enables drawing of vector features (points, lines, polygons, and circles) on the map.

```typescript
interface InteractionDrawProps {
	// Geometry type
	type?: 'Point' | 'LineString' | 'Polygon' | 'Circle'; // bindable, default: 'Point'

	// Source configuration
	source?: VectorSource | null; // bindable, uses layer context if not provided

	// Feature collection
	features?: Collection<Feature> | null; // bindable

	// Drawing behavior
	clickTolerance?: number; // default: 6
	snapTolerance?: number; // default: 12
	stopClick?: boolean; // default: false
	maxPoints?: number; // Max points before auto-finish
	minPoints?: number; // Min points required (default: 3 for polygons, 2 for lines)

	// Drawing conditions
	finishCondition?: Condition; // Custom finish condition
	condition?: Condition; // Event handling condition

	// Freehand drawing
	freehand?: boolean; // default: false
	freehandCondition?: Condition; // Condition for freehand mode

	// Tracing
	trace?: boolean | Condition; // default: false
	traceSource?: VectorSource; // Source for trace features

	// Geometry configuration
	geometryFunction?: GeometryFunction; // Custom geometry creation
	geometryName?: string; // Property name for geometry
	geometryLayout?: 'XY' | 'XYZ' | 'XYM' | 'XYZM'; // default: 'XY'

	// Display options
	style?: StyleLike | FlatStyleLike; // Style for drawing preview
	wrapX?: boolean; // default: false

	// Event callbacks
	onDrawStart?: (evt: DrawEvent) => void;
	onDrawEnd?: (evt: DrawEvent) => void;
	onDrawAbort?: (evt: DrawEvent) => void;

	// Bindable instance (read-only)
	interaction?: Draw | null; // bindable
}
```

**Drawing Types**:

- **Point**: Single click to place
- **LineString**: Click to start, continue clicking, double-click to finish
- **Polygon**: Click to start, continue clicking, double-click to close
- **Circle**: Click and drag to create

**DrawEvent Properties**:

```typescript
interface DrawEvent {
	type: 'drawstart' | 'drawend' | 'drawabort';
	feature: Feature; // The drawn feature
	target: Draw; // The draw interaction instance
}
```

### Interaction.Modify <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

Enables modification of existing vector features by dragging vertices and segments.

```typescript
interface InteractionModifyProps {
	// Features to modify
	features?: Collection<Feature> | Feature[] | null; // bindable, features to edit
	source?: VectorSource | null; // bindable, uses layer context if not provided

	// Styling
	style?: StyleLike; // Style for features while modifying

	// Interaction behavior
	pixelTolerance?: number; // default: 10, hit detection tolerance
	hitDetection?: boolean | Layer[]; // Enable hit detection on layers

	// Conditions (OpenLayers condition functions)
	condition?: Condition; // Condition for modification
	deleteCondition?: Condition; // Condition for deleting vertices (default: Alt+Click)
	insertVertexCondition?: Condition; // Condition for inserting vertices

	// Event callbacks
	onModifyStart?: (evt: ModifyEvent) => void;
	onModifyEnd?: (evt: ModifyEvent) => void;

	// Bindable instance (read-only)
	interaction?: Modify | null; // bindable
}
```

**ModifyEvent Properties**:

```typescript
interface ModifyEvent {
	type: 'modifystart' | 'modifyend';
	features: Collection<Feature>; // Modified features
	mapBrowserEvent: MapBrowserEvent; // Original browser event
	target: Modify; // The modify interaction instance
}
```

**Modification Actions**:

- **Move vertex**: Click and drag a vertex
- **Delete vertex**: Alt+Click on a vertex (or custom `deleteCondition`)
- **Add vertex**: Click and drag a line segment
- **Undo**: Ctrl+Z while modifying

### Coming Soon {.toc}

The following interaction types are planned for future releases:

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

### Overlay.TooltipManager {.toc}

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

### Overlay.Hover {.toc}

Auto-positioned overlay that appears when a parent Feature component is hovered.

```typescript
interface OverlayHoverProps {
	// Positioning (relative to hover coordinate)
	offset?: [number, number]; // default: [0, -10]
	positioning?: OverlayPositioning; // default: 'bottom-center'

	// Styling
	class?: string; // CSS class name

	// Behavior
	autoPan?: boolean; // default: false

	// Children
	children?: Snippet; // Content to display
}
```

**Usage**:

Must be placed inside a Feature component. Automatically appears at the hover coordinate when the feature is hovered.

```svelte
<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }}>
	<Overlay.Hover>
		<div class="tooltip">New York</div>
	</Overlay.Hover>
</Feature.Point>
```

### Overlay.Popup {.toc}

Auto-positioned overlay that appears when a parent Feature component is selected.

```typescript
interface OverlayPopupProps {
	// Positioning (relative to click coordinate)
	offset?: [number, number]; // default: [0, -15]
	positioning?: OverlayPositioning; // default: 'bottom-center'

	// Styling
	class?: string; // CSS class name

	// Behavior
	autoPan?: boolean; // default: true

	// Children
	children?: Snippet; // Content to display
}
```

**Usage**:

Must be placed inside a Feature component. Automatically appears at the click coordinate when the feature is selected.

```svelte
<Feature.Point coordinates={[-74.0, 40.7]} properties={{ name: 'New York' }}>
	<Overlay.Popup>
		<div class="popup">
			<h3>New York</h3>
			<p>Population: 8M</p>
		</div>
	</Overlay.Popup>
</Feature.Point>
```

## Control Components {.toc}

### Control.Draw <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

A comprehensive drawing control toolbar with support for drawing, selecting, and editing features. Optionally includes a feature properties panel.

```typescript
interface ControlDrawProps {
	// Drawing mode
	type?: 'Point' | 'LineString' | 'Polygon' | 'Circle' | 'Select' | null; // bindable

	// Source configuration
	source?: VectorSource | null; // bindable, vector source for drawn features

	// Styling
	style?: StyleLike | FlatStyleLike; // Style for drawn features
	selectStyle?: StyleLike; // Style for selected features

	// Feature panel
	showPropertiesPanel?: boolean; // default: false
	propertiesPanelPosition?: 'left' | 'right'; // default: 'right'
	selectedFeature?: Feature<Geometry> | null; // bindable

	// Event callbacks
	onDrawStart?: (evt: DrawEvent) => void;
	onDrawEnd?: (evt: DrawEvent) => void;
	onDrawAbort?: (evt: DrawEvent) => void;
	onTypeChange?: (type: DrawType) => void;
	onFeatureSelect?: (feature: Feature<Geometry> | null) => void;
	onFeatureModified?: (feature: Feature<Geometry>) => void;
	onFeatureDelete?: (feature: Feature<Geometry>) => void;

	// Bindable instance (read-only)
	control?: Control | null; // bindable
}
```

**Drawing Modes**:

- **Point, LineString, Polygon, Circle**: Standard drawing modes
- **Select**: Select and modify existing features
- **null**: No active mode

**Usage**:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Control.Draw
				type="Point"
				showPropertiesPanel
				onDrawEnd={(evt) => console.log('Drew:', evt.feature)}
				onFeatureModified={(feature) => console.log('Modified:', feature)}
			/>
		</Layer.Vector>
	</Map>
</View>
```

### Control.FeaturePanel <sup class="text-xs font-medium text-amber-600 dark:text-amber-400">Beta</sup> {.toc}

A standalone feature properties editor panel for editing styles and custom properties.

```typescript
interface ControlFeaturePanelProps {
	// Panel configuration
	title?: string; // default: 'Feature Properties'
	feature?: Feature<Geometry> | null; // bindable, feature to edit
	visible?: boolean; // bindable, panel visibility
	position?: 'left' | 'right'; // default: 'right'

	// Event callbacks
	onStyleChange?: (feature: Feature, style: any) => void;
	onPropertyChange?: (feature: Feature, key: string, value: any) => void;
	onDelete?: (feature: Feature) => void;
	onClose?: () => void;

	// Bindable instance (read-only)
	control?: Control | null; // bindable
}
```

**Features**:

- Interactive style editor (fill, stroke, point radius, dash patterns)
- Custom property editor (add, edit, delete properties)
- Delete feature button
- Real-time preview of changes

**Usage**:

```svelte
<script>
	let selectedFeature = $state(null);
	let panelVisible = $state(false);
</script>

<View center={[0, 0]} zoom={2}>
	<Map class="h-96 w-full">
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<Feature.Point coordinates={[0, 0]} />
			<Interaction.Select onSelect={(f) => {
				selectedFeature = f;
				panelVisible = !!f;
			}} />
		</Layer.Vector>

		<Control.FeaturePanel
			bind:feature={selectedFeature}
			bind:visible={panelVisible}
			position="right"
			onStyleChange={(f, style) => console.log('Style changed:', style)}
			onDelete={() => panelVisible = false}
		/>
	</Map>
</View>
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

Components communicate through Svelte's context system. The library uses internal context functions for map and view access that are automatically managed by the component hierarchy.

### How Context Works {.toc}

When you nest components inside `View` and `Map`, they automatically receive access to the OpenLayers instances:

```svelte
<View center={[0, 0]} zoom={2}>
	<Map class="h-96">
		<!-- All child components have access to map and view context -->
		<Layer.Tile source="osm" />
		<Layer.Vector>
			<!-- Feature components access layer context -->
			<Feature.Point coordinates={[0, 0]} />
		</Layer.Vector>
	</Map>
</View>
```

For direct access to OpenLayers instances, use bindable props:

```svelte
<script>
	import type { Map, View } from 'ol';

	let map: Map | null = $state(null);
	let view: View | null = $state(null);
</script>

<View bind:view>
	<Map bind:map>
		<!-- ... -->
	</Map>
</View>
```

### Layer Context {.toc}

```typescript
// Layer context (available to feature components)
interface LayerContext {
	getSource: () => VectorSource | null;
	getLayer: () => VectorLayer<any> | WebGLVectorLayer<any> | null;
	addFeature: (feature: Feature) => void;
	removeFeature: (feature: Feature) => void;
	setStyle: (style: StyleLike | FlatStyleLike) => void;
}
```

## Reactive Properties {.toc}

Many component properties are reactive and bindable:

```svelte
<script>
	import { View, Map, Layer, Feature } from 'svelte-openlayers';

	// Bindable view properties
	let viewInstance = null;
	let center = $state([0, 0]);
	let zoom = $state(2);

	// Bindable map properties
	let mapInstance = null;

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

<View bind:view={viewInstance} bind:center bind:zoom>
	<Map bind:map={mapInstance} class="h-96 w-full">
		<Layer.Tile bind:layer={tileLayer} source="osm" />

		<Layer.Vector bind:layer={vectorLayer} bind:source={vectorSource}>
			<Feature.Point
				bind:feature={pointFeature}
				coordinates={center}
				properties={{ name: 'Map Center' }}
			/>
		</Layer.Vector>
	</Map>
</View>
```

## Utility Functions {.toc}

### createReactiveCollection {.toc}

Creates a reactive wrapper around an OpenLayers `Collection` to enable Svelte 5 reactivity when the collection changes.

```typescript
function createReactiveCollection<T extends Feature>(
	collection: Collection<T>,
	idField?: string
): ReactiveCollection<T>;
```

#### Parameters {.toc}

| Parameter    | Type            | Default | Description                                        |
| ------------ | --------------- | ------- | -------------------------------------------------- |
| `collection` | `Collection<T>` | -       | OpenLayers Collection instance to wrap             |
| `idField`    | `string`        | `'id'`  | Property field name to use for ID-based operations |

#### Return Type {.toc}

```typescript
interface ReactiveCollection<T extends Feature> {
	// Reactive getter that returns the original collection
	get collection(): Collection<T>;

	// Reactive getter that returns the current length
	get length(): number;

	// Reactive getter that returns the array of features
	get array(): T[];

	// Check if collection contains a specific feature
	has(feature: T): boolean;

	// Check if collection contains a feature with specific ID
	hasId(id: string): boolean;
}
```

#### Usage Notes {.toc}

- This utility uses Svelte 5's `createSubscriber` API to listen for Collection events (`add`, `remove`, `clear`)
- All getters and methods trigger reactivity when accessed in reactive contexts
- The wrapper automatically cleans up event listeners when no longer referenced
- Essential for bidirectional binding between OpenLayers Collections and Svelte components
- Commonly used with `Interaction.Select`'s `selectedFeatures` prop for reactive selection state

#### Import {.toc}

```typescript
import { createReactiveCollection } from 'svelte-openlayers/utils';
```

### ReactiveCollection {.toc}

A reactive wrapper around OpenLayers `Collection` that automatically triggers Svelte reactivity. Used by default in all interaction components to provide seamless bidirectional updates.

```typescript
class ReactiveCollection<T extends Feature = Feature> extends Collection<T> {
	constructor(array?: T[], options?: ReactiveCollectionOptions);

	// Reactive getters
	getLength(): number; // Reactive
	getArray(): T[]; // Reactive

	// Convenience methods (all reactive)
	hasFeature(feature: T): boolean;
	hasId(id: string | number): boolean;
	getById(id: string | number): T | undefined;
	toggle(feature: T): boolean;
	replaceAll(items: T[]): void;

	// Interaction binding
	bindInteraction(interaction: any): void;
	unbindInteraction(): void;

	// Static factory methods
	static from<T extends Feature>(
		collection: Collection<T>,
		options?: ReactiveCollectionOptions
	): ReactiveCollection<T>;

	static isReactiveCollection(obj: any): obj is ReactiveCollection;
}
```

#### ReactiveCollectionOptions {.toc}

```typescript
interface ReactiveCollectionOptions {
	// Whether to make the collection reactive (default: true)
	reactive?: boolean;

	// Field to use for ID-based operations (default: 'id')
	idField?: string;
}
```

#### Key Features {.toc}

- **Automatic Reactivity**: All getters trigger Svelte reactivity when accessed
- **Bidirectional Updates**: Changes to the collection automatically dispatch events on bound interactions
- **Performance Optimization**: Can be disabled with `reactive: false` for large datasets
- **OpenLayers Compatibility**: Fully compatible with all OpenLayers Collection methods
- **Smart Event Handling**: Prevents infinite loops by detecting internal vs external changes

#### Import {.toc}

```typescript
import { ReactiveCollection } from 'svelte-openlayers/utils';
```

## Common Projections {.toc}

- `'EPSG:4326'` - WGS84 Geographic (longitude/latitude)
- `'EPSG:3857'` - Web Mercator (default, used by most web maps)
- `'EPSG:3395'` - World Mercator
