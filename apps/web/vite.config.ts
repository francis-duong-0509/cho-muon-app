import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({ server: { entry: "./ssr-bun-render-handler.ts" } }),
    viteReact(),
  ],
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
    host: true,
  },
});
