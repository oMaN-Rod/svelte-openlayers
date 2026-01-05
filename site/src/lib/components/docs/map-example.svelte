<script lang="ts">
	import { type Snippet } from 'svelte';
	import ExamplePreview from './example-preview.svelte';
	import CodeBlock from './code-block.svelte';
	import { getExampleComponent, getExampleFiles } from '$lib/examples/registry';

	interface Props {
		name: string;
		title?: string;
		description?: string;
		customPreview?: Snippet;
		componentProps?: Record<string, any>;
	}

	let { name, title, description, customPreview, componentProps = {} }: Props = $props();

	const Component = $derived(getExampleComponent(name));
	const files = $derived(getExampleFiles(name));
	const primaryFile = $derived(files.find((f) => f.isPrimary));
</script>

{#if Component && primaryFile}
	<div class="component-example mb-4">
		{#if title}
			<h2 class="mb-4 text-2xl font-bold">{title}</h2>
		{/if}

		{#if description}
			<p class="text-muted-foreground mb-6">{description}</p>
		{/if}

		<ExamplePreview>
			{#snippet preview()}
				{#if customPreview}
					{@render customPreview()}
				{:else}
					<Component {...componentProps} />
				{/if}
			{/snippet}

			{#snippet code()}
				<CodeBlock code={primaryFile.content} language="svelte" title={primaryFile.filename} />
			{/snippet}
		</ExamplePreview>
	</div>
{:else}
	<div class="text-destructive border-destructive/20 bg-destructive/10 rounded-md border p-4">
		Example "{name}" not found in registry
	</div>
{/if}
