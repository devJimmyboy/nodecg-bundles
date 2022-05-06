import { resolve } from "path";
import { defineConfig } from "vite";
import { splitVendorChunkPlugin } from "vite";

export default defineConfig({
  envDir: resolve(__dirname, "../../"),
  build: {
    minify: false,
    rollupOptions: {
      output: {
        dir: undefined,
        file: "extension/index.js",
        inlineDynamicImports: true,
      },
    },
  },
});
