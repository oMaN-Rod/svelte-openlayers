import { Style, Circle, Fill, Stroke, Text, Icon, RegularShape } from 'ol/style.js';
import type { Feature } from 'ol';
import type {
	PointStyleOptions,
	FillStyleOptions,
	StrokeStyleOptions,
	TextStyleOptions,
	CircleStyleOptions,
	IconStyleOptions,
	RegularShapeOptions
} from '$lib/styles/types.js';

export function createStroke(options: StrokeStyleOptions): Stroke {
	return new Stroke(options);
}

export function createFill(options: FillStyleOptions): Fill {
	return new Fill(options);
}

export function createText(options: TextStyleOptions): Text {
	const { fill, stroke, backgroundFill, backgroundStroke, ...rest } = options as any;
	const textOptions: any = { ...rest };

	if (fill) textOptions.fill = createFill(fill);
	if (stroke) textOptions.stroke = createStroke(stroke);
	if (backgroundFill) textOptions.backgroundFill = createFill(backgroundFill);
	if (backgroundStroke) textOptions.backgroundStroke = createStroke(backgroundStroke);

	return new Text(textOptions);
}

export function createCircleStyle(options: CircleStyleOptions): Style {
	const { fill, stroke, ...rest } = options;
	const circleOptions: any = { ...rest };

	if (fill) {
		circleOptions.fill = createFill(fill);
	}

	if (stroke) {
		circleOptions.stroke = createStroke(stroke);
	}

	return new Style({
		image: new Circle(circleOptions)
	});
}

export function createTextStyle(options: TextStyleOptions): Style {
	return new Style({
		text: createText(options)
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
	image?: PointStyleOptions;
	text?: TextStyleOptions;
}): Style {
	const styleOptions: any = {};

	if (options.fill) {
		styleOptions.fill = createFill(options.fill);
	}

	if (options.stroke) {
		styleOptions.stroke = createStroke(options.stroke);
	}

	if (options.image) {
		styleOptions.image = createImage(options.image);
	}

	if (options.text) {
		styleOptions.text = createText(options.text);
	}

	return new Style(styleOptions);
}

export function createStyleFromFeature(feature: Feature): Style {
	const fill = feature.get('fill') as FillStyleOptions | undefined;
	const stroke = feature.get('stroke') as StrokeStyleOptions | undefined;
	const image = feature.get('image') as PointStyleOptions | undefined;
	const text = feature.get('text') as TextStyleOptions | undefined;

	const styleOptions: any = {};

	if (fill) {
		styleOptions.fill = createFill(fill);
	}

	if (stroke) {
		styleOptions.stroke = createStroke(stroke);
	}

	if (image) {
		styleOptions.image = createImage(image);
	}

	if (text) {
		styleOptions.text = createText(text);
	}

	return new Style(styleOptions);
}

export function isCircleStyleOptions(options: PointStyleOptions): options is CircleStyleOptions {
	return 'radius' in options && !('src' in options) && !('points' in options);
}

export function isIconStyleOptions(options: PointStyleOptions): options is IconStyleOptions {
	return 'src' in options;
}

export function isRegularShapeOptions(options: PointStyleOptions): options is RegularShapeOptions {
	return 'points' in options;
}

export function createImage(options: PointStyleOptions): Circle | Icon | RegularShape {
	if (isIconStyleOptions(options)) {
		return new Icon(options);
	}

	if (isRegularShapeOptions(options)) {
		const { fill, stroke, ...rest } = options;
		const shapeOptions: any = { ...rest };

		if (fill) {
			shapeOptions.fill = createFill(fill);
		}
		if (stroke) {
			shapeOptions.stroke = createStroke(stroke);
		}

		return new RegularShape(shapeOptions);
	}

	if (isCircleStyleOptions(options)) {
		const { fill, stroke, ...rest } = options;
		const circleOptions: any = { ...rest };

		if (fill) {
			circleOptions.fill = createFill(fill);
		}
		if (stroke) {
			circleOptions.stroke = createStroke(stroke);
		}

		return new Circle(circleOptions);
	}

	return new Circle({ radius: 6, fill: new Fill({ color: '#3b82f6' }) });
}

export function setDefaultStyleProperties(feature: Feature): void {
	const geometry = feature.getGeometry();
	const geomType = geometry?.getType();

	const defaultFillColor = 'rgba(59, 130, 246, 0.3)';
	const defaultStrokeColor = '#2563eb';
	const defaultStrokeWidth = 2;

	switch (geomType) {
		case 'Point':
		case 'MultiPoint':
			feature.set(
				'image',
				{
					type: 'circle',
					radius: 6,
					fill: { color: '#3b82f6' },
					stroke: { color: defaultStrokeColor, width: defaultStrokeWidth }
				},
				true
			);
			break;
		case 'LineString':
		case 'MultiLineString':
			feature.set('stroke', { color: defaultStrokeColor, width: defaultStrokeWidth }, true);
			break;
		case 'Polygon':
		case 'MultiPolygon':
		case 'Circle':
			feature.set('fill', { color: defaultFillColor }, true);
			feature.set('stroke', { color: defaultStrokeColor, width: defaultStrokeWidth }, true);
			break;
	}
}

export function createFeatureStyleFunction() {
	return (feature: Feature): Style => {
		return createStyleFromFeature(feature);
	};
}

export function hexToRgba(hex: string, opacity: number): string {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function parseColor(color: any): { hex: string; opacity: number } | null {
	if (typeof color === 'string') {
		if (color.startsWith('#')) {
			return { hex: color.slice(0, 7), opacity: 1 };
		}
		if (color.startsWith('rgba')) {
			const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
			if (match) {
				const r = parseInt(match[1]);
				const g = parseInt(match[2]);
				const b = parseInt(match[3]);
				const a = match[4] ? parseFloat(match[4]) : 1;
				const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
				return { hex, opacity: a };
			}
		}
		if (color.startsWith('rgb')) {
			const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
			if (match) {
				const r = parseInt(match[1]);
				const g = parseInt(match[2]);
				const b = parseInt(match[3]);
				const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
				return { hex, opacity: 1 };
			}
		}
	}
	if (Array.isArray(color) && color.length >= 3) {
		const [r, g, b, a = 1] = color;
		const hex = '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
		return { hex, opacity: a };
	}
	return null;
}
