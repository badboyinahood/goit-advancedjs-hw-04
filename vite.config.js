import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/goit-advancedjs-hw-04/",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
    }
  },
  optimizeDeps: {
    include: ["simplelightbox"]
  },
  define: {
    global: "window"
  }
});
