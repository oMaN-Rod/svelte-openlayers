import type { Feature } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { Snippet } from 'svelte';

/**
 * Event callback types for interactive features
 */
export interface FeatureEventCallbacks {
	onHover?: (feature: Feature, coordinate: Coordinate) => void;
	onHoverEnd?: (feature: Feature) => void;
	onClick?: (feature: Feature, coordinate: Coordinate) => void;
	onSelect?: (feature: Feature) => void;
	onDeselect?: (feature: Feature) => void;
}

/**
 * Style props for interactive features
 */
export interface FeatureInteractiveStyles {
	hoverStyle?: StyleLike | FlatStyleLike;
	selectedStyle?: StyleLike | FlatStyleLike;
}

/**
 * Combined interactive feature props
 */
export interface InteractiveFeatureProps extends FeatureEventCallbacks, FeatureInteractiveStyles {
	children?: Snippet;
}

/**
 * Registration info for a feature in the event registry
 */
export interface FeatureRegistration {
	id: string;
	feature: Feature;
	callbacks: FeatureEventCallbacks;
	styles: FeatureInteractiveStyles;
	originalStyle?: StyleLike | FlatStyleLike;
}

export interface FeaturePointProps extends InteractiveFeatureProps {
	coordinates: Coordinate;
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}

export interface FeatureLineStringProps extends InteractiveFeatureProps {
	coordinates: Coordinate[];
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}

export interface FeaturePolygonProps extends InteractiveFeatureProps {
	coordinates: Coordinate[][];
	projection?: string;
	style?: StyleLike;
	properties?: Record<string, any>;
	feature?: Feature | null;
}
