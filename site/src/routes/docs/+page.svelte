<script lang="ts">
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight, BookOpen, Code2, Layers, Zap } from 'lucide-svelte';
</script>

<div class="space-y-8">
	<div>
		<h1 class="text-4xl font-bold tracking-tight">Documentation</h1>
		<p class="text-muted-foreground mt-4 text-lg">
			Learn how to use Svelte OpenLayers to build powerful, interactive maps with composable
			components.
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center space-x-2">
					<BookOpen class="text-primary h-5 w-5" />
					<Card.Title>Getting Started</Card.Title>
				</div>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground mb-4 text-sm">
					Get up and running with Svelte OpenLayers in minutes. Learn how to install the library and
					create your first map.
				</p>
				<Button href={`${base}/docs/getting-started`} variant="outline" size="sm" class="group">
					Read Guide
					<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center space-x-2">
					<Code2 class="text-primary h-5 w-5" />
					<Card.Title>Architecture</Card.Title>
				</div>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground mb-4 text-sm">
					Understand the core principles and architecture that power Svelte OpenLayers.
				</p>
				<Button href={`${base}/docs/architecture`} variant="outline" size="sm" class="group">
					Learn More
					<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center space-x-2">
					<Layers class="text-primary h-5 w-5" />
					<Card.Title>Components</Card.Title>
				</div>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground mb-4 text-sm">
					Explore the complete set of components available for building your maps.
				</p>
				<Button href={`${base}/docs/components/map`} variant="outline" size="sm" class="group">
					View Components
					<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center space-x-2">
					<Zap class="text-primary h-5 w-5" />
					<Card.Title>Examples</Card.Title>
				</div>
			</Card.Header>
			<Card.Content>
				<p class="text-muted-foreground mb-4 text-sm">
					See Svelte OpenLayers in action with live, interactive examples.
				</p>
				<Button href={`${base}/examples`} variant="outline" size="sm" class="group">
					Browse Examples
					<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
