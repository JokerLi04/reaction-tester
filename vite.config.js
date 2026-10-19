import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    open: true,
    port: 1000,
    host: true,
  },
  build: {
    sourcemap: true,
  },
});
