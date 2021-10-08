module.exports = {
	purge: ["src/**/*.{html,js,css}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
