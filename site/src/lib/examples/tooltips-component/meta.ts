import { MousePointer } from 'lucide-svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'tooltips-component',
	title: 'Component Tooltips',
	description: 'Tooltips using Svelte snippet components for rich, interactive content',
	category: 'interaction',
	icon: MousePointer,
	tags: ['Interaction', 'UI', 'Tooltips', 'Components'],
	concepts: ['Overlay.TooltipManager', 'hoverSnippet', 'selectSnippet', 'Svelte snippets'],
	order: 4.5,
	additionalFiles: [
		'data.ts',
		'styles.ts',
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte'
	]
};

export default meta;
