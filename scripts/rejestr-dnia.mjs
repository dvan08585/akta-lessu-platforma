// Rejestr Fundacji na żywo w dniu premiery: co godzinę inne wiersze.
// Użycie: ADMIN_TOKEN=... node scripts/rejestr-dnia.mjs content-prywatne/rejestr-dnia.json [--hour 14] [--off]
// Plik harmonogramu: { "header": "...", "hours": { "12": ["1. Wzg. Żmigrodzkie: nieznany", ...], "13": [...] }, "notices": { "12": [{ "date": "…", "text": "…" }] } }
// Skrypt wysyła wiersze z bieżącej godziny (albo z --hour) do Workera (PUT /rejestr) i zapisuje tę samą treść do public/live/rejestr.json jako zapas
// na wypadek, gdyby Worker padł (wtedy: commit + push, GitHub Pages wdraża w minutę). --off wyłącza rejestr (active: false).
import { readFileSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2); const file = args.find((a) => a.endsWith(".json")); const off = args.includes("--off");
const hourArg = args.includes("--hour") ? Number(args[args.indexOf("--hour") + 1]) : new Date().getHours();
if (!file) { console.error("Podaj plik harmonogramu."); process.exit(2); }
const sched = JSON.parse(readFileSync(file, "utf8"));
const cfg = JSON.parse(readFileSync("src/content/config.json", "utf8"));
const url = (cfg.backendUrl || "").replace(/\/$/, "");
const token = process.env.ADMIN_TOKEN || "";
// najbliższa godzina w harmonogramie, nie późniejsza niż bieżąca
const hours = Object.keys(sched.hours || {}).map(Number).sort((a, b) => a - b);
const pick = hours.filter((h) => h <= hourArg).pop();
const early = pick === undefined; // przed pierwszą godziną harmonogramu rejestr jest nieaktywny, nie „z południa"
const body = { active: !off && !early, header: sched.header || "Rejestr statusów — Fundacja Sandomierska Memoria — aktualizacja na żywo", lines: off || early ? [] : (sched.hours?.[String(pick)] ?? []), notices: early ? [] : (sched.notices?.[String(pick)] ?? []) };
const local = { ...body, updatedAt: new Date().toISOString(), note: "Zapas dla Workera; podmieniany skryptem rejestr-dnia.mjs. Plik idzie zawsze z sieci (service worker nie trzyma go w pamięci)." };
writeFileSync("public/live/rejestr.json", JSON.stringify(local, null, 2) + "\n");
console.log(`Zapas: public/live/rejestr.json (${early ? "przed pierwszą godziną harmonogramu" : "godzina " + pick}, ${body.lines.length} wierszy${off ? ", wyłączony" : ""}).`);
if (!url || !token) { console.log("Bez backendUrl albo ADMIN_TOKEN: tylko plik zapasowy. Commit + push, żeby strona go zobaczyła."); process.exit(0); }
const r = await fetch(url + "/rejestr", { method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
console.log(r.ok ? `Worker: zapisano (${r.status}).` : `Worker: błąd ${r.status}; strona użyje pliku zapasowego po commit + push.`);
