export interface Landmark {
	id: number;
	name: string;
	coordinates: [number, number];
	description: string;
	height: string;
	built: string;
	visitors: string;
}

/** European landmarks for tooltip demonstration */
export const landmarks: Landmark[] = [
	{
		id: 1,
		name: 'Eiffel Tower',
		coordinates: [2.2945, 48.8584],
		description: 'Iconic iron lattice tower in Paris',
		height: '330m',
		built: '1889',
		visitors: '7M annually'
	},
	{
		id: 2,
		name: 'Big Ben',
		coordinates: [-0.1246, 51.4994],
		description: 'Famous clock tower in London',
		height: '96m',
		built: '1859',
		visitors: '5M annually'
	},
	{
		id: 3,
		name: 'Brandenburg Gate',
		coordinates: [13.3777, 52.5163],
		description: 'Neoclassical monument in Berlin',
		height: '26m',
		built: '1791',
		visitors: '3M annually'
	}
];

/** Default map view settings */
export const DEFAULT_CENTER: [number, number] = [5, 50];
export const DEFAULT_ZOOM = 5;
