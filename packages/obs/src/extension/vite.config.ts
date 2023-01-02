import { defineConfig } from "vite";
import pkg from "../../package.json";
export default defineConfig({
  esbuild: {
    platform: "node",
  },
  build: {
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies || {}),
        "events",
        "obs-websocket-js",
        "openssl",
      ],
    },
  },
  optimizeDeps: {
    disabled: true,
  },
});
