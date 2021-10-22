module.exports = {
	purge: ["./src/{dashboard,graphics}/*.{html,vue,js,ts,jsx,tsx,css}"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require("daisyui"),
		// ...
	],
};
