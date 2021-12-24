module.exports = {
  content: ["./src/{dashboard,graphics}/*.{html,ts,tsx,css}"],
  darkMode: "media", // or 'media' or 'class'
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
}
