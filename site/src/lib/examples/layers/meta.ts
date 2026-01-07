import { Layers } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'layers',
	title: 'Layer Management',
	description: 'Multiple tile sources and vector layer visibility controls',
	category: 'core',
	icon: Layers,
	tags: ['Advanced', 'Data'],
	concepts: [
		'Multiple tile sources',
		'Layer visibility',
		'Base layer switching',
		'Data organization'
	],
	order: 3,
	additionalFiles: ['_shared/data/map-sources.ts', '_shared/styles.ts']
};

export default meta;
