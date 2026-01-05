import { createIconStyle } from 'svelte-openlayers/utils';
import type { Style } from 'ol/style';

export function createColorableSvgDataUrl(svgContent: string, color: string): string {
	try {
		const modifiedSvg = svgContent.replace(/currentColor/g, color);
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvg)}`;
	} catch (error) {
		console.warn('Failed to process SVG:', error);
		return '';
	}
}

export function createMarkerStyle(
	svgContent: string,
	color: string,
	scale: number,
	useCustomColor: boolean
): Style {
	const iconSrc = createColorableSvgDataUrl(svgContent, useCustomColor ? '#fff' : 'currentColor');

	return createIconStyle({
		src: iconSrc,
		scale,
		color: useCustomColor ? color : undefined,
		anchor: [0.5, 1],
		anchorXUnits: 'fraction',
		anchorYUnits: 'fraction'
	});
}
