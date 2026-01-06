import OverlayTooltip from './OverlayTooltip.svelte';
import OverlayHover from './OverlayHover.svelte';
import OverlayPopup from './OverlayPopup.svelte';
import TooltipManager from './TooltipManager.svelte';

export * from './types.js';

export const Overlay = {
	Tooltip: OverlayTooltip,
	Hover: OverlayHover,
	Popup: OverlayPopup,
	TooltipManager
};

export { OverlayTooltip, OverlayHover, OverlayPopup, TooltipManager };
