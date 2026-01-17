import { Filter } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'webgl-meteorite-filter',
	title: 'WebGL Filtering',
	description:
		'Dynamic filtering of 45k meteorite landing sites using WebGL with animated pulse effects',
	category: 'advanced',
	icon: Filter,
	tags: ['Advanced', 'WebGL', 'Performance', 'Animation', 'Filtering'],
	concepts: [
		'LayerWebGL',
		'Style variables',
		'Dynamic filtering',
		'Expression-based styles',
		'Animation with time',
		'Large datasets'
	],
	order: 9,
	additionalFiles: ['_shared/data/map-sources.svelte.ts']
};

export default meta;