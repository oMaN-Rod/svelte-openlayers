import type { Map, View, Overlay, Feature } from 'ol';
import type { ProjectionLike } from 'ol/proj.js';
import type { Coordinate } from 'ol/coordinate.js';
import type Layer from 'ol/layer/Layer.js';
import type Interaction from 'ol/interaction/Interaction.js';
import type Control from 'ol/control/Control.js';
import type VectorSource from 'ol/source/Vector.js';
import type VectorLayer from 'ol/layer/Vector.js';
import type { StyleLike } from 'ol/style/Style.js';

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
