import brooklynBridge from '$lib/img/brooklyn-bridge.webp';
import centralPark from '$lib/img/central-park.webp';
import statueOfLiberty from '$lib/img/statue-of-liberty.webp';
import timesSquare from '$lib/img/times-square.webp';
import bigBen from '$lib/img/big-ben.webp';
import eiffelTower from '$lib/img/eiffel-tower.webp';
import brandenburgGate from '$lib/img/brandenburg-gate.webp';
import empireStateBuilding from '$lib/img/empire-state-building.webp';

export const DEFAULT_CENTER_US: [number, number] = [-73.99371, 40.73496];
export const DEFAULT_CENTER_EU: [number, number] = [5, 50];
export const DEFAULT_ZOOM = 5;

export interface Location {
	id: string;
	name: string;
	description?: string;
	coords: [number, number];
	image: string;
	type: string;
	rating: number;
	reviews: number;
	hours: string;
	address: string;
	phone?: string;
	website?: string;
	height?: string;
	built?: string;
	visitors?: string;
	feature?: any;
}

export const locationsUS: Location[] = [
	{
		id: 'central-park',
		name: 'Central Park',
		description: 'A large public park in New York City',
		coords: [-73.965355, 40.782865],
		image: centralPark,
		type: 'Park',
		rating: 4.8,
		reviews: 245892,
		hours: 'Open 6AM - 1AM',
		address: 'New York, NY 10024',
		phone: '+1 212-310-6600',
		website: 'https://www.centralparknyc.org',
		visitors: '42M annually',
		feature: null
	},
	{
		id: 'times-square',
		name: 'Times Square',
		description: 'Major commercial intersection and tourist destination',
		coords: [-73.98513, 40.758896],
		image: timesSquare,
		type: 'Landmark',
		rating: 4.6,
		reviews: 189432,
		hours: 'Open 24 hours',
		address: 'Manhattan, NY 10036',
		phone: '+1 212-768-1560',
		website: 'https://www.timessquarenyc.org',
		visitors: '50M annually',
		feature: null
	},
	{
		id: 'brooklyn-bridge',
		name: 'Brooklyn Bridge',
		description: 'Iconic suspension bridge connecting Manhattan and Brooklyn',
		coords: [-73.996864, 40.711174],
		image: brooklynBridge,
		type: 'Bridge',
		rating: 4.8,
		reviews: 156789,
		hours: 'Open 24 hours',
		address: 'Brooklyn Bridge, New York, NY 10038',
		visitors: '14M annually',
		website: 'https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml',
		height: '84m',
		built: '1883',
		feature: null
	},
	{
		id: 'statue-of-liberty',
		name: 'Statue of Liberty',
		description: 'Famous neoclassical sculpture on Liberty Island',
		coords: [-74.044502, 40.689247],
		image: statueOfLiberty,
		type: 'Monument',
		rating: 4.7,
		reviews: 98234,
		hours: '9AM - 5PM',
		address: 'Liberty Island, New York, NY 10004',
		phone: '+1 212-363-3200',
		website: 'https://www.nps.gov/stli',
		visitors: '4M annually',
		height: '93m',
		built: '1886',
		feature: null
	},
	{
		id: 'empire-state-building',
		name: 'Empire State Building',
		description: '102-story Art Deco skyscraper in Midtown Manhattan',
		coords: [-73.9857, 40.7484],
		image: empireStateBuilding,
		type: 'Building',
		rating: 4.7,
		reviews: 210345,
		hours: '8AM - 2AM',
		address: '20 W 34th St, New York, NY 10001',
		phone: '+1 212-736-3100',
		website: 'https://www.esbnyc.com',
		visitors: '4M annually',
		height: '443m',
		built: '1931',
		feature: null
	}
];

// Tour route
export const tourRouteUS: [number, number][] = [
	[-73.965355, 40.782865],
	[-73.98513, 40.758896],
	[-73.9857, 40.7484],
	[-73.996864, 40.711174]
];

export const locationsEU: Location[] = [
	{
		id: 'big-ben',
		name: 'Big Ben',
		description: 'Famous clock tower in London',
		coords: [-0.124626, 51.500729],
		image: bigBen,
		type: 'Clock Tower',
		rating: 4.7,
		reviews: 123456,
		hours: '9AM - 5PM',
		address: 'Westminster, London SW1A 0AA, United Kingdom',
		phone: '+44 20 7219 3000',
		website: 'https://www.parliament.uk/bigben',
		height: '96m',
		built: '1859',
		visitors: '4M annually'
	},
	{
		id: 'eiffel-tower',
		name: 'Eiffel Tower',
		description: 'Iconic iron lattice tower in Paris',
		coords: [2.294481, 48.85837],
		image: eiffelTower,
		type: 'Monument',
		rating: 4.6,
		reviews: 234567,
		hours: '9AM - 12AM',
		address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
		phone: '+33 892 70 12 39',
		website: 'https://www.toureiffel.paris/en',
		height: '330m',
		built: '1889',
		visitors: '7M annually'
	},
	{
		id: 'brandenburg-gate',
		name: 'Brandenburg Gate',
		description: 'Neoclassical monument in Berlin',
		coords: [13.377704, 52.516275],
		image: brandenburgGate,
		type: 'Monument',
		rating: 4.5,
		reviews: 345678,
		hours: 'Open 24 hours',
		address: 'Pariser Platz, 10117 Berlin, Germany',
		phone: '+49 30 9026 2020',
		website: 'https://www.visitberlin.de/en/brandenburg-gate',
		height: '26m',
		built: '1791',
		visitors: '3M annually'
	}
];
