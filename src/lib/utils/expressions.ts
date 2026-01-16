/**
 * WebGL style utilities for creating expression-based styles with filtering.
 *
 * WebGL layers in OpenLayers use a flat style format with expression arrays
 * for dynamic styling based on feature properties, zoom levels, and time.
 *
 * @module webgl-styles
 */

// Re-export types from OpenLayers for convenience
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
	FlatText
} from 'ol/style/flat.js';

export type { EncodedExpression, LiteralValue } from 'ol/expr/expression.js';

/**
 * Expression type for WebGL style expressions.
 * Can be a literal value or an array representing an expression.
 */
export type Expression = number | string | boolean | number[] | any[];

/**
 * Options for creating a filtered style rule.
 */
export interface FilteredStyleOptions {
	/** The flat style to apply when the filter matches */
	style: Record<string, Expression>;
	/** Filter expression - if omitted, the rule always applies */
	filter?: Expression;
	/** If true, the rule applies only if no previous rule matched */
	else?: boolean;
}

/**
 * Creates a single style rule with an optional filter.
 * Use this to build conditional styles based on feature properties.
 *
 * @example
 * ```ts
 * // Filter meteorites by year range using variables
 * const rule = createStyleRule({
 *   style: {
 *     'circle-radius': 8,
 *     'circle-fill-color': '#ff0000'
 *   },
 *   filter: ['between', ['get', 'year'], ['var', 'minYear'], ['var', 'maxYear']]
 * });
 * ```
 */
export function createStyleRule(options: FilteredStyleOptions): {
	style: Record<string, Expression>;
	filter?: Expression;
	else?: boolean;
} {
	const rule: { style: Record<string, Expression>; filter?: Expression; else?: boolean } = {
		style: options.style
	};

	if (options.filter !== undefined) {
		rule.filter = options.filter;
	}

	if (options.else !== undefined) {
		rule.else = options.else;
	}

	return rule;
}

/**
 * Creates an array of style rules suitable for use as a WebGL layer style.
 * This is the recommended way to create filtered/conditional styles.
 *
 * @example
 * ```ts
 * // Multiple rules with fallback
 * const style = createStyleRules([
 *   {
 *     style: { 'circle-radius': 10, 'circle-fill-color': 'red' },
 *     filter: ['>', ['get', 'population'], 1000000]
 *   },
 *   {
 *     style: { 'circle-radius': 5, 'circle-fill-color': 'blue' },
 *     else: true
 *   }
 * ]);
 * ```
 */
export function createStyleRules(
	rules: FilteredStyleOptions[]
): Array<{ style: Record<string, Expression>; filter?: Expression; else?: boolean }> {
	return rules.map(createStyleRule);
}

// ============================================================================
// Expression Builders
// ============================================================================

/**
 * Creates a 'get' expression to retrieve a feature property value.
 *
 * @example
 * ```ts
 * get('population') // ['get', 'population']
 * ```
 */
export function get(property: string): ['get', string] {
	return ['get', property];
}

/**
 * Creates a 'var' expression to reference a style variable.
 * Variables can be updated dynamically via `layer.updateStyleVariables()`.
 *
 * @example
 * ```ts
 * variable('minYear') // ['var', 'minYear']
 * ```
 */
export function variable(name: string): ['var', string] {
	return ['var', name];
}

/**
 * Creates a 'time' expression that returns the current animation time in seconds.
 * Use this for animated styles that change over time.
 *
 * @example
 * ```ts
 * time() // ['time']
 * ```
 */
export function time(): ['time'] {
	return ['time'];
}

/**
 * Creates a 'zoom' expression that returns the current map zoom level.
 *
 * @example
 * ```ts
 * zoom() // ['zoom']
 * ```
 */
export function zoom(): ['zoom'] {
	return ['zoom'];
}

/**
 * Creates a linear interpolation expression.
 *
 * @example
 * ```ts
 * // Interpolate radius based on population
 * interpolate('linear', get('population'), 0, 4, 100000, 20)
 * // Result: ['interpolate', ['linear'], ['get', 'population'], 0, 4, 100000, 20]
 * ```
 */
export function interpolate(
	method: 'linear' | ['exponential', number],
	input: Expression,
	...stops: (number | string)[]
): any[] {
	const methodExpr = typeof method === 'string' ? [method] : method;
	return ['interpolate', methodExpr, input, ...stops];
}

/**
 * Creates a 'between' filter expression for range checking.
 *
 * @example
 * ```ts
 * between(get('year'), variable('minYear'), variable('maxYear'))
 * // Result: ['between', ['get', 'year'], ['var', 'minYear'], ['var', 'maxYear']]
 * ```
 */
export function between(value: Expression, min: Expression, max: Expression): any[] {
	return ['between', value, min, max];
}

/**
 * Creates a comparison expression.
 *
 * @example
 * ```ts
 * compare('>', get('population'), 1000000)
 * // Result: ['>', ['get', 'population'], 1000000]
 * ```
 */
export function compare(
	op: '==' | '!=' | '<' | '>' | '<=' | '>=',
	left: Expression,
	right: Expression
): any[] {
	return [op, left, right];
}

/**
 * Creates a 'match' expression for value-based styling.
 *
 * @example
 * ```ts
 * match(get('type'), 'city', 'blue', 'town', 'green', 'gray')
 * // Result: ['match', ['get', 'type'], 'city', 'blue', 'town', 'green', 'gray']
 * ```
 */
export function match(input: Expression, ...casesAndDefault: Expression[]): any[] {
	return ['match', input, ...casesAndDefault];
}

/**
 * Creates a mathematical expression.
 *
 * @example
 * ```ts
 * math('*', get('value'), 2)    // ['*', ['get', 'value'], 2]
 * math('+', time(), 10)         // ['+', ['time'], 10]
 * math('%', time(), 12)         // ['%', ['time'], 12]
 * ```
 */
export function math(
	op:
		| '+'
		| '-'
		| '*'
		| '/'
		| '%'
		| '^'
		| 'clamp'
		| 'abs'
		| 'floor'
		| 'round'
		| 'ceil'
		| 'sin'
		| 'cos'
		| 'atan'
		| 'sqrt',
	...operands: Expression[]
): any[] {
	return [op, ...operands];
}

/**
 * Creates an 'array' expression for multi-value properties like displacement or scale.
 *
 * @example
 * ```ts
 * array(0, get('offset'))
 * // Result: ['array', 0, ['get', 'offset']]
 * ```
 */
export function array(...values: Expression[]): any[] {
	return ['array', ...values];
}

// ============================================================================
// Animation Helpers
// ============================================================================

/**
 * Creates a cyclic animation ratio expression.
 * Returns a value between 0 and 1 that cycles over the given period.
 *
 * @param period - Animation cycle duration in seconds
 * @param offset - Optional offset expression (e.g., based on feature property)
 * @param easing - Optional power for easing (0.5 = ease-out, 2 = ease-in)
 *
 * @example
 * ```ts
 * // Simple pulse animation
 * const pulse = animationCycle(3);
 *
 * // Staggered animation based on year
 * const staggered = animationCycle(12, interpolate('linear', get('year'), 1850, 0, 2015, 12));
 *
 * // With easing
 * const eased = animationCycle(3, undefined, 0.5);
 * ```
 */
export function animationCycle(period: number, offset?: Expression, easing?: number): any[] {
	// Base: (time + offset) % period / period
	let timeExpr: Expression = time();

	if (offset !== undefined) {
		timeExpr = ['+', timeExpr, offset];
	}

	let ratio: Expression = ['/', ['%', timeExpr, period], period];

	if (easing !== undefined) {
		ratio = ['^', ratio, easing];
	}

	return ratio as any[];
}

/**
 * Creates a pulse effect expression for radius or opacity.
 * The value oscillates between baseValue and baseValue * (1 - amplitude).
 *
 * @example
 * ```ts
 * // Pulsing radius between 8 and 12
 * const radius = pulseEffect(10, 0.2, 3);
 * ```
 */
export function pulseEffect(
	baseValue: number | Expression,
	maxValue: number | Expression,
	amplitude: number,
	period: number,
	offset?: Expression,
	easing?: number
): any[] {
	const cycle = animationCycle(period, offset, easing);
	return ['*', baseValue, ['-', maxValue, ['*', cycle, amplitude]]];
}

/**
 * Creates an animated color interpolation between two colors.
 *
 * @example
 * ```ts
 * const color = animatedColor('#ffe52c', 'rgba(242,56,22,0.61)', 3);
 * ```
 */
export function animatedColor(
	startColor: string,
	endColor: string,
	period: number,
	offset?: Expression,
	easing?: number
): any[] {
	const cycle = animationCycle(period, offset, easing);
	return ['interpolate', ['linear'], cycle, 0, startColor, 1, endColor];
}

// ============================================================================
// Common Style Patterns
// ============================================================================

/**
 * Creates a size expression that scales with a feature property.
 *
 * @example
 * ```ts
 * // Size based on population, from 4px to 20px
 * const size = sizeByProperty('population', 0, 4, 1000000, 20);
 * ```
 */
export function sizeByProperty(
	property: string,
	minValue: number,
	minSize: number,
	maxValue: number,
	maxSize: number
): any[] {
	return interpolate('linear', get(property), minValue, minSize, maxValue, maxSize);
}

/**
 * Creates a size expression that scales with zoom level.
 *
 * @example
 * ```ts
 * // Size doubles every zoom level from zoom 5
 * const size = sizeByZoom(5, 2, 15);
 * ```
 */
export function sizeByZoom(
	minZoom: number,
	baseSize: number,
	maxZoom: number,
	exponentialBase: number = 2
): any[] {
	const maxSize = baseSize * Math.pow(exponentialBase, maxZoom - minZoom);
	return interpolate(['exponential', exponentialBase], zoom(), minZoom, baseSize, maxZoom, maxSize);
}
