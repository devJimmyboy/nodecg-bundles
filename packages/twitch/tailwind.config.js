module.exports = {
  purge: ["src/dashboard/*.{html,ts,css}", "src/graphics/*.{html,ts,css}"],

  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
}
