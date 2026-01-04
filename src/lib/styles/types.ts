import type { Options as OLCircleStyleOptions } from 'ol/style/Circle.js';
import type { Options as OLFillStyleOptions } from 'ol/style/Fill.js';
import type { Options as OLIconStyleOptions } from 'ol/style/Icon.js';
import type { Options as OLRegularShapeStyleOptions } from 'ol/style/RegularShape.js';
import type { Options as OLStrokeStyleOptions } from 'ol/style/Stroke.js';
import type { Options as OLTextStyleOptions } from 'ol/style/Text.js';

export type FillStyleOptions = OLFillStyleOptions;
export type StrokeStyleOptions = OLStrokeStyleOptions;
export type TextStyleOptions = OLTextStyleOptions;

export interface CircleStyleOptions extends Omit<OLCircleStyleOptions, 'fill' | 'stroke'> {
	fill?: FillStyleOptions;
	stroke?: StrokeStyleOptions;
}

export interface IconStyleOptions extends OLIconStyleOptions {
	src: string;
}

export interface RegularShapeOptions extends Omit<OLRegularShapeStyleOptions, 'fill' | 'stroke'> {
	fill?: FillStyleOptions;
	stroke?: StrokeStyleOptions;
}

export type PointStyleOptions = CircleStyleOptions | IconStyleOptions | RegularShapeOptions;
