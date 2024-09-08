import * as path from 'path';
import { defineConfig } from 'rspress/config';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import remarkAutolinkHeadings from 'remark-autolink-headings';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
	lang: 'zh-CN',
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
		search: true,
		nav: [
			{
				text: '首页',
				link: '/',
			},
			{
				text: '文档',
				link: '/docs/',
			},
		],
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
		rehypePlugins: [rehypeSlug, rehypeRaw, rehypeKatex as any],
	},
	globalStyles: path.join(__dirname, '/docs/styles/global.css'),
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
		tools: {
			rspack: config => {
				config.module.rules.push({
					test: /\.(woff|woff2|eot|ttf|otf)$/i,
					type: 'asset/resource',
				});
				return config;
			},
		},
	},
});
