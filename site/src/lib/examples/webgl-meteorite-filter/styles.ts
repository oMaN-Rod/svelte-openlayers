import {
	createStyleRules,
	get,
	variable,
	interpolate,
	between,
	animationCycle,
	math,
	type FlatStyleLike,
	pulseEffect
} from 'svelte-openlayers';
import { MAX_YEAR, MIN_YEAR } from './data';

// Colors for the pulse animation
const oldColor = '#667de9';
const newColor = '#764ca4';

/**
 * WebGL style for meteorite points with pulse animation
 * - Circle radius scales with mass (bigger meteorites = bigger circles)
 * - Radius pulsates (shrinks by up to 43% during animation)
 * - Color transitions from yellow (new animation phase) to red (old animation phase)
 * - Opacity pulsates with the animation
 */

/**
 * Creates a filtered style for the WebGL layer that filters meteorites by year range.
 * Uses style variables (minYear, maxYear) that can be updated dynamically.
 *
 * Returns an array of style rules (Array<Rule>) which is a valid FlatStyleLike.
 */
export function createFilteredStyle(period: number): FlatStyleLike {
	const offset = interpolate('linear', get('year'), MIN_YEAR, 0, MAX_YEAR, period);
	const animRatio = animationCycle(period, offset, 0.5);
	const baseValue = interpolate('linear', get('mass'), 0, 4, 200000, 12);
	const meteoriteStyle = {
		'circle-radius': pulseEffect(baseValue, 1.75, 1, period, offset, 0.5),
		'circle-fill-color': interpolate('linear', animRatio, 0, newColor, 1, oldColor),
		'circle-opacity': math('-', 1.0, math('*', animRatio, 1))
	};

	return createStyleRules([
		{
			style: meteoriteStyle,
			filter: between(get('year'), variable('minYear'), variable('maxYear'))
		}
	]);
}
