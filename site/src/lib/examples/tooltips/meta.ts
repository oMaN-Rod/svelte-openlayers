import { MousePointer } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'tooltips',
	title: 'Interactive Tooltips',
	description: 'Context-sensitive tooltips with hover and click modes',
	category: 'interaction',
	icon: MousePointer,
	tags: ['Interaction', 'UI'],
	concepts: ['Overlay.Tooltip', 'Pointer events', 'Dynamic content', 'State management'],
	order: 4,
	additionalFiles: ['data.ts', 'styles.ts', '_shared/data/map-sources.ts']
};

export default meta;
