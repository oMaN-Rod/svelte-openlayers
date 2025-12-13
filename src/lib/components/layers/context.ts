import { getContext, setContext } from 'svelte';
import { LAYER_CONTEXT_KEY, type LayerContext } from '$lib/types.js';

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
