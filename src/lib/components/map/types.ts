import type { Map, MapBrowserEvent, MapEvent, View } from 'ol';
import type { DefaultsOptions as ControlOptions } from 'ol/control/defaults.js';
import type { DefaultsOptions as InteractionOptions } from 'ol/interaction/defaults.js';
import type RenderEvent from 'ol/render/Event.js';
import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { ViewProps } from '$lib/components/view/types.js';

export interface MapProps extends HTMLAttributes<HTMLDivElement> {
	controls?: ControlOptions;
	interactions?: InteractionOptions;
	pixelRatio?: number;
	keyboardEventTarget?: HTMLElement;
	maxTilesLoading?: number;
	moveTolerance?: number;
	click?: (evt: MapBrowserEvent) => void;
	dblclick?: (evt: MapBrowserEvent) => void;
	pointerdrag?: (evt: MapBrowserEvent) => void;
	pointermove?: (evt: MapBrowserEvent) => void;
	pointerdown?: (evt: MapBrowserEvent) => void;
	pointerup?: (evt: MapBrowserEvent) => void;
	pointerover?: (evt: MapBrowserEvent) => void;
	pointerout?: (evt: MapBrowserEvent) => void;
	pointerenter?: (evt: MapBrowserEvent) => void;
	pointerleave?: (evt: MapBrowserEvent) => void;
	pointercancel?: (evt: MapBrowserEvent) => void;
	postrender?: (evt: MapEvent) => void;
	movestart?: (evt: MapEvent) => void;
	moveend?: (evt: MapEvent) => void;
	loadstart?: (evt: MapEvent) => void;
	loadend?: (evt: MapEvent) => void;
	precompose?: (evt: RenderEvent) => void;
	postcompose?: (evt: RenderEvent) => void;
	rendercomplete?: (evt: RenderEvent) => void;
	children?: Snippet;
	map?: Map | null;
	view?: View | null;
}

export interface MapViewProps extends ViewProps {}
