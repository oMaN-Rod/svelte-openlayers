import type { Component } from 'svelte';

// ============ TYPES ============

export interface ExampleMeta {
	id: string;
	title: string;
	description: string;
	category: 'foundation' | 'core' | 'interaction' | 'control' | 'advanced';
	icon: Component;
	tags: string[];
	concepts: string[];
	order: number;
	additionalFiles?: string[];
}

export interface ExampleFile {
	filename: string;
	content: string;
	language: 'svelte' | 'typescript' | 'css';
	isPrimary: boolean;
	isShared: boolean;
}

export interface ExampleDefinition {
	id: string;
	meta: ExampleMeta;
	component: Component;
	files: ExampleFile[];
}

export interface CategoryMeta {
	id: string;
	title: string;
	description: string;
	order: number;
}

// ============ CATEGORY METADATA ============

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
	control: {
		id: 'control',
		title: 'Controls',
		description: 'Map controls',
		order: 4
	},
	advanced: {
		id: 'advanced',
		title: 'Advanced',
		description: 'Complex features and integrations',
		order: 5
	}
};

// ============ AUTO-DISCOVERY ============

// Import all meta.ts files from example directories (excludes _shared)
const metaModules = import.meta.glob<{ default: ExampleMeta }>('./**/meta.ts', {
	eager: true
});

// Import all index.svelte components from example directories
const componentModules = import.meta.glob<{ default: ComponentType }>('./**/index.svelte', {
	eager: true,
	import: 'default'
});

// Import all source files as raw strings for code display (excludes registry.ts and _shared)
const sourceModules = import.meta.glob<string>(
	['./**/*.svelte', './**/*.ts', '!./registry.ts', '!./_shared/**', '!./**/meta.ts'],
	{
		query: '?raw',
		import: 'default',
		eager: true
	}
);

// Import shared utilities source for display when referenced via additionalFiles
const sharedSourceModules = import.meta.glob<string>('./_shared/**/*.{svelte,ts}', {
	query: '?raw',
	import: 'default',
	eager: true
});

// ============ HELPER FUNCTIONS ============

function getExampleIdFromPath(path: string): string {
	// "./basic-map/meta.ts" -> "basic-map"
	// "./basic-map/index.svelte" -> "basic-map"
	const match = path.match(/\.\/([^/]+)\//);
	return match ? match[1] : '';
}

function getFileInfo(path: string): { exampleId: string; filename: string; ext: string } {
	// "./basic-map/index.svelte" -> { exampleId: "basic-map", filename: "index.svelte", ext: "svelte" }
	const match = path.match(/\.\/([^/]+)\/(.+)$/);
	if (!match) return { exampleId: '', filename: '', ext: '' };
	const exampleId = match[1];
	const filename = match[2];
	const ext = filename.split('.').pop() || '';
	return { exampleId, filename, ext };
}

function getLanguage(ext: string): 'svelte' | 'typescript' | 'css' {
	if (ext === 'svelte') return 'svelte';
	if (ext === 'ts') return 'typescript';
	return 'css';
}

function getTabLabel(filename: string): string {
	if (filename === 'index.svelte') return 'Map';
	// Remove extension and format nicely
	const name = filename.replace(/\.(svelte|ts)$/, '');
	return name.charAt(0).toUpperCase() + name.slice(1);
}

// ============ BUILD REGISTRY ============

const examplesRegistry: Map<string, ExampleDefinition> = new Map();

// First pass: collect all examples with their meta and component
for (const [path, module] of Object.entries(metaModules)) {
	const id = getExampleIdFromPath(path);
	if (!id || id.startsWith('_')) continue;

	const componentPath = `./${id}/index.svelte`;
	const component = componentModules[componentPath];

	if (component) {
		examplesRegistry.set(id, {
			id,
			meta: module.default,
			component: component as unknown as Component,
			files: []
		});
	}
}

// Second pass: attach source files to each example
for (const [path, content] of Object.entries(sourceModules)) {
	const { exampleId, filename, ext } = getFileInfo(path);
	if (!exampleId || exampleId.startsWith('_')) continue;

	const example = examplesRegistry.get(exampleId);
	if (example) {
		example.files.push({
			filename,
			content,
			language: getLanguage(ext),
			isPrimary: filename === 'index.svelte',
			isShared: false
		});
	}
}

// Third pass: add additional files declared in additionalFiles
// These can be either local files (same directory) or shared files (_shared/)
// Local files may already be added in second pass, so we skip duplicates
for (const example of examplesRegistry.values()) {
	if (example.meta.additionalFiles) {
		for (const filePath of example.meta.additionalFiles) {
			const isSharedFile = filePath.startsWith('_shared/');
			let content: string | undefined;
			let fullPath: string;
			let displayFilename: string;

			if (isSharedFile) {
				// Shared file from _shared/ directory
				fullPath = `./${filePath}`;
				content = sharedSourceModules[fullPath];
				displayFilename = `${filePath.split('/').pop() || filePath}`;
			} else {
				// Local file in same example directory
				fullPath = `./${example.id}/${filePath}`;
				content = sourceModules[fullPath];
				displayFilename = filePath;
				// Skip if already added in second pass
				if (example.files.some((f) => f.filename === displayFilename)) {
					continue;
				}
			}

			if (content) {
				const ext = displayFilename.split('.').pop() || '';
				example.files.push({
					filename: displayFilename,
					content,
					language: getLanguage(ext),
					isPrimary: false,
					isShared: isSharedFile
				});
			}
		}
	}
}

// Sort files: primary first, then non-shared alphabetically, then shared
for (const example of examplesRegistry.values()) {
	example.files.sort((a, b) => {
		if (a.isPrimary) return -1;
		if (b.isPrimary) return 1;
		if (a.isShared !== b.isShared) return a.isShared ? 1 : -1;
		return a.filename.localeCompare(b.filename);
	});
}

// ============ PUBLIC API ============

export function getExample(id: string): ExampleDefinition | undefined {
	return examplesRegistry.get(id);
}

export function getExampleComponent(id: string): Component | undefined {
	return examplesRegistry.get(id)?.component;
}

export function getExampleMeta(id: string): ExampleMeta | undefined {
	return examplesRegistry.get(id)?.meta;
}

export function getExampleFiles(id: string): ExampleFile[] {
	return examplesRegistry.get(id)?.files ?? [];
}

export function getAllExampleIds(): string[] {
	return Array.from(examplesRegistry.keys());
}

export function hasExample(id: string): boolean {
	return examplesRegistry.has(id);
}

export function getSharedFile(path: string): string | undefined {
	const fullPath = `./_shared/${path}`;
	return sharedSourceModules[fullPath];
}

export function getExamplesByCategory(): Record<string, ExampleMeta[]> {
	const grouped: Record<string, ExampleMeta[]> = {};

	// Initialize categories
	for (const category of Object.values(categoriesMeta)) {
		grouped[category.id] = [];
	}

	// Group examples
	for (const example of examplesRegistry.values()) {
		const category = example.meta.category;
		if (grouped[category]) {
			grouped[category].push(example.meta);
		}
	}

	// Sort examples within each category
	for (const category of Object.keys(grouped)) {
		grouped[category].sort((a, b) => a.order - b.order);
	}

	return grouped;
}

export function getSortedCategoriesWithExamples(): Array<
	CategoryMeta & { examples: ExampleMeta[] }
> {
	const categories = Object.values(categoriesMeta).sort((a, b) => a.order - b.order);
	const examplesByCategory = getExamplesByCategory();

	return categories.map((category) => ({
		...category,
		examples: examplesByCategory[category.id] || []
	}));
}

// Export for backward compatibility with tab label generation
export { getTabLabel };
