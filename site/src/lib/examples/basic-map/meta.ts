import { Map } from '@lucide/svelte';
import type { ExampleMeta } from '../registry';

const meta: ExampleMeta = {
	id: 'basic-map',
	title: 'Basic Map',
	description: 'Simple OpenLayers map with tile layer and reactive bindings',
	category: 'foundation',
	icon: Map,
	tags: ['Beginner', 'Foundation'],
	concepts: ['View', 'Map', 'Layer.Tile', 'Reactive bindings'],
	order: 1
};

export default meta;
