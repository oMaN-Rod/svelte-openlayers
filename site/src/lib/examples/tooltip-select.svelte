<script lang="ts">
	let { ...props }: { [key: string]: any } = $props();
</script>

<div class="overflow-hidden rounded-xl bg-white shadow-lg">
	<div
		class="flex items-center justify-between bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3 text-white"
	>
		<span class="text-base font-semibold">{props.name || 'Feature'}</span>
		<span class="rounded-md bg-white/20 px-2 py-0.5 text-xs">{props.type || ''}</span>
	</div>
	<div class="px-4 py-3 text-gray-800">
		{#each Object.entries(props).filter(([key]) => key !== 'geometry') as [key, value]}
			<div class="flex justify-between gap-4 border-b border-gray-100 py-1.5 last:border-b-0">
				<span class="text-sm font-medium text-gray-500">{key}:</span>
				<span class="text-sm text-gray-900">{value}</span>
			</div>
		{/each}
	</div>
	<div class="border-t border-gray-200 bg-gray-50 px-4 py-3">
		<button
			onclick={() => alert(`Clicked on ${props.name}`)}
			class="pointer-events-auto w-full cursor-pointer rounded-md border-none bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
		>
			View Details
		</button>
	</div>
</div>
