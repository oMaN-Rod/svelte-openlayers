import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { fromLonLat } from 'ol/proj.js';

const METEORITES_URL =
	'https://raw.githubusercontent.com/openlayers/openlayers/main/examples/data/csv/meteorite_landings.csv';

export const MIN_YEAR = 1850;
export const MAX_YEAR = 2015;

export interface MeteoriteData {
	name: string;
	mass: number;
	year: number;
	coordinates: [number, number];
}

export async function fetchMeteoriteLandings(): Promise<Feature[]> {
	const response = await fetch(METEORITES_URL);
	const csv = await response.text();
	const features: Feature[] = [];

	// Skip header line
	let prevIndex = csv.indexOf('\n') + 1;
	let curIndex: number;

	while ((curIndex = csv.indexOf('\n', prevIndex)) !== -1) {
		const line = csv.substring(prevIndex, curIndex).split(',');
		prevIndex = curIndex + 1;

		const lon = parseFloat(line[4]);
		const lat = parseFloat(line[3]);
		const coords = fromLonLat([lon, lat]);

		// Guard against bad data
		if (isNaN(coords[0]) || isNaN(coords[1])) {
			continue;
		}

		const mass = parseFloat(line[1]) || 0;
		const year = parseInt(line[2]) || 0;

		features.push(
			new Feature({
				name: line[0],
				mass: mass,
				year: year,
				geometry: new Point(coords)
			})
		);
	}

	return features;
}

export function getYearRange(features: Feature[]): { min: number; max: number } {
	let min = Infinity;
	let max = -Infinity;

	for (const feature of features) {
		const year = feature.get('year');
		if (year > 0) {
			min = Math.min(min, year);
			max = Math.max(max, year);
		}
	}

	return { min: min === Infinity ? 1850 : min, max: max === -Infinity ? 2015 : max };
}

export function getCurrentYear(
	timestamp: number,
	animationStartTime: number,
	animationPeriod: number
): number {
	const elapsedSeconds = (timestamp - animationStartTime) / 1000;
	const cyclePosition = (elapsedSeconds % animationPeriod) / animationPeriod;
	// Reverse because newer years pulse first in the animation
	const yearInCycle = Math.round(MAX_YEAR - cyclePosition * (MAX_YEAR - MIN_YEAR));
	return Math.max(MIN_YEAR, Math.min(MAX_YEAR, yearInCycle));
}

// Validation functions
export function validateMinYear(value: number, maxYear: number): string | null {
	if (value < MIN_YEAR) return `Minimum is ${MIN_YEAR}`;
	if (value > MAX_YEAR) return `Maximum is ${MAX_YEAR}`;
	if (value > maxYear) return `Must be ≤ max year (${maxYear})`;
	return null;
}

export function validateMaxYear(value: number, minYear: number): string | null {
	if (value < MIN_YEAR) return `Minimum is ${MIN_YEAR}`;
	if (value > MAX_YEAR) return `Maximum is ${MAX_YEAR}`;
	if (value < minYear) return `Must be ≥ min year (${minYear})`;
	return null;
}
