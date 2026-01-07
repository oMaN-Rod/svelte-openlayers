export const DEFAULT_CENTER: [number, number] = [0, 0];
export const DEFAULT_ZOOM = 2;

export interface ThemeConfig {
	id: string;
	name: string;
	description: string;
	cssVariables: Record<string, string>;
	points: Array<{ coordinates: [number, number] }>;
}

export const themes: ThemeConfig[] = [
	{
		id: 'ocean',
		name: 'Ocean Theme',
		description: 'Point styles dynamically created from CSS variables (large cyan circles)',
		cssVariables: {
			'--ol-color-primary': '#0891b2',
			'--ol-zoom-button-bg': '#0891b2',
			'--ol-zoom-button-color': '#ffffff',
			'--ol-zoom-button-radius': '0.5rem',
			'--ol-mouse-position-bg': 'rgba(8, 145, 178, 0.9)',
			'--ol-mouse-position-color': '#ffffff',
			'--ol-attribution-bg': 'rgba(8, 145, 178, 0.8)',
			'--ol-attribution-color': '#ffffff'
		},
		points: [{ coordinates: [0, 0] }, { coordinates: [20, 20] }]
	},
	{
		id: 'sunset',
		name: 'Sunset Theme',
		description: 'Point styles dynamically created from CSS variables (small orange circles)',
		cssVariables: {
			'--ol-color-primary': '#f97316',
			'--ol-zoom-button-bg': '#f97316',
			'--ol-zoom-button-color': '#ffffff',
			'--ol-zoom-button-radius': '9999px',
			'--ol-mouse-position-bg': 'rgba(249, 115, 22, 0.9)',
			'--ol-mouse-position-color': '#ffffff',
			'--ol-mouse-position-font-size': '0.875rem',
			'--ol-attribution-bg': 'rgba(249, 115, 22, 0.8)',
			'--ol-attribution-color': '#ffffff'
		},
		points: [{ coordinates: [-100, 40] }, { coordinates: [-80, 35] }]
	},
	{
		id: 'forest',
		name: 'Forest Theme',
		description: 'Point styles dynamically created from CSS variables (extra-large green circles)',
		cssVariables: {
			'--ol-color-primary': '#059669',
			'--ol-zoom-button-bg': '#059669',
			'--ol-zoom-button-color': '#ffffff',
			'--ol-zoom-button-width': '2rem',
			'--ol-zoom-button-height': '2rem',
			'--ol-zoom-button-margin': '0.25rem 0',
			'--ol-attribution-bg': 'rgba(5, 150, 105, 0.85)',
			'--ol-attribution-color': '#ffffff',
			'--ol-attribution-font-size': '0.8125rem'
		},
		points: [{ coordinates: [10, 50] }, { coordinates: [15, 55] }]
	}
];

export const themeRadii: Record<string, number> = {
	ocean: 12,
	sunset: 8,
	forest: 14
};
