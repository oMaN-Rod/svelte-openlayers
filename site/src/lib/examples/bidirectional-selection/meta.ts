import { ArrowLeftRight } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'bidirectional-selection',
	title: 'Bidirectional Selection',
	description: 'Synchronized selection between table and map features with programmatic control',
	category: 'interaction',
	icon: ArrowLeftRight,
	tags: ['Interaction', 'Selection', 'Advanced'],
	concepts: [
		'Interaction.Select',
		'bind:selectedFeatures',
		'Programmatic selection',
		'Feature collections',
		'State synchronization'
	],
	order: 5,
	additionalFiles: [
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/data/map-sources.ts',
		'_shared/styles.ts'
	]
};

export default meta;
