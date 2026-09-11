import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

function githubPagesFallback() {
  return {
    name: "github-pages-fallback",
    closeBundle() {
      const outputDir = resolve("dist");
      mkdirSync(outputDir, { recursive: true });
      copyFileSync(resolve(outputDir, "index.html"), resolve(outputDir, "404.html"));
    }
  };
}

export default defineConfig({
  plugins: [react(), githubPagesFallback()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  }
});
