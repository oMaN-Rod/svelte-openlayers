<script lang="ts">
	import { cn } from '$lib/utils';
	import CodeBlock from './code-block.svelte';
	import { getExample, getTabLabel, type ExampleFile } from '$lib/examples/registry';
	import { Code, Eye, FileCode, FileText, Palette, Database } from 'lucide-svelte';

	interface Props {
		exampleId: string;
		class?: string;
	}

	let { exampleId, class: className }: Props = $props();

	const example = $derived(getExample(exampleId));
	const Component = $derived(example?.component);
	const files = $derived(example?.files ?? []);

	let activeView = $state<'preview' | 'code'>('preview');
	let activeFile = $state<string>('index.svelte');

	// Reset active file when example changes
	$effect(() => {
		if (files.length > 0) {
			activeFile = files[0]?.filename ?? 'index.svelte';
		}
	});

	function getFileIcon(file: ExampleFile) {
		if (file.isPrimary) return Eye;
		if (file.isShared) return FileText;
		if (file.filename.includes('style') || file.filename.includes('theme')) return Palette;
		if (file.filename.includes('data')) return Database;
		if (file.language === 'svelte') return FileCode;
		return Code;
	}

	function formatTabLabel(file: ExampleFile): string {
		if (file.isPrimary) return 'Map';
		if (file.isShared) {
			const name = file.filename.replace(/\.(svelte|ts)$/, '');
			return name.charAt(0).toUpperCase() + name.slice(1);
		}
		return getTabLabel(file.filename);
	}

	const currentFile = $derived(files.find((f) => f.filename === activeFile));
</script>

<div class={cn('space-y-4', className)}>
	<!-- Preview / Code Toggle -->
	<div class="bg-muted grid w-full max-w-[400px] grid-cols-2 rounded-lg p-1">
		<button
			class={cn(
				'rounded-md px-3 py-1 text-sm font-medium transition-colors',
				activeView === 'preview'
					? 'bg-background text-foreground shadow-sm'
					: 'text-muted-foreground hover:text-foreground'
			)}
			onclick={() => (activeView = 'preview')}
		>
			Preview
		</button>
		<button
			class={cn(
				'rounded-md px-3 py-1 text-sm font-medium transition-colors',
				activeView === 'code'
					? 'bg-background text-foreground shadow-sm'
					: 'text-muted-foreground hover:text-foreground'
			)}
			onclick={() => (activeView = 'code')}
		>
			Code
		</button>
	</div>

	<!-- Content -->
	<div class="mt-4">
		{#if activeView === 'preview'}
			<div class="overflow-hidden rounded-lg">
				{#if Component}
					<Component />
				{:else}
					<div
						class="text-destructive border-destructive/20 bg-destructive/10 rounded-md border p-4"
					>
						Example "{exampleId}" not found in registry
					</div>
				{/if}
			</div>
		{:else}
			<!-- File Tabs -->
			{#if files.length > 1}
				<div class="mb-4 flex flex-wrap gap-1">
					{#each files as file}
						{@const FileIcon = getFileIcon(file)}
						<button
							class={cn(
								'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
								activeFile === file.filename
									? 'bg-primary text-primary-foreground'
									: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
							)}
							onclick={() => (activeFile = file.filename)}
						>
							<FileIcon class="h-3.5 w-3.5" />
							<span>{formatTabLabel(file)}</span>
						</button>
					{/each}
				</div>

				{#if currentFile}
					<CodeBlock
						code={currentFile.content}
						language={currentFile.language}
						filename={currentFile.filename.replace(/^\(shared\) /, '')}
					/>
				{/if}
			{:else if files.length === 1}
				<CodeBlock
					code={files[0].content}
					language={files[0].language}
					filename={files[0].filename}
				/>
			{:else}
				<div class="text-muted-foreground p-4">No source files available</div>
			{/if}
		{/if}
	</div>
</div>
