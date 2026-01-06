import type { Collection, Feature, Overlay } from 'ol';
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
 * Props for Overlay.Click - shows when parent Feature is selected
 */
export interface OverlayPopupProps {
	offset?: [number, number];
	positioning?: OverlayPositioning;
	class?: string;
	autoPan?: boolean;
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
