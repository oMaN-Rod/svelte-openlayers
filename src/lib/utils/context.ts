import { getContext, setContext } from 'svelte';
import {
	LAYER_CONTEXT_KEY,
	MAP_CONTEXT_KEY,
	type LayerContext,
	type MapContext
} from '../types.js';

export function setMapContext(context: MapContext): void {
	setContext(MAP_CONTEXT_KEY, context);
}

export function getMapContext(): MapContext {
	const context = getContext<MapContext>(MAP_CONTEXT_KEY);
	if (!context) {
		throw new Error('Map context not found. Make sure component is used within Map.Root');
	}
	return context;
}

export function setLayerContext(context: LayerContext): void {
	setContext(LAYER_CONTEXT_KEY, context);
}

export function getLayerContext(feature: string): LayerContext {
	const context = getContext<LayerContext>(LAYER_CONTEXT_KEY);

	if (!context) {
		throw new Error(`Feature ${feature} must be used within LayerVector`);
	}

	return context;
}
