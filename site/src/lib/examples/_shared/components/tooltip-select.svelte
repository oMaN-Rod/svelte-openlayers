<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import {
		Star,
		Clock,
		Navigation,
		ExternalLink,
		MapPin,
		Phone,
		Globe,
		DollarSign
	} from 'lucide-svelte';

	let { ...props }: { [key: string]: any } = $props();

	// Known metadata fields for map applications
	const knownFields = [
		'geometry',
		'name',
		'type',
		'image',
		'rating',
		'reviews',
		'hours',
		'address',
		'phone',
		'website',
		'priceLevel'
	];
</script>

<Card.Root class="w-64 overflow-hidden rounded-sm py-0 shadow-lg">
	<div class="relative h-32 overflow-hidden">
		{#if props.image}
			<img
				src={props.image}
				alt={props.name || 'Feature'}
				class="h-full w-full object-cover"
			/>
		{:else}
			<div
				class="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600"
			>
				<span class="text-4xl">📍</span>
			</div>
		{/if}
	</div>

	<Card.Header class="gap-0 px-3 py-0 my-0">
		<Card.Description class="text-xs font-medium uppercase tracking-wide">
			{props.type || 'Feature'}
		</Card.Description>
		<Card.Title class="text-base leading-tight">
			{props.name || 'Unknown'}
		</Card.Title>
	</Card.Header>

	<Card.Content class="space-y-1.5 px-3 py-0 my-0">
		{#if props.rating !== undefined || props.priceLevel}
			<div class="flex items-center gap-3 text-sm">
				{#if props.rating !== undefined}
					<div class="flex items-center gap-1">
						<Star class="size-3.5 fill-amber-400 text-amber-400" />
						<span class="font-medium">{props.rating}</span>
						{#if props.reviews !== undefined}
							<span class="text-muted-foreground">
								({typeof props.reviews === 'number'
									? props.reviews.toLocaleString()
									: props.reviews})
							</span>
						{/if}
					</div>
				{/if}
				{#if props.priceLevel}
					<div class="text-muted-foreground flex items-center">
						{#each Array(props.priceLevel) as _}
							<DollarSign class="size-3" />
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if props.address}
			<div class="text-muted-foreground flex items-start gap-1.5 text-sm">
				<MapPin class="mt-0.5 size-3.5 shrink-0" />
				<span class="line-clamp-2">{props.address}</span>
			</div>
		{/if}

		{#if props.hours}
			<div class="text-muted-foreground flex items-center gap-1.5 text-sm">
				<Clock class="size-3.5 shrink-0" />
				<span>{props.hours}</span>
			</div>
		{/if}

		{#if props.phone}
			<div class="text-muted-foreground flex items-center gap-1.5 text-sm">
				<Phone class="size-3.5 shrink-0" />
				<span>{props.phone}</span>
			</div>
		{/if}

		{#if props.website}
			<div class="text-muted-foreground flex items-center gap-1.5 text-sm">
				<Globe class="size-3.5 shrink-0" />
				<a
					href={props.website}
					class="pointer-events-auto truncate text-indigo-600 hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					{props.website.replace(/^https?:\/\/(www\.)?/, '')}
				</a>
			</div>
		{/if}

		{#each Object.entries(props).filter(([key]) => !knownFields.includes(key)) as [key, value]}
			<div class="text-muted-foreground flex items-center justify-between text-sm">
				<span class="font-medium">{key}:</span>
				<span class="truncate">{value}</span>
			</div>
		{/each}
	</Card.Content>

	<Card.Footer class="gap-2 px-3 py-3">
		<Button
			size="sm"
			class="pointer-events-auto h-8 flex-1 bg-indigo-600 hover:bg-indigo-700"
			onclick={() => alert(`Directions to ${props.name}`)}
		>
			<Navigation class="mr-1.5 size-3.5" />
			Directions
		</Button>
		<Button
			size="sm"
			variant="outline"
			class="pointer-events-auto h-8"
			onclick={() => alert(`Details for ${props.name}`)}
		>
			<ExternalLink class="size-3.5" />
		</Button>
	</Card.Footer>
</Card.Root>
