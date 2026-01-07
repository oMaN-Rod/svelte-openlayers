import { clsx, type ClassValue } from 'clsx';
import type Feature from 'ol/Feature';
import type { Geometry } from 'ol/geom';
import { transform } from 'ol/proj';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function getFeatureInfo(feature: Feature<Geometry>) {
	const geom = feature.getGeometry();
	if (!geom) return { type: 'Unknown', details: '' };

	const type = geom.getType();
	let details = '';

	const formatCoords = (coords: number[][]) => {
		const transformed = coords.map((c) => transform(c, 'EPSG:3857', 'EPSG:4326'));
		return transformed.map((c) => `(${c[1].toFixed(2)}, ${c[0].toFixed(2)})`).join(', ');
	};

	const coords = (geom as any).getCoordinates();

	switch (type) {
		case 'Point':
			const point = formatCoords([coords]);
			details = `Coordinates: [ ${point} ]`;
			break;
		case 'LineString':
			const line = formatCoords(coords);
			details = `${coords.length} points: [ ${line} ]`;
			break;
		case 'Polygon':
			const polygon = formatCoords(coords[0]);
			details = `${coords[0].length - 1} vertices: [ ${polygon} ]`;
			break;
		case 'Circle':
			const center = (geom as any).getCenter();
			const circleCenter = formatCoords([center]);
			const radius = (geom as any).getRadius();
			details = `Center: ${circleCenter}, Radius: ${radius.toFixed(0)}m`;
			break;
	}

	return { type, details };
}
