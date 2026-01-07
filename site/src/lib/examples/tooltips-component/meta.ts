import { MousePointer } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'tooltips-component',
	title: 'Component Tooltips',
	description: 'Feature overlays using reusable Svelte components for rich content',
	category: 'interaction',
	icon: MousePointer,
	tags: ['Interaction', 'UI', 'Overlays', 'Components'],
	concepts: ['Overlay.Hover', 'Overlay.Popup', 'hoverStyle / selectedStyle', 'Svelte components'],
	order: 4.5,
	additionalFiles: [
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/styles.ts'
	]
};

export default meta;
