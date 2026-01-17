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

export {
	// Rule builders
	createStyleRule,
	createStyleRules,
	// Expression builders
	get,
	variable,
	time,
	zoom,
	interpolate,
	between,
	compare,
	match,
	math,
	array,
	// Animation helpers
	animationCycle,
	pulseEffect,
	animatedColor,
	// Common patterns
	sizeByProperty,
	sizeByZoom
} from './expressions.js';

// WebGL style types
export type {
	FlatStyleLike,
	FlatStyle,
	Rule,
	StyleVariables,
	FlatCircle,
	FlatFill,
	FlatStroke,
	FlatIcon,
	FlatShape,
	FlatText,
	EncodedExpression,
	LiteralValue,
	Expression,
	FilteredStyleOptions
} from './expressions.js';

// Collection utilities
export { createReactiveCollection } from './collections.js';
export { ReactiveCollection, type ReactiveCollectionOptions } from './reactive-collection.js';
