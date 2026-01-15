import LayerTile from './LayerTile.svelte';
import LayerVector from './LayerVector.svelte';
import LayerVectorTile from './LayerVectorTile.svelte';
import LayerWebGL from './LayerWebGL.svelte';
import LayerStatic from './LayerStatic.svelte';

export * from './types.js';

export const Layer = {
	Tile: LayerTile,
	Vector: LayerVector,
	VectorTile: LayerVectorTile,
	WebGL: LayerWebGL,
	Static: LayerStatic
};

export { LayerTile, LayerVector, LayerVectorTile, LayerWebGL, LayerStatic };
