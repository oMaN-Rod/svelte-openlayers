import { createContext } from 'svelte';
import type { Feature } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';

/**
 * State context provided by Feature components to their children (overlays)
 * Child overlays use this to determine visibility and positioning
 */
export interface FeatureStateContext {
	/**
	 * Get the OpenLayers Feature object
	 */
	getFeature: () => Feature | null;

	/**
	 * Whether the feature is currently being hovered
	 */
	readonly isHovered: boolean;

	/**
	 * Whether the feature is currently selected
	 */
	readonly isSelected: boolean;

	/**
	 * Coordinate where the hover is occurring (for overlay positioning)
	 */
	readonly hoverCoordinate: Coordinate | undefined;

	/**
	 * Coordinate where the click/select occurred (for overlay positioning)
	 */
	readonly clickCoordinate: Coordinate | undefined;
}

// Context for features to provide and overlay children to consume
const [getContext, setFeatureStateContext] = createContext<FeatureStateContext>();

function getFeatureStateContext(): FeatureStateContext | undefined {
	try {
		return getContext();
	} catch {
		// No feature context available - component not inside a Feature
		return undefined;
	}
}

export { setFeatureStateContext, getFeatureStateContext };
