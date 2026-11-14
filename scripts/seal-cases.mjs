// Pieczętowanie spraw: treść sprawy (dokumenty, pytania, rozwiązanie, finał) nie leży w bundlu strony.
// Użycie: node scripts/seal-cases.mjs codes.local.json
// Dla każdej sprawy z listy SEALED:
//  - pełny JSON trafia do content-prywatne/cases/ (gitignore),
//  - w src/content/cases/ zostaje nagłówek (n, id, gate, title, subtitle, epigraph, type, requires, sealed:true),
//  - zaszyfrowany ładunek (AES-GCM-256, klucz = SHA-256("akta-lessu:seal:" + znormalizowany kod rozdziału z requires.chapter)) idzie do public/akta/sprawa-N.json
//    razem z SHA-256 jawnego tekstu (dowód, że w dniu publikacji nic nie zmieniono).
// Klucz w dniu publikacji: wpisać do public/live/klucze.json jako { "N": "<hex klucza>" } (node scripts/seal-cases.mjs --key N codes.local.json wypisze go).
import { readFileSync, writeFileSync, existsSync, readdirSync, renameSync } from "node:fs";
import { createHash, webcrypto } from "node:crypto";
const SEALED = [5, 6, 7];
const args = process.argv.slice(2); const keyOnly = args.includes("--key") ? Number(args[args.indexOf("--key") + 1]) : null;
const file = args.find((a) => a.endsWith(".json")); if (!file) { console.error("Podaj codes.local.json"); process.exit(1); }
const codes = JSON.parse(readFileSync(file, "utf8"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l").replace(/Ł/g, "L").toUpperCase().replace(/[^A-Z0-9]/g, "");
const keyHex = (code) => createHash("sha256").update("akta-lessu:seal:" + norm(code)).digest("hex");
const HEAD = ["n", "id", "gate", "title", "subtitle", "epigraph", "type", "requires"];
for (const n of SEALED) {
  const name = readdirSync("src/content/cases").find((f) => f.startsWith(String(n).padStart(2, "0") + "-") && !f.includes(".header"));
  const privPath = `content-prywatne/cases/${name}`; const pubPath = `src/content/cases/${name}`;
  let full;
  if (existsSync(privPath)) full = JSON.parse(readFileSync(privPath, "utf8"));
  else { full = JSON.parse(readFileSync(pubPath, "utf8")); if (full.sealed) { console.error(`Brak jawnej treści sprawy ${n} (content-prywatne/cases/${name}).`); process.exit(1); } renameSync(pubPath, privPath); }
  const code = codes[String(full.requires.chapter)]; if (!code) { console.error(`Brak kodu rozdziału ${full.requires.chapter} dla sprawy ${n}`); process.exit(1); }
  const kh = keyHex(code);
  if (keyOnly !== null) { if (keyOnly === n) console.log(kh); continue; }
  const key = await webcrypto.subtle.importKey("raw", Buffer.from(kh, "hex"), "AES-GCM", false, ["encrypt"]);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const plain = Buffer.from(JSON.stringify(full), "utf8");
  const ct = Buffer.from(await webcrypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain));
  writeFileSync(`public/akta/sprawa-${n}.json`, JSON.stringify({ n, iv: Buffer.from(iv).toString("base64"), ct: ct.toString("base64"), sha256: createHash("sha256").update(plain).digest("hex") }));
  const head = Object.fromEntries(HEAD.filter((k) => k in full).map((k) => [k, full[k]])); head.sealed = true; head.docs = []; head.questions = []; head.solution = [];
  writeFileSync(pubPath, JSON.stringify(head, null, 2) + "\n");
  console.log(`Sprawa ${n}: zapieczętowana (${ct.length} B), nagłówek w ${pubPath}, jawna treść w ${privPath}.`);
}
