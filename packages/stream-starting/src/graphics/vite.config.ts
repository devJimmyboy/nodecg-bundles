import { defineConfig } from "vite";
export default defineConfig({
  mode: "development",
  build: {
    minify: false,
    sourcemap: "inline",
  },
});
