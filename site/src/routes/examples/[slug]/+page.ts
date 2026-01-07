import { error } from '@sveltejs/kit';
import { hasExample, getExampleMeta, getAllExampleIds } from '$lib/examples/registry';
import type { PageLoad, EntryGenerator } from './$types';

export const load: PageLoad = ({ params }) => {
	const { slug } = params;

	if (!hasExample(slug)) {
		throw error(404, {
			message: `Example "${slug}" not found`
		});
	}

	const meta = getExampleMeta(slug);

	return {
		slug,
		meta
	};
};

// Generate entries for prerendering
export const entries: EntryGenerator = () => {
	return getAllExampleIds().map((id) => ({ slug: id }));
};
