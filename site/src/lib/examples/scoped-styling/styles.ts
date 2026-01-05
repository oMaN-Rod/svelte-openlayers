import { createCircleStyle, getCSSVariable } from 'svelte-openlayers/utils';
import type { Style } from 'ol/style';

export function createThemePointStyle(container: Element, radius: number = 10): Style {
	const primaryColor = getCSSVariable('--ol-color-primary', container, '#4338ca');

	return createCircleStyle({
		radius,
		fill: { color: primaryColor },
		stroke: { color: '#ffffff', width: 2 }
	});
}
