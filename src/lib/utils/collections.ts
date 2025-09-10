import type Collection from 'ol/Collection.js';
import type Feature from 'ol/Feature.js';
import { createSubscriber } from 'svelte/reactivity';

export function createReactiveCollection<T extends Feature>(
	collection: Collection<T>,
	idField = 'id'
) {
	const subscribe = createSubscriber((update) => {
		const handleChange = () => update();

		collection.on('add', handleChange);
		collection.on('remove', handleChange);

		return () => {
			collection.un('add', handleChange);
			collection.un('remove', handleChange);
		};
	});

	return {
		get collection() {
			subscribe();
			return collection;
		},
		get length() {
			subscribe();
			return collection.getLength();
		},
		get array() {
			subscribe();
			return collection.getArray();
		},
		has(feature: T) {
			subscribe();
			return collection.getArray().includes(feature);
		},
		hasId(id: string) {
			subscribe();
			return collection.getArray().some((f) => f.get(idField) === id);
		}
	};
}
