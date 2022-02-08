module.exports = {
  content: ["./src/**/*"],
  options: {
    safelist: [/data-theme$/],
  },
  corePlugins: { preflight: false },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
  daisyui: {
    base: false,
    util: false,
  },
}
