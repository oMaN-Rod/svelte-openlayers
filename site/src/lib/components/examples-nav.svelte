<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { getSortedCategoriesWithExamples } from '$lib/examples/sources';

	const categoriesWithExamples = getSortedCategoriesWithExamples();
	let currentPath = $derived($page.url.pathname);
</script>

<div class="h-full overflow-auto py-6 pr-6 pl-8 lg:py-8">
	<div class="space-y-6">
		<!-- Overview section -->
		<div>
			<h4 class="text-foreground/70 mb-2 text-sm font-semibold">Overview</h4>
			<nav class="grid gap-1">
				<a
					href="/examples"
					class={cn(
						'group hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors',
						currentPath === '/examples'
							? 'bg-accent text-accent-foreground font-medium'
							: 'text-muted-foreground'
					)}
				>
					<div class="flex flex-col gap-0.5">
						<span class="font-medium">All Examples</span>
						<span class="text-xs opacity-70">Browse all available examples</span>
					</div>
				</a>
			</nav>
		</div>

		<!-- Dynamic categories from registry -->
		{#each categoriesWithExamples as category}
			{#if category.examples.length > 0}
				<div>
					<h4 class="text-foreground/70 mb-2 text-sm font-semibold">{category.title}</h4>
					<nav class="grid gap-1">
						{#each category.examples as example}
							<a
								href={`/examples/${example.id}`}
								class={cn(
									'group hover:bg-accent hover:text-accent-foreground flex w-full items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors',
									currentPath === `/examples/${example.id}`
										? 'bg-accent text-accent-foreground font-medium'
										: 'text-muted-foreground'
								)}
							>
								{#if example.icon}
									{@const Icon = example.icon}
									<Icon class="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
								{/if}
								<div class="flex flex-col gap-0.5">
									<span class="font-medium">{example.title}</span>
									<span class="line-clamp-2 text-xs opacity-70">{example.description}</span>
								</div>
							</a>
						{/each}
					</nav>
				</div>
			{/if}
		{/each}
	</div>
</div>
