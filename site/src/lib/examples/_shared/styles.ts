import { createCircleStyle, createStyle } from 'svelte-openlayers/utils';

export const pointStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#4338ca' },
	stroke: { color: '#ffffff', width: 2 }
});

export const selectedStyle = createCircleStyle({
	radius: 6,
	fill: { color: '#10b981' },
	stroke: { color: '#ffffff', width: 2 }
});

export const hoverStyle = createCircleStyle({
	radius: 8,
	fill: { color: '#10b981' },
	stroke: { color: '#ffffff', width: 2 }
});

export const drawStyle = createStyle({
	fill: {
		color: 'rgba(59, 130, 246, 0.3)'
	},
	stroke: {
		color: '#2563eb',
		width: 2
	},
	image: {
		radius: 6,
		fill: { color: '#2563eb' },
		stroke: { color: '#ffffff', width: 2 }
	}
});

export const sketchStyle = createStyle({
	fill: {
		color: 'rgba(16, 185, 129, 0.2)'
	},
	stroke: {
		color: '#10b981',
		width: 2,
		lineDash: [10, 10]
	},
	image: {
		radius: 6,
		fill: { color: '#10b981' },
		stroke: { color: '#ffffff', width: 2 }
	}
});

export const lineStyle = createStyle({
	stroke: {
		color: '#10b981',
		width: 3
	}
});

export const lineHoverStyle = createStyle({
	stroke: {
		color: '#34d399',
		width: 5
	}
});

export const lineSelectedStyle = createStyle({
	stroke: {
		color: '#f59e0b',
		width: 5
	}
});

export const polygonStyle = createStyle({
	fill: {
		color: 'rgba(99, 102, 241, 0.3)'
	},
	stroke: {
		color: '#4338ca',
		width: 2
	}
});

export const polygonHoverStyle = createStyle({
	fill: {
		color: 'rgba(99, 102, 241, 0.5)'
	},
	stroke: {
		color: '#6366f1',
		width: 3
	}
});

export const polygonSelectedStyle = createStyle({
	fill: {
		color: 'rgba(16, 185, 129, 0.3)'
	},
	stroke: {
		color: '#10b981',
		width: 3
	}
});
