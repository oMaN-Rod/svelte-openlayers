import { createStyle } from 'svelte-openlayers/utils';

/** Style for completed drawn features (solid blue) */
export const drawStyle = createStyle({
	fill: {
		color: 'rgba(59, 130, 246, 0.3)'
	},
	stroke: {
		color: '#2563eb',
		width: 2
	},
	image: {
		radius: 6,
		fill: { color: '#2563eb' },
		stroke: { color: '#ffffff', width: 2 }
	}
});

/** Style for drawing interaction preview (dashed green) */
export const sketchStyle = createStyle({
	fill: {
		color: 'rgba(16, 185, 129, 0.2)'
	},
	stroke: {
		color: '#10b981',
		width: 2,
		lineDash: [10, 10]
	},
	image: {
		radius: 6,
		fill: { color: '#10b981' },
		stroke: { color: '#ffffff', width: 2 }
	}
});

/** Default map center (New York City) */
export const DEFAULT_CENTER: [number, number] = [-74.006, 40.7128];
export const DEFAULT_ZOOM = 10;
