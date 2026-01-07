<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getSortedCategoriesWithExamples } from '$lib/examples/registry';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';

	const categoriesWithExamples = getSortedCategoriesWithExamples();
	const allExamples = categoriesWithExamples.flatMap((cat) => cat.examples);

	const tagColors: Record<string, string> = {
		Beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		Foundation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		Core: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		Styling: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
		Interaction: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
		UI: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		Advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
		Data: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
	};
</script>

<svelte:head>
	<title>Examples - svelte-openlayers</title>
	<meta
		name="description"
		content="Interactive examples demonstrating svelte-openlayers components and patterns"
	/>
</svelte:head>

<div>
	<div class="mb-12">
		<h1 class="mb-4 text-4xl font-bold">Interactive Examples</h1>
		<p class="text-muted-foreground max-w-3xl text-lg">
			Explore practical examples of svelte-openlayers components with live code demos and detailed
			explanations.
		</p>
	</div>

	<div class="mb-12 flex flex-col gap-4">
		{#each allExamples as example}
			{@const Icon = example.icon}
			<Card.Root class="group hover:border-primary/20 bg-card/50 transition-all hover:shadow-lg">
				<div class="flex flex-col gap-2 p-2 sm:flex-row sm:items-center sm:justify-between">
					<div class="flex flex-1 items-start gap-4">
						<div class="bg-primary/10 group-hover:bg-primary/20 rounded-xl p-2 transition-colors">
							<Icon class="text-primary h-6 w-6" />
						</div>
						<div class="flex-1 space-y-2">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="text-lg font-semibold">{example.title}</h3>
								{#each example.tags as tag}
									<Badge variant="secondary" class={tagColors[tag] || ''}>
										{tag}
									</Badge>
								{/each}
							</div>
							<p class="text-muted-foreground text-sm">
								{example.description}
							</p>
							<div class="flex flex-wrap gap-1.5 pt-1">
								{#each example.concepts as concept}
									<code class="bg-muted rounded-md px-2 py-0.5 text-xs font-medium">
										{concept}
									</code>
								{/each}
							</div>
						</div>
					</div>
					<div class="sm:ml-4">
						<Button
							href={`${resolve('/examples')}/${example.id}`}
							variant="outline"
							class="group/btn gap-2"
						>
							View Example
							<ArrowRight class="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
						</Button>
					</div>
				</div>
			</Card.Root>
		{/each}
	</div>
</div>
