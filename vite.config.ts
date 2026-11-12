import { defineConfig } from "vite";

// GitHub Pages serwuje projekt pod /akta-lessu-platforma/ (dev i preview też, żeby ścieżki były identyczne).
export default defineConfig({
  base: "/akta-lessu-platforma/",
  build: { target: "es2022", sourcemap: false },
  test: { environment: "node" },
});
