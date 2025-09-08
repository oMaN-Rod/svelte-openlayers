<script lang="ts">
	let { name, type }: { name?: string; type?: string } = $props();
</script>

<div class="custom-tooltip-hover">
	<div class="tooltip-icon">📍</div>
	<div class="tooltip-name">{name || 'Unknown'}</div>
	<div class="tooltip-badge">{type || 'Feature'}</div>
</div>

<style>
	:global(.custom-tooltip-hover) {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	:global(.tooltip-icon) {
		font-size: 18px;
	}

	:global(.tooltip-name) {
		font-weight: 600;
		font-size: 14px;
	}

	:global(.tooltip-badge) {
		background: rgba(255, 255, 255, 0.2);
		padding: 2px 8px;
		border-radius: 12px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
</style>
