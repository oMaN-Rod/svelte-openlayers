import { createContext } from 'svelte';
import { type LayerContext } from './types.js';

const [getLayer, setLayerContext] = createContext<LayerContext>();

function getLayerContext() {
	try {
		return getLayer();
	} catch {
		console.warn(
			'Layer context not found. Make sure to use components that depend on it within a Layer.Vector or Layer.WebGL.'
		);
		return undefined;
	}
}

export { setLayerContext, getLayerContext };
