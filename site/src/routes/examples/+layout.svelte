<script lang="ts">
	import ExamplesNav from '$lib/components/examples-nav.svelte';
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
			<ExamplesNav />
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
		<span class="sr-only">Toggle Examples Navigation</span>
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
					<h2 class="text-lg font-semibold">Examples</h2>
					<Button variant="ghost" size="icon" onclick={() => (mobileNavOpen = false)}>×</Button>
				</div>
				<div class="mt-4 p-4">
					<ExamplesNav />
				</div>
			</aside>
		</div>
	{/if}

	<!-- Main content area -->
	<div class="flex flex-1 overflow-x-hidden">
		<!-- Content -->
		<main class="w-full min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
			<div class="mx-auto max-w-7xl overflow-x-hidden">
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
