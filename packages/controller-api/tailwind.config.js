module.exports = {
  content: ["./src/**/*.{html,ts,tsx,css}"],

  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require("daisyui")],
};
