import { createCircleStyle } from 'svelte-openlayers/utils';

/** Style for airport point markers */
export const airportStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});
