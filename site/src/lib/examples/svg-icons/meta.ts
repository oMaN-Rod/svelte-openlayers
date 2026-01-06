import { Image } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'svg-icons',
	title: 'SVG Icon Markers',
	description: 'Use SVG icons as map markers with dynamic color tinting and size control',
	category: 'core',
	icon: Image,
	tags: ['Core', 'Styling', 'Icons'],
	concepts: ['createIconStyle', 'SVG icons', 'Color tinting', 'Dynamic sizing'],
	order: 3.5,
	additionalFiles: []
};

export default meta;
