export const DEFAULT_CENTER: [number, number] = [0, 0];
export const DEFAULT_ZOOM = 2;

export interface City {
	name: string;
	coordinates: [number, number];
}

export const cities: City[] = [
	{ name: 'New York', coordinates: [-74.006, 40.7128] },
	{ name: 'London', coordinates: [-0.1276, 51.5074] },
	{ name: 'Tokyo', coordinates: [139.6503, 35.6762] },
	{ name: 'Sydney', coordinates: [151.2093, -33.8688] },
	{ name: 'Paris', coordinates: [2.3522, 48.8566] },
	{ name: 'Dubai', coordinates: [55.2708, 25.2048] }
];
