import GeoJSON from 'ol/format/GeoJSON.js';
import type { Feature } from 'ol';

const WORLD_CITIES_URL =
	'https://raw.githubusercontent.com/openlayers/openlayers/main/examples/data/geojson/world-cities.geojson';

/**
 * Fetches world cities GeoJSON data from the OpenLayers examples repository
 * and converts it to OpenLayers features projected to Web Mercator (EPSG:3857)
 */
export async function fetchWorldCities(): Promise<Feature[]> {
	const response = await fetch(WORLD_CITIES_URL);
	const data = await response.json();
	const format = new GeoJSON();
	return format.readFeatures(data, {
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:3857'
	});
}
