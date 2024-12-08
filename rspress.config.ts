import * as path from 'path'
import { defineConfig } from 'rspress/config'

export default defineConfig({
	base: process.env.NODE_ENV === 'development' ? '' : '/fe-rs-blog/',
	root: path.join(__dirname, 'docs'),
	title: 'fe-blog',
	description: 'fe-rspress-blog',
	icon: '/favicon.ico',
	logo: '/favicon.ico',
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
				content: 'https://github.com/xixixiaoyu',
			},
		],
		hideNavbar: 'never',
		outlineTitle: '目录',
		enableContentAnimation: true,
		enableAppearanceAnimation: true,
	},
	markdown: {
		mdxRs: true,
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
				})
				return config
			},
		},
	},
})
