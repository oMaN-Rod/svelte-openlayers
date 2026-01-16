import Map from './components/map/Map.svelte';
import View from './components/view/View.svelte';
export { Map, View };

export type { MapProps, MapViewProps } from './components/map/types.js';
export type { ViewProps } from './components/view/types.js';

export {
	Layer,
	LayerTile,
	LayerVector,
	LayerWebGL,
	LayerStatic
} from './components/layers/index.js';
export type {
	LayerContext,
	LayerTileProps,
	LayerStaticProps,
	LayerVectorProps,
	LayerWebGLProps
} from './components/layers/index.js';

export {
	Feature,
	FeaturePoint,
	FeatureLineString,
	FeaturePolygon
} from './components/features/index.js';
export type {
	FeaturePointProps,
	FeatureLineStringProps,
	FeaturePolygonProps
} from './components/features/index.js';

export {
	Interaction,
	InteractionSelect,
	InteractionHover,
	InteractionDraw
} from './components/interactions/index.js';
export type {
	InteractionSelectProps,
	InteractionHoverProps,
	InteractionDrawProps
} from './components/interactions/index.js';

export {
	Overlay,
	OverlayTooltip,
	OverlayMarker,
	TooltipManager
} from './components/overlays/index.js';
export type {
	OverlayTooltipProps,
	OverlayMarkerProps,
	TooltipManagerProps
} from './components/overlays/index.js';

export { Control, ControlDraw } from './components/controls/index.js';
export type { ControlDrawProps, ControlDrawType } from './components/controls/index.js';
export * from './styles/types.js';

export {
	// Traditional style utilities
	createCircleStyle,
	createFeatureStyleFunction,
	createFill,
	createIconStyle,
	createStroke,
	createStyle,
	createStyleFromFeature,
	createTextStyle,
	// WebGL style utilities
	createStyleRule,
	createStyleRules,
	get,
	variable,
	time,
	zoom,
	interpolate,
	between,
	compare,
	match,
	math,
	array,
	animationCycle,
	pulseEffect,
	animatedColor,
	sizeByProperty,
	sizeByZoom
} from './utils/index.js';

// WebGL style types
export type {
	FlatStyleLike,
	FlatStyle,
	Rule,
	StyleVariables,
	Expression,
	FilteredStyleOptions
} from './utils/index.js';
