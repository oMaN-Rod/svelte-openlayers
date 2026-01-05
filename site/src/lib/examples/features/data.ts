import brooklynBridge from '$lib/img/brooklyn-bridge.webp';
import centralPark from '$lib/img/central-park.webp';
import statueOfLiberty from '$lib/img/statue-of-liberty.webp';
import timesSquare from '$lib/img/times-square.webp';

export interface Location {
	name: string;
	coords: [number, number];
	image: string;
	type: string;
	rating: number;
	reviews: number;
	hours: string;
	address: string;
	phone?: string;
	website?: string;
}

/** NYC landmarks with rich metadata for tooltip display */
export const locations: Location[] = [
	{
		name: 'Central Park',
		coords: [-73.965355, 40.782865],
		image: centralPark,
		type: 'Park',
		rating: 4.8,
		reviews: 245892,
		hours: 'Open 6AM - 1AM',
		address: 'New York, NY 10024',
		phone: '+1 212-310-6600'
	},
	{
		name: 'Times Square',
		coords: [-73.98513, 40.758896],
		image: timesSquare,
		type: 'Landmark',
		rating: 4.6,
		reviews: 189432,
		hours: 'Open 24 hours',
		address: 'Manhattan, NY 10036'
	},
	{
		name: 'Brooklyn Bridge',
		coords: [-73.996864, 40.711174],
		image: brooklynBridge,
		type: 'Bridge',
		rating: 4.8,
		reviews: 156789,
		hours: 'Open 24 hours',
		address: 'Brooklyn Bridge, New York, NY 10038'
	},
	{
		name: 'Statue of Liberty',
		coords: [-74.044502, 40.689247],
		image: statueOfLiberty,
		type: 'Monument',
		rating: 4.7,
		reviews: 98234,
		hours: '9AM - 5PM',
		address: 'Liberty Island, New York, NY 10004',
		phone: '+1 212-363-3200',
		website: 'https://www.nps.gov/stli'
	}
];

/** Tour route connecting Central Park → Times Square → Brooklyn Bridge */
export const tourRoute: [number, number][] = [
	[-73.965355, 40.782865],
	[-73.98513, 40.758896],
	[-73.996864, 40.711174]
];

/** Central Park boundary polygon coordinates */
export const centralParkBoundary: [number, number][][] = [
	[
		[-73.98021871253646, 40.77027200461764],
		[-73.98135532570753, 40.76860169645568],
		[-73.98116483044817, 40.76830306897773],
		[-73.98115801876689, 40.76829482488293],
		[-73.98109760344741, 40.76792115885644],
		[-73.97375288825044, 40.76482052989492],
		[-73.97326503024209, 40.76537580381231],
		[-73.97245835676172, 40.7650023528409],
		[-73.94960315787255, 40.79661308321068],
		[-73.95016363453198, 40.79724072518886],
		[-73.9577904394985, 40.80040799782778],
		[-73.95842880506385, 40.80022593137676],
		[-73.98021871253646, 40.77027200461764]
	]
];

/** Default map center (Times Square, NYC) */
export const DEFAULT_CENTER: [number, number] = [-73.98513, 40.758896];
export const DEFAULT_ZOOM = 11;
