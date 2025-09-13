import LayerTile from './LayerTile.svelte';
import LayerVector from './LayerVector.svelte';
import LayerWebGL from './LayerWebGL.svelte';

export const Layer = {
	Tile: LayerTile,
	Vector: LayerVector,
	WebGL: LayerWebGL
};

export { LayerTile, LayerVector, LayerWebGL };