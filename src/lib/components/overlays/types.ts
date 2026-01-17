import type { Collection, Feature, Overlay } from 'ol';
import type { FeatureLike } from 'ol/Feature.js';
import type { Coordinate } from 'ol/coordinate.js';
import type { Interaction } from 'ol/interaction.js';
import type Layer from 'ol/layer/Layer.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';

/**
 * Positioning options for overlays
 */
export type OverlayPositioning =
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'
	| 'center-left'
	| 'center-center'
	| 'center-right'
	| 'top-left'
	| 'top-center'
	| 'top-right';

export interface OverlayTooltipProps {
	position?: Coordinate;
	content?: string;
	visible?: boolean;
	offset?: [number, number];
	positioning?: OverlayPositioning;
	class?: string;
	autoPan?: boolean;
	overlay?: Overlay | null;
	children?: Snippet;
}

/**
 * Props for Overlay.Hover - shows when parent Feature is hovered
 */
export interface OverlayHoverProps {
	offset?: [number, number];
	positioning?: OverlayPositioning;
	class?: string;
	autoPan?: boolean;
	children?: Snippet;
}

/**
 * Props for Overlay.Popup - shows when parent Feature is selected
 */
export interface OverlayPopupProps {
	offset?: [number, number];
	positioning?: OverlayPositioning;
	class?: string;
	autoPan?: boolean;
	children?: Snippet;
}

/**
 * Props for Overlay.Marker - always visible HTML marker at feature position
 * Use this to render custom HTML/CSS as the visual representation of a feature
 */
export interface OverlayMarkerProps {
	/** Offset in pixels from the feature coordinate. Default: [0, 0] */
	offset?: [number, number];
	/** How the overlay is positioned relative to the coordinate. Default: 'center-center' */
	positioning?: OverlayPositioning;
	/** Additional CSS classes for the marker container */
	class?: string;
	/** Whether to pan the map to show the marker when it's added. Default: false */
	autoPan?: boolean;
	/** Whether the overlay should stop event propagation. Default: true */
	stopEvent?: boolean;
	/** Bindable reference to the underlying OpenLayers Overlay */
	overlay?: Overlay | null;
	/** Svelte snippet for the marker content (HTML/components) */
	children?: Snippet;
}

export interface TooltipManagerProps {
	layers?: Layer[];
	hitTolerance?: number;
	hoverTooltip?: boolean;
	selectTooltip?: boolean;
	hoverContent?: (feature: FeatureLike) => string;
	selectContent?: (feature: FeatureLike) => string;
	hoverSnippet?: Snippet<[FeatureLike]>;
	selectSnippet?: Snippet<[FeatureLike]>;
	hoverPositioning?: OverlayPositioning;
	selectPositioning?: OverlayPositioning;
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
