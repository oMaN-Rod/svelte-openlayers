<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { stops } from './styles';
</script>

<Card.Root class="w-48 overflow-hidden rounded-lg py-2 text-xs shadow-xl">
	<Card.Header class="gap-0.5 px-3">
		<Card.Description class="font-medium tracking-wide text-indigo-600 uppercase">
			Legend
		</Card.Description>
		<Card.Title class="leading-tight">Population Density</Card.Title>
	</Card.Header>

	<Card.Content class="space-y-1.5 px-3 pt-0 pb-3">
		{#each Object.entries(stops) as stop}
			{@const population = parseInt(stop[0])}
			{@const color = stop[1]}
			<div class="flex w-auto justify-between gap-2 p-1">
				<span>{population.toLocaleString()}</span>
				<div class="w-10 rounded border shadow" style="background-color: {color}"></div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
