import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/arun-homeo-clinic/" : "/",
  server: { proxy: { "/api": "http://localhost:8080" } }
});

