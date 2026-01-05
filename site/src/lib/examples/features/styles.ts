import { createCircleStyle, createStyle } from 'svelte-openlayers/utils';

/** Style for point features (landmarks) */
export const pointStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});

/** Style for selected/highlighted point features */
export const selectedStyle = createCircleStyle({
	radius: 8,
	fill: { color: '#10b981' },
	stroke: { color: '#ffffff', width: 2 }
});

/** Style for line features (routes) */
export const lineStyle = createStyle({
	stroke: {
		color: '#10b981',
		width: 3
	}
});

/** Style for polygon features (areas/regions) */
export const polygonStyle = createStyle({
	fill: {
		color: 'rgba(99, 102, 241, 0.3)'
	},
	stroke: {
		color: '#4338ca',
		width: 2
	}
});
