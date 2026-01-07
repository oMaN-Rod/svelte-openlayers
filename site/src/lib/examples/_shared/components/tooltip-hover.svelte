<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';

	let { name, type }: { name?: string; type?: string } = $props();
</script>

<div
	class="flex items-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 px-3 py-2 text-white shadow-lg"
>
	<span class="text-lg">📍</span>
	<span class="text-sm font-semibold">{name || 'Unknown'}</span>
	<Badge variant="secondary" class="bg-white/20 text-[11px] uppercase tracking-wide text-white">
		{type || 'Feature'}
	</Badge>
</div>
