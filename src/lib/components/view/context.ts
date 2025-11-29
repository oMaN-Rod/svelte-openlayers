import { View } from 'ol';
import { createContext } from 'svelte';

const [get, setView] = createContext<View>();
function getView() {
	try {
		return get();
	} catch {
		console.warn(
			'View context not found. Make sure to pass a view to components that depend on it or wrappe them in a view.'
		);
		return undefined;
	}
}

export { setView, getView };
