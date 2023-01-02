import { defineConfig } from "vite";
import pkg from "../../package.json";
export default defineConfig({
  esbuild: {
    platform: "node",
  },
  build: {
    rollupOptions: {
      output: {},
      external: [...Object.keys(pkg.dependencies || {}), "events"],
    },
  },
  optimizeDeps: {
    disabled: true,
  },
});
