import Collection from 'ol/Collection.js';
import type Feature from 'ol/Feature.js';
import { createSubscriber } from 'svelte/reactivity';
import type { CollectionEvent } from 'ol/Collection.js';
import type BaseEvent from 'ol/events/Event.js';

export interface ReactiveCollectionOptions {
	/**
	 * Whether to make the collection reactive. Defaults to true.
	 * Set to false for performance-critical scenarios with large datasets.
	 */
	reactive?: boolean;
	/**
	 * The field to use for identifying features. Defaults to 'id'.
	 */
	idField?: string;
}

/**
 * A reactive wrapper around OpenLayers Collection that automatically
 * triggers Svelte reactivity updates when the collection changes.
 *
 * @template T The type of items in the collection, typically Feature
 */
export class ReactiveCollection<T extends Feature = Feature> extends Collection<T> {
	private reactive: boolean;
	private idField: string;
	private subscribe: (() => void) | null = null;
	private boundInteraction: any = null;
	private isInternalChange = false;

	constructor(array?: T[], options: ReactiveCollectionOptions = {}) {
		super(array);
		this.reactive = options.reactive !== false; // Default to true
		this.idField = options.idField || 'id';

		if (this.reactive) {
			this.setupReactivity();
		}
	}

	private setupReactivity(): void {
		this.subscribe = createSubscriber((update) => {
			const handleChange = (evt: BaseEvent) => {
				// Skip if this is an internal change to avoid loops
				if (!this.isInternalChange) {
					update();
					// Dispatch event on bound interaction if external change
					this.dispatchInteractionEvent(evt as CollectionEvent<T>);
				}
			};

			this.on('add', handleChange);
			this.on('remove', handleChange);

			return () => {
				this.un('add', handleChange);
				this.un('remove', handleChange);
			};
		});
	}

	private dispatchInteractionEvent(evt: CollectionEvent<T>): void {
		if (!this.boundInteraction) return;

		const selected: T[] = [];
		const deselected: T[] = [];

		if (evt.type === 'add' && evt.element) {
			selected.push(evt.element);
		} else if (evt.type === 'remove' && evt.element) {
			deselected.push(evt.element);
		}

		// Create a proper SelectEvent-like object
		const selectEvent = {
			type: 'select',
			selected,
			deselected,
			target: this.boundInteraction,
			preventDefault: () => {},
			stopPropagation: () => {}
		};

		// Dispatch synthetic select event on the interaction
		this.boundInteraction.dispatchEvent(selectEvent);
	}

	/**
	 * Bind this collection to an interaction for automatic event dispatching.
	 * This enables bidirectional updates between the collection and the interaction.
	 */
	bindInteraction(interaction: any): void {
		this.boundInteraction = interaction;
	}

	/**
	 * Unbind the interaction from this collection.
	 */
	unbindInteraction(): void {
		this.boundInteraction = null;
	}

	/**
	 * Mark the start of internal changes to prevent infinite loops.
	 */
	beginInternalChange(): void {
		this.isInternalChange = true;
	}

	/**
	 * Mark the end of internal changes.
	 */
	endInternalChange(): void {
		this.isInternalChange = false;
	}

	// Reactive getters

	/**
	 * Get the length of the collection reactively.
	 */
	override getLength(): number {
		if (this.reactive && this.subscribe) {
			this.subscribe();
		}
		return super.getLength();
	}

	/**
	 * Get the array of items reactively.
	 */
	override getArray(): T[] {
		if (this.reactive && this.subscribe) {
			this.subscribe();
		}
		return super.getArray();
	}

	// Convenience methods

	/**
	 * Check if the collection contains a specific feature.
	 */
	hasFeature(feature: T): boolean {
		if (this.reactive && this.subscribe) {
			this.subscribe();
		}
		return this.getArray().includes(feature);
	}

	/**
	 * Check if the collection contains a feature with a specific ID.
	 */
	hasId(id: string | number): boolean {
		if (this.reactive && this.subscribe) {
			this.subscribe();
		}
		return this.getArray().some((f) => f.get(this.idField) === id);
	}

	/**
	 * Get a feature by its ID.
	 */
	getById(id: string | number): T | undefined {
		if (this.reactive && this.subscribe) {
			this.subscribe();
		}
		return this.getArray().find((f) => f.get(this.idField) === id);
	}

	/**
	 * Clear the collection and add new items.
	 */
	replaceAll(items: T[]): void {
		this.beginInternalChange();
		this.clear();
		this.extend(items);
		this.endInternalChange();
	}

	/**
	 * Toggle a feature in the collection.
	 */
	toggle(feature: T): boolean {
		if (this.hasFeature(feature)) {
			this.remove(feature);
			return false;
		} else {
			this.push(feature);
			return true;
		}
	}

	/**
	 * Create a reactive collection from a regular OpenLayers Collection.
	 */
	static from<T extends Feature>(
		collection: Collection<T>,
		options?: ReactiveCollectionOptions
	): ReactiveCollection<T> {
		return new ReactiveCollection(collection.getArray(), options);
	}

	/**
	 * Check if a given object is a ReactiveCollection.
	 */
	static isReactiveCollection(obj: any): obj is ReactiveCollection {
		return obj instanceof ReactiveCollection;
	}
}
