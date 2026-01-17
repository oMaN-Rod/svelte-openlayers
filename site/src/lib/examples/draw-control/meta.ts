import { Pencil } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'draw-control',
	title: 'Draw Control',
	description: 'Control for drawing points, lines, polygons, and circles',
	category: 'control',
	icon: Pencil,
	tags: ['Control', 'Drawing', 'Geometry', 'Beta'],
	concepts: [
		'Control.Draw',
		'Drawing types',
		'Feature creation',
		'Vector sources',
		'Event handling',
		'Geometry styling'
	],
	order: 7,
	additionalFiles: ['_shared/data/map-sources.ts', '_shared/styles.ts'],
	beta: true
};

export default meta;
