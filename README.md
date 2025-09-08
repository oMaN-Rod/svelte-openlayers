# Svelte OpenLayers

A composable, component-based OpenLayers integration for Svelte 5. Build interactive maps using declarative components while maintaining full access to OpenLayers' powerful functionality.

![Svelte OpenLayers Demo](https://img.shields.io/badge/Svelte-5.0+-orange.svg)
![OpenLayers](https://img.shields.io/badge/OpenLayers-10.6+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)

## Installation

```bash
npm install svelte-openlayers ol
# or
bun add svelte-openlayers ol
```

## Quick Start

```svelte
<script>
	import { Map, Layer, Feature } from 'svelte-openlayers';

	let center = $state([-74.006, 40.7128]); // New York City
	let zoom = $state(12);
</script>

<Map.Root class="map-container">
	<Map.View bind:center bind:zoom />
	<Layer.Tile source="osm" />
</Map.Root>

<style>
	.map-container {
		width: 100%;
		height: 400px;
	}
</style>
```

## Documentation

For complete API documentation, examples, and guides, visit:

**[svelte-openlayers.com](https://svelte-openlayers.com)**

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## License

MIT © O

---

Built with [Svelte 5](https://svelte.dev/) and [OpenLayers](https://openlayers.org/)
