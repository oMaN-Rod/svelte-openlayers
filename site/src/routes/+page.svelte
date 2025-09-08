<script lang="ts">
	import { CodeBlock } from '$lib/components/docs';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight, Code2, Layers, MapPin, Sparkles, Type, Zap } from 'lucide-svelte';

	const quickStartCode = `<script>
  import { Map, Layer, Feature } from 'svelte-openlayers';
<\/script>

<Map.Root center={[longitude, latitude]} zoom={10}>
  <Map.View />
  <Layer.Tile source="osm" />
  <Layer.Vector>
    <Feature.Point coordinates={[0, 0]} />
  </Layer.Vector>
</Map.Root>`;

	const githubUrl = '';
	const features = [
		{
			icon: Code2,
			title: 'Composable Architecture',
			description:
				'Build complex maps with simple, declarative components that work together seamlessly.'
		},
		{
			icon: Sparkles,
			title: 'Svelte 5 Runes',
			description:
				'Leverages the latest Svelte 5 features including runes for optimal reactivity and performance.'
		},
		{
			icon: Layers,
			title: 'Full OpenLayers Power',
			description:
				'Access the complete OpenLayers API while enjoying the simplicity of Svelte components.'
		},
		{
			icon: Type,
			title: 'TypeScript First',
			description:
				'Built with TypeScript from the ground up for excellent IDE support and type safety.'
		},
		{
			icon: Zap,
			title: 'Automatic Cleanup',
			description:
				'Smart lifecycle management prevents memory leaks and ensures optimal performance.'
		},
		{
			icon: MapPin,
			title: 'Rich Interactions',
			description: 'Built-in support for tooltips, selections, drawing, and custom interactions.'
		}
	];
</script>

<svelte:head>
	<title>Svelte OpenLayers - Composable OpenLayers Components for Svelte 5</title>
	<meta
		name="description"
		content="A modern, declarative OpenLayers component library for Svelte 5. Build interactive maps with composable components and reactive bindings."
	/>
</svelte:head>

<div class="relative">
	<section class="relative overflow-hidden py-20 sm:py-32">
		<div
			class="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20"
		></div>

		<div class="relative container">
			<div class="mx-auto max-w-2xl text-center">
				<Badge variant="outline" class="mb-4">Svelte 5 + OpenLayers</Badge>

				<h1
					class="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl"
				>
					Svelte OpenLayers
				</h1>

				<p class="text-muted-foreground mt-6 text-lg leading-8">
					Build powerful, interactive maps with <span class="font-semibold">composable</span>,
					<span class="font-semibold">declarative</span> OpenLayers components for Svelte 5. Experience
					the full power of OpenLayers with the simplicity and elegance of Svelte.
				</p>

				<div class="mt-10 flex items-center justify-center gap-4">
					<Button size="lg" href="/docs/getting-started" class="group">
						Get Started
						<ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Button>
					<Button size="lg" variant="outline" href="/examples">View Examples</Button>
				</div>
			</div>

			<div class="mx-auto mt-16 max-w-3xl">
				<div class="bg-muted/50 rounded-lg border p-1 backdrop-blur">
					<CodeBlock code={quickStartCode} language="svelte" height="h-auto" />
				</div>
			</div>
		</div>
	</section>

	<section class="py-20">
		<div class="container">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Why Svelte OpenLayers?</h2>
				<p class="text-muted-foreground mt-4 text-lg">
					Designed from the ground up to make OpenLayers feel native in Svelte
				</p>
			</div>

			<div class="mx-auto mt-16 max-w-5xl">
				<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{#each features as feature}
						{@const Icon = feature.icon}
						<Card.Root class="relative overflow-hidden">
							<Card.Header>
								<Card.Title class="flex items-center gap-4 text-lg">
									<div
										class="bg-primary/10 mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg"
									>
										<Icon class="text-primary h-5 w-5" />
									</div>
									{feature.title}
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-muted-foreground text-sm">
									{feature.description}
								</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="bg-muted/30 py-20">
		<div class="container">
			<div class="mx-auto max-w-5xl">
				<div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
					<div>
						<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
							Developer Experience First
						</h2>
						<p class="text-muted-foreground mt-4 text-lg">
							Built with modern development in mind. Enjoy excellent TypeScript support,
							tree-shaking, hot module replacement, and a predictable API that makes building
							complex mapping applications a breeze.
						</p>

						<ul class="mt-8 space-y-3">
							<li class="flex items-start">
								<div class="flex-shrink-0">
									<div class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
										<div class="bg-primary h-2 w-2 rounded-full"></div>
									</div>
								</div>
								<p class="ml-3 text-sm">Intuitive component composition patterns</p>
							</li>
							<li class="flex items-start">
								<div class="flex-shrink-0">
									<div class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
										<div class="bg-primary h-2 w-2 rounded-full"></div>
									</div>
								</div>
								<p class="ml-3 text-sm">Reactive bindings for all properties</p>
							</li>
							<li class="flex items-start">
								<div class="flex-shrink-0">
									<div class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
										<div class="bg-primary h-2 w-2 rounded-full"></div>
									</div>
								</div>
								<p class="ml-3 text-sm">Automatic coordinate transformations</p>
							</li>
							<li class="flex items-start">
								<div class="flex-shrink-0">
									<div class="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
										<div class="bg-primary h-2 w-2 rounded-full"></div>
									</div>
								</div>
								<p class="ml-3 text-sm">Event-driven architecture for predictable updates</p>
							</li>
						</ul>
					</div>

					<div class="relative">
						<div class="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-[2px]">
							<div class="bg-background rounded-lg p-6">
								<div class="space-y-4">
									<div class="flex items-center space-x-2">
										<div class="h-3 w-3 rounded-full bg-red-500"></div>
										<div class="h-3 w-3 rounded-full bg-yellow-500"></div>
										<div class="h-3 w-3 rounded-full bg-green-500"></div>
									</div>
									<div class="space-y-2">
										<div class="bg-muted h-2 w-24 rounded"></div>
										<div class="bg-muted h-2 w-32 rounded"></div>
										<div class="bg-muted h-2 w-20 rounded"></div>
										<div class="bg-muted h-2 w-28 rounded"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="py-20">
		<div class="container">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
				<p class="text-muted-foreground mt-4 text-lg">
					Join developers building amazing map experiences with Svelte OpenLayers
				</p>
				<div class="mt-10 flex items-center justify-center gap-4">
					<Button size="lg" href="/docs/getting-started">Read the Documentation</Button>
					<Button
						size="lg"
						variant="outline"
						href="https://github.com/oMaN-Rod/svelte-openlayers"
						target="_blank"
					>
						View on GitHub
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>
