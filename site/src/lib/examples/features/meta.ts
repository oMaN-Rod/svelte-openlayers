import { MapPin } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'features',
	title: 'Features',
	description: 'Points, lines, and polygons with custom styling and click interactions',
	category: 'core',
	icon: MapPin,
	tags: ['Core', 'Styling'],
	concepts: [
		'Feature.Point',
		'Feature.LineString',
		'Feature.Polygon',
		'Custom styles',
		'Event handling'
	],
	order: 2,
	additionalFiles: [
		'data.ts',
		'styles.ts',
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/data/map-sources.ts'
	]
};

export default meta;
