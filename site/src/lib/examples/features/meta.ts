import { MapPin } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'features',
	title: 'Features',
	description: 'Points, lines, and polygons with custom styling and click interactions',
	category: 'core',
	icon: MapPin,
	tags: ['Core', 'Styling', 'Interactive'],
	concepts: [
		'Feature.Point',
		'Feature.LineString',
		'Feature.Polygon',
		'hoverStyle / selectedStyle',
		'Overlay.Hover',
		'Overlay.Popup'
	],
	order: 2,
	additionalFiles: [
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/data/map-sources.ts',
		'_shared/styles.ts'
	]
};

export default meta;
