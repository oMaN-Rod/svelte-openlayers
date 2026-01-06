import XYZ from 'ol/source/XYZ.js';
import type TileLayer from 'ol/layer/Tile';

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

const mapSourcesRecord = {
	osm: {
		id: 'osm',
		name: 'OpenStreetMap',
		url: 'osm',
		attributions: buildAttributions('')
	},
	'carto-light': {
		id: 'carto-light',
		name: 'Carto Light',
		url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	'carto-dark': {
		id: 'carto-dark',
		name: 'Carto Dark',
		url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	'carto-voyager': {
		id: 'carto-voyager',
		name: 'Carto Voyager',
		url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
		attributions: buildAttributions('<a href="https://carto.com/">CARTO</a>')
	},
	satellite: {
		id: 'satellite',
		name: 'Satellite',
		url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		attributions: buildAttributions('&copy; <a href="https://www.esri.com/">Esri</a>')
	}
};

export const mapSources: MapSource[] = Object.values(mapSourcesRecord);

export type MapSourceId = keyof typeof mapSourcesRecord;

const defaultLightModeSource = mapSourcesRecord['carto-light'];
const defaultDarkModeSource = mapSourcesRecord['carto-dark'];

let darkMode = $state(false);

function checkDarkMode(): boolean {
	if (typeof window === 'undefined') return false;
	const hasDarkClass = document.documentElement.classList.contains('dark');
	return hasDarkClass;
}

if (typeof window !== 'undefined') {
	darkMode = checkDarkMode();

	const observer = new MutationObserver(() => {
		darkMode = checkDarkMode();
	});

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class']
	});
}

export const themeMapSource: { readonly current: MapSource } = {
	get current() {
		return darkMode ? defaultDarkModeSource : defaultLightModeSource;
	}
};

export function useThemeMapSource(getLayer: () => TileLayer | null): void {
	$effect(() => {
		const layer = getLayer();
		const source = themeMapSource.current;
		if (layer && source.url !== 'osm') {
			layer.setSource(
				new XYZ({
					url: source.url,
					attributions: source.attributions ? [source.attributions] : []
				})
			);
		}
	});
}
