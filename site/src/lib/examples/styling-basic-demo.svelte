<script lang="ts">
	import { Map, Layer, Feature } from 'svelte-openlayers';
	import { createCircleStyle } from 'svelte-openlayers/utils';

	const pointStyle = createCircleStyle({
		radius: 6,
		fill: '#4338ca', // Uses --ol-color-primary
		stroke: '#ffffff',
		strokeWidth: 2
	});
</script>

<div class="h-[400px] overflow-hidden rounded-lg border">
	<Map.Root>
		<Map.View center={[0, 0]} zoom={2} />
		<Layer.Tile
			source="xyz"
			url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`}
			attributions="&copy; <a href='https://carto.com/attributions'>CARTO</a>"
		/>

		<Layer.Vector style={pointStyle}>
			<Feature.Point coordinates={[-74.006, 40.7128]} properties={{ name: 'New York' }} />
			<Feature.Point coordinates={[-0.1276, 51.5074]} properties={{ name: 'London' }} />
			<Feature.Point coordinates={[139.6503, 35.6762]} properties={{ name: 'Tokyo' }} />
		</Layer.Vector>
	</Map.Root>
</div>
