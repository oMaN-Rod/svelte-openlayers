import FeaturePoint from './FeaturePoint.svelte';
import FeatureLineString from './FeatureLineString.svelte';
import FeaturePolygon from './FeaturePolygon.svelte';

export const Feature = {
	Point: FeaturePoint,
	LineString: FeatureLineString,
	Polygon: FeaturePolygon
};

export { FeaturePoint, FeatureLineString, FeaturePolygon };