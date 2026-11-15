import { defineConfig } from "vite";

// GitHub Pages serwuje projekt pod /akta-lessu-platforma/ (dev i preview też, żeby ścieżki były identyczne).
export default defineConfig({
  base: "/akta-lessu-platforma/",
  define: { __BUILD__: JSON.stringify(Date.now().toString(36)) }, // znacznik budowy do linków poza aplikacją (omija pamięć podręczną HTML)
  build: { target: "es2022", sourcemap: false },
  test: { environment: "node" },
});
