// Explicit exports for better tree-shaking instead of star exports

// Style utilities
export {
	createCircleStyle,
	createFeatureStyleFunction,
	createFill,
	createIconStyle,
	createStroke,
	createStyle,
	createStyleFromFeature,
	createTextStyle,
	isCircleStyleOptions,
	isIconStyleOptions,
	isRegularShapeOptions,
	setDefaultStyleProperties
} from './styles.js';

// CSS utilities
export {
	getCSSVariable,
	getCSSVariables,
	getOpenLayersTheme,
	getThemePrimaryColor,
	hasCSSVariable,
	setCSSVariable
} from './css.js';

// Collection utilities
export { createReactiveCollection } from './collections.js';
export { ReactiveCollection, type ReactiveCollectionOptions } from './reactive-collection.js';
