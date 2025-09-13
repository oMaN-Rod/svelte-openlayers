<script lang="ts">
	import { type Snippet } from 'svelte';
	import ExamplePreview from './example-preview.svelte';
	import CodeBlock from './code-block.svelte';
	import { getExampleSource, getExampleComponent } from '$lib/examples/sources';

	interface Props {
		name: string;
		title?: string;
		description?: string;
		customPreview?: Snippet;
		componentProps?: Record<string, any>;
	}

	let { name, title, description, customPreview, componentProps = {} }: Props = $props();

	const Component = $derived(getExampleComponent(name));
	const source = $derived(getExampleSource(name));
</script>

{#if Component && source}
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
				<CodeBlock code={source} language="svelte" title={`${name}.svelte`} />
			{/snippet}
		</ExamplePreview>
	</div>
{:else}
	<div class="text-destructive border-destructive/20 bg-destructive/10 rounded-md border p-4">
		Example "{name}" not found in registry
	</div>
{/if}
