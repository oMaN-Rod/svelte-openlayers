import { get, interpolate } from 'svelte-openlayers';

export const stops = {
	0: '#ffffcc', // Low population - light yellow
	1000000: '#c7e9b4', // 1M
	5000000: '#7fcdbb', // 5M
	10000000: '#41b6c4', // 10M
	50000000: '#2c7fb8', // 50M
	100000000: '#253494', // 100M
	1000000000: '#081d58' // 1B+ - dark blue
};

export const countryStyle = {
	'fill-color': interpolate(
		'linear',
		get('pop_est'),
		...Object.entries(stops).flatMap(([k, v]) => [Number(k), v])
	),
	'stroke-color': '#333',
	'stroke-width': 1
};
