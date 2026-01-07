import LayerTile from './LayerTile.svelte';
import LayerVector from './LayerVector.svelte';
import LayerWebGL from './LayerWebGL.svelte';
import LayerStatic from './LayerStatic.svelte';

export * from './types.js';

export const Layer = {
	Tile: LayerTile,
	Vector: LayerVector,
	WebGL: LayerWebGL,
	Static: LayerStatic
};

export { LayerTile, LayerVector, LayerWebGL, LayerStatic };
