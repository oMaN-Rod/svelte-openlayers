import type { Feature } from 'ol';
import type { Extent } from 'ol/extent.js';
import type ImageLayer from 'ol/layer/Image.js';
import type TileLayer from 'ol/layer/Tile.js';
import type VectorLayer from 'ol/layer/Vector.js';
import type WebGLVectorLayer from 'ol/layer/WebGLVector.js';
import type { ProjectionLike } from 'ol/proj.js';
import type { Source } from 'ol/source.js';
import type VectorSource from 'ol/source/Vector.js';
import type { FlatStyleLike, StyleVariables } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';

export interface LayerContext {
	getSource: () => VectorSource | null;
	getLayer: () => VectorLayer<any> | WebGLVectorLayer<any> | null;
	addFeature: (feature: Feature) => void;
	removeFeature: (feature: Feature) => void;
	setStyle: (style: StyleLike | FlatStyleLike) => void;
}

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
