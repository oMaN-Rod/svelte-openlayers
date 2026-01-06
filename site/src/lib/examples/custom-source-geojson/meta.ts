import { Globe } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'custom-source-geojson',
	title: 'GeoJSON Vector Source',
	description: 'Load GeoJSON data from remote URLs or inline objects with custom VectorSource',
	category: 'advanced',
	icon: Globe,
	tags: ['Advanced', 'Data', 'GeoJSON'],
	concepts: [
		'VectorSource',
		'GeoJSON format',
		'Remote data loading',
		'Custom layer binding',
		'Feature styling'
	],
	order: 7
};

export default meta;
