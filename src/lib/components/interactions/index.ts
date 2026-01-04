import InteractionSelect from './InteractionSelect.svelte';
import InteractionHover from './InteractionHover.svelte';
import InteractionDraw from './InteractionDraw.svelte';

export * from './types.js';

export const Interaction = {
	Select: InteractionSelect,
	Hover: InteractionHover,
	Draw: InteractionDraw
};

export { InteractionSelect, InteractionHover, InteractionDraw };
