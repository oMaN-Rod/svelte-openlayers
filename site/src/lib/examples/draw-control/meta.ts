import { Pencil } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'draw-control',
	title: 'Draw Control',
	description: 'Control for drawing points, lines, polygons, and circles',
	category: 'control',
	icon: Pencil,
	tags: ['Control', 'Drawing', 'Geometry'],
	concepts: [
		'Control.Draw',
		'Drawing types',
		'Feature creation',
		'Vector sources',
		'Event handling',
		'Geometry styling'
	],
	order: 7,
	additionalFiles: ['styles.ts', '_shared/data/map-sources.ts']
};

export default meta;
