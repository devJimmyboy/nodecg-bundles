import { defineConfig } from "vite";

defineConfig({
  resolve: {},
  build: {
    lib: {
      entry: "./index.ts",
      formats: ["cjs"],
    },
  },
});
