// Import zredagowanych tekstów z content-prywatne/docs/TEKSTY_DO_REDAKCJI.md z powrotem do JSON.
import { readFileSync, writeFileSync } from "node:fs";
const file = process.argv[2] || "content-prywatne/docs/TEKSTY_DO_REDAKCJI.md";
const md = readFileSync(file, "utf8");
const re = /<!-- (.+?) -->\n([\s\S]*?)(?=\n<!-- |\n## |\n*$)/g;
const files = {};
const load = (p) => (files[p] ??= JSON.parse(readFileSync(p, "utf8")));
let n = 0, m;
function setPath(obj, path, value) {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").replace(/^\./, "").split(".");
  let cur = obj; for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
}
while ((m = re.exec(md))) {
  const ref = m[1].trim(); const text = m[2].trim();
  let path, field;
  if (ref.startsWith("cases/")) { const [f, ...rest] = ref.split(" "); path = "src/content/" + f; field = rest.join(" "); }
  else if (ref.startsWith("interludia")) { path = "src/content/interludia.json"; field = ref.replace(/^interludia/, ""); }
  else if (ref.startsWith("mikroakta")) { path = "src/content/mikroakta.json"; field = ref.replace(/^mikroakta/, ""); }
  else if (ref.startsWith("rewards.")) { path = "src/content/rewards.json"; field = ref.replace(/^rewards\./, ""); }
  else continue;
  const obj = load(path);
  setPath(obj, field, text);
  n++;
}
for (const [p, obj] of Object.entries(files)) writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
console.log("Wczytano", n, "fragmentów do", Object.keys(files).length, "plików.");
