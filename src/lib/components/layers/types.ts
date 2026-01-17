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
import type { FlatStyleLike, StyleVariables } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';
import type { Size } from 'ol/size.js';
import type WebGLTileLayer from 'ol/layer/WebGLTile.js';
import type WebGLVectorTileLayer from 'ol/layer/WebGLVectorTile.js';
import type { Style as WebGLTileStyle } from 'ol/layer/WebGLTile.js';

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

export interface LayerWebGLProps {
	opacity?: number;
	visible?: boolean;
	zIndex?: number;
	minZoom?: number;
	maxZoom?: number;
	style?: FlatStyleLike;
	variables?: StyleVariables;
	hitTolerance?: number;
	layer?: WebGLVectorLayer<any> | null;
	source?: VectorSource | null;
	children?: Snippet;
	disableHitDetection?: boolean;
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

export interface LayerWebGLTileProps {
	/** Tile source: 'osm', 'xyz', or a DataTileSource instance. */
	source?: 'osm' | 'xyz' | Source;
	/** URL template for XYZ tiles. Must include {x}, {y}, {z} placeholders. */
	url?: string;
	/** Array of URL templates for load balancing. */
	urls?: string[];
	/** Layer opacity (0 to 1). */
	opacity?: number;
	/** Layer visibility. */
	visible?: boolean;
	/** Z-index for layer ordering. */
	zIndex?: number;
	/** Minimum zoom level (exclusive) at which layer is visible. */
	minZoom?: number;
	/** Maximum zoom level (inclusive) at which layer is visible. */
	maxZoom?: number;
	/** Number of zoom levels to preload (0 = no preloading). */
	preload?: number;
	/** WebGL tile style for color manipulation (brightness, contrast, saturation, etc.). */
	style?: WebGLTileStyle;
	/** The internal texture cache size. Defaults to 512. */
	cacheSize?: number;
	/** Bindable reference to the OpenLayers layer instance. */
	layer?: WebGLTileLayer | null;
	/** Attribution text for the source. */
	attributions?: string | string[];
	/** Cross-origin setting for image requests. */
	crossOrigin?: string | null;
}

export interface LayerWebGLVectorTileProps {
	/** URL template for vector tiles. Must include {x}, {y}, {z} placeholders. */
	url?: string;
	/** Array of URL templates for load balancing. */
	urls?: string[];
	/** Layer opacity (0 to 1). */
	opacity?: number;
	/** Layer visibility. */
	visible?: boolean;
	/** Z-index for layer ordering. */
	zIndex?: number;
	/** Minimum zoom level (exclusive) at which layer is visible. */
	minZoom?: number;
	/** Maximum zoom level (inclusive) at which layer is visible. */
	maxZoom?: number;
	/** Layer style using flat style syntax (required for WebGL rendering). */
	style?: FlatStyleLike;
	/** Style variables for dynamic styling with expressions. */
	variables?: StyleVariables;
	/** Number of zoom levels to preload (0 = no preloading). */
	preload?: number;
	/** Background color for the layer. */
	background?: string;
	/** Feature format for parsing tiles. Defaults to MVT. */
	format?: FeatureFormat<any>;
	/** Projection for the tile source. Defaults to EPSG:3857. */
	projection?: ProjectionLike;
	/** Tile grid for the source. */
	tileGrid?: TileGrid;
	/** Tile size. Defaults to 512. */
	tileSize?: number | Size;
	/** Maximum zoom for auto-generated tile grid. */
	sourceMaxZoom?: number;
	/** Minimum zoom for auto-generated tile grid. */
	sourceMinZoom?: number;
	/** Whether source geometries may overlap. */
	overlaps?: boolean;
	/** Attribution text for the source. */
	attributions?: string | string[];
	/** Whether to wrap the world horizontally. */
	wrapX?: boolean;
	/** Duration for tile opacity transitions in ms. */
	transition?: number;
	/** Disable hit detection for improved performance. */
	disableHitDetection?: boolean;
	/** Bindable reference to the OpenLayers layer instance. */
	layer?: WebGLVectorTileLayer | null;
	/** Bindable reference to the OpenLayers source instance. */
	source?: VectorTileSource<any> | null;
}
