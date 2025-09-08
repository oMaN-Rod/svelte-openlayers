/**
 * CSS Variable Utility Functions
 * 
 * Utilities for working with CSS custom properties (CSS variables) in the context
 * of OpenLayers styling system.
 */

/**
 * Get the computed value of a CSS custom property (CSS variable)
 * @param variableName - The CSS variable name (with or without --)
 * @param element - The element to get the computed style from (defaults to document.documentElement)
 * @param fallback - Fallback value if the variable is not defined
 * @returns The computed CSS variable value
 */
export function getCSSVariable(
	variableName: string,
	element: Element = document.documentElement,
	fallback?: string
): string {
	// Ensure the variable name starts with --
	const varName = variableName.startsWith('--') ? variableName : `--${variableName}`;
	
	// Get the computed style value
	const computedStyle = getComputedStyle(element);
	const value = computedStyle.getPropertyValue(varName).trim();
	
	// Return the value or fallback
	return value || fallback || '';
}

/**
 * Set a CSS custom property (CSS variable) on an element
 * @param variableName - The CSS variable name (with or without --)
 * @param value - The value to set
 * @param element - The element to set the variable on (defaults to document.documentElement)
 */
export function setCSSVariable(
	variableName: string,
	value: string,
	element: Element = document.documentElement
): void {
	// Ensure the variable name starts with --
	const varName = variableName.startsWith('--') ? variableName : `--${variableName}`;
	
	// Set the property on the element's style
	if (element instanceof HTMLElement) {
		element.style.setProperty(varName, value);
	}
}

/**
 * Get multiple CSS variables as an object
 * @param variableNames - Array of CSS variable names
 * @param element - The element to get the computed style from
 * @param fallbacks - Object with fallback values for each variable
 * @returns Object with variable names as keys and their values
 */
export function getCSSVariables(
	variableNames: string[],
	element: Element = document.documentElement,
	fallbacks: Record<string, string> = {}
): Record<string, string> {
	const result: Record<string, string> = {};
	
	variableNames.forEach(varName => {
		const cleanName = varName.startsWith('--') ? varName : `--${varName}`;
		const keyName = varName.startsWith('--') ? varName.slice(2) : varName;
		result[keyName] = getCSSVariable(cleanName, element, fallbacks[keyName]);
	});
	
	return result;
}

/**
 * Get the current theme's primary color from CSS variables
 * @param element - The element to get the computed style from
 * @returns The primary color value
 */
export function getThemePrimaryColor(element?: Element): string {
	return getCSSVariable('--ol-color-primary', element, '#4338ca');
}

/**
 * Check if a CSS variable is defined
 * @param variableName - The CSS variable name (with or without --)
 * @param element - The element to check
 * @returns True if the variable is defined and has a non-empty value
 */
export function hasCSSVariable(
	variableName: string,
	element: Element = document.documentElement
): boolean {
	const value = getCSSVariable(variableName, element);
	return value !== '';
}

/**
 * Get OpenLayers theme variables for a specific element context
 * @param element - The element to get the theme from (e.g., a themed container)
 * @returns Object with common OpenLayers theme variables
 */
export function getOpenLayersTheme(element?: Element) {
	const targetElement = element || document.documentElement;
	
	return getCSSVariables([
		'--ol-color-primary',
		'--ol-color-primary-foreground',
		'--ol-color-background',
		'--ol-color-foreground',
		'--ol-color-surface',
		'--ol-color-muted',
		'--ol-color-border',
		'--ol-zoom-button-bg',
		'--ol-zoom-button-color'
	], targetElement, {
		'ol-color-primary': '#4338ca',
		'ol-color-primary-foreground': '#ffffff',
		'ol-color-background': '#ffffff',
		'ol-color-foreground': '#1f2937',
		'ol-color-surface': '#f9fafb',
		'ol-color-muted': '#f3f4f6',
		'ol-color-border': '#d1d5db',
		'ol-zoom-button-bg': '#4338ca',
		'ol-zoom-button-color': '#ffffff'
	});
}