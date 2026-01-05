import { createCircleStyle } from 'svelte-openlayers/utils';
import type { Feature } from 'ol';
import type { Geometry } from 'ol/geom';

export const pointStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});

export const selectedStyle = createCircleStyle({
	radius: 10,
	fill: { color: '#ef4444' },
	stroke: { color: '#991b1b', width: 3 }
});

export function createHoverContent(name: string, type: string): string {
	return `
		<div style="font-size: 16px; color: #1e40af; margin-bottom: 8px; font-weight: bold;">
			${name || 'Unknown'}
		</div>
		<div style="color: #6b7280; font-size: 14px;">
			<span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px;">
				${type || 'Feature'}
			</span>
		</div>
	`;
}

export function createSelectContent(feature: Feature<Geometry>): string {
	const props = feature.getProperties();
	const entries = Object.entries(props)
		.filter(([key]) => key !== 'geometry')
		.map(
			([key, value]) => `
				<tr>
					<td style="padding: 4px 8px; color: #6b7280; font-weight: 500;">${key}:</td>
					<td style="padding: 4px 8px;">${value}</td>
				</tr>
			`
		)
		.join('');

	return `
		<div style="padding: 4px;">
			<div style="font-size: 18px; color: #1e40af; margin-bottom: 12px; font-weight: bold; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
				${props.name || 'Feature Details'}
			</div>
			<table style="width: 100%;">
				${entries}
			</table>
		</div>
	`;
}
