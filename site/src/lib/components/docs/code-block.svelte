<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Check, Copy } from 'lucide-svelte';
	import { createHighlighter } from 'shiki';
	import { onMount } from 'svelte';
	import svelteLogo from '$lib/components/icons/svelte-logo.svg';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	interface Props {
		code: string;
		language?: string;
		filename?: string;
		title?: string;
		height?: string;
	}

	let {
		code = $bindable(''),
		language = 'svelte',
		filename,
		title,
		height = 'h-[600px]'
	}: Props = $props();

	let copied = $state(false);
	let highlightedCode = $state('');
	let mounted = $state(false);

	async function copyToClipboard() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	onMount(async () => {
		try {
			const highlighter = await createHighlighter({
				themes: ['github-dark', 'github-light'],
				langs: ['typescript', 'javascript', 'svelte', 'html', 'css', 'bash', 'json']
			});

			highlightedCode = highlighter.codeToHtml(code, {
				lang: language,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				}
			});
		} catch (error) {
			console.warn('Failed to highlight code:', error);
			// Fallback to plain code
			highlightedCode = `<pre><code class="language-${language}">${code}</code></pre>`;
		} finally {
			mounted = true;
		}
	});

	$effect(() => {
		if (!mounted || !code) return;
		// Re-highlight code when language or code changes
		(async () => {
			try {
				const highlighter = await createHighlighter({
					themes: ['github-dark', 'github-light'],
					langs: ['typescript', 'javascript', 'svelte', 'html', 'css', 'bash', 'json']
				});

				highlightedCode = highlighter.codeToHtml(code, {
					lang: language,
					themes: {
						light: 'github-light',
						dark: 'github-dark'
					}
				});
			} catch (error) {
				console.warn('Failed to highlight code:', error);
				// Fallback to plain code
				highlightedCode = `<pre><code class="language-${language}">${code}</code></pre>`;
			}
		})();
	});
</script>

<div class="group relative">
	{#if filename || title}
		<div class="bg-muted/50 flex items-center justify-between rounded-t-lg border-b px-4 py-2">
			<div class="flex gap-2">
				<img src={svelteLogo} alt="Svelte" class="h-4 w-4" />
				<span class="text-muted-foreground font-mono text-sm">{filename || title}</span>
			</div>
			<Button
				variant="ghost"
				size="icon"
				class="h-8 w-8 transition-opacity"
				onclick={copyToClipboard}
			>
				{#if copied}
					<Check class="h-4 w-4" />
				{:else}
					<Copy class="h-4 w-4" />
				{/if}
				<span class="sr-only">Copy code</span>
			</Button>
		</div>
	{:else}
		<Button
			variant="ghost"
			size="icon"
			class="absolute top-2 right-2 h-8 w-8 transition-opacity group-hover:opacity-100"
			onclick={copyToClipboard}
		>
			{#if copied}
				<Check class="h-4 w-4" />
			{:else}
				<Copy class="h-4 w-4" />
			{/if}
			<span class="sr-only">Copy code</span>
		</Button>
	{/if}

	<div class="relative overflow-x-auto">
		{#if mounted && highlightedCode}
			<ScrollArea class="{height} rounded-b-lg">
				<div
					class="[&>pre]:!m-0 [&>pre]:min-w-0 [&>pre]:overflow-x-auto [&>pre]:!border-0 [&>pre]:!p-4"
				>
					{@html highlightedCode}
				</div>
			</ScrollArea>
		{:else}
			<pre
				class="overflow-x-auto rounded-lg p-4 {filename || title ? 'rounded-t-none' : ''} border">
				<code class="language-{language} text-sm whitespace-pre">
					{code}
				</code>
			</pre>
		{/if}
	</div>
</div>

<style>
	/* Theme switching for dual-theme Shiki output */
	/* Light mode: use the inline color styles (default behavior) */
	/* Dark mode: override with --shiki-dark custom property */
	:global(.shiki code) {
		counter-reset: step;
		counter-increment: step 0;
	}

	:global(.shiki code .line::before) {
		content: counter(step);
		counter-increment: step;
		width: 1rem;
		margin-right: 1.5rem;
		display: inline-block;
		text-align: right;
		color: var(--shiki-light);
	}

	:global(.dark .shiki code .line::before) {
		color: var(--shiki-dark);
	}

	:global(.shiki) {
		background: #f5f5f5 !important;
		overflow-x: auto !important;
	}

	:global(.shiki pre) {
		overflow-x: auto !important;
		white-space: pre !important;
	}

	:global(.shiki code) {
		display: block !important;
		width: max-content !important;
		min-width: 100% !important;
	}

	:global(.dark .shiki) {
		background: #181818 !important;
	}

	:global(.dark .shiki span) {
		color: var(--shiki-dark) !important;
	}
</style>
