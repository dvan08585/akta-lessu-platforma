import { h, back } from "./dom";
import { topbar, crumb, fmtWhen, addr } from "./views";
import { expertCode } from "../engine/pair";
import { GESTURE_OF } from "../engine/cases";
import { fetchStats } from "../engine/wspolny";
import type { App } from "../app";

/**
 * Protokół biegłego: jeden dokument o graczu, w głosie archiwisty, z tego, co telefon i tak pamięta (zeszyt, próby, odczyty, decyzje).
 * Bez ocen, bez punktów, bez porównań. To, co ludzie pokażą drugiej osobie przy stole.
 */
export function viewProtokol(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in" }, topbar(app, "#/zeszyt"), crumb("Protokół", "#/zeszyt", "Zeszyt"), h("h2", {}, "Protokół biegłego"));
  const s = app.state; const now = new Date();
  const line = (k: string, v: string) => h("p", {}, h("b", {}, k + ": "), v);
  const notes = s.notebook;
  const whenOf = (pred: (e: { text: string; meta: string }) => boolean) => { const e = notes.find(pred); return e ? fmtWhen(new Date(e.at)) : null; };
  const art = h("article", { class: "doc mono stamped" }, h("h4", {}, "Program „Sandomierz Pod Spodem”"), h("div", { class: "src" }, `Wyciąg z rejestru zdarzeń urządzenia biegłego. Sporządzono ${fmtWhen(now)}. Dane nie opuściły urządzenia.`));
  art.append(line("Biegły", addr(app, "forma żeńska", "forma męska", "forma nieokreślona") + ", bez nazwiska (zgodnie z zasadą programu)"));
  // sprawy i bramy
  const rows: string[] = [];
  for (const c of [...app.cases].sort((a, b) => a.n - b.n)) {
    const solved = s.solvedCases.includes(c.n); if (!solved) { rows.push(`Sprawa ${c.n} (brama ${c.gate}): nierozpoznana`); continue; }
    const tries = (s.attempts[c.id] ?? []).length; const g = GESTURE_OF[c.gate]; const passed = !g || s.interludesDone.includes(g) || s.testMode;
    const pledged = notes.some((e) => e.meta === `brama ${c.gate} przebyta` && e.text.includes("na słowo"));
    const when = whenOf((e) => e.text.startsWith(`Brama ${c.gate} rozpoznana`));
    rows.push(`Sprawa ${c.n} (brama ${c.gate}): rozpoznana${when ? " " + when : ""}${tries ? `, ${tries === 1 ? "za pierwszym razem" : `${tries} ${tries < 5 ? "próby" : "prób"}`}` : ""}; brama ${passed ? (pledged ? "przebyta na słowo" : "przebyta ciałem") : "jeszcze nieprzebyta"}`);
  }
  art.append(h("p", {}, h("b", {}, "Bramy: ")), ...rows.map((r) => h("p", { class: "row-line" }, r)));
  if (s.unstableGates.length) art.append(line("Bramy otwarte siłą", s.unstableGates.map((g) => `brama ${g}`).join(", ") + ". Zostają w karcie jako niestabilne."));
  const silent = app.silent.length ? app.silent.join(" i ") : "nie ustalono";
  const readings = Object.entries(s.readings);
  art.append(line("Wzgórza milczące", `${silent}. Odczyty dopełniające: ${readings.length ? readings.map(([g, src]) => `wzgórze ${g} ${src === "archiwum" ? "z archiwum programu" : "od innego biegłego"}`).join(", ") : "żadnego"}.`));
  const replies = Object.keys(s.inbox?.replies ?? {}).length; const letters = Object.keys(s.inbox?.scheduled ?? {}).length;
  art.append(line("Korespondencja", `${letters} ${letters === 1 ? "list" : letters < 5 ? "listy" : "listów"}, ${replies} ${replies === 1 ? "odpowiedź" : replies < 5 ? "odpowiedzi" : "odpowiedzi"}.`));
  const daily = Object.values(s.daily); const dailyOk = daily.filter(Boolean).length;
  if (daily.length) art.append(line("Mikro-akta", `${daily.length} ${daily.length === 1 ? "dzień" : "dni"}, ${dailyOk} trafnie.`));
  // pora pracy
  if (notes.length >= 3) { const hours = notes.map((e) => new Date(e.at).getHours()); const bins = [0, 0, 0, 0]; for (const hh of hours) bins[hh < 6 ? 0 : hh < 12 ? 1 : hh < 18 ? 2 : 3]++; const names = ["w nocy", "rano", "po południu", "wieczorem"]; const top = bins.indexOf(Math.max(...bins)); art.append(line("Pora pracy", `najczęściej ${names[top]} (${notes.length} ${notes.length < 5 ? "zapiski" : "zapisków"} w zeszycie).`)); }
  if (s.leftSeventhEmpty) { const c = h("code", {}, "…"); expertCode(s.seed, s.finaleAt ?? Date.now()).then((v) => (c.textContent = v)); art.append(line("Siódma pozycja", `zostawiona pusta${s.finaleAt ? " " + fmtWhen(new Date(s.finaleAt)) : ""}.`), h("p", {}, h("b", {}, "Kod biegłego: "), c)); }
  else art.append(line("Siódma pozycja", "nierozstrzygnięta."));
  if (app.cfg.backendUrl) { const pl = h("p", {}, h("b", {}, "Biegłych w programie: "), "…"); art.append(pl); fetchStats(app.cfg.backendUrl).then((st) => { pl.lastChild!.textContent = st ? String(st.players) : "bez połączenia"; }); }
  art.append(h("p", { class: "faint" }, "Protokół sporządza urządzenie. Program nie przechowuje jego kopii."));
  sec.append(art, h("div", { class: "verdict" }, back("Wróć do zeszytu", "#/zeszyt")));
  return sec;
}
