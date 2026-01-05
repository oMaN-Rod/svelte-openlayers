import { Zap } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'webgl-points',
	title: 'WebGL Rendering',
	description:
		'High-performance rendering of large point datasets using WebGL with dynamic styling',
	category: 'advanced',
	icon: Zap,
	tags: ['Advanced', 'WebGL', 'Performance'],
	concepts: [
		'LayerWebGL',
		'WebGL rendering',
		'Expression-based styles',
		'Dynamic variables',
		'Large datasets',
		'Performance optimization'
	],
	order: 8,
	additionalFiles: [
		'styles.ts',
		'data.ts',
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/data/map-sources.ts'
	]
};

export default meta;
