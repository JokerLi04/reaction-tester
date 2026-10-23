import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

const viteConfig = defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd());
  const isDev = mode.command === "server";
  return {
    plugins: [vue()],
    server: {
      open: true,
      port: 1000,
      host: "localhost",
    },
    build: {
      sourcemap: isDev ? 'inline' : true,
    },
    base: !isDev ? "./" : env.VITE_PUBLIC_PATH,
  };
});

// https://vite.dev/config/
export default viteConfig;
