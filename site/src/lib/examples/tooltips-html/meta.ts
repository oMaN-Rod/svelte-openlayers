import { MousePointer } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'tooltips-html',
	title: 'HTML Tooltips',
	description: 'Tooltips with custom HTML content using string generators',
	category: 'interaction',
	icon: MousePointer,
	tags: ['Interaction', 'UI', 'Tooltips'],
	concepts: ['Overlay.TooltipManager', 'hoverContent', 'selectContent', 'HTML strings'],
	order: 4.3,
	additionalFiles: ['data.ts', 'styles.ts']
};

export default meta;
