import { defineConfig } from "vite";

const BUILD = Date.now().toString(36);
// version.json obok index.html: aplikacja porównuje go ze swoim znacznikiem i prosi o odświeżenie, gdy na serwerze jest nowsza wersja
const versionFile = () => ({ name: "version-json", generateBundle(this: { emitFile: (f: { type: "asset"; fileName: string; source: string }) => void }) { this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify({ build: BUILD }) }); } });

// GitHub Pages serwuje projekt pod /akta-lessu-platforma/ (dev i preview też, żeby ścieżki były identyczne).
export default defineConfig({
  base: "/akta-lessu-platforma/",
  define: { __BUILD__: JSON.stringify(BUILD) }, // znacznik budowy do linków poza aplikacją (omija pamięć podręczną HTML)
  plugins: [versionFile()],
  build: { target: ["es2020", "safari14", "chrome90"], sourcemap: false },
  test: { environment: "node" },
});
