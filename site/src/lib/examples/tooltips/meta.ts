import { MousePointer } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'tooltips',
	title: 'Basic Tooltips',
	description: 'Context-sensitive tooltips with hover and click modes',
	category: 'interaction',
	icon: MousePointer,
	tags: ['Interaction', 'UI'],
	concepts: ['Overlay.Hover', 'Overlay.Popup', 'hoverStyle / selectedStyle', 'Feature events'],
	order: 4,
	additionalFiles: ['_shared/data/map-sources.ts', '_shared/styles.ts']
};

export default meta;
