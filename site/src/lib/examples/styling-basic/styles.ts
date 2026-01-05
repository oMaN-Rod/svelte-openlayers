import { createCircleStyle } from 'svelte-openlayers/utils';

export const pointStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});
