<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { formatNumber, getFlagEmoji } from '$lib/examples/vector-tiles/utils';
	import { Globe, MapPin, TrendingUp, Users, X } from '@lucide/svelte';

	let { clearSelection, ...props }: { clearSelection: () => void; [key: string]: any } = $props();
</script>

<div class="absolute top-4 right-4 z-10">
	<Card.Root class="w-72 overflow-hidden rounded-lg shadow-2xl">
		<div
			class="relative mt-0 flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600"
		>
			<span class="text-6xl drop-shadow-lg">{getFlagEmoji(props.wb_a2)}</span>
			<Button
				size="icon"
				variant="ghost"
				class="absolute top-2 right-2 size-8 text-white hover:bg-white/20"
				onclick={clearSelection}
			>
				<X class="size-4" />
			</Button>
		</div>

		<Card.Header class="gap-0.5 px-4 py-3">
			<Card.Description class="text-xs font-medium tracking-wide text-indigo-600 uppercase">
				{props.type || props.featurecla || 'Country'}
			</Card.Description>
			<Card.Title class="text-xl leading-tight">
				{props.name || props.admin || 'Unknown'}
			</Card.Title>
			{#if props.formal_en && props.formal_en !== props.name}
				<p class="text-muted-foreground text-sm">{props.formal_en}</p>
			{/if}
		</Card.Header>

		<Card.Content class="space-y-2.5 px-4 pt-0 pb-4">
			{#if props.continent}
				<div class="text-muted-foreground flex items-center gap-2 text-sm">
					<Globe class="size-4 shrink-0 text-indigo-500" />
					<span>{props.continent}</span>
					{#if props.subregion}
						<span class="text-muted-foreground/60">• {props.subregion}</span>
					{/if}
				</div>
			{/if}

			{#if props.pop_est}
				<div class="text-muted-foreground flex items-center gap-2 text-sm">
					<Users class="size-4 shrink-0 text-emerald-500" />
					<span
						>Population: <strong class="text-foreground">{formatNumber(props.pop_est)}</strong
						></span
					>
				</div>
			{/if}

			{#if props.gdp_md_est}
				<div class="text-muted-foreground flex items-center gap-2 text-sm">
					<TrendingUp class="size-4 shrink-0 text-amber-500" />
					<span
						>GDP: <strong class="text-foreground"
							>${formatNumber(props.gdp_md_est * 1_000_000)}</strong
						></span
					>
				</div>
			{/if}

			{#if props.economy}
				<div class="text-muted-foreground flex items-center gap-2 text-sm">
					<MapPin class="size-4 shrink-0 text-rose-500" />
					<span class="truncate">{props.economy.replace(/^\d+\.\s*/, '')}</span>
				</div>
			{/if}

			{#if props.income_grp}
				<div class="mt-2 border-t pt-2">
					<span class="text-muted-foreground text-xs">Income: </span>
					<span class="text-xs font-medium">{props.income_grp.replace(/^\d+\.\s*/, '')}</span>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
