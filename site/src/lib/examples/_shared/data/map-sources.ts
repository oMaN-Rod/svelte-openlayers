const buildAttributions = (append: string) => {
	let parts = [
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	];
	if (append) {
		parts.push(append);
	}
	return parts.join(' & ');
};

export interface MapSource {
	id: string;
	name: string;
	url: string;
	attributions?: string;
}

export const mapSources: MapSource[] = [
	{ id: 'osm', name: 'OpenStreetMap', url: 'osm' },
	{
		id: 'carto-light',
		name: 'Carto Light',
		url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'carto-dark',
		name: 'Carto Dark',
		url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'carto-voyager',
		name: 'Carto Voyager',
		url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	{
		id: 'satellite',
		name: 'Satellite',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attributions: buildAttributions('&copy; <a href="https://www.esri.com/">Esri</a>')
	}
];

export function getMapSource(id: string): MapSource | undefined {
	return mapSources.find((s) => s.id === id);
}
