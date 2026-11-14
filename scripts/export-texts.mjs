// Eksport wszystkich tekstów gry do jednego pliku Markdown do redakcji: content-prywatne/docs/TEKSTY_DO_REDAKCJI.md
// Użycie: node scripts/export-texts.mjs        (import z powrotem: node scripts/import-texts.mjs content-prywatne/docs/TEKSTY_DO_REDAKCJI.md)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
// Sprawy zapieczętowane: jawna treść leży w content-prywatne/cases (poza gitem), w src/content/cases tylko nagłówek.
const casePath = (f) => (existsSync("content-prywatne/cases/" + f) ? "content-prywatne/cases/" + f : "src/content/cases/" + f);
const out = [];
const H = (t) => out.push("\n## " + t + "\n");
const F = (ref, text) => out.push(`<!-- ${ref} -->\n${text}\n`);
out.push("# AKTA LESSU — TEKSTY DO REDAKCJI\n\nKażdy fragment ma nad sobą komentarz z adresem pola. Zmieniaj tylko tekst pod komentarzem, nie komentarz. Potem: `node scripts/import-texts.mjs content-prywatne/docs/TEKSTY_DO_REDAKCJI.md`.\n");
for (const f of readdirSync("src/content/cases").sort()) {
  const c = JSON.parse(readFileSync(casePath(f), "utf8"));
  H(`SPRAWA ${c.n}: ${c.title} (${f})`);
  F(`cases/${f} title`, c.title); F(`cases/${f} subtitle`, c.subtitle); F(`cases/${f} epigraph`, c.epigraph);
  c.docs.forEach((d, i) => { F(`cases/${f} docs[${i}].source`, d.source); d.paragraphs.forEach((p, j) => F(`cases/${f} docs[${i}].paragraphs[${j}]`, p)); });
  c.questions.forEach((q, i) => { F(`cases/${f} questions[${i}].text`, q.text); q.options.forEach((o, j) => F(`cases/${f} questions[${i}].options[${j}]`, o)); if (q.hint) F(`cases/${f} questions[${i}].hint`, q.hint); if (q.monthLines) q.monthLines.forEach((m, j) => F(`cases/${f} questions[${i}].monthLines[${j}]`, m)); if (q.monthClosing) F(`cases/${f} questions[${i}].monthClosing`, q.monthClosing); });
  c.solution.forEach((p, j) => F(`cases/${f} solution[${j}]`, p));
  if (c.decision) { for (const k of ["prompt", "open", "leave"]) F(`cases/${f} decision.${k}`, c.decision[k]); c.decision.buried.forEach((p, j) => F(`cases/${f} decision.buried[${j}]`, p)); }
  if (c.pair) { for (const k of ["prompt", "promptUnstable", "ask", "refuse", "register", "registerQuestion", "yes", "no", "yesRefused"]) F(`cases/${f} pair.${k}`, c.pair[k]); c.pair.finale.forEach((p, j) => F(`cases/${f} pair.finale[${j}]`, p)); }
}
const inter = JSON.parse(readFileSync("src/content/interludia.json", "utf8"));
H("MIĘDZY SPRAWAMI (interludia.json)");
inter.forEach((it, i) => {
  F(`interludia[${i}].title`, it.title);
  if (it.lines) it.lines.forEach((l, j) => F(`interludia[${i}].lines[${j}]`, l));
  if (it.intro) F(`interludia[${i}].intro`, it.intro);
  if (it.questions) it.questions.forEach((q, j) => { F(`interludia[${i}].questions[${j}].q`, q.q); F(`interludia[${i}].questions[${j}].a`, q.a); });
  if (it.reveal) F(`interludia[${i}].reveal`, it.reveal); if (it.wrong) F(`interludia[${i}].wrong`, it.wrong);
});
const mk = JSON.parse(readFileSync("src/content/mikroakta.json", "utf8"));
H("MIKRO-AKTA (mikroakta.json)");
mk.forEach((m, i) => { F(`mikroakta[${i}].title`, m.title); F(`mikroakta[${i}].doc`, m.doc); F(`mikroakta[${i}].q`, m.q); m.options.forEach((o, j) => F(`mikroakta[${i}].options[${j}]`, o)); });
const rw = JSON.parse(readFileSync("src/content/rewards.json", "utf8"));
H("NAGRODY (rewards.json)");
for (const [k, r] of Object.entries(rw)) { F(`rewards.${k}.title`, r.title); F(`rewards.${k}.note`, r.note); r.paragraphs.forEach((p, j) => F(`rewards.${k}.paragraphs[${j}]`, p)); }
writeFileSync("content-prywatne/docs/TEKSTY_DO_REDAKCJI.md", out.join("\n"));
console.log("Zapisano content-prywatne/docs/TEKSTY_DO_REDAKCJI.md:", out.length, "fragmentów");
