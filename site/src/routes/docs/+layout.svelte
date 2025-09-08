<script lang="ts">
	import DocsNav from '$lib/components/docs-nav.svelte';
	import TableOfContents from '$lib/components/table-of-contents.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Menu } from 'lucide-svelte';

	let { children } = $props();
	let mobileNavOpen = $state(false);
</script>

<div class="flex min-h-[calc(100vh-4rem)]">
	<!-- Left sidebar - Navigation -->
	<aside class="hidden w-64 shrink-0 md:block lg:w-72">
		<div class="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-6">
			<DocsNav />
		</div>
	</aside>

	<!-- Mobile nav toggle -->
	<Button
		variant="ghost"
		size="icon"
		class="rounded-fullshadow-lg bg-muted fixed right-4 bottom-4 z-40 h-12 w-12 md:hidden"
		onclick={() => (mobileNavOpen = !mobileNavOpen)}
	>
		<Menu class="h-5 w-5" />
		<span class="sr-only">Toggle Docs Navigation</span>
	</Button>

	<!-- Mobile sidebar -->
	{#if mobileNavOpen}
		<div class="fixed inset-0 z-50 md:hidden">
			<button
				type="button"
				class="fixed inset-0 bg-black/50"
				onclick={() => (mobileNavOpen = false)}
				aria-label="Close mobile navigation"
			></button>
			<aside class="bg-background fixed top-0 left-0 h-full w-80 border-r">
				<div class="flex items-center justify-between border-b p-4">
					<h2 class="text-lg font-semibold">Documentation</h2>
					<Button variant="ghost" size="icon" onclick={() => (mobileNavOpen = false)}>×</Button>
				</div>
				<div class="mt-4 p-4">
					<DocsNav />
				</div>
			</aside>
		</div>
	{/if}

	<!-- Main content area -->
	<div class="flex flex-1 overflow-x-hidden">
		<!-- Content -->
		<main class="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
			<div class="prose dark:prose-invert max-w-none overflow-x-hidden">
				{@render children()}
			</div>
		</main>

		<!-- Right sidebar - Table of Contents -->
		<aside class="hidden w-64 shrink-0 xl:block">
			<div class="sticky top-16 overflow-y-auto p-6">
				<TableOfContents />
			</div>
		</aside>
	</div>
</div>

<style>
	/* Markdown content styling */
	:global(.prose) {
		line-height: 1.7;
	}

	:global(.prose h1) {
		scroll-margin: 5rem;
		font-size: 2.25rem;
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.025em;
		margin-top: 0;
		margin-bottom: 2rem;
	}

	:global(.prose h2) {
		scroll-margin: 5rem;
		padding-bottom: 0.5rem;
		font-size: 1.875rem;
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.025em;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
	}

	:global(.prose h2:first-child) {
		margin-top: 0;
	}

	:global(.prose h3) {
		scroll-margin: 5rem;
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.025em;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	:global(.prose h4) {
		scroll-margin: 5rem;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.4;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose p) {
		margin-bottom: 1.5rem;
	}

	:global(.prose ul) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
		list-style-type: disc;
	}

	:global(.prose ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
		list-style-type: decimal;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
		list-style-position: outside;
		margin-left: 0.25rem;
	}

	:global(.prose ul ul) {
		list-style-type: circle;
		margin-top: 0.5rem;
	}

	:global(.prose ul ul ul) {
		list-style-type: square;
	}

	/* Inline code styling */
	:global(.prose code:not(pre code)) {
		position: relative;
		border-radius: 0.375rem;
		background-color: #f1f5f9;
		color: #1e293b;
		padding: 0.125rem 0.375rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.875rem;
		font-weight: 500;
		border: 1px solid #e2e8f0;
	}

	/* Pre and code block styling */
	:global(.prose pre) {
		overflow-x: auto;
		border-radius: 0.75rem;
		border: 1px solid #e2e8f0;
		background-color: #f8fafc !important;
		padding: 1rem;
		margin: 1.5rem 0;
		font-size: 0.875rem;
		line-height: 1.5;
		max-width: 100%;
	}

	:global(.prose pre code) {
		background-color: transparent !important;
		padding: 0;
		border-radius: 0;
		font-size: inherit;
		color: inherit;
		border: none;
	}

	/* Shiki theme switching */
	:global(.prose .shiki) {
		background-color: #f8fafc !important;
		border: 1px solid #e2e8f0;
		border-radius: 0.75rem;
		color-scheme: light;
	}

	:global(.prose .shiki code) {
		background-color: transparent !important;
	}

	/* Light theme - use light variants */
	:global(.prose .shiki span) {
		color: var(--shiki-light, var(--shiki-light-bg, inherit));
	}

	/* Dark mode adjustments */
	:global(.dark .prose pre) {
		background-color: #181818 !important;
		border: none;
		color-scheme: dark;
	}

	:global(.dark .prose .shiki) {
		background-color: #181818 !important;
		border: none;
		color-scheme: dark;
	}

	/* Dark theme - use dark variants */
	:global(.dark .prose .shiki span) {
		color: var(--shiki-dark, var(--shiki-dark-bg, inherit));
	}

	:global(.dark .prose code:not(pre code)) {
		background-color: #181818;
		color: #e2e8f0;
		border: none;
	}

	/* Table styling */
	:global(.prose table) {
		width: 100%;
		border-collapse: collapse;
		border-top: 2px solid #e2e8f0;
		border-bottom: 2px solid #e2e8f0;
		margin: 1.5rem 0;
		display: block;
		overflow-x: auto;
		white-space: nowrap;
	}

	@media (min-width: 640px) {
		:global(.prose table) {
			display: table;
		}
	}

	:global(.prose th) {
		padding: 0.75rem;
		text-align: left;
		font-weight: 700;
		font-size: 0.875rem;
		border-bottom: 1px solid #e2e8f0;
	}

	:global(.prose td) {
		padding: 0.75rem;
		font-size: 0.875rem;
		border-bottom: 1px solid #e2e8f0;
	}

	/* Dark mode table styling */
	:global(.dark .prose table) {
		border-top-color: #181818;
		border-bottom-color: #181818;
	}

	:global(.dark .prose th) {
		border-bottom-color: #181818;
	}

	:global(.dark .prose td) {
		border-bottom-color: #181818;
	}

	/* Links */
	:global(.prose a) {
		color: hsl(var(--primary));
		text-decoration: none;
		text-underline-offset: 0.25rem;
		font-weight: 500;
	}

	:global(.prose a:hover) {
		text-decoration: none;
	}

	/* Blockquotes */
	:global(.prose blockquote) {
		border-left: 4px solid hsl(var(--primary));
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: hsl(var(--muted-foreground));
	}

	/* Mobile responsive typography */
	@media (max-width: 640px) {
		:global(.prose h1) {
			font-size: 1.875rem;
		}

		:global(.prose h2) {
			font-size: 1.5rem;
		}

		:global(.prose h3) {
			font-size: 1.25rem;
		}

		:global(.prose h4) {
			font-size: 1.125rem;
		}

		:global(.prose pre) {
			padding: 0.75rem;
			font-size: 0.8125rem;
		}

		:global(.prose code:not(pre code)) {
			font-size: 0.8125rem;
			word-break: break-word;
		}
	}
</style>
