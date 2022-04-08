module.exports = {
  purge: ['./src/dashboard/index.html', './src/graphics/index.html', './src/{dashboard,graphics}/*.{vue,js,ts,jsx,tsx,css}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
