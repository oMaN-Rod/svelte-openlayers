import type { Collection, Feature, Map, Overlay, View } from 'ol';
import type Control from 'ol/control/Control.js';
import type { Coordinate } from 'ol/coordinate.js';
import type { Geometry } from 'ol/geom.js';
import type Interaction from 'ol/interaction/Interaction.js';
import type Layer from 'ol/layer/Layer.js';
import type TileLayer from 'ol/layer/Tile.js';
import type ImageLayer from 'ol/layer/Image.js';
import type VectorLayer from 'ol/layer/Vector.js';
import type WebGLVectorLayer from 'ol/layer/WebGLVector.js';
import type MapBrowserEvent from 'ol/MapBrowserEvent.js';
import type MapEvent from 'ol/MapEvent.js';
import type { ProjectionLike } from 'ol/proj.js';
import type RenderEvent from 'ol/render/Event.js';
import type Source from 'ol/source/Source.js';
import type VectorSource from 'ol/source/Vector.js';
import type { FlatStyleLike, StyleVariables } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';
import type { Extent } from 'ol/extent.js';
import type { HTMLAttributes } from 'svelte/elements';
import type { DefaultsOptions as ControlOptions } from 'ol/control/defaults.js';
import type { DefaultsOptions as InteractionOptions } from 'ol/interaction/defaults.js';

export const LAYER_CONTEXT_KEY = Symbol('layer-ctx');
export interface ViewProps {
	view?: null | View;
	bbox?: null | Extent;
	center?: Coordinate;
	zoom?: number;
	projection?: ProjectionLike;
	minZoom?: number;
	maxZoom?: number;
	rotation?: number;
	extent?: Extent;
	constrainRotation?: boolean | number;
	enableRotation?: boolean;
	onCenterChange?: (center: Coordinate) => void;
	onZoomChange?: (zoom: number | undefined) => void;
	onRotationChange?: (rotation: number) => void;
	onMoveEnd?: (evt: any) => void;
	children?: Snippet;
}

export interface MapProps extends HTMLAttributes<HTMLDivElement> {
	controls?: ControlOptions;
	interactions?: InteractionOptions;
	pixelRatio?: number;
	keyboardEventTarget?: HTMLElement;
	maxTilesLoading?: number;
	moveTolerance?: number;
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
	postrender?: (evt: MapEvent) => void;
	movestart?: (evt: MapEvent) => void;
	moveend?: (evt: MapEvent) => void;
	loadstart?: (evt: MapEvent) => void;
	loadend?: (evt: MapEvent) => void;
	precompose?: (evt: RenderEvent) => void;
	postcompose?: (evt: RenderEvent) => void;
	rendercomplete?: (evt: RenderEvent) => void;
	children?: Snippet;
	map?: Map | null;
	view?: View | null;
}
export interface LayerContext {
	getSource: () => VectorSource | null;
	getLayer: () => VectorLayer<any> | WebGLVectorLayer<any> | null;
	addFeature: (feature: Feature) => void;
	removeFeature: (feature: Feature) => void;
	setStyle: (style: StyleLike | FlatStyleLike) => void;
}

// Component Props Types

export interface MapViewProps extends ViewProps {}

// Layer Component Props
export interface LayerTileProps {
	source?: 'osm' | 'xyz' | Source;
	url?: string;
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	preload?: number;
	layer?: TileLayer<any> | null;
	attributions?: string | string[];
	crossOrigin?: string | null;
}

export interface LayerStaticProps {
	url: string;
	extent: Extent;
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	preload?: number;
	layer?: ImageLayer<any> | null;
	attributions?: string | string[];
	projection?: ProjectionLike;
}

export interface LayerVectorProps {
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	style?: StyleLike | FlatStyleLike;
	updateWhileAnimating?: boolean;
	updateWhileInteracting?: boolean;
	renderBuffer?: number;
	layer?: VectorLayer<any> | null;
	source?: VectorSource | null;
	children?: Snippet;
}

export interface LayerWebGLProps {
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	style?: FlatStyleLike;
	variables?: StyleVariables;
	layer?: WebGLVectorLayer<any> | null;
	source?: VectorSource | null;
	children?: Snippet;
	disableHitDetection?: boolean;
}

// Feature Component Props
export interface FeaturePointProps {
	coordinates: Coordinate;
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}

export interface FeatureLineStringProps {
	coordinates: Coordinate[];
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}

export interface FeaturePolygonProps {
	coordinates: Coordinate[][];
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}

// Interaction Component Props
export interface InteractionSelectProps {
	style?: StyleLike;
	layers?: Layer[];
	filter?: any; // FilterFunction from ol/interaction/Select
	multi?: boolean;
	hitTolerance?: number;
	addCondition?: any;
	removeCondition?: any;
	toggleCondition?: any;
	onSelect?: (features: Feature<Geometry>[]) => void;
	interaction?: Interaction | null;
	selectedFeatures?: Collection<Feature<Geometry>> | null;
	reactive?: boolean;
}

export interface InteractionHoverProps {
	onHover?: (feature: Feature | null, coordinate?: Coordinate) => void;
	onHoverEnd?: () => void;
	layers?: Layer[];
	hitTolerance?: number;
	interaction?: any | null;
}

export interface InteractionDrawProps {
	type: 'Point' | 'LineString' | 'Polygon' | 'Circle';
	source: VectorSource | null;
	features?: Collection<Feature<Geometry>> | null;
	clickTolerance?: number;
	snapTolerance?: number;
	stopClick?: boolean;
	maxPoints?: number;
	minPoints?: number;
	finishCondition?: any;
	style?: StyleLike | FlatStyleLike;
	geometryFunction?: any;
	geometryName?: string;
	condition?: any;
	freehand?: boolean;
	freehandCondition?: any;
	trace?: boolean | any;
	traceSource?: VectorSource;
	wrapX?: boolean;
	geometryLayout?: 'XY' | 'XYZ' | 'XYM' | 'XYZM';
	onDrawStart?: (evt: any) => void;
	onDrawEnd?: (evt: any) => void;
	onDrawAbort?: (evt: any) => void;
	interaction?: Interaction | null;
}

// Control Component Props
export interface ControlDrawProps {
	type?: 'Point' | 'LineString' | 'Polygon' | 'Circle';
	source?: VectorSource | null;
	style?: StyleLike | FlatStyleLike;
	control?: Control | null;
	onDrawStart?: (evt: any) => void;
	onDrawEnd?: (evt: any) => void;
	onDrawAbort?: (evt: any) => void;
	onTypeChange?: (type: 'Point' | 'LineString' | 'Polygon' | 'Circle') => void;
}

// Overlay Component Props
export interface OverlayTooltipProps {
	position?: Coordinate;
	content?: string;
	visible?: boolean;
	offset?: [number, number];
	positioning?:
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
		| 'center-left'
		| 'center-center'
		| 'center-right'
		| 'top-left'
		| 'top-center'
		| 'top-right';
	class?: string;
	autoPan?: boolean;
	overlay?: Overlay | null;
	children?: Snippet;
}

export interface TooltipManagerProps {
	layers?: Layer[];
	hitTolerance?: number;
	hoverTooltip?: boolean;
	selectTooltip?: boolean;
	hoverContent?: (feature: Feature) => string;
	selectContent?: (feature: Feature) => string;
	hoverSnippet?: Snippet<[Feature]>;
	selectSnippet?: Snippet<[Feature]>;
	hoverPositioning?:
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
		| 'center-left'
		| 'center-center'
		| 'center-right'
		| 'top-left'
		| 'top-center'
		| 'top-right';
	selectPositioning?:
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
		| 'center-left'
		| 'center-center'
		| 'center-right'
		| 'top-left'
		| 'top-center'
		| 'top-right';
	hoverClass?: string;
	selectClass?: string;
	selectStyle?: StyleLike;
	selectInteraction?: Interaction | null;
	hoverInteraction?: Interaction | null;
	selectedFeatures?: Collection<Feature> | null;
	multi?: boolean;
	reactive?: boolean;
	children?: Snippet;
}

// Built in Icons
export interface IconProps {
	width?: number;
	height?: number;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	class?: string;
	style?: string;
}
