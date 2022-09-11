module.exports = {
  content: ["src/**/*.{html,ts,css}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require("daisyui")],
};
