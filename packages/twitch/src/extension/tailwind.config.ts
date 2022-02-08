import { TailwindConfig } from "tailwindcss/tailwind-config"

export default {
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ["hover", "focus"] },
  },
  plugins: [require("daisyui")],
} as TailwindConfig
