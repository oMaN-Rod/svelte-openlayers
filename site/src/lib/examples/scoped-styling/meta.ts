import { Palette } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'scoped-styling',
	title: 'Scoped CSS Styling',
	description: 'Multiple maps with scoped CSS variable themes sharing a single View',
	category: 'advanced',
	icon: Palette,
	tags: ['Advanced', 'Styling', 'CSS Variables'],
	concepts: [
		'CSS Variables',
		'Scoped Styles',
		'Shared View',
		'getCSSVariable',
		'createCircleStyle'
	],
	order: 6.5,
	additionalFiles: ['data.ts', 'styles.ts']
};

export default meta;
