export interface MarkerLocation {
	id: string;
	name: string;
	coordinates: [number, number];
	type: 'active' | 'warning' | 'info' | 'success';
	size: number;
	pulse?: boolean;
	description?: string;
}

export const DEFAULT_CENTER: [number, number] = [-73.99, 40.74];
export const DEFAULT_ZOOM = 12;

export const markerLocations: MarkerLocation[] = [
	{
		id: 'loc-1',
		name: 'Central Hub',
		coordinates: [-73.965355, 40.782865],
		type: 'success',
		size: 16,
		pulse: true,
		description: 'Main operational center'
	},
	{
		id: 'loc-2',
		name: 'Times Square Node',
		coordinates: [-73.98513, 40.758896],
		type: 'active',
		size: 12,
		pulse: true,
		description: 'High traffic monitoring point'
	},
	{
		id: 'loc-3',
		name: 'Downtown Sensor',
		coordinates: [-73.996864, 40.711174],
		type: 'warning',
		size: 14,
		pulse: true,
		description: 'Elevated activity detected'
	},
	{
		id: 'loc-4',
		name: 'Harbor Station',
		coordinates: [-74.044502, 40.689247],
		type: 'info',
		size: 10,
		pulse: true,
		description: 'Remote monitoring station'
	},
	{
		id: 'loc-5',
		name: 'Midtown Relay',
		coordinates: [-73.9857, 40.7484],
		type: 'active',
		size: 12,
		pulse: true,
		description: 'Data relay point'
	}
];

// Color mappings for marker types
export const typeColors: Record<
	MarkerLocation['type'],
	{ base: string; pulse: string; glow: string }
> = {
	active: {
		base: 'bg-blue-500',
		pulse: 'bg-blue-500/40',
		glow: 'shadow-blue-500/50'
	},
	warning: {
		base: 'bg-amber-500',
		pulse: 'bg-amber-500/40',
		glow: 'shadow-amber-500/50'
	},
	info: {
		base: 'bg-cyan-500',
		pulse: 'bg-cyan-400/40',
		glow: 'shadow-cyan-400/50'
	},
	success: {
		base: 'bg-emerald-500',
		pulse: 'bg-emerald-500/40',
		glow: 'shadow-emerald-500/50'
	}
};
