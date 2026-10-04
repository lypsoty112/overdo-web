// Vite config for overdo-web. /api is proxied to overdo-api on port 3700 with the prefix stripped, so the
// browser only ever talks to one origin and the API needs no CORS handling.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3700",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
