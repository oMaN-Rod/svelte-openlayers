import ControlDraw from './ControlDraw.svelte';
import ControlFeaturePanel from './ControlFeaturePanel.svelte';

export * from './types.js';

export const Control = {
	Draw: ControlDraw,
	FeaturePanel: ControlFeaturePanel
};

export { ControlDraw, ControlFeaturePanel };
