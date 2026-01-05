import type { Feature as OlFeature } from 'ol';

export interface Location {
	id: string;
	name: string;
	coords: [number, number];
	visitors: string;
	feature: OlFeature | null;
}

// NYC landmark locations with visitor statistics
export const nycLocations: Location[] = [
	{
		id: 'cp',
		name: 'Central Park',
		coords: [-73.965355, 40.782865],
		visitors: '42M/year',
		feature: null
	},
	{
		id: 'ts',
		name: 'Times Square',
		coords: [-73.98513, 40.758896],
		visitors: '50M/year',
		feature: null
	},
	{
		id: 'bb',
		name: 'Brooklyn Bridge',
		coords: [-73.996864, 40.711174],
		visitors: '13M/year',
		feature: null
	},
	{
		id: 'sl',
		name: 'Statue of Liberty',
		coords: [-74.044502, 40.689247],
		visitors: '4.5M/year',
		feature: null
	},
	{
		id: 'es',
		name: 'Empire State',
		coords: [-73.985664, 40.748433],
		visitors: '4M/year',
		feature: null
	},
	{
		id: 'hs',
		name: 'High Line',
		coords: [-74.00479, 40.74787],
		visitors: '8M/year',
		feature: null
	}
];

export const DEFAULT_CENTER: [number, number] = [-73.98513, 40.758896]; // Times Square, NYC
