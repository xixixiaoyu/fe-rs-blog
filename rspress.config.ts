import * as path from 'path';
import { defineConfig } from 'rspress/config';

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
