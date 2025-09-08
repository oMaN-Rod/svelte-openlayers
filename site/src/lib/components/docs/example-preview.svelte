<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	interface Props {
		preview: Snippet;
		code: Snippet;
		title?: string;
		description?: string;
		class?: string;
	}

	let { preview, code, title, description, class: className }: Props = $props();
	let activeTab = $state<'preview' | 'code'>('preview');
</script>

<div class="space-y-4">
	{#if title || description}
		<div class="space-y-1">
			{#if title}
				<h3 class="text-lg font-semibold">{title}</h3>
			{/if}
			{#if description}
				<p class="text-muted-foreground text-sm">{description}</p>
			{/if}
		</div>
	{/if}

	<div class="w-full overflow-x-hidden">
		<!-- Tab buttons -->
		<div class="bg-muted grid w-full max-w-[400px] grid-cols-2 rounded-lg p-1">
			<button
				class={cn(
					'rounded-md px-3 py-1 text-sm font-medium transition-colors',
					activeTab === 'preview'
						? 'bg-background text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'
				)}
				onclick={() => (activeTab = 'preview')}
			>
				Preview
			</button>
			<button
				class={cn(
					'rounded-md px-3 py-1 text-sm font-medium transition-colors',
					activeTab === 'code'
						? 'bg-background text-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground'
				)}
				onclick={() => (activeTab = 'code')}
			>
				Code
			</button>
		</div>

		<!-- Tab content -->
		<div class="mt-4 overflow-x-hidden">
			{#if activeTab === 'preview'}
				<div class={cn('rounded-lg overflow-x-hidden', className)}>
					{@render preview()}
				</div>
			{:else}
				<div class="overflow-x-auto">
					{@render code()}
				</div>
			{/if}
		</div>
	</div>
</div>
