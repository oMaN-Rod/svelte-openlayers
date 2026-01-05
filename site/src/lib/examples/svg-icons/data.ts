export const DEFAULT_CENTER: [number, number] = [20, 30];
export const DEFAULT_ZOOM = 3;

export interface Location {
	coordinates: [number, number];
	name: string;
	type: 'hospital' | 'school' | 'building' | 'house' | 'landmark';
	color: string;
}

export const locations: Location[] = [
	{
		coordinates: [-0.1276, 51.5074],
		name: 'London Hospital',
		type: 'hospital',
		color: '#ef4444' // red
	},
	{
		coordinates: [2.3522, 48.8566],
		name: 'Sorbonne University',
		type: 'school',
		color: '#3b82f6' // blue
	},
	{
		coordinates: [-74.006, 40.7128],
		name: 'Empire State Building',
		type: 'building',
		color: '#8b5cf6' // purple
	},
	{
		coordinates: [13.405, 52.52],
		name: 'Residential Area',
		type: 'house',
		color: '#10b981' // green
	},
	{
		coordinates: [139.6503, 35.6762],
		name: 'Tokyo Tower',
		type: 'landmark',
		color: '#f97316' // orange
	}
];

export const iconMap: Record<Location['type'], string> = {
	hospital: '/src/lib/components/icons/hospital.svg',
	school: '/src/lib/components/icons/school.svg',
	building: '/src/lib/components/icons/building.svg',
	house: '/src/lib/components/icons/house.svg',
	landmark: '/src/lib/components/icons/map-pin.svg'
};
