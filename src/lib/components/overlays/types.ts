import type { Collection, Feature, Overlay } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { Interaction } from 'ol/interaction.js';
import type Layer from 'ol/layer/Layer.js';
import type { StyleLike } from 'ol/style/Style.js';
import type { Snippet } from 'svelte';

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
