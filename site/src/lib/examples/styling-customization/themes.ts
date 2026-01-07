export interface Theme {
	primary: string;
	tooltipBg: string;
	color: string;
	zoomBg: string;
}

export const themes: Record<string, Theme> = {
	default: {
		primary: '#4338ca',
		tooltipBg: 'rgba(255, 255, 255, 0.9)',
		color: '#181818',
		zoomBg: '#4338ca'
	},
	defaultDark: {
		primary: '#8b5cf6',
		tooltipBg: 'rgba(24, 24, 24, 0.9)',
		color: '#f3f4f6',
		zoomBg: '#8b5cf6'
	},
	ocean: {
		primary: '#0891b2',
		tooltipBg: 'rgba(255, 255, 255, 0.9)',
		color: '#181818',
		zoomBg: '#0891b2'
	},
	oceanDark: {
		primary: '#06b6d4',
		tooltipBg: 'rgba(31, 41, 55, 0.9)',
		color: '#f3f4f6',
		zoomBg: '#06b6d4'
	},
	forest: {
		primary: '#059669',
		tooltipBg: 'rgba(255, 255, 255, 0.9)',
		color: '#181818',
		zoomBg: '#059669'
	},
	forestDark: {
		primary: '#10b981',
		tooltipBg: 'rgba(31, 41, 55, 0.9)',
		color: '#f3f4f6',
		zoomBg: '#10b981'
	},
	sunset: {
		primary: '#f97316',
		tooltipBg: 'rgba(255, 255, 255, 0.9)',
		color: '#181818',
		zoomBg: '#f97316'
	},
	sunsetDark: {
		primary: '#fb923c',
		tooltipBg: 'rgba(31, 41, 55, 0.9)',
		color: '#f3f4f6',
		zoomBg: '#fb923c'
	}
};

export type ThemeName = keyof typeof themes;

/**
 * Apply theme CSS variables to specified element
 */
export function applyTheme(themeName: ThemeName, element?: HTMLElement): void {
	if (!element) {
		return;
	}
	const selectedTheme = themes[themeName];

	element.style.setProperty('--ol-color-primary', selectedTheme.primary);
	element.style.setProperty('--ol-tooltip-color', selectedTheme.color);
	element.style.setProperty('--ol-tooltip-bg', selectedTheme.tooltipBg);
	element.style.setProperty('--ol-zoom-button-bg', selectedTheme.zoomBg);
	element.style.setProperty('--ol-tooltip-select-accent-color', selectedTheme.primary);
}

/**
 * Generate CSS variable declarations for the current theme
 */
export function getCssVariables(themeName: ThemeName): string {
	const theme = themes[themeName];
	return `--ol-color-primary: ${theme.primary};
--ol-tooltip-color: ${theme.color};
--ol-tooltip-bg: ${theme.tooltipBg};
--ol-zoom-button-bg: ${theme.zoomBg};
--ol-tooltip-select-accent-color: ${theme.primary};`;
}
