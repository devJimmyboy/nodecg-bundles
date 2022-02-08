module.exports = {
  content: ["./src/**/*.{html,ts,css}"],

  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
}
