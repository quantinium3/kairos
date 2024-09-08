/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [
		function ({addUtilities}) {
			addUtilities ({
				'.text-transparent': {
					'background-clip': 'text',
					'-webkit-background clip': 'text',
					'color': 'transparent',
				}
			})
		}
	],
}
