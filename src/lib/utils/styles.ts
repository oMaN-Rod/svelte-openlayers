import { Style, Circle, Fill, Stroke, Text, Icon } from 'ol/style.js';
import type { Color } from 'ol/color.js';
import type { Size } from 'ol/size.js';

export interface CircleStyleOptions {
	radius: number;
	fill?: Color | string;
	stroke?: Color | string;
	strokeWidth?: number;
	displacement?: number[];
	scale?: number | Size;
}

export interface StrokeStyleOptions {
	color?: Color | string;
	width?: number;
	lineCap?: CanvasLineCap;
	lineJoin?: CanvasLineJoin;
	lineDash?: number[];
	lineDashOffset?: number;
	miterLimit?: number;
}

export interface FillStyleOptions {
	color?: Color | string;
}

export interface TextStyleOptions {
	text: string;
	font?: string;
	offsetX?: number;
	offsetY?: number;
	scale?: number | Size;
	rotateWithView?: boolean;
	rotation?: number;
	textAlign?: CanvasTextAlign;
	justify?: 'left' | 'center' | 'right';
	textBaseline?: CanvasTextBaseline;
	fill?: FillStyleOptions;
	stroke?: StrokeStyleOptions;
	backgroundFill?: FillStyleOptions;
	backgroundStroke?: StrokeStyleOptions;
	padding?: number[];
}

export interface IconStyleOptions {
	src: string;
	anchor?: number[];
	anchorXUnits?: 'fraction' | 'pixels';
	anchorYUnits?: 'fraction' | 'pixels';
	color?: Color | string;
	crossOrigin?: string | null;
	offset?: number[];
	displacement?: number[];
	opacity?: number;
	scale?: number | Size;
	width?: number;
	height?: number;
	rotation?: number;
	rotateWithView?: boolean;
	size?: Size;
}

export function createCircleStyle(options: CircleStyleOptions): Style {
	const circleOptions: any = {
		radius: options.radius
	};

	if (options.fill) {
		circleOptions.fill = new Fill({ color: options.fill });
	}

	if (options.stroke || options.strokeWidth) {
		circleOptions.stroke = new Stroke({
			color: options.stroke,
			width: options.strokeWidth
		});
	}

	if (options.displacement) circleOptions.displacement = options.displacement;
	if (options.scale) circleOptions.scale = options.scale;

	return new Style({
		image: new Circle(circleOptions)
	});
}

export function createStrokeStyle(options: StrokeStyleOptions): Stroke {
	return new Stroke(options);
}

export function createFillStyle(options: FillStyleOptions): Fill {
	return new Fill(options);
}

export function createTextStyle(options: TextStyleOptions): Style {
	const textOptions: any = {
		text: options.text
	};

	if (options.font) textOptions.font = options.font;
	if (options.offsetX) textOptions.offsetX = options.offsetX;
	if (options.offsetY) textOptions.offsetY = options.offsetY;
	if (options.scale) textOptions.scale = options.scale;
	if (options.rotation !== undefined) textOptions.rotation = options.rotation;
	if (options.rotateWithView !== undefined) textOptions.rotateWithView = options.rotateWithView;
	if (options.textAlign) textOptions.textAlign = options.textAlign;
	if (options.justify) textOptions.justify = options.justify;
	if (options.textBaseline) textOptions.textBaseline = options.textBaseline;
	if (options.padding) textOptions.padding = options.padding;

	if (options.fill) {
		textOptions.fill = new Fill(options.fill);
	}

	if (options.stroke) {
		textOptions.stroke = new Stroke(options.stroke);
	}

	if (options.backgroundFill) {
		textOptions.backgroundFill = new Fill(options.backgroundFill);
	}

	if (options.backgroundStroke) {
		textOptions.backgroundStroke = new Stroke(options.backgroundStroke);
	}

	return new Style({
		text: new Text(textOptions)
	});
}

export function createIconStyle(options: IconStyleOptions): Style {
	return new Style({
		image: new Icon(options)
	});
}

export function createStyle(options: {
	fill?: FillStyleOptions;
	stroke?: StrokeStyleOptions;
	image?: CircleStyleOptions | IconStyleOptions;
	text?: TextStyleOptions;
}): Style {
	const styleOptions: any = {};

	if (options.fill) {
		styleOptions.fill = new Fill(options.fill);
	}

	if (options.stroke) {
		styleOptions.stroke = new Stroke(options.stroke);
	}

	if (options.image) {
		if ('radius' in options.image) {
			const circleOptions: any = { radius: options.image.radius };
			if (options.image.fill) {
				circleOptions.fill = new Fill({ color: options.image.fill });
			}
			if (options.image.stroke || options.image.strokeWidth) {
				circleOptions.stroke = new Stroke({
					color: options.image.stroke,
					width: options.image.strokeWidth
				});
			}
			styleOptions.image = new Circle(circleOptions);
		} else if ('src' in options.image) {
			styleOptions.image = new Icon(options.image);
		}
	}

	if (options.text) {
		const textOptions: any = { text: options.text.text };
		if (options.text.fill) {
			textOptions.fill = new Fill(options.text.fill);
		}
		if (options.text.stroke) {
			textOptions.stroke = new Stroke(options.text.stroke);
		}
		styleOptions.text = new Text(textOptions);
	}

	return new Style(styleOptions);
}