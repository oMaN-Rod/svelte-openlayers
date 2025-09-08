<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	interface ApiItem {
		name: string;
		type: string;
		default?: string;
		description: string;
		required?: boolean;
	}

	interface Props {
		title?: string;
		items: ApiItem[];
	}

	let { title = 'API Reference', items }: Props = $props();
</script>

<div class="space-y-4">
	<h3 class="text-lg font-semibold">{title}</h3>

	<div class="overflow-x-auto">
		<table class="w-full">
			<thead>
				<tr class="border-b">
					<th class="p-2 text-left font-medium">Property</th>
					<th class="p-2 text-left font-medium">Type</th>
					<th class="p-2 text-left font-medium">Default</th>
					<th class="p-2 text-left font-medium">Description</th>
				</tr>
			</thead>
			<tbody>
				{#each items as item}
					<tr class="border-b">
						<td class="p-2">
							<code class="font-mono text-sm">{item.name}</code>
							{#if item.required}
								<Badge variant="destructive" class="ml-2 text-xs">Required</Badge>
							{/if}
						</td>
						<td class="p-2">
							<code class="text-muted-foreground font-mono text-xs">{item.type}</code>
						</td>
						<td class="p-2">
							{#if item.default}
								<code class="font-mono text-xs">{item.default}</code>
							{:else}
								<span class="text-muted-foreground text-xs">—</span>
							{/if}
						</td>
						<td class="text-muted-foreground p-2 text-sm">{item.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
