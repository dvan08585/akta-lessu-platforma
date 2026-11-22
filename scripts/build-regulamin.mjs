// Regulamin w grze: docs/REGULAMIN_KONKURSU.md → public/regulamin/index.html (prosta zamiana markdown na HTML, bez zależności).
// Uruchom po każdej zmianie regulaminu: node scripts/build-regulamin.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const md = readFileSync("docs/REGULAMIN_KONKURSU.md", "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>");
const lines = md.split("\n"); const out = []; let list = null;
const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
for (const raw of lines) {
  const l = raw.trimEnd();
  if (/^#\s/.test(l)) { closeList(); out.push(`<h1>${inline(l.slice(2))}</h1>`); continue; }
  if (/^##\s/.test(l)) { closeList(); out.push(`<h2>${inline(l.slice(3))}</h2>`); continue; }
  if (/^###\s/.test(l)) { closeList(); out.push(`<h3>${inline(l.slice(4))}</h3>`); continue; }
  if (/^---\s*$/.test(l)) { closeList(); out.push("<hr>"); continue; }
  const num = /^(\d+)\.\s+(.*)$/.exec(l); const bul = /^-\s+(.*)$/.exec(l);
  if (num) { if (list !== "ol") { closeList(); out.push("<ol>"); list = "ol"; } out.push(`<li>${inline(num[2])}</li>`); continue; }
  if (bul) { if (list !== "ul") { closeList(); out.push("<ul>"); list = "ul"; } out.push(`<li>${inline(bul[1])}</li>`); continue; }
  if (!l.trim()) { closeList(); continue; }
  closeList(); out.push(`<p>${inline(l)}</p>`);
}
closeList();
const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Regulamin konkursu „Rejestr biegłych”</title><meta name="robots" content="noindex">
<style>
 :root { color-scheme: light dark; }
 body { margin: 0; padding: 1.2rem 1rem 3rem; max-width: 42rem; margin-inline: auto; font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif; line-height: 1.55; color: #1c1a16; background: #efebe1; }
 @media (prefers-color-scheme: dark) { body { color: #e8e0cf; background: #0e0d0b; } a { color: #c9a86a; } }
 h1 { font-size: 1.4rem; font-weight: 400; } h2 { font-size: 1.05rem; margin-top: 1.8rem; } h3 { font-size: 0.95rem; }
 li { margin: 0.3rem 0; } code { font-family: Menlo, Consolas, monospace; font-size: 0.9em; }
 .note { font-size: 0.85rem; opacity: 0.75; border-top: 1px solid currentColor; padding-top: 0.6rem; margin-top: 2rem; }
 a { color: #765520; }
</style></head><body>
<p><a href="../#/akta">← Akta</a></p>
${out.join("\n")}
<p class="note">Wersja robocza. Miejsca w nawiasach kwadratowych wypełnia Organizator przed ogłoszeniem konkursu. Wygenerowano z docs/REGULAMIN_KONKURSU.md.</p>
</body></html>`;
mkdirSync("public/regulamin", { recursive: true });
writeFileSync("public/regulamin/index.html", html);
console.log("public/regulamin/index.html:", html.length, "bajtów");
