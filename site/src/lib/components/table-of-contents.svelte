<script lang="ts">
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';

	interface TocItem {
		id: string;
		text: string;
		level: number;
	}

	let tocItems = $state<TocItem[]>([]);
	let activeId = $state<string>('');
	let observer: IntersectionObserver | null = null;

	// React to page changes
	$effect(() => {
		// Trigger on page change
		$page.url;

		// Clean up previous observer
		observer?.disconnect();

		// Small delay to ensure DOM is updated
		setTimeout(() => {
			// Only extract headings that explicitly have data-toc attribute
			const headings = document.querySelectorAll(
				'main h2[data-toc], main h3[data-toc], main h4[data-toc]'
			);
			const items: TocItem[] = [];

			headings.forEach((heading) => {
				const element = heading as HTMLElement;
				// Generate id if not present
				if (!element.id) {
					element.id =
						element.textContent
							?.toLowerCase()
							.replace(/[^\w\s-]/g, '')
							.replace(/\s+/g, '-') || '';
				}

				items.push({
					id: element.id,
					text: element.textContent || '',
					level: parseInt(element.tagName[1])
				});
			});

			tocItems = items;

			// Set up intersection observer for active section tracking
			const observerOptions = {
				rootMargin: '-100px 0px -66% 0px',
				threshold: 0
			};

			observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeId = entry.target.id;
					}
				});
			}, observerOptions);

			headings.forEach((heading) => {
				observer?.observe(heading);
			});

			// Check for hash on mount
			if (window.location.hash) {
				activeId = window.location.hash.slice(1);
			}
		}, 100);
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			const offset = 80; // Account for fixed header
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.scrollY - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});

			// Update URL hash
			history.pushState(null, '', `#${id}`);
		}
	}
</script>

{#if tocItems.length > 0}
	<nav class="top-20 overflow-y-auto">
		<div class="space-y-2">
			<h5 class="mb-3 text-sm font-semibold">On This Page</h5>
			<ul class="space-y-1 text-sm">
				{#each tocItems as item}
					<li style="padding-left: {(item.level - 2) * 0.75}rem" class="relative">
						<button
							onclick={() => scrollToSection(item.id)}
							class="hover:bg-muted/50 block w-full rounded-md px-3 py-1.5 text-left transition-colors {activeId ===
							item.id
								? 'text-primary bg-muted/50 font-medium'
								: 'text-muted-foreground hover:text-foreground'}"
						>
							{#if activeId === item.id}
								<span
									class="bg-primary absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full"
								></span>
							{/if}
							{item.text}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
{/if}

<style>
	nav {
		scrollbar-width: thin;
		scrollbar-color: hsl(var(--border)) transparent;
	}

	nav::-webkit-scrollbar {
		width: 4px;
	}

	nav::-webkit-scrollbar-track {
		background: transparent;
	}

	nav::-webkit-scrollbar-thumb {
		background-color: hsl(var(--border));
		border-radius: 2px;
	}
</style>
