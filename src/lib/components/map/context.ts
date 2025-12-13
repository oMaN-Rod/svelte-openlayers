import { Map, View } from 'ol';
import { createContext } from 'svelte';

const [get, setMap] = createContext<Map>();
function getMap() {
	try {
		return get();
	} catch {
		console.warn(
			'Map context not found. Make sure to pass a map to components that depend on it or wrappe them in a map.'
		);
		return undefined;
	}
}

export { setMap, getMap };
