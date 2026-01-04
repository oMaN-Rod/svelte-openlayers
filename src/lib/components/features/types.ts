import type { Feature } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { StyleLike } from 'ol/style/Style.js';

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
