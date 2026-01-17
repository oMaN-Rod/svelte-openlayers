<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatNumber, getFlagEmoji } from '$lib/examples/vector-tiles/utils';
	import { Globe, Users } from '@lucide/svelte';

	let { ...props }: { [key: string]: any } = $props();
</script>

<Card.Root class="w-64 overflow-hidden rounded-lg shadow-xl">
	<Card.Header class="gap-0.5 px-3 py-2">
		<Card.Description class="text-xs font-medium tracking-wide text-indigo-600 uppercase">
			{props.type || 'Country'}
		</Card.Description>
		<Card.Title class="text-base leading-tight">
			<div class="flex items-center gap-2">
				<span class="text-3xl">{getFlagEmoji(props.wb_a2)}</span>
				<span>{props.name || 'Unknown'}</span>
			</div>
		</Card.Title>
	</Card.Header>

	<Card.Content class="space-y-1.5 px-3 pt-0 pb-3">
		{#if props.continent}
			<div class="text-muted-foreground flex items-center gap-2 text-xs">
				<Globe class="size-3.5 shrink-0 text-indigo-500" />
				<span>{props.continent}</span>
			</div>
		{/if}
		{#if props.pop_est}
			<div class="text-muted-foreground flex items-center gap-2 text-xs">
				<Users class="size-3.5 shrink-0 text-emerald-500" />
				<span>Pop: {formatNumber(props.pop_est)}</span>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
