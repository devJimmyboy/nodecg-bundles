import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    rollupOptions: {
      input: ['./src/dashboard/index.html', './src/dashboard/emoteTest.html'],
    },
  },
})
