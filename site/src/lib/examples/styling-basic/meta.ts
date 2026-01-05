import { Palette } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'styling-basic',
	title: 'Basic Marker Styling',
	description: 'Simple circle markers with custom fill and stroke styles on world cities',
	category: 'core',
	icon: Palette,
	tags: ['Core', 'Styling', 'Beginner'],
	concepts: ['Feature.Point', 'createCircleStyle', 'Layer.Vector', 'Custom fill and stroke'],
	order: 2.5,
	additionalFiles: ['data.ts', 'styles.ts']
};

export default meta;
