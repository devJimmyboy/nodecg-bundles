import { resolve } from 'path'
import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        dir: undefined,
        file: 'extension/index.js',
        inlineDynamicImports: true,
      },
    },
  },
})
