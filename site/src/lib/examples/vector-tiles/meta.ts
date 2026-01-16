import { Layers } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'vector-tiles',
	title: 'Vector Tiles',
	description: 'Display vector tiles with custom styling using Layer.VectorTile',
	category: 'core',
	icon: Layers,
	tags: ['Layers', 'Vector Tiles', 'MVT', 'Styling'],
	concepts: ['Layer.VectorTile', 'MVT', 'Feature styling'],
	order: 6
};

export default meta;
