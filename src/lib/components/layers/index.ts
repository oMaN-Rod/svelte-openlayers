import LayerStatic from './LayerStatic.svelte';
import LayerTile from './LayerTile.svelte';
import LayerVector from './LayerVector.svelte';
import LayerVectorTile from './LayerVectorTile.svelte';
import LayerWebGL from './LayerWebGL.svelte';
import LayerWebGLTile from './LayerWebGLTile.svelte';
import LayerWebGLVectorTile from './LayerWebGLVectorTile.svelte';

export * from './types.js';

export const Layer = {
	Tile: LayerTile,
	Vector: LayerVector,
	VectorTile: LayerVectorTile,
	WebGL: LayerWebGL,
	WebGLTile: LayerWebGLTile,
	WebGLVectorTile: LayerWebGLVectorTile,
	Static: LayerStatic
};

export {
	LayerStatic,
	LayerTile,
	LayerVector,
	LayerVectorTile,
	LayerWebGL,
	LayerWebGLTile,
	LayerWebGLVectorTile
};
