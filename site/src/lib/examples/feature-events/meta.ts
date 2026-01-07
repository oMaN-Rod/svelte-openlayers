import { MousePointerClick } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'feature-events',
	title: 'Feature Events',
	description: 'Interactive features with onHover, onClick, and child overlays',
	category: 'interaction',
	icon: MousePointerClick,
	tags: ['Events', 'Overlays', 'Interactive'],
	concepts: [
		'Feature event callbacks',
		'onHover / onHoverEnd',
		'onClick / onSelect / onDeselect',
		'hoverStyle / selectedStyle',
		'Overlay.Hover',
		'Overlay.Popup'
	],
	order: 1,
	additionalFiles: [
		'_shared/components/tooltip-hover.svelte',
		'_shared/components/tooltip-select.svelte',
		'_shared/data/map-sources.ts'
	]
};

export default meta;
