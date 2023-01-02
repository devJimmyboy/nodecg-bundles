import { defineConfig } from "vite";
export default defineConfig({
  mode: "development",
  build: {
    minify: "terser",
    sourcemap: "inline",
  },
});