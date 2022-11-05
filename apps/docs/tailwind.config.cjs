const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Roboto', ...defaultTheme.fontFamily.sans]
			}
		}
	},
	plugins: []
};

module.exports = config;
