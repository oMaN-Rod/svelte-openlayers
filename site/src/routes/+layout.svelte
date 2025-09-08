<script lang="ts">
	import '../app.css';
	import 'svelte-openlayers/styles.css';

	import SiteHeader from '$lib/components/site-header.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const theme = localStorage.getItem('theme');
		if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<div class="relative flex min-h-screen flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
