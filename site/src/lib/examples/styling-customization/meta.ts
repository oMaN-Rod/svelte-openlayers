import { Palette } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'styling-customization',
	title: 'Dynamic Theming',
	description: 'Interactive theme customization with CSS variables and dark mode',
	category: 'advanced',
	icon: Palette,
	tags: ['Advanced', 'Styling', 'UI'],
	concepts: ['Dynamic Themes', 'Dark Mode', 'CSS Variables', 'Scoped Styles', 'Runtime Theming'],
	order: 6,
	additionalFiles: ['_shared/data/map-sources.ts']
};

export default meta;
