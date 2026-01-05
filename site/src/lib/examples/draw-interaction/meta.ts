import { Pencil } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'draw-interaction',
	title: 'Draw Interaction',
	description:
		'Interactive drawing of points, lines, polygons, and circles with real-time feature tracking',
	category: 'interaction',
	icon: Pencil,
	tags: ['Interaction', 'Drawing', 'Geometry'],
	concepts: [
		'Interaction.Draw',
		'Drawing types',
		'Feature creation',
		'Vector sources',
		'Event handling',
		'Geometry styling'
	],
	order: 6,
	additionalFiles: ['styles.ts', '_shared/data/map-sources.ts']
};

export default meta;
