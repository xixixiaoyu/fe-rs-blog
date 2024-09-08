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
	logo: {
		light: '/site-icon.png',
		dark: '/site-icon.png',
	},
	themeConfig: {
		socialLinks: [
			{
				icon: 'juejin',
				mode: 'link',
				content: 'https://juejin.cn/user/1530130204207822',
			},
			{
				icon: 'bilibili',
				mode: 'link',
				content: 'https://space.bilibili.com/145679856',
			},
			{
				icon: 'github',
				mode: 'link',
				content: 'hhttps://github.com/xixixiaoyu',
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
