import OverlayTooltip from './OverlayTooltip.svelte';
import OverlayHover from './OverlayHover.svelte';
import OverlayPopup from './OverlayPopup.svelte';
import OverlayMarker from './OverlayMarker.svelte';
import TooltipManager from './TooltipManager.svelte';

export * from './types.js';

export const Overlay = {
	Tooltip: OverlayTooltip,
	Hover: OverlayHover,
	Popup: OverlayPopup,
	Marker: OverlayMarker,
	TooltipManager
};

export { OverlayTooltip, OverlayHover, OverlayPopup, OverlayMarker, TooltipManager };
