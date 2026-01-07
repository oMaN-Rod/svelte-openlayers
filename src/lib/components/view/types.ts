import type { View } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type { Extent } from 'ol/extent.js';
import type { ProjectionLike } from 'ol/proj.js';
import type { Snippet } from 'svelte';

export interface ViewProps {
	view?: null | View;
	bbox?: null | Extent;
	center?: Coordinate;
	zoom?: number;
	projection?: ProjectionLike;
	minZoom?: number;
	maxZoom?: number;
	rotation?: number;
	extent?: Extent;
	constrainRotation?: boolean | number;
	enableRotation?: boolean;
	onCenterChange?: (center: Coordinate) => void;
	onZoomChange?: (zoom: number | undefined) => void;
	onRotationChange?: (rotation: number) => void;
	onMoveEnd?: (evt: any) => void;
	children?: Snippet;
}
