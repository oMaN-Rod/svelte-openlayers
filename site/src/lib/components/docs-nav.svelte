<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';

	interface NavItem {
		title: string;
		href?: string;
		items?: NavItem[];
	}

	const navigation: NavItem[] = [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Introduction', href: '/docs' },
				{ title: 'Installation', href: '/docs/getting-started' },
				{ title: 'Quick Start', href: '/docs/getting-started#quick-start' }
			]
		},
		{
			title: 'Core Concepts',
			items: [
				{ title: 'Architecture', href: '/docs/architecture' },
				{ title: 'Component Hierarchy', href: '/docs/architecture#component-hierarchy' },
				{ title: 'Styling System', href: '/docs/styling' }
			]
		},
		{
			title: 'Components',
			items: [
				{ title: 'Overview', href: '/docs/components' },
				{ title: 'Map', href: '/docs/components/map' },
				{ title: 'Layers', href: '/docs/components/layers' },
				{ title: 'Features', href: '/docs/components/features' },
				{ title: 'Interactions', href: '/docs/components/interactions' },
				{ title: 'Overlays', href: '/docs/components/overlays' }
			]
		},
		{
			title: 'API Reference',
			items: [{ title: 'Complete API', href: '/docs/api-reference' }]
		}
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="h-full overflow-auto py-6 pr-6 pl-8 lg:py-8">
	<div class="space-y-6">
		{#each navigation as section}
			<div>
				<h4 class="mb-2 text-sm font-semibold">{section.title}</h4>
				{#if section.items}
					<nav class="grid gap-1">
						{#each section.items as item}
							<a
								href={item.href}
								class={cn(
									'group hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-md px-2 py-1.5 text-sm',
									currentPath === item.href
										? 'bg-accent text-accent-foreground font-medium'
										: 'text-muted-foreground'
								)}
							>
								{item.title}
							</a>
						{/each}
					</nav>
				{/if}
			</div>
		{/each}
	</div>
</div>
