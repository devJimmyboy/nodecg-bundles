module.exports = {
  content: ["./src/**/*"],
  corePlugins: { preflight: false },
  darkMode: "class", // or 'media' or 'class
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
};
