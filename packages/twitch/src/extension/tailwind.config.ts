import { TailwindConfig } from 'tailwindcss/tailwind-config'

export default {
  theme: {
    extend: {},
  },
  variants: {
    extend: { blur: ['hover', 'focus'] },
  },
  plugins: [require('daisyui')],
} as TailwindConfig
