import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@healthcare/theme": path.resolve(__dirname, "../../packages/theme/src"),
      "@healthcare/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@healthcare/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@healthcare/hooks": path.resolve(__dirname, "../../packages/hooks/src"),
      "@healthcare/types": path.resolve(__dirname, "../../packages/types/src"),
      "@healthcare/api-client": path.resolve(__dirname, "../../packages/api-client/src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: "es2020",
    outDir: "dist",
    sourcemap: true,
  },
});
