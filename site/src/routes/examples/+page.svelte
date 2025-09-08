<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getSortedCategoriesWithExamples } from '$lib/examples/sources';

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

	<div class="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each allExamples as example}
			{@const Icon = example.icon}
			<Card.Root class="transition-shadow hover:shadow-lg">
				<Card.Header>
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3">
							<div class="bg-primary/10 rounded-lg p-2">
								<Icon class="h-5 w-5" />
							</div>
							<div>
								<Card.Title class="mb-1 text-xl">{example.title}</Card.Title>
								<div class="mb-2 flex gap-2">
									{#each example.tags as tag}
										<Badge variant="secondary" class={tagColors[tag] || ''}>
											{tag}
										</Badge>
									{/each}
								</div>
							</div>
						</div>
					</div>
					<Card.Description class="text-base">
						{example.description}
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<div>
							<h4 class="text-muted-foreground mb-2 text-sm font-semibold">Key Concepts:</h4>
							<div class="flex flex-wrap gap-1">
								{#each example.concepts as concept}
									<code class="bg-muted rounded px-2 py-1 text-xs">
										{concept}
									</code>
								{/each}
							</div>
						</div>
						<Button href={`/examples/${example.id}`} class="w-full">View Example</Button>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
