import { defineConfig } from "vite";
import pkg from "../../package.json";
export default defineConfig({
  esbuild: {
    platform: "node",
  },
  build: {
    sourcemap: "inline",
    lib: {
      entry: "./index.ts",
      fileName: "index",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {})],
    },
  },
  optimizeDeps: {
    disabled: true,
  },
});
