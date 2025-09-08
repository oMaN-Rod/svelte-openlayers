import { visit } from 'unist-util-visit';

/**
 * Remark plugin to add data-toc attribute to headings marked with {.toc}
 *
 * Usage in markdown:
 * ## My Heading {.toc}
 * ### Another Section {.toc}
 * ## Regular Heading (will not appear in TOC)
 */
export function remarkTocHeadings() {
	return function transformer(tree) {
		visit(tree, 'heading', (node) => {
			// Only process h2, h3, h4
			if (node.depth < 2 || node.depth > 4) return;

			// Check for {.toc} marker in any text node
			let hasTocMarker = false;
			const tocMarkerRegex = /\s*\{[#.]toc\}\s*$/;

			// Process all children to find and remove the marker
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				if (child.type === 'text') {
					const text = child.value;
					if (tocMarkerRegex.test(text)) {
						hasTocMarker = true;
						// Remove the marker from the text
						child.value = text.replace(tocMarkerRegex, '').trim();
						break; // Only process the first match
					}
				}
			}

			// If we found the marker, add the data-toc attribute
			if (hasTocMarker) {
				node.data = node.data || {};
				node.data.hProperties = node.data.hProperties || {};
				node.data.hProperties['data-toc'] = true;
			}
		});

		return tree;
	};
}
