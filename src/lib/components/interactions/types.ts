import type { Feature, Collection } from 'ol';
import type { FeatureLike } from 'ol/Feature.js';
import type { Coordinate } from 'ol/coordinate.js';
import type { Geometry } from 'ol/geom.js';
import type { Interaction } from 'ol/interaction.js';
import type { FilterFunction } from 'ol/interaction/Select.js';
import type Layer from 'ol/layer/Layer.js';
import type VectorSource from 'ol/source/Vector.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';

export interface InteractionSelectProps {
	style?: StyleLike;
	layers?: Layer[];
	filter?: FilterFunction;
	multi?: boolean;
	hitTolerance?: number;
	addCondition?: any;
	removeCondition?: any;
	toggleCondition?: any;
	onSelect?: (features: Feature<Geometry>[]) => void;
	interaction?: Interaction | null;
	selectedFeatures?: Collection<Feature<Geometry>> | null;
	reactive?: boolean;
}

export interface InteractionHoverProps {
	onHover?: (feature: FeatureLike | null, coordinate?: Coordinate) => void;
	onHoverEnd?: () => void;
	layers?: Layer[];
	hitTolerance?: number;
	interaction?: any | null;
}

export interface InteractionDrawProps {
	type: 'Point' | 'LineString' | 'Polygon' | 'Circle';
	source: VectorSource | null;
	features?: Collection<Feature<Geometry>> | null;
	clickTolerance?: number;
	snapTolerance?: number;
	stopClick?: boolean;
	maxPoints?: number;
	minPoints?: number;
	finishCondition?: any;
	style?: StyleLike | FlatStyleLike;
	geometryFunction?: any;
	geometryName?: string;
	condition?: any;
	freehand?: boolean;
	freehandCondition?: any;
	trace?: boolean | any;
	traceSource?: VectorSource;
	wrapX?: boolean;
	geometryLayout?: 'XY' | 'XYZ' | 'XYM' | 'XYZM';
	onDrawStart?: (evt: any) => void;
	onDrawEnd?: (evt: any) => void;
	onDrawAbort?: (evt: any) => void;
	interaction?: Interaction | null;
}

export interface InteractionModifyProps {
	features?: Collection<Feature<Geometry>> | Feature<Geometry>[] | null;
	source?: VectorSource | null;
	style?: StyleLike | FlatStyleLike;
	pixelTolerance?: number;
	condition?: any;
	deleteCondition?: any;
	insertVertexCondition?: any;
	hitDetection?: boolean | Layer;
	onModifyStart?: (evt: any) => void;
	onModifyEnd?: (evt: any) => void;
	interaction?: Interaction | null;
}
