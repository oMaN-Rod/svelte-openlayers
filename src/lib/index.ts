import Map from './components/map/Map.svelte';
import View from './components/view/View.svelte';
export { Map, View };

export type { MapProps, MapViewProps } from './components/map/types.js';
export type { ViewProps } from './components/view/types.js';

export {
	Layer,
	LayerStatic,
	LayerTile,
	LayerVector,
	LayerVectorTile,
	LayerWebGL,
	LayerWebGLTile,
	LayerWebGLVectorTile
} from './components/layers/index.js';
export type {
	LayerContext,
	LayerStaticProps,
	LayerTileProps,
	LayerVectorProps,
	LayerWebGLProps
} from './components/layers/index.js';

export {
	Feature,
	FeatureLineString,
	FeaturePoint,
	FeaturePolygon
} from './components/features/index.js';
export type {
	FeatureLineStringProps,
	FeaturePointProps,
	FeaturePolygonProps
} from './components/features/index.js';

export {
	Interaction,
	InteractionDraw,
	InteractionHover,
	InteractionSelect
} from './components/interactions/index.js';
export type {
	InteractionDrawProps,
	InteractionHoverProps,
	InteractionSelectProps
} from './components/interactions/index.js';

export {
	Overlay,
	OverlayMarker,
	OverlayTooltip,
	TooltipManager
} from './components/overlays/index.js';
export type {
	OverlayMarkerProps,
	OverlayTooltipProps,
	TooltipManagerProps
} from './components/overlays/index.js';

export { Control, ControlDraw } from './components/controls/index.js';
export type { ControlDrawProps, ControlDrawType } from './components/controls/index.js';
export * from './styles/types.js';

export {
	animatedColor,
	animationCycle,
	array,
	between,
	compare,
	// Traditional style utilities
	createCircleStyle,
	createFeatureStyleFunction,
	createFill,
	createIconStyle,
	createStroke,
	createStyle,
	createStyleFromFeature,
	// WebGL style utilities
	createStyleRule,
	createStyleRules,
	createTextStyle,
	get,
	interpolate,
	match,
	math,
	pulseEffect,
	sizeByProperty,
	sizeByZoom,
	time,
	variable,
	zoom
} from './utils/index.js';

// WebGL style types
export type {
	Expression,
	FilteredStyleOptions,
	FlatStyle,
	FlatStyleLike,
	Rule,
	StyleVariables
} from './utils/index.js';
