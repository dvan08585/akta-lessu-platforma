// Użycie: node scripts/hash-codes.mjs codes.local.json
// codes.local.json (NIE commitować): { "0": "GOLAB", "1": "JABLKA", ... }  -> wpisuje codeHash do src/content/chapters.json
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const file = process.argv[2];
if (!file) { console.error("Podaj plik z kodami, np. codes.local.json"); process.exit(1); }
const codes = JSON.parse(readFileSync(file, "utf8"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").toUpperCase().replace(/[^A-Z0-9]/g, "");
const chapters = JSON.parse(readFileSync("src/content/chapters.json", "utf8"));
for (const ch of chapters) {
  const code = codes[String(ch.n)];
  ch.codeHash = code ? createHash("sha256").update("akta-lessu:" + norm(code)).digest("hex") : "";
}
writeFileSync("src/content/chapters.json", JSON.stringify(chapters, null, 2) + "\n");
console.log("Zapisano hashe dla", Object.keys(codes).length, "kodów.");
