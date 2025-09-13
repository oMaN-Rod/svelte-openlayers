import type { Collection, Feature, Map, Overlay, View } from 'ol';
import type Control from 'ol/control/Control.js';
import type { Coordinate } from 'ol/coordinate.js';
import type { Geometry } from 'ol/geom.js';
import type Interaction from 'ol/interaction/Interaction.js';
import type Layer from 'ol/layer/Layer.js';
import type TileLayer from 'ol/layer/Tile.js';
import type VectorLayer from 'ol/layer/Vector.js';
import type { ProjectionLike } from 'ol/proj.js';
import type Source from 'ol/source/Source.js';
import type VectorSource from 'ol/source/Vector.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';

export const MAP_CONTEXT_KEY = Symbol('map-ctx');
export const LAYER_CONTEXT_KEY = Symbol('layer-ctx');

export type MapContext = {
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

export type ViewProps = {
	center?: Coordinate;
	zoom?: number;
	projection?: ProjectionLike;
	minZoom?: number;
	maxZoom?: number;
	rotation?: number;
	extent?: number[];
	constrainRotation?: boolean | number;
	enableRotation?: boolean;
	onCenterChange?: (center: Coordinate) => void;
	onZoomChange?: (zoom: number | undefined) => void;
	onRotationChange?: (rotation: number) => void;
	onMoveEnd?: (evt: any) => void;
};

export type MapProps = {
	class?: string;
	style?: string;
	target?: HTMLElement;
	pixelRatio?: number;
	keyboardEventTarget?: HTMLElement | Document;
	maxTilesLoading?: number;
	moveTolerance?: number;
	view?: View | null;
};

export interface LayerContext {
	getSource: () => VectorSource | null;
	getLayer: () => VectorLayer<any> | null;
	addFeature: (feature: Feature) => void;
	removeFeature: (feature: Feature) => void;
	setStyle: (style: StyleLike) => void;
}

// Component Props Types

// Map Component Props
export interface MapRootProps extends MapProps {
	children?: Snippet;
	map?: Map | null;
	view?: View | null;
	zoomControl?: boolean;
	attributionControl?: boolean;
	rotateControl?: boolean;
	mousePositionControl?: boolean;
}

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

export interface LayerVectorProps {
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	style?: StyleLike | StyleLike[] | Record<string, any>;
	updateWhileAnimating?: boolean;
	updateWhileInteracting?: boolean;
	renderBuffer?: number;
	layer?: VectorLayer<any> | null;
	source?: VectorSource | null;
	children?: Snippet;
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
