module.exports = {
  purge: ["src/**.{html,js,ts,css}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
}
