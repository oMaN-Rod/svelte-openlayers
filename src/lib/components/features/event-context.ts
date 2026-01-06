import { createContext } from 'svelte';
import type { Feature } from 'ol';
import type { Coordinate } from 'ol/coordinate.js';
import type {
	FeatureEventCallbacks,
	FeatureInteractiveStyles,
	FeatureRegistration
} from './types.js';

/**
 * State updates that the layer sends to features
 * Selection fields are optional - when omitted, existing selection state is preserved
 */
export interface FeatureStateUpdate {
	isHovered: boolean;
	isSelected?: boolean;
	hoverCoordinate?: Coordinate;
	clickCoordinate?: Coordinate;
}

/**
 * Extended registration with state callback
 */
export interface FeatureRegistrationWithState extends FeatureRegistration {
	onStateChange: (state: FeatureStateUpdate) => void;
}

/**
 * Registry for interactive features - provided by Layer components
 */
export interface FeatureEventRegistry {
	registerFeature(
		id: string,
		feature: Feature,
		callbacks: FeatureEventCallbacks,
		styles: FeatureInteractiveStyles,
		onStateChange: (state: FeatureStateUpdate) => void
	): void;

	unregisterFeature(id: string): void;

	hasInteractiveFeatures(): boolean;

	getRegistrations(): Map<string, FeatureRegistrationWithState>;

	findByFeature(feature: Feature): FeatureRegistrationWithState | undefined;
}

/**
 * Create a new feature event registry instance
 */
export function createFeatureEventRegistry(): FeatureEventRegistry {
	const registrations = new Map<string, FeatureRegistrationWithState>();
	const featureToId = new WeakMap<Feature, string>();

	return {
		registerFeature(
			id: string,
			feature: Feature,
			callbacks: FeatureEventCallbacks,
			styles: FeatureInteractiveStyles,
			onStateChange: (state: FeatureStateUpdate) => void
		): void {
			registrations.set(id, {
				id,
				feature,
				callbacks,
				styles,
				onStateChange
			});
			featureToId.set(feature, id);
		},

		unregisterFeature(id: string): void {
			const reg = registrations.get(id);
			if (reg) {
				featureToId.delete(reg.feature);
			}
			registrations.delete(id);
		},

		hasInteractiveFeatures(): boolean {
			return registrations.size > 0;
		},

		getRegistrations(): Map<string, FeatureRegistrationWithState> {
			return registrations;
		},

		findByFeature(feature: Feature): FeatureRegistrationWithState | undefined {
			const id = featureToId.get(feature);
			return id ? registrations.get(id) : undefined;
		}
	};
}

/**
 * Options for creating a lazy feature event registry
 */
export interface LazyRegistryOptions {
	/**
	 * Callback fired when the first feature registers.
	 * Use this to set up event listeners/controllers only when needed.
	 */
	onFirstRegistration?: () => void;
}

/**
 * Create a lazy feature event registry that defers internal allocation
 * until the first feature actually registers. This provides zero-cost
 * abstraction when no features use interactive callbacks.
 */
export function createLazyFeatureEventRegistry(
	options: LazyRegistryOptions = {}
): FeatureEventRegistry {
	let innerRegistry: FeatureEventRegistry | null = null;

	function getOrCreateRegistry(): FeatureEventRegistry {
		if (!innerRegistry) {
			innerRegistry = createFeatureEventRegistry();
			options.onFirstRegistration?.();
		}
		return innerRegistry;
	}

	return {
		registerFeature(
			id: string,
			feature: Feature,
			callbacks: FeatureEventCallbacks,
			styles: FeatureInteractiveStyles,
			onStateChange: (state: FeatureStateUpdate) => void
		): void {
			getOrCreateRegistry().registerFeature(id, feature, callbacks, styles, onStateChange);
		},

		unregisterFeature(id: string): void {
			// Only unregister if registry was ever created
			innerRegistry?.unregisterFeature(id);
		},

		hasInteractiveFeatures(): boolean {
			// If registry was never created, there are no features
			return innerRegistry?.hasInteractiveFeatures() ?? false;
		},

		getRegistrations(): Map<string, FeatureRegistrationWithState> {
			// Return empty map if registry was never created
			return innerRegistry?.getRegistrations() ?? new Map();
		},

		findByFeature(feature: Feature): FeatureRegistrationWithState | undefined {
			return innerRegistry?.findByFeature(feature);
		}
	};
}

// Context for layers to provide and features to consume
const [getRegistry, setFeatureEventRegistry] = createContext<FeatureEventRegistry>();

function getFeatureEventRegistry(): FeatureEventRegistry | undefined {
	try {
		return getRegistry();
	} catch {
		// No registry available - layer doesn't support interactive features
		return undefined;
	}
}

export { setFeatureEventRegistry, getFeatureEventRegistry };
