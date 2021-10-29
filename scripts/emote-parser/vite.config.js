const path = require("path")
const { defineConfig } = require("vite")

module.exports = defineConfig({
  build: {
    outDir: path.resolve(__dirname, "lib"),
    watch: process.env.NODE_ENV === "development" && {
      include: ["src/**", "tsconfig.json", "package.json"],
    },
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "EmoteParser",
      fileName: (format) => `index.${format !== "umd" ? format + "." : ""}js`,
      formats: ["umd", "esm"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {},
      },
    },
  },
})
