<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { Sun, Moon, Menu } from 'lucide-svelte';
	import GitHub from '$lib/components/icons/github.svg?raw';

	let isDarkMode = $state(false);
	let mobileMenuOpen = $state(false);

	$effect(() => {
		if (typeof document !== 'undefined') {
			isDarkMode = document.documentElement.classList.contains('dark');
		}
	});

	function toggleTheme() {
		if (typeof document !== 'undefined') {
			const html = document.documentElement;
			const isDark = html.classList.contains('dark');
			if (isDark) {
				html.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			} else {
				html.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			}
			isDarkMode = !isDark;
		}
	}

	const navItems = [
		{ href: resolve('/'), label: 'Home' },
		{ href: resolve('/docs'), label: 'Documentation' },
		{ href: resolve('/examples'), label: 'Examples' }
	];
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div class="container flex h-16 items-center">
		<div class="mr-4 hidden md:flex">
			<a href={resolve('/')} class="mr-6 flex items-center space-x-2">
				<span
					class="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-lg font-bold text-transparent"
				>
					Svelte OpenLayers
				</span>
			</a>
			<nav class="flex items-center space-x-6 text-sm font-medium">
				{#each navItems as item}
					<a href={item.href} class="hover:text-foreground/80 text-foreground/60 transition-colors">
						{item.label}
					</a>
				{/each}
			</nav>
		</div>

		<Button
			variant="ghost"
			size="icon"
			class="md:hidden"
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			<Menu class="h-5 w-5" />
			<span class="sr-only">Toggle Menu</span>
		</Button>

		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<div class="w-full flex-1 md:w-auto md:flex-none"></div>
			<nav class="flex items-center">
				<Button variant="ghost" size="icon" onclick={toggleTheme}>
					{#if isDarkMode}
						<Sun class="h-5 w-5" />
					{:else}
						<Moon class="h-5 w-5" />
					{/if}
					<span class="sr-only">Toggle theme</span>
				</Button>
				<Button
					variant="ghost"
					size="icon"
					href="https://github.com/oMaN-Rod/svelte-openlayers"
					target="_blank"
				>
					{@html GitHub}
				</Button>
			</nav>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div class="bg-background/95 border-t backdrop-blur md:hidden">
			<nav class="container space-y-2 py-4">
				{#each navItems as item}
					<a
						href={item.href}
						class="hover:text-foreground/80 text-foreground/60 block py-2 text-sm font-medium transition-colors"
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
