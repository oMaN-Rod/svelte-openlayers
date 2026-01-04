import type { Control } from 'ol/control.js';
import type VectorSource from 'ol/source/Vector.js';
import type { FlatStyleLike } from 'ol/style/flat.js';
import type { StyleLike } from 'ol/style/Style.js';

export interface ControlDrawProps {
	type?: 'Point' | 'LineString' | 'Polygon' | 'Circle';
	source?: VectorSource | null;
	style?: StyleLike | FlatStyleLike;
	control?: Control | null;
	onDrawStart?: (evt: any) => void;
	onDrawEnd?: (evt: any) => void;
	onDrawAbort?: (evt: any) => void;
	onTypeChange?: (type: 'Point' | 'LineString' | 'Polygon' | 'Circle') => void;
}
