import * as path from 'path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
	base: '/fe-rs-blog'
	root: path.join(__dirname, 'docs'),
	title: 'fe-blog',
	description: 'Rspack-based Static Site Generator',
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
	},
});
