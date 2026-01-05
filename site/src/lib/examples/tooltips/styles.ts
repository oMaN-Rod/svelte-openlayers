import { createCircleStyle } from 'svelte-openlayers/utils';

/** Style for selected/highlighted features */
export const selectedStyle = createCircleStyle({
	radius: 10,
	fill: { color: '#ef4444' },
	stroke: { color: '#991b1b', width: 3 }
});

/** Default style for point features */
export const pointStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});
