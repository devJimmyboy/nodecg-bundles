import { defineConfig } from "vite";

export default defineConfig({
  mode: 'development',
  base: '/bundles/peepo-interactive/graphics/',
  build: {
    outDir: './graphics',
    sourcemap: true,
  },
})
