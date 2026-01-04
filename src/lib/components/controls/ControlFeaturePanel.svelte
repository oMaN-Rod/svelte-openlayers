<script lang="ts">
	import { getMap } from '$lib/components/map/context.js';
	import type {
		FillStyleOptions,
		PointStyleOptions,
		StrokeStyleOptions
	} from '$lib/styles/types.js';
	import { createStyleFromFeature, hexToRgba, parseColor } from '$lib/utils/styles.js';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import type { Feature } from 'ol';
	import Control from 'ol/control/Control.js';
	import { onMount } from 'svelte';
	import type { ControlFeaturePanelProps } from './types.js';

	let {
		title = 'Feature Properties',
		feature = $bindable(null),
		visible = $bindable(false),
		position = 'right',
		onStyleChange,
		onPropertyChange,
		onDelete,
		onClose,
		control = $bindable(null)
	}: ControlFeaturePanelProps = $props();

	const map = getMap();

	// Default style values
	const defaults = {
		fillColor: '#3b82f6',
		fillOpacity: 0.3,
		strokeColor: '#2563eb',
		strokeWidth: 2,
		lineDash: 'solid' as 'solid' | 'dashed' | 'dotted',
		pointRadius: 6,
		dashLength: 10,
		dashGap: 10,
		dotLength: 2,
		dotGap: 8
	};

	let controlElement: HTMLDivElement;
	let olControl: Control | null = null;

	// Style state - map to OL style options
	let fillColor = $state('#3b82f6');
	let fillOpacity = $state(0.3);
	let strokeColor = $state('#2563eb');
	let strokeWidth = $state(2);
	let lineDash = $state<'solid' | 'dashed' | 'dotted'>('solid');
	let pointRadius = $state(6);

	// Dash pattern state (dash length, gap length)
	let dashLength = $state(defaults.dashLength);
	let dashGap = $state(defaults.dashGap);
	let dotLength = $state(defaults.dotLength);
	let dotGap = $state(defaults.dotGap);

	// Custom properties state
	let customProperties = $state<Array<{ key: string; value: string }>>([]);
	let newPropertyKey = $state('');
	let newPropertyValue = $state('');

	const lineDashPatterns = $derived<Record<string, number[] | undefined>>({
		solid: undefined,
		dashed: [dashLength, dashGap],
		dotted: [dotLength, dotGap]
	});

	// Reserved property keys (style-related, should not show in custom properties)
	const reservedKeys = new Set(['geometry', 'fill', 'stroke', 'image', 'text']);

	// Extract style from feature properties (fill, stroke, image at root level)
	function extractStyleFromFeature(feat: Feature) {
		// Reset to defaults first
		fillColor = defaults.fillColor;
		fillOpacity = defaults.fillOpacity;
		strokeColor = defaults.strokeColor;
		strokeWidth = defaults.strokeWidth;
		lineDash = 'solid';
		pointRadius = defaults.pointRadius;
		dashLength = defaults.dashLength;
		dashGap = defaults.dashGap;
		dotLength = defaults.dotLength;
		dotGap = defaults.dotGap;

		// Read fill property
		const fillProp = feat.get('fill') as FillStyleOptions | undefined;
		if (fillProp?.color) {
			const parsed = parseColor(fillProp.color);
			if (parsed) {
				fillColor = parsed.hex;
				fillOpacity = parsed.opacity;
			}
		}

		// Read stroke property
		const strokeProp = feat.get('stroke') as StrokeStyleOptions | undefined;
		if (strokeProp) {
			if (strokeProp.color) {
				const parsed = parseColor(strokeProp.color);
				if (parsed) {
					strokeColor = parsed.hex;
				}
			}
			if (strokeProp.width !== undefined) {
				strokeWidth = strokeProp.width;
			}
			if (strokeProp.lineDash) {
				if (strokeProp.lineDash[0] >= 5) {
					lineDash = 'dashed';
					dashLength = strokeProp.lineDash[0];
					dashGap = strokeProp.lineDash[1] ?? strokeProp.lineDash[0];
				} else if (strokeProp.lineDash[0] < 5) {
					lineDash = 'dotted';
					dotLength = strokeProp.lineDash[0];
					dotGap = strokeProp.lineDash[1] ?? strokeProp.lineDash[0];
				}
			}
		}

		// Read image property (for points)
		const imageProp = feat.get('image') as PointStyleOptions | undefined;
		if (imageProp) {
			// Check if it's a circle type with radius property
			if ('radius' in imageProp && imageProp.radius !== undefined) {
				pointRadius = imageProp.radius;
			}
			if ('fill' in imageProp && imageProp.fill?.color) {
				const parsed = parseColor(imageProp.fill.color);
				if (parsed) {
					fillColor = parsed.hex;
				}
			}
			if ('stroke' in imageProp && imageProp.stroke?.color) {
				const parsed = parseColor(imageProp.stroke.color);
				if (parsed) {
					strokeColor = parsed.hex;
				}
			}
			if ('stroke' in imageProp && imageProp.stroke?.width !== undefined) {
				strokeWidth = imageProp.stroke.width;
			}
		}
	}

	// Extract custom properties from feature (excluding reserved keys)
	function extractPropertiesFromFeature(feat: Feature) {
		const props = feat.getProperties();
		const entries: Array<{ key: string; value: string }> = [];
		for (const [key, value] of Object.entries(props)) {
			if (!reservedKeys.has(key) && typeof value !== 'object') {
				entries.push({ key, value: String(value ?? '') });
			}
		}
		customProperties = entries;
	}

	// Apply style changes to feature using root-level properties
	function applyStyle() {
		if (!feature) return;

		const geometry = feature.getGeometry();
		const geomType = geometry?.getType();

		// Update feature properties based on geometry type
		if (geomType === 'Point' || geomType === 'MultiPoint') {
			// For points, use image property
			feature.set(
				'image',
				{
					type: 'circle',
					radius: pointRadius,
					fill: { color: fillColor },
					stroke: { color: strokeColor, width: strokeWidth }
				} as PointStyleOptions,
				true
			);
		} else {
			// For polygons and lines
			if (geomType === 'Polygon' || geomType === 'Circle' || geomType === 'MultiPolygon') {
				feature.set('fill', { color: hexToRgba(fillColor, fillOpacity) } as FillStyleOptions, true);
			}
			feature.set(
				'stroke',
				{
					color: strokeColor,
					width: strokeWidth,
					lineDash: lineDashPatterns[lineDash]
				} as StrokeStyleOptions,
				true
			);
		}

		// Create and apply the visual style
		const newStyle = createStyleFromFeature(feature);
		feature.setStyle(newStyle);

		onStyleChange?.(feature, newStyle);
	}

	// Handle property changes
	function updateProperty(index: number, key: string, value: string) {
		if (!feature) return;

		const oldKey = customProperties[index].key;

		// If key changed, remove old property
		if (oldKey !== key) {
			feature.unset(oldKey);
		}

		feature.set(key, value);
		customProperties[index] = { key, value };

		onPropertyChange?.(feature, key, value);
	}

	function addProperty() {
		if (!feature || !newPropertyKey.trim()) return;

		feature.set(newPropertyKey, newPropertyValue);
		customProperties = [...customProperties, { key: newPropertyKey, value: newPropertyValue }];

		onPropertyChange?.(feature, newPropertyKey, newPropertyValue);

		newPropertyKey = '';
		newPropertyValue = '';
	}

	function removeProperty(index: number) {
		if (!feature) return;

		const prop = customProperties[index];
		feature.unset(prop.key);
		customProperties = customProperties.filter((_, i) => i !== index);

		onPropertyChange?.(feature, prop.key, undefined);
	}

	function handleDelete() {
		if (!feature) return;
		onDelete?.(feature);
	}

	function handleClose() {
		visible = false;
		onClose?.();
	}

	// Watch for feature changes
	$effect(() => {
		if (feature) {
			extractStyleFromFeature(feature);
			extractPropertiesFromFeature(feature);
			visible = true;
		} else {
			visible = false;
		}
	});

	onMount(() => {
		olControl = new Control({
			element: controlElement
		});

		map?.addControl(olControl);
		control = olControl;

		return () => {
			if (olControl) {
				map?.removeControl(olControl);
				olControl = null;
				control = null;
			}
		};
	});
</script>

<div
	bind:this={controlElement}
	class="ol-control ol-properties-panel"
	class:ol-properties-panel-left={position === 'left'}
	class:ol-properties-panel-right={position === 'right'}
	class:ol-properties-panel-visible={visible && feature}
	role="dialog"
	aria-label={title}
>
	{#if visible && feature}
		<div class="ol-properties-panel-header">
			<h3 class="ol-properties-panel-title">{title}</h3>
			<button
				class="ol-properties-panel-close"
				onclick={handleClose}
				title="Close"
				aria-label="Close panel"
				type="button"
			>
				<X size={16} />
			</button>
		</div>

		<div class="ol-properties-panel-content">
			<!-- Style Section -->
			<div class="ol-properties-section">
				<h4 class="ol-properties-section-title">Style</h4>

				{#if feature?.getGeometry()?.getType() !== 'LineString'}
					<div class="ol-properties-field">
						<label for="fill-color">Fill Color</label>
						<div class="ol-properties-color-input">
							<input type="color" id="fill-color" bind:value={fillColor} oninput={applyStyle} />
							<input
								type="range"
								min="0"
								max="1"
								step="0.1"
								bind:value={fillOpacity}
								oninput={applyStyle}
								title="Opacity: {Math.round(fillOpacity * 100)}%"
							/>
						</div>
					</div>
				{/if}

				<div class="ol-properties-field">
					<label for="stroke-color">Stroke Color</label>
					<input type="color" id="stroke-color" bind:value={strokeColor} oninput={applyStyle} />
				</div>

				<div class="ol-properties-field">
					<label for="stroke-width">Stroke Width</label>
					<div class="ol-properties-range-input">
						<input
							type="range"
							id="stroke-width"
							min="1"
							max="10"
							bind:value={strokeWidth}
							oninput={applyStyle}
						/>
						<span class="ol-properties-range-value">{strokeWidth}px</span>
					</div>
				</div>

				<div class="ol-properties-field">
					<label for="line-dash">Line Style</label>
					<select id="line-dash" bind:value={lineDash} onchange={applyStyle}>
						<option value="solid">Solid</option>
						<option value="dashed">Dashed</option>
						<option value="dotted">Dotted</option>
					</select>
				</div>

				{#if lineDash === 'dashed'}
					<div class="ol-properties-field ol-properties-field-indent">
						<label for="dash-length">Dash Length</label>
						<div class="ol-properties-range-input">
							<input
								type="range"
								id="dash-length"
								min="5"
								max="30"
								bind:value={dashLength}
								oninput={applyStyle}
							/>
							<span class="ol-properties-range-value">{dashLength}px</span>
						</div>
					</div>
					<div class="ol-properties-field ol-properties-field-indent">
						<label for="dash-gap">Dash Gap</label>
						<div class="ol-properties-range-input">
							<input
								type="range"
								id="dash-gap"
								min="2"
								max="30"
								bind:value={dashGap}
								oninput={applyStyle}
							/>
							<span class="ol-properties-range-value">{dashGap}px</span>
						</div>
					</div>
				{/if}

				{#if lineDash === 'dotted'}
					<div class="ol-properties-field ol-properties-field-indent">
						<label for="dot-length">Dot Size</label>
						<div class="ol-properties-range-input">
							<input
								type="range"
								id="dot-length"
								min="1"
								max="4"
								bind:value={dotLength}
								oninput={applyStyle}
							/>
							<span class="ol-properties-range-value">{dotLength}px</span>
						</div>
					</div>
					<div class="ol-properties-field ol-properties-field-indent">
						<label for="dot-gap">Dot Gap</label>
						<div class="ol-properties-range-input">
							<input
								type="range"
								id="dot-gap"
								min="2"
								max="20"
								bind:value={dotGap}
								oninput={applyStyle}
							/>
							<span class="ol-properties-range-value">{dotGap}px</span>
						</div>
					</div>
				{/if}

				{#if feature?.getGeometry()?.getType() === 'Point'}
					<div class="ol-properties-field">
						<label for="point-radius">Point Radius</label>
						<div class="ol-properties-range-input">
							<input
								type="range"
								id="point-radius"
								min="2"
								max="20"
								bind:value={pointRadius}
								oninput={applyStyle}
							/>
							<span class="ol-properties-range-value">{pointRadius}px</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- Custom Properties Section -->
			<div class="ol-properties-section">
				<h4 class="ol-properties-section-title">Properties</h4>

				{#each customProperties as prop, index}
					<div class="ol-properties-custom-field">
						<input
							type="text"
							value={prop.key}
							placeholder="Key"
							onchange={(e) => updateProperty(index, e.currentTarget.value, prop.value)}
						/>
						<input
							type="text"
							value={prop.value}
							placeholder="Value"
							onchange={(e) => updateProperty(index, prop.key, e.currentTarget.value)}
						/>
						<button
							class="ol-properties-remove-btn"
							onclick={() => removeProperty(index)}
							title="Remove property"
							type="button"
						>
							<X size={14} />
						</button>
					</div>
				{/each}

				<div class="ol-properties-add-field">
					<input type="text" bind:value={newPropertyKey} placeholder="New key" />
					<input type="text" bind:value={newPropertyValue} placeholder="Value" />
					<button
						class="ol-properties-add-btn"
						onclick={addProperty}
						disabled={!newPropertyKey.trim()}
						title="Add property"
						type="button"
					>
						<Plus size={14} />
					</button>
				</div>
			</div>
		</div>

		<!-- Delete Button -->
		<div class="ol-properties-panel-footer">
			<button class="ol-properties-delete-btn" onclick={handleDelete} type="button">
				<Trash2 size={16} />
				<span>Delete Feature</span>
			</button>
		</div>
	{/if}
</div>

<style>
	.ol-properties-panel {
		position: absolute;
		top: var(--ol-space-2);
		width: var(--ol-properties-panel-width, 280px);
		max-height: calc(100% - var(--ol-space-4));
		background: var(--ol-properties-panel-bg, var(--ol-color-surface));
		border: 1px solid var(--ol-properties-panel-border, var(--ol-color-border));
		border-radius: var(--ol-radius);
		box-shadow: var(--ol-properties-panel-shadow, var(--ol-shadow-lg));
		z-index: var(--ol-properties-panel-z-index, 200);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		transform: translateX(calc(100% + var(--ol-space-4)));
		opacity: 0;
		visibility: hidden;
		transition:
			transform var(--ol-transition-duration-normal, 200ms) ease,
			opacity var(--ol-transition-duration-normal, 200ms) ease,
			visibility var(--ol-transition-duration-normal, 200ms) ease;
		pointer-events: auto;
	}

	.ol-properties-panel-right {
		right: var(--ol-space-2);
		transform: translateX(calc(100% + var(--ol-space-4)));
	}

	.ol-properties-panel-left {
		left: var(--ol-space-2);
		transform: translateX(calc(-100% - var(--ol-space-4)));
	}

	.ol-properties-panel-visible {
		transform: translateX(0);
		opacity: 1;
		visibility: visible;
	}

	.ol-properties-panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--ol-space-3) var(--ol-space-4);
		border-bottom: 1px solid var(--ol-color-border);
		background: var(--ol-color-background);
	}

	.ol-properties-panel-title {
		margin: 0;
		font-size: var(--ol-font-size-sm);
		font-weight: var(--ol-font-weight-semibold);
		color: var(--ol-color-foreground);
	}

	.ol-properties-panel-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		border: none;
		background: transparent;
		color: var(--ol-color-muted-foreground);
		cursor: pointer;
		border-radius: var(--ol-radius-sm);
		transition: all var(--ol-transition-duration-fast) ease;
	}

	.ol-properties-panel-close:hover {
		background: var(--ol-color-accent);
		color: var(--ol-color-foreground);
	}

	.ol-properties-panel-content {
		flex: 1;
		overflow-y: auto;
		padding: var(--ol-space-4);
	}

	.ol-properties-section {
		margin-bottom: var(--ol-space-4);
	}

	.ol-properties-section:last-child {
		margin-bottom: 0;
	}

	.ol-properties-section-title {
		margin: 0 0 var(--ol-space-3) 0;
		font-size: var(--ol-font-size-xs);
		font-weight: var(--ol-font-weight-semibold);
		color: var(--ol-color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.ol-properties-field {
		display: flex;
		flex-direction: column;
		gap: var(--ol-space-1);
		margin-bottom: var(--ol-space-3);
	}

	.ol-properties-field-indent {
		margin-left: var(--ol-space-3);
		padding-left: var(--ol-space-3);
		border-left: 2px solid var(--ol-color-border);
	}

	.ol-properties-field label {
		font-size: var(--ol-font-size-xs);
		font-weight: var(--ol-font-weight-medium);
		color: var(--ol-color-foreground);
	}

	.ol-properties-field input[type='color'] {
		width: 100%;
		height: var(--ol-properties-input-height, 32px);
		padding: 2px;
		border: 1px solid var(--ol-properties-input-border, var(--ol-color-border));
		border-radius: var(--ol-properties-input-border-radius, var(--ol-radius-sm));
		background: var(--ol-properties-input-bg, var(--ol-color-background));
		cursor: pointer;
	}

	.ol-properties-field input[type='range'] {
		width: 100%;
		cursor: pointer;
	}

	.ol-properties-field select {
		width: 100%;
		height: var(--ol-properties-input-height, 32px);
		padding: 0 var(--ol-space-2);
		border: 1px solid var(--ol-properties-input-border, var(--ol-color-border));
		border-radius: var(--ol-properties-input-border-radius, var(--ol-radius-sm));
		background: var(--ol-properties-input-bg, var(--ol-color-background));
		font-size: var(--ol-font-size-sm);
		color: var(--ol-color-foreground);
		cursor: pointer;
	}

	.ol-properties-color-input {
		display: flex;
		gap: var(--ol-space-2);
		align-items: center;
	}

	.ol-properties-color-input input[type='color'] {
		width: 48px;
		flex-shrink: 0;
	}

	.ol-properties-color-input input[type='range'] {
		flex: 1;
	}

	.ol-properties-range-input {
		display: flex;
		align-items: center;
		gap: var(--ol-space-2);
	}

	.ol-properties-range-input input {
		flex: 1;
	}

	.ol-properties-range-value {
		min-width: 40px;
		font-size: var(--ol-font-size-xs);
		color: var(--ol-color-muted-foreground);
		text-align: right;
	}

	.ol-properties-custom-field,
	.ol-properties-add-field {
		display: flex;
		gap: var(--ol-space-1);
		margin-bottom: var(--ol-space-2);
	}

	.ol-properties-custom-field input,
	.ol-properties-add-field input {
		flex: 1;
		height: var(--ol-properties-input-height, 32px);
		padding: 0 var(--ol-space-2);
		border: 1px solid var(--ol-properties-input-border, var(--ol-color-border));
		border-radius: var(--ol-properties-input-border-radius, var(--ol-radius-sm));
		background: var(--ol-properties-input-bg, var(--ol-color-background));
		font-size: var(--ol-font-size-xs);
		color: var(--ol-color-foreground);
	}

	.ol-properties-custom-field input:first-child,
	.ol-properties-add-field input:first-child {
		flex: 0.8;
	}

	.ol-properties-remove-btn,
	.ol-properties-add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: var(--ol-properties-input-height, 32px);
		padding: 0;
		border: 1px solid var(--ol-color-border);
		border-radius: var(--ol-properties-input-border-radius, var(--ol-radius-sm));
		background: var(--ol-color-surface);
		color: var(--ol-color-muted-foreground);
		cursor: pointer;
		transition: all var(--ol-transition-duration-fast) ease;
		flex-shrink: 0;
	}

	.ol-properties-remove-btn:hover {
		background: var(--ol-color-destructive, #ef4444);
		border-color: var(--ol-color-destructive, #ef4444);
		color: white;
	}

	.ol-properties-add-btn:hover:not(:disabled) {
		background: var(--ol-color-primary);
		border-color: var(--ol-color-primary);
		color: var(--ol-color-primary-foreground);
	}

	.ol-properties-add-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ol-properties-panel-footer {
		padding: var(--ol-space-3) var(--ol-space-4);
		border-top: 1px solid var(--ol-color-border);
		background: var(--ol-color-surface);
	}

	.ol-properties-delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--ol-space-2);
		width: 100%;
		padding: var(--ol-space-3);
		border: none;
		border-radius: var(--ol-radius-sm);
		background: var(--ol-properties-delete-bg, var(--ol-color-destructive, #ef4444));
		color: var(--ol-properties-delete-color, white);
		font-size: var(--ol-font-size-sm);
		font-weight: var(--ol-font-weight-medium);
		cursor: pointer;
		transition: all var(--ol-transition-duration-fast) ease;
	}

	.ol-properties-delete-btn:hover {
		opacity: 0.9;
	}
</style>
