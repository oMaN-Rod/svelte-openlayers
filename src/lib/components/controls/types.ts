import type { Feature } from 'ol';
import type { Control } from 'ol/control.js';
import type { Geometry } from 'ol/geom.js';
import type VectorSource from 'ol/source/Vector.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';

export type DrawType = 'Point' | 'LineString' | 'Polygon' | 'Circle';
export type ControlDrawType = DrawType | 'Select' | null;

export interface ControlDrawProps {
	type?: ControlDrawType;
	source?: VectorSource | null;
	style?: StyleLike | FlatStyleLike;
	selectStyle?: StyleLike;
	control?: Control | null;
	selectedFeature?: Feature<Geometry> | null;
	showPropertiesPanel?: boolean;
	propertiesPanelPosition?: 'left' | 'right';
	onDrawStart?: (evt: any) => void;
	onDrawEnd?: (evt: any) => void;
	onDrawAbort?: (evt: any) => void;
	onTypeChange?: (type: ControlDrawType) => void;
	onFeatureSelect?: (feature: Feature<Geometry> | null) => void;
	onFeatureModified?: (feature: Feature<Geometry>) => void;
	onFeatureDelete?: (feature: Feature<Geometry>) => void;
}

export interface ControlFeaturePanelProps {
	title?: string;
	feature?: Feature<Geometry> | null;
	visible?: boolean;
	position?: 'left' | 'right';
	onStyleChange?: (feature: Feature<Geometry>, style: any) => void;
	onPropertyChange?: (feature: Feature<Geometry>, key: string, value: any) => void;
	onDelete?: (feature: Feature<Geometry>) => void;
	onClose?: () => void;
	control?: Control | null;
}
