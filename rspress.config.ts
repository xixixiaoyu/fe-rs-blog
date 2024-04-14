import * as path from 'path';
import { defineConfig } from 'rspress/config';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
	base: process.env.NODE_ENV === 'development' ? '' : '/fe-rs-blog/',
	root: path.join(__dirname, 'docs'),
	title: 'fe-blog',
	description: 'fe-rspress-blog',
	icon: '/rspress-icon.png',
	logo: {
		light: '/rspress-light-logo.png',
		dark: '/rspress-dark-logo.png',
	},
	themeConfig: {
		socialLinks: [
			{
				icon: 'github',
				mode: 'link',
				content: 'https://github.com/web-infra-dev/rspress',
			},
		],
		hideNavbar: 'never',
	},
	markdown: {
		mdxRs: false,
		remarkPlugins: [
			[
				remarkAutolinkHeadings,
				{
					behavior: 'wrap',
				},
			],
		],
		rehypePlugins: [rehypeSlug, rehypeRaw, rehypeKatex],
	},
	builderConfig: {
		html: {
			tags: [
				{
					tag: 'meta',
					attrs: {
						name: 'referrer',
						content: 'no-referrer',
					},
				},
			],
		},
	},
});
