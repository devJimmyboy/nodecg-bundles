module.exports =
  /**
   *
   * @type {import("tailwindcss").TailwindConfig}
   */
  {
    content: ["src/**/*.{html,js,tsx,css}"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
      extend: {},
    },
    corePlugins: { preflight: false },

    variants: {
      extend: { blur: ["hover", "focus"] },
    },
    plugins: [require("daisyui")],
    daisyui: {
      base: false,
      util: false,
    },
  }
