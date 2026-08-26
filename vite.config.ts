import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from '@mdx-js/rollup';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), {
    ...mdx(), enforce:'pre'
  }],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },

  build: {
    sourcemap: false, // Disable sourcemap untuk menghindari error saat build
    chunkSizeWarningLimit: 1000, // Increase limit untuk menghindari warning
  },
});
