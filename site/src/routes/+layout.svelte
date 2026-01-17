<script lang="ts">
	import '../app.css';
	import 'svelte-openlayers/styles.css';
	import { ModeWatcher } from 'mode-watcher';

	import SiteHeader from '$lib/components/site-header.svelte';

	let { children } = $props();
</script>

<ModeWatcher />
<div class="relative flex min-h-screen flex-col">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
