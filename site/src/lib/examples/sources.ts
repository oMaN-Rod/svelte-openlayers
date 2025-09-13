import { Map, MapPin, MousePointer, Layers, Palette, Image, ArrowLeftRight } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

const buildAttributions = (append: string) => {
	let parts = [
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	];
	if (append) {
		parts.push(append);
	}
	return parts.join(' & ');
};

// Map source configurations
export const mapSources = [
	{ id: 'osm', name: 'OpenStreetMap', url: 'osm' },
	{
		id: 'carto-light',
		name: 'Carto Light',
		url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'carto-dark',
		name: 'Carto Dark',
		url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'carto-voyager',
		name: 'Carto Voyager',
		url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'satellite',
		name: 'Satellite',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attributions: buildAttributions('&copy; <a href="https://www.esri.com/">Esri</a>')
	}
];

// Example metadata
export interface ExampleMeta {
	id: string;
	title: string;
	description: string;
	category: 'foundation' | 'core' | 'interaction' | 'advanced';
	icon: ComponentType;
	tags: string[];
	concepts: string[];
	order: number;
}

export const examplesMeta: Record<string, ExampleMeta> = {
	'basic-map-demo': {
		id: 'basic-map',
		title: 'Basic Map',
		description: 'Simple OpenLayers map with tile layer and reactive bindings',
		category: 'foundation',
		icon: Map,
		tags: ['Beginner', 'Foundation'],
		concepts: ['Map.Root', 'Map.View', 'Layer.Tile', 'Reactive bindings'],
		order: 1
	},
	'features-demo': {
		id: 'features',
		title: 'Features',
		description: 'Points, lines, and polygons with custom styling and click interactions',
		category: 'core',
		icon: MapPin,
		tags: ['Core', 'Styling'],
		concepts: [
			'Feature.Point',
			'Feature.LineString',
			'Feature.Polygon',
			'Custom styles',
			'Event handling'
		],
		order: 2
	},
	'layers-demo': {
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
		order: 3
	},
	'tooltips-basic-demo': {
		id: 'tooltips',
		title: 'Interactive Tooltips',
		description: 'Context-sensitive tooltips with hover and click modes',
		category: 'interaction',
		icon: MousePointer,
		tags: ['Interaction', 'UI'],
		concepts: ['Overlay.Tooltip', 'Pointer events', 'Dynamic content', 'State management'],
		order: 4
	},
	'styling-customization-demo': {
		id: 'styling-customization',
		title: 'Dynamic Theming',
		description: 'Interactive theme customization with CSS variables and dark mode',
		category: 'advanced',
		icon: Palette,
		tags: ['Advanced', 'Styling', 'UI'],
		concepts: ['Dynamic Themes', 'Dark Mode', 'CSS Variables', 'Scoped Styles', 'Runtime Theming'],
		order: 6
	},
	'bidirectional-selection-demo': {
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
		order: 5
	}
};

// Category metadata
export interface CategoryMeta {
	id: string;
	title: string;
	description: string;
	order: number;
}

export const categoriesMeta: Record<string, CategoryMeta> = {
	foundation: {
		id: 'foundation',
		title: 'Foundation',
		description: 'Core concepts and basic usage',
		order: 1
	},
	core: {
		id: 'core',
		title: 'Core Features',
		description: 'Essential map components and features',
		order: 2
	},
	interaction: {
		id: 'interaction',
		title: 'Interactions',
		description: 'User interactions and UI components',
		order: 3
	},
	advanced: {
		id: 'advanced',
		title: 'Advanced',
		description: 'Complex features and integrations',
		order: 4
	}
};

// Import all example source code as raw strings
const sources = import.meta.glob('./*.svelte', {
	query: '?raw',
	import: 'default',
	eager: true
});

// Import all example components
const components = import.meta.glob('./*.svelte', {
	import: 'default',
	eager: true
});

// Helper function to get the example name from the path
function getExampleName(path: string): string {
	const match = path.match(/\.\/(.+)\.svelte$/);
	return match ? match[1] : '';
}

// Create a map of example names to their source code
export const exampleSources: Record<string, string> = {};
for (const [path, source] of Object.entries(sources)) {
	const name = getExampleName(path);
	if (name) {
		exampleSources[name] = source as string;
	}
}

// Create a map of example names to their components
export const exampleComponents: Record<string, any> = {};
for (const [path, component] of Object.entries(components)) {
	const name = getExampleName(path);
	if (name) {
		exampleComponents[name] = component;
	}
}

// Get source code for a specific example
export function getExampleSource(name: string): string | undefined {
	return exampleSources[name];
}

// Get component for a specific example
export function getExampleComponent(name: string): any {
	return exampleComponents[name];
}

// Get all example names
export function getAllExampleNames(): string[] {
	return Object.keys(exampleSources);
}

// Check if an example exists
export function hasExample(name: string): boolean {
	return name in exampleSources;
}

// Get metadata for a specific example
export function getExampleMeta(name: string): ExampleMeta | undefined {
	return examplesMeta[name];
}

// Get all examples grouped by category
export function getExamplesByCategory() {
	const grouped: Record<string, ExampleMeta[]> = {};

	// Initialize categories
	Object.values(categoriesMeta).forEach((category) => {
		grouped[category.id] = [];
	});

	// Group examples
	Object.values(examplesMeta).forEach((example) => {
		if (grouped[example.category]) {
			grouped[example.category].push(example);
		}
	});

	// Sort examples within each category
	Object.keys(grouped).forEach((category) => {
		grouped[category].sort((a, b) => a.order - b.order);
	});

	return grouped;
}

// Get sorted categories with their examples
export function getSortedCategoriesWithExamples() {
	const categories = Object.values(categoriesMeta).sort((a, b) => a.order - b.order);
	const examplesByCategory = getExamplesByCategory();

	return categories.map((category) => ({
		...category,
		examples: examplesByCategory[category.id] || []
	}));
}
