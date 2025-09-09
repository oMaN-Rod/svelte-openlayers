import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHighlighter } from 'shiki';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { remarkTocHeadings } from './remark-toc-headings.js';

const highlighter = await createHighlighter({
	themes: ['github-dark', 'github-light'],
	langs: ['typescript', 'javascript', 'svelte', 'html', 'css', 'bash', 'json']
});

const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	highlight: {
		highlighter: (code, lang) => {
			const html = highlighter.codeToHtml(code, {
				lang: lang || 'text',
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				},
				defaultColor: false
			});
			return `{@html \`${html}\`}`;
		}
	},
	remarkPlugins: [remarkTocHeadings],
	rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]
};

const config = {
	preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	},
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
