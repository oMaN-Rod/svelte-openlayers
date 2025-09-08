---
title: Styling System
description: Learn how to use and customize the CSS variable-based styling system
---

# Styling System

Svelte OpenLayers provides a comprehensive CSS variable-based styling system that enables consistent, customizable design across all components while remaining framework-agnostic.

## Overview {.toc}

The styling system is built on modern CSS custom properties (CSS variables), providing:

- **Complete design tokens** for colors, spacing, typography, and shadows
- **Dark mode support** via both system preferences and manual controls
- **Component-specific variables** for fine-grained customization
- **Framework independence** with sensible defaults and fallbacks
- **Zero runtime overhead** - pure CSS solution

## Quick Start {.toc}

### Basic Setup {.toc}

Import the complete styling system in your application:

```javascript
// In your app's entry point or root layout
import 'svelte-openlayers/styles.css';
```

That's it! All components will now use the consistent styling system.

### Import Options {.toc}

You have several import options depending on your needs:

```javascript
// Complete system (recommended)
import 'svelte-openlayers/styles.css';

// Variables only (no component styles)
import 'svelte-openlayers/styles/variables-only.css';

// Individual parts
import 'svelte-openlayers/styles/variables.css';
import 'svelte-openlayers/styles/components.css';
```

## Core Design Tokens {.toc}

### Color System {.toc}

The color system provides semantic colors that adapt to your design:

```css
:root {
	/* Primary colors */
	--ol-color-primary: #4338ca;
	--ol-color-primary-foreground: #ffffff;
	--ol-color-secondary: #6b7280;
	--ol-color-secondary-foreground: #ffffff;

	/* Surface colors */
	--ol-color-background: #ffffff;
	--ol-color-foreground: #1f2937;
	--ol-color-surface: #f9fafb;
	--ol-color-surface-foreground: #374151;

	/* Semantic colors */
	--ol-color-muted: #f3f4f6;
	--ol-color-muted-foreground: #6b7280;
	--ol-color-accent: #e5e7eb;
	--ol-color-accent-foreground: #1f2937;

	/* Border & Input */
	--ol-color-border: #d1d5db;
	--ol-color-input: #e5e7eb;
	--ol-color-ring: #6b7280;
}
```

### Spacing Scale {.toc}

A comprehensive spacing scale based on rem units:

```css
:root {
	--ol-space-0: 0;
	--ol-space-px: 1px;
	--ol-space-0-5: 0.125rem; /* 2px */
	--ol-space-1: 0.25rem; /* 4px */
	--ol-space-1-5: 0.375rem; /* 6px */
	--ol-space-2: 0.5rem; /* 8px */
	--ol-space-2-5: 0.625rem; /* 10px */
	--ol-space-3: 0.75rem; /* 12px */
	--ol-space-3-5: 0.875rem; /* 14px */
	--ol-space-4: 1rem; /* 16px */
	--ol-space-5: 1.25rem; /* 20px */
	--ol-space-6: 1.5rem; /* 24px */
	--ol-space-8: 2rem; /* 32px */
	--ol-space-10: 2.5rem; /* 40px */
	--ol-space-12: 3rem; /* 48px */
}
```

### Typography {.toc}

Comprehensive typography variables for consistent text styling:

```css
:root {
	/* Font sizes */
	--ol-font-size-xs: 0.75rem; /* 12px */
	--ol-font-size-sm: 0.875rem; /* 14px */
	--ol-font-size-base: 1rem; /* 16px */
	--ol-font-size-lg: 1.125rem; /* 18px */
	--ol-font-size-xl: 1.25rem; /* 20px */

	/* Line heights */
	--ol-line-height-tight: 1.25;
	--ol-line-height-normal: 1.5;
	--ol-line-height-relaxed: 1.625;

	/* Font weights */
	--ol-font-weight-normal: 400;
	--ol-font-weight-medium: 500;
	--ol-font-weight-semibold: 600;
	--ol-font-weight-bold: 700;

	/* Font families */
	--ol-font-family-sans:
		ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
	--ol-font-family-mono:
		ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}
```

### Border Radius {.toc}

Consistent border radius scale for rounded corners:

```css
:root {
	--ol-radius-none: 0;
	--ol-radius-sm: 0.125rem; /* 2px */
	--ol-radius: 0.25rem; /* 4px */
	--ol-radius-md: 0.375rem; /* 6px */
	--ol-radius-lg: 0.5rem; /* 8px */
	--ol-radius-xl: 0.75rem; /* 12px */
	--ol-radius-2xl: 1rem; /* 16px */
	--ol-radius-full: 9999px;
}
```

### Shadows {.toc}

Elevation system using consistent shadow values:

```css
:root {
	--ol-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	--ol-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
	--ol-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	--ol-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	--ol-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
```

### Additional Design Tokens {.toc}

Z-index scale, transitions, and opacity values:

```css
:root {
	/* Z-index scale */
	--ol-z-10: 10;
	--ol-z-20: 20;
	--ol-z-50: 50;
	--ol-z-100: 100;
	--ol-z-500: 500;
	--ol-z-1000: 1000;

	/* Transitions */
	--ol-transition-duration-fast: 150ms;
	--ol-transition-duration-normal: 250ms;
	--ol-transition-duration-slow: 350ms;

	/* Opacity scale */
	--ol-opacity-0: 0;
	--ol-opacity-20: 0.2;
	--ol-opacity-50: 0.5;
	--ol-opacity-75: 0.75;
	--ol-opacity-100: 1;
}
```

## Component Customization {.toc}

The styling system provides comprehensive variables for customizing all map components.

### Map Container {.toc}

Control the basic map container styling:

```css
:root {
	--ol-map-width: 100%;
	--ol-map-height: 100%;
	--ol-map-position: relative;
}
```

### Map Controls {.toc}

Base control styling that applies to all controls:

```css
:root {
	--ol-control-bg: rgba(255, 255, 255, 0.8);
	--ol-control-border: var(--ol-color-border);
	--ol-control-border-radius: var(--ol-radius);
	--ol-control-shadow: var(--ol-shadow);
	--ol-control-padding: var(--ol-space-2);
	--ol-control-margin: var(--ol-space-2);
	--ol-control-z-index: var(--ol-z-100);
}
```

### Zoom Controls {.toc}

Customize zoom button appearance:

```css
:root {
	/* Button dimensions and layout */
	--ol-zoom-button-width: 1.5rem;
	--ol-zoom-button-height: 1.5rem;
	--ol-zoom-button-margin: var(--ol-space-0-5) 0;

	/* Button styling */
	--ol-zoom-button-bg: var(--ol-color-primary);
	--ol-zoom-button-color: var(--ol-color-primary-foreground);
	--ol-zoom-button-border: none;
	--ol-zoom-button-radius: var(--ol-radius);

	/* Typography */
	--ol-zoom-button-font-size: var(--ol-font-size-sm);
	--ol-zoom-button-font-weight: var(--ol-font-weight-medium);
}
```

### Mouse Position Control {.toc}

Customize the coordinate display:

```css
:root {
	--ol-mouse-position-bg: rgba(255, 255, 255, 0.9);
	--ol-mouse-position-color: var(--ol-color-foreground);
	--ol-mouse-position-padding: var(--ol-space-1-5) var(--ol-space-2-5);
	--ol-mouse-position-border-radius: var(--ol-radius);
	--ol-mouse-position-font-family: var(--ol-font-family-mono);
	--ol-mouse-position-font-size: var(--ol-font-size-xs);
	--ol-mouse-position-shadow: var(--ol-shadow-sm);
	--ol-mouse-position-z-index: var(--ol-z-1000);
}
```

### Attribution Control {.toc}

Style the map attribution display:

```css
:root {
	--ol-attribution-bg: rgba(255, 255, 255, 0.7);
	--ol-attribution-color: var(--ol-color-muted-foreground);
	--ol-attribution-font-size: var(--ol-font-size-xs);
	--ol-attribution-padding: var(--ol-space-1) var(--ol-space-2);
}
```

### Tooltips {.toc}

Comprehensive tooltip customization options:

```css
:root {
	/* Base tooltip styles */
	--ol-tooltip-bg: rgba(255, 255, 255, 0.85);
	--ol-tooltip-color: #181818;
	--ol-tooltip-padding: var(--ol-space-2) var(--ol-space-3);
	--ol-tooltip-border-radius: var(--ol-radius);
	--ol-tooltip-font-size: var(--ol-font-size-sm);
	--ol-tooltip-font-weight: var(--ol-font-weight-normal);
	--ol-tooltip-line-height: var(--ol-line-height-normal);
	--ol-tooltip-shadow: var(--ol-shadow-lg);
	--ol-tooltip-max-width: 18.75rem; /* 300px */
	--ol-tooltip-white-space: normal;
	--ol-tooltip-word-wrap: break-word;
	--ol-tooltip-z-index: var(--ol-z-100);

	/* Tooltip transitions */
	--ol-tooltip-transition-property: opacity, visibility;
	--ol-tooltip-transition-duration: var(--ol-transition-duration-fast);
	--ol-tooltip-transition-timing: var(--ol-transition-timing-ease-in-out);

	/* Hover tooltip variant */
	--ol-tooltip-hover-bg: rgba(255, 255, 255, 0.85);
	--ol-tooltip-hover-color: #181818;
	--ol-tooltip-hover-font-size: var(--ol-font-size-xs);
	--ol-tooltip-hover-padding: var(--ol-space-1-5) var(--ol-space-2-5);

	/* Select tooltip variant */
	--ol-tooltip-select-bg: rgba(255, 255, 255, 0.96);
	--ol-tooltip-select-color: var(--ol-color-foreground);
	--ol-tooltip-select-border: 1px solid var(--ol-color-border);
	--ol-tooltip-select-font-size: var(--ol-font-size-sm);
	--ol-tooltip-select-padding: var(--ol-space-2-5) var(--ol-space-3-5);
	--ol-tooltip-select-shadow: var(--ol-shadow-md);
	--ol-tooltip-select-accent-color: var(--ol-color-primary);
}
```

### Map Features {.toc}

Default styling for map features (points, lines, polygons):

```css
:root {
	/* Feature stroke and fill */
	--ol-feature-stroke-color: var(--ol-color-primary);
	--ol-feature-stroke-width: 2;
	--ol-feature-fill-color: rgba(67, 56, 202, 0.2);

	/* Point features */
	--ol-feature-point-radius: 5;
	--ol-feature-point-fill: var(--ol-color-primary);
	--ol-feature-point-stroke: var(--ol-color-primary-foreground);
	--ol-feature-point-stroke-width: 2;

	/* Overlays and layers */
	--ol-overlay-z-index: var(--ol-z-100);
	--ol-overlay-pointer-events: none;
	--ol-layer-opacity: 1;
	--ol-layer-visible: true;
	--ol-layer-z-index: auto;
}
```

## Feature Styling with TypeScript {.toc}

Beyond CSS variables, Svelte OpenLayers provides TypeScript utilities for programmatically styling map features like points, lines, polygons, text, and icons. These utilities are located in `src/lib/utils/styles.ts`.

### Style Creation Functions {.toc}

#### Circle Styles {.toc}

Create circular point features with customizable appearance:

```typescript
import { createCircleStyle } from 'svelte-openlayers/utils';

const pointStyle = createCircleStyle({
	radius: 8,
	fill: '#4338ca',
	stroke: '#ffffff',
	strokeWidth: 2,
	displacement: [0, 0],
	scale: 1
});
```

**CircleStyleOptions Interface:**

- `radius: number` - Circle radius in pixels
- `fill?: Color | string` - Fill color (optional)
- `stroke?: Color | string` - Stroke color (optional)
- `strokeWidth?: number` - Stroke width in pixels (optional)
- `displacement?: number[]` - Offset from anchor point (optional)
- `scale?: number | Size` - Scale factor or size (optional)

#### Text Styles {.toc}

Add text labels to features with comprehensive typography control:

```typescript
import { createTextStyle } from 'svelte-openlayers/utils';

const labelStyle = createTextStyle({
	text: 'Feature Label',
	font: '14px sans-serif',
	offsetX: 0,
	offsetY: -20,
	textAlign: 'center',
	fill: { color: '#1f2937' },
	stroke: { color: '#ffffff', width: 2 },
	backgroundFill: { color: 'rgba(255, 255, 255, 0.8)' },
	padding: [4, 8, 4, 8]
});
```

**TextStyleOptions Interface:**

- `text: string` - Text content (required)
- `font?: string` - Font specification (optional)
- `offsetX?: number` - Horizontal offset (optional)
- `offsetY?: number` - Vertical offset (optional)
- `scale?: number | Size` - Text scale (optional)
- `rotateWithView?: boolean` - Rotate with map view (optional)
- `rotation?: number` - Text rotation in radians (optional)
- `textAlign?: CanvasTextAlign` - Horizontal alignment (optional)
- `justify?: 'left' | 'center' | 'right'` - Text justification (optional)
- `textBaseline?: CanvasTextBaseline` - Vertical alignment (optional)
- `fill?: FillStyleOptions` - Text fill styling (optional)
- `stroke?: StrokeStyleOptions` - Text stroke styling (optional)
- `backgroundFill?: FillStyleOptions` - Background fill (optional)
- `backgroundStroke?: StrokeStyleOptions` - Background stroke (optional)
- `padding?: number[]` - Background padding (optional)

#### Icon Styles {.toc}

Use custom images as feature symbols:

```typescript
import { createIconStyle } from 'svelte-openlayers/utils';

const markerStyle = createIconStyle({
	src: '/icons/marker.png',
	anchor: [0.5, 1], // Bottom-center anchor
	scale: 0.8,
	opacity: 0.9
});
```

**IconStyleOptions Interface:**

- `src: string` - Image URL (required)
- `anchor?: number[]` - Anchor point as fraction [x, y] (optional)
- `anchorXUnits?: 'fraction' | 'pixels'` - X anchor units (optional)
- `anchorYUnits?: 'fraction' | 'pixels'` - Y anchor units (optional)
- `color?: Color | string` - Tint color (optional)
- `crossOrigin?: string | null` - CORS setting (optional)
- `offset?: number[]` - Image offset in pixels (optional)
- `displacement?: number[]` - Displacement from anchor (optional)
- `opacity?: number` - Icon opacity 0-1 (optional)
- `scale?: number | Size` - Icon scale factor (optional)
- `width?: number` - Specific width in pixels (optional)
- `height?: number` - Specific height in pixels (optional)
- `rotation?: number` - Rotation in radians (optional)
- `rotateWithView?: boolean` - Rotate with view (optional)
- `size?: Size` - Icon size as [width, height] (optional)

#### Stroke and Fill Utilities {.toc}

Create individual stroke and fill styles for composition:

```typescript
import { createStrokeStyle, createFillStyle } from 'svelte-openlayers/utils';

const borderStroke = createStrokeStyle({
	color: '#4338ca',
	width: 3,
	lineCap: 'round',
	lineJoin: 'round',
	lineDash: [5, 5]
});

const areaFill = createFillStyle({
	color: 'rgba(67, 56, 202, 0.3)'
});
```

**StrokeStyleOptions Interface:**

- `color?: Color | string` - Stroke color (optional)
- `width?: number` - Line width in pixels (optional)
- `lineCap?: CanvasLineCap` - Line cap style (optional)
- `lineJoin?: CanvasLineJoin` - Line join style (optional)
- `lineDash?: number[]` - Dash pattern array (optional)
- `lineDashOffset?: number` - Dash pattern offset (optional)
- `miterLimit?: number` - Miter limit for joins (optional)

**FillStyleOptions Interface:**

- `color?: Color | string` - Fill color (optional)

#### Composite Styles {.toc}

Create complex styles combining multiple elements:

```typescript
import { createStyle } from 'svelte-openlayers/utils';

const complexStyle = createStyle({
	fill: { color: 'rgba(67, 56, 202, 0.2)' },
	stroke: { color: '#4338ca', width: 2 },
	image: {
		radius: 6,
		fill: '#4338ca',
		stroke: '#ffffff',
		strokeWidth: 2
	},
	text: {
		text: 'Label',
		fill: { color: '#1f2937' },
		stroke: { color: '#ffffff', width: 1 }
	}
});
```

## Common Customization Patterns {.toc}

### Brand Colors {.toc}

Apply your brand colors across all components:

```css
:root {
	/* Use your brand colors */
	--ol-color-primary: #059669; /* Emerald */
	--ol-color-primary-foreground: white;

	/* Adjust related colors */
	--ol-zoom-button-bg: var(--ol-color-primary);
	--ol-tooltip-select-accent-color: var(--ol-color-primary);
}
```

### Compact Spacing {.toc}

Create a more compact UI by adjusting the spacing scale:

```css
:root {
	/* Reduce all spacing proportionally */
	--ol-space-1: 0.125rem; /* 2px */
	--ol-space-2: 0.25rem; /* 4px */
	--ol-space-3: 0.375rem; /* 6px */
	--ol-space-4: 0.5rem; /* 8px */
}
```

### Rounded Design {.toc}

Make everything more rounded:

```css
:root {
	--ol-radius: 0.5rem;
	--ol-zoom-button-radius: 9999px; /* Fully rounded */
	--ol-tooltip-border-radius: 1rem;
}
```

## Integration Examples {.toc}

### With Tailwind CSS {.toc}

Integrate with Tailwind's design system:

```css
@import 'tailwindcss/base';
@import 'svelte-openlayers/styles/variables.css';

:root {
	--ol-color-primary: theme('colors.blue.600');
	--ol-color-border: theme('colors.gray.200');
	--ol-radius: theme('borderRadius.lg');
	--ol-shadow-md: theme('boxShadow.md');
}

@import 'svelte-openlayers/styles/components.css';
```

### With Bootstrap {.toc}

Use Bootstrap's variables:

```css
@import 'bootstrap/scss/bootstrap';
@import 'svelte-openlayers/styles/variables.css';

:root {
	--ol-color-primary: var(--bs-primary);
	--ol-color-secondary: var(--bs-secondary);
	--ol-font-family-sans: var(--bs-font-sans-serif);
}

@import 'svelte-openlayers/styles/components.css';
```

### With Custom Design System {.toc}

Map your existing design tokens:

```css
:root {
	/* Map your tokens to OpenLayers variables */
	--ol-color-primary: var(--brand-primary);
	--ol-color-background: var(--app-background);
	--ol-space-1: var(--spacing-xs);
	--ol-space-2: var(--spacing-sm);
	--ol-radius: var(--border-radius-base);
}
```

## Advanced Techniques {.toc}

### Scoped Customization {.toc}

Apply different styles to different map instances:

```svelte
<div class="ocean-theme">
	<Map.Root>
		<!-- Uses ocean theme -->
	</Map.Root>
</div>

<div class="forest-theme">
	<Map.Root>
		<!-- Uses forest theme -->
	</Map.Root>
</div>

<style>
	.ocean-theme {
		--ol-color-primary: #0891b2;
		--ol-tooltip-bg: rgba(8, 145, 178, 0.9);
	}

	.forest-theme {
		--ol-color-primary: #059669;
		--ol-tooltip-bg: rgba(5, 150, 105, 0.9);
	}
</style>
```

### Dynamic Theming {.toc}

Change themes programmatically:

```svelte
<script>
	function applyTheme(theme) {
		const root = document.documentElement;

		switch (theme) {
			case 'ocean':
				root.style.setProperty('--ol-color-primary', '#0891b2');
				root.style.setProperty('--ol-color-secondary', '#06b6d4');
				break;
			case 'sunset':
				root.style.setProperty('--ol-color-primary', '#f97316');
				root.style.setProperty('--ol-color-secondary', '#fb923c');
				break;
			case 'midnight':
				root.style.setProperty('--ol-color-primary', '#6366f1');
				root.style.setProperty('--ol-color-secondary', '#8b5cf6');
				break;
		}
	}
</script>

<select onchange={(e) => applyTheme(e.target.value)}>
	<option value="ocean">Ocean</option>
	<option value="sunset">Sunset</option>
	<option value="midnight">Midnight</option>
</select>
```

### Responsive Styling {.toc}

Adjust styles based on screen size:

```css
/* Mobile-first responsive adjustments */
@media (max-width: 640px) {
	:root {
		--ol-tooltip-max-width: 250px;
		--ol-space-2: 0.375rem; /* Tighter spacing on mobile */
		--ol-font-size-sm: 0.8125rem;
	}
}

@media (min-width: 1024px) {
	:root {
		--ol-space-2: 0.625rem; /* More spacious on desktop */
		--ol-tooltip-max-width: 400px;
	}
}
```
