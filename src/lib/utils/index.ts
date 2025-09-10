// Explicit exports for better tree-shaking instead of star exports

// Style utilities
export {
	createCircleStyle,
	createStrokeStyle,
	createFillStyle,
	createTextStyle,
	createIconStyle,
	createStyle,
	type CircleStyleOptions,
	type StrokeStyleOptions,
	type FillStyleOptions,
	type TextStyleOptions,
	type IconStyleOptions
} from './styles.js';

// Context utilities
export { setMapContext, getMapContext, setLayerContext, getLayerContext } from './context.js';

// CSS utilities
export {
	getCSSVariable,
	setCSSVariable,
	getCSSVariables,
	getThemePrimaryColor,
	hasCSSVariable,
	getOpenLayersTheme
} from './css.js';

// Collection utilities
export { createReactiveCollection } from './collections.js';
