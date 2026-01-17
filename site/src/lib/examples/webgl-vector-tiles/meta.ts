import { Zap } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'webgl-vector-tiles',
	title: 'WebGL Vector Tiles',
	description: 'GPU-accelerated vector tiles using Layer.WebGLVectorTile for high-performance rendering',
	category: 'advanced',
	icon: Zap,
	tags: ['Layers', 'Vector Tiles', 'WebGL', 'Performance', 'MVT'],
	concepts: ['Layer.WebGLVectorTile', 'WebGL rendering', 'Flat styles', 'Style variables'],
	order: 7
};

export default meta;