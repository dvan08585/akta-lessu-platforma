// Weryfikacja kodów z gry bez gry: dla organizatora, biblioteki, jury.
// Użycie: node scripts/verify-code.mjs b1a2f0k7c3   (kod biegłego, połowa klucza „k…" albo odczyt „<wzgórze><4 hex><2 chk>")
// Nie wymaga sieci ani danych gracza; sprawdza tylko sumę kontrolną i odczytuje datę z kodu biegłego.
import { createHash } from "node:crypto";

const sha = (s) => createHash("sha256").update(s, "utf8").digest("hex");
const check = (body) => sha("akta-lessu:chk:" + body).slice(0, 2);
const EPOCH = Date.UTC(2027, 0, 1);

const raw = (process.argv[2] ?? "").trim().toLowerCase();
if (!raw) { console.error("Podaj kod."); process.exit(2); }
const body = raw.slice(0, -2), chk = raw.slice(-2);
if (check(body) !== chk) { console.log(`NIEPRAWIDŁOWY: ${raw} (suma kontrolna się nie zgadza; literówka albo kod zmyślony)`); process.exit(1); }

if (/^b[0-9a-f]{4}[0-9a-z]{3}$/.test(body)) {
  const day = parseInt(body.slice(5, 8), 36);
  const at = new Date(EPOCH + day * 86400000);
  const date = at.toISOString().slice(0, 10);
  console.log(`KOD BIEGŁEGO: ważny. Siedem bram rozstrzygniętych dnia ${date} (UTC, dokładność do dnia). Kohortę „Pierwszy tydzień" liczy się od dnia premiery: ${date} + regulamin.`);
} else if (/^k[0-9a-f]{4}$/.test(body)) {
  console.log("POŁOWA KLUCZA: ważna (po sześciu bramach). Sama nie dowodzi ukończenia; do finału potrzebna druga połowa innej osoby.");
} else if (/^[1-7][0-9a-f]{4}$/.test(body)) {
  console.log(`ODCZYT ZAWIESZKI: ważny, wzgórze ${body[0]}. To odczyt dla innego biegłego, nie dowód ukończenia.`);
} else {
  console.log(`Suma zgadza się, ale format nieznany: ${raw}`);
}
