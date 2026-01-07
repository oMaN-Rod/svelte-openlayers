import InteractionSelect from './InteractionSelect.svelte';
import InteractionHover from './InteractionHover.svelte';
import InteractionDraw from './InteractionDraw.svelte';
import InteractionModify from './InteractionModify.svelte';

export * from './types.js';

export const Interaction = {
	Select: InteractionSelect,
	Hover: InteractionHover,
	Draw: InteractionDraw,
	Modify: InteractionModify
};

export { InteractionSelect, InteractionHover, InteractionDraw, InteractionModify };
