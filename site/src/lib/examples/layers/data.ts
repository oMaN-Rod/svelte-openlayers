export interface Airport {
	name: string;
	coordinates: [number, number];
	code: string;
}

export interface Railway {
	name: string;
	coordinates: [number, number][];
}

export interface Region {
	name: string;
	coordinates: [number, number][][];
}

/** Major European airports */
export const airports: Airport[] = [
	{ name: 'Heathrow', coordinates: [-0.4614, 51.47], code: 'LHR' },
	{ name: 'Charles de Gaulle', coordinates: [2.5479, 49.0097], code: 'CDG' },
	{ name: 'Schiphol', coordinates: [4.7683, 52.3105], code: 'AMS' }
];

/** High-speed rail connections */
export const railways: Railway[] = [
	{
		name: 'London-Paris',
		coordinates: [
			[-0.1276, 51.5074],
			[2.3522, 48.8566]
		]
	},
	{
		name: 'Paris-Amsterdam',
		coordinates: [
			[2.3522, 48.8566],
			[4.9041, 52.3676]
		]
	}
];

/** Metropolitan regions */
export const regions: Region[] = [
	{
		name: 'Greater London',
		coordinates: [
			[
				[-0.5, 51.3],
				[0.3, 51.3],
				[0.3, 51.7],
				[-0.5, 51.7],
				[-0.5, 51.3]
			]
		]
	}
];

/** All sample data grouped by category */
export const sampleData = {
	airports,
	railways,
	regions
};

/** Default map view settings */
export const DEFAULT_CENTER: [number, number] = [2, 51];
export const DEFAULT_ZOOM = 6;
