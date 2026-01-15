import type { Feature } from 'ol';
import type { Extent } from 'ol/extent.js';
import type FeatureFormat from 'ol/format/Feature.js';
import type ImageLayer from 'ol/layer/Image.js';
import type TileLayer from 'ol/layer/Tile.js';
import type VectorLayer from 'ol/layer/Vector.js';
import type VectorTileLayer from 'ol/layer/VectorTile.js';
import type WebGLVectorLayer from 'ol/layer/WebGLVector.js';
import type { ProjectionLike } from 'ol/proj.js';
import type { Source } from 'ol/source.js';
import type VectorSource from 'ol/source/Vector.js';
import type VectorTileSource from 'ol/source/VectorTile.js';
import type TileGrid from 'ol/tilegrid/TileGrid.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';
import type { Size } from 'ol/size.js';

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
	crossOrigin?: string | null;
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
	hitTolerance?: number;
	layer?: VectorLayer<any> | null;
	source?: VectorSource | null;
	children?: Snippet;
}

export type VectorTileRenderType = 'hybrid' | 'vector';

export interface LayerVectorTileProps {
	url?: string;
	urls?: string[];
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	style?: StyleLike | FlatStyleLike | null;
	declutter?: boolean | string | number;
	renderMode?: VectorTileRenderType;
	preload?: number;
	renderBuffer?: number;
	updateWhileAnimating?: boolean;
	updateWhileInteracting?: boolean;
	background?: string;
	format?: FeatureFormat<any>;
	projection?: ProjectionLike;
	tileGrid?: TileGrid;
	tileSize?: number | Size;
	sourceMaxZoom?: number;
	sourceMinZoom?: number;
	overlaps?: boolean;
	attributions?: string | string[];
	wrapX?: boolean;
	transition?: number;
	layer?: VectorTileLayer | null;
	source?: VectorTileSource<any> | null;
}
