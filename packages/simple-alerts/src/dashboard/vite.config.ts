import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        config: resolve(__dirname, "config.html"),
        ttsTest: resolve(__dirname, "ttsTest.html"),
      },
      external: ["nodecg-types"],
    },
    sourcemap: "inline",
  },
});
