<script lang="ts">
	import { Control } from '$lib/components/controls/index.js';
	import { Interaction } from '$lib/components/interactions/index.js';
	import { getLayerContext } from '$lib/components/layers/context.js';
	import { getMap } from '$lib/components/map/context.js';
	import type {
		FillStyleOptions,
		PointStyleOptions,
		StrokeStyleOptions
	} from '$lib/styles/types.js';
	import { isCircleStyleOptions, isRegularShapeOptions } from '$lib/utils/styles.js';
	import Circle from '@lucide/svelte/icons/circle';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import MousePointer2 from '@lucide/svelte/icons/mouse-pointer-2';
	import Pentagon from '@lucide/svelte/icons/pentagon';
	import Spline from '@lucide/svelte/icons/spline';
	import type { Feature } from 'ol';
	import Collection from 'ol/Collection.js';
	import { Control as OLControl } from 'ol/control.js';
	import type { Geometry } from 'ol/geom.js';
	import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
	import { onMount } from 'svelte';
	import { type ControlDrawProps, type DrawType } from './types.js';

	let {
		type = $bindable(null),
		source = $bindable(null),
		onDrawStart,
		onDrawEnd,
		onDrawAbort,
		onTypeChange,
		onFeatureSelect,
		onFeatureModified,
		onFeatureDelete,
		style,
		selectStyle,
		selectedFeature = $bindable(null),
		propertiesPanelPosition = 'right',
		control = $bindable(null)
	}: ControlDrawProps = $props();

	const map = getMap();
	const layerContext = getLayerContext();

	const drawTypes = ['Point', 'LineString', 'Polygon', 'Circle'] as DrawType[];
	const allTypes: Array<DrawType | 'Select'> = [...drawTypes, 'Select'];

	let controlElement: HTMLDivElement;
	let olControl: OLControl | null = null;
	let selectedFeaturesCollection = $state<Collection<Feature<Geometry>> | null>(null);

	const isDrawMode = $derived(type !== null && type !== 'Select' && drawTypes.includes(type));
	const isSelectMode = $derived(type === 'Select');
	const drawType = $derived(isDrawMode ? (type as DrawType) : 'Point');

	const typeConfig = {
		Point: { icon: MapPin, label: 'Point', description: 'Draw points' },
		LineString: { icon: Spline, label: 'Line', description: 'Draw lines' },
		Polygon: { icon: Pentagon, label: 'Polygon', description: 'Draw polygons' },
		Circle: { icon: Circle, label: 'Circle', description: 'Draw circles' },
		Select: { icon: MousePointer2, label: 'Select', description: 'Select and edit features' }
	};

	// Selection style function that preserves feature's actual style and adds a subtle highlight
	function defaultSelectStyleFunction(
		feature: Feature<Geometry> | import('ol/render/Feature.js').default
	): Style[] {
		// Only handle regular features, not render features
		if (!('get' in feature)) return [];
		const geometry = feature.getGeometry();
		const geomType = geometry?.getType();
		const styles: Style[] = [];

		const fillProp = feature.get('fill') as FillStyleOptions | undefined;
		const strokeProp = feature.get('stroke') as StrokeStyleOptions | undefined;
		const imageProp = feature.get('image') as PointStyleOptions | undefined;

		const defaultFillColor = 'rgba(59, 130, 246, 0.3)';
		const defaultStrokeColor = '#3b82f6';
		const defaultStrokeWidth = 2;

		// Create the feature's actual style first
		if (geomType === 'Point' || geomType === 'MultiPoint') {
			let radius = 6;
			let pointFill: string = '#3b82f6';
			let pointStroke: string = defaultStrokeColor;
			let pointStrokeWidth: number = defaultStrokeWidth;

			if (imageProp) {
				if (isCircleStyleOptions(imageProp)) {
					radius = imageProp.radius ?? 6;
					if (imageProp.fill?.color) pointFill = imageProp.fill.color as string;
					if (imageProp.stroke?.color) pointStroke = imageProp.stroke.color as string;
					if (imageProp.stroke?.width) pointStrokeWidth = imageProp.stroke.width;
				} else if (isRegularShapeOptions(imageProp)) {
					radius = imageProp.radius ?? 6;
					if (imageProp.fill?.color) pointFill = imageProp.fill.color as string;
					if (imageProp.stroke?.color) pointStroke = imageProp.stroke.color as string;
					if (imageProp.stroke?.width) pointStrokeWidth = imageProp.stroke.width;
				}
			}

			// Draw the actual point
			styles.push(
				new Style({
					image: new CircleStyle({
						radius,
						fill: new Fill({ color: pointFill }),
						stroke: new Stroke({ color: pointStroke, width: pointStrokeWidth })
					})
				})
			);
			// Add selection highlight ring
			styles.push(
				new Style({
					image: new CircleStyle({
						radius: radius + 4,
						fill: new Fill({ color: 'transparent' }),
						stroke: new Stroke({ color: '#3b82f6', width: 2, lineDash: [4, 4] })
					})
				})
			);
		} else if (geomType === 'LineString' || geomType === 'MultiLineString') {
			const strokeColor = strokeProp?.color ?? defaultStrokeColor;
			const strokeWidth = strokeProp?.width ?? defaultStrokeWidth;
			const lineDash = strokeProp?.lineDash;

			// Draw a wider highlight underneath
			styles.push(
				new Style({
					stroke: new Stroke({
						color: 'rgba(59, 130, 246, 0.3)',
						width: strokeWidth + 6
					})
				})
			);
			// Draw the actual line
			styles.push(
				new Style({
					stroke: new Stroke({
						color: strokeColor as string,
						width: strokeWidth,
						lineDash
					})
				})
			);
		} else {
			const fillColor = fillProp?.color ?? defaultFillColor;
			const strokeColor = strokeProp?.color ?? defaultStrokeColor;
			const strokeWidth = strokeProp?.width ?? defaultStrokeWidth;
			const lineDash = strokeProp?.lineDash;

			// Draw selection outline first
			styles.push(
				new Style({
					stroke: new Stroke({
						color: '#3b82f6',
						width: 2,
						lineDash: [6, 4]
					})
				})
			);
			// Draw the actual fill and stroke
			styles.push(
				new Style({
					fill: new Fill({ color: fillColor as string }),
					stroke: new Stroke({
						color: strokeColor as string,
						width: strokeWidth,
						lineDash
					})
				})
			);
		}

		return styles;
	}

	function handleTypeChange(newType: DrawType | 'Select') {
		// Toggle behavior: clicking active button deselects it
		if (type === newType) {
			type = null;
			clearSelection();
			onTypeChange?.(null);
			return;
		}

		// Clear selection when switching modes
		clearSelection();

		type = newType;
		onTypeChange?.(newType);
	}

	function handleEscapeKey(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			type = null;
			clearSelection();
			onTypeChange?.(null);
		}
	}

	function clearSelection() {
		if (selectedFeaturesCollection) {
			selectedFeaturesCollection.clear();
		}
		selectedFeature = null;
	}

	function handleFeatureSelect(features: Feature<Geometry>[]) {
		selectedFeature = features.length > 0 ? features[0] : null;
		onFeatureSelect?.(selectedFeature);
	}

	function handleModifyEnd(evt: any) {
		if (selectedFeature) {
			onFeatureModified?.(selectedFeature);
		}
	}

	function handleDrawEnd(evt: any) {
		onDrawEnd?.(evt);

		const drawnFeature = evt.feature as Feature<Geometry>;

		requestAnimationFrame(() => {
			// Open the feature panel for the drawn feature without switching to Select mode
			if (drawnFeature) {
				selectedFeature = drawnFeature;
				onFeatureSelect?.(selectedFeature);
			}
		});
	}

	function handleDelete(feature: Feature<Geometry>) {
		const featureSource = source || layerContext?.getSource();
		if (featureSource) {
			featureSource.removeFeature(feature);
		}
		clearSelection();
		onFeatureDelete?.(feature);
	}

	function handlePanelClose() {
		clearSelection();
	}

	onMount(() => {
		selectedFeaturesCollection = new Collection<Feature<Geometry>>([]);

		olControl = new OLControl({
			element: controlElement
		});

		map?.addControl(olControl);
		control = olControl;

		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('keydown', handleEscapeKey);

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
	class="ol-control ol-control-draw"
	role="toolbar"
	aria-label="Drawing tools"
>
	{#each allTypes as toolType}
		{@const config = typeConfig[toolType]}
		{@const Icon = config.icon}
		<button
			class="ol-control-draw-button"
			class:active={toolType === type}
			onclick={() => handleTypeChange(toolType)}
			title={config.description}
			aria-label={config.description}
			aria-pressed={toolType === type}
			type="button"
		>
			<Icon class="ol-control-draw-icon" size={16} />
		</button>
	{/each}
</div>

{#if isSelectMode}
	<Interaction.Select
		style={selectStyle || defaultSelectStyleFunction}
		onSelect={handleFeatureSelect}
		selectedFeatures={selectedFeaturesCollection}
		reactive={false}
	/>
	{#if selectedFeature && selectedFeaturesCollection}
		<Interaction.Modify features={selectedFeaturesCollection} onModifyEnd={handleModifyEnd} />
	{/if}
{:else if isDrawMode}
	<Interaction.Draw
		type={drawType}
		bind:source
		{style}
		{onDrawStart}
		onDrawEnd={handleDrawEnd}
		{onDrawAbort}
	/>
{/if}

{#if selectedFeature}
	<Control.FeaturePanel
		bind:feature={selectedFeature}
		position={propertiesPanelPosition}
		onDelete={handleDelete}
		onClose={handlePanelClose}
	/>
{/if}

<style>
	.ol-control-draw {
		display: flex;
		flex-direction: column;
		top: var(--ol-draw-control-top);
		left: var(--ol-draw-control-left);
		width: var(--ol-draw-control-width);
		height: var(--ol-draw-control-height);
		border-radius: var(--ol-draw-control-border-radius);
		padding: var(--ol-draw-control-padding);
	}

	.ol-control-draw-button {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: inherit;
		font-weight: bold;
		text-decoration: none;
		text-align: center;
		box-sizing: border-box;
		transition: background-color 150ms ease;
		margin: var(--ol-draw-button-margin);
		padding: var(--ol-draw-button-padding);
		border: var(--ol-draw-button-border);
		background-color: var(--ol-draw-button-bg);
		color: var(--ol-draw-button-color);
		width: var(--ol-draw-button-width);
		height: var(--ol-draw-button-height);
		line-height: var(--ol-draw-button-line-height);
	}

	.ol-control-draw-button:first-child {
		border-radius: var(--ol-draw-button-border-radius-first);
	}

	.ol-control-draw-button:last-child {
		border-radius: var(--ol-draw-button-border-radius-last);
	}

	.ol-control-draw-button:hover,
	.ol-control-draw-button:focus {
		text-decoration: none;
		color: var(--ol-color-foreground);
		background-color: color-mix(in srgb, var(--ol-draw-button-bg) 90%, black);
	}

	.ol-control-draw-button.active {
		background-color: var(--ol-color-primary);
		color: var(--ol-color-surface);
	}

	:global(.dark) .ol-control-draw-button.active {
		color: var(--ol-color-surface-foreground);
	}

	.ol-control-draw-button.active:hover,
	.ol-control-draw-button.active:focus {
		background-color: var(--ol-color-primary);
		outline: 1px solid var(--ol-foreground-color);
	}
</style>
