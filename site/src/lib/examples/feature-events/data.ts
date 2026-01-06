// NYC locations
export const locations = [
	{
		id: 1,
		name: 'Central Park',
		type: 'Park',
		coords: [-73.965355, 40.782865] as [number, number]
	},
	{
		id: 2,
		name: 'Times Square',
		type: 'Landmark',
		coords: [-73.98513, 40.758896] as [number, number]
	},
	{
		id: 3,
		name: 'Brooklyn Bridge',
		type: 'Bridge',
		coords: [-73.996864, 40.711174] as [number, number]
	},
	{ id: 4, name: 'Empire State', type: 'Building', coords: [-73.9857, 40.7484] as [number, number] }
];

// Tour route
export const tourRoute: [number, number][] = [
	[-73.965355, 40.782865],
	[-73.98513, 40.758896],
	[-73.9857, 40.7484],
	[-73.996864, 40.711174]
];
