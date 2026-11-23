import { h, back } from "./dom";
import { topbar, crumb, fmtWhen } from "./views";
import { seal } from "./icons";
import { expertCode } from "../engine/pair";
import { GESTURE_OF } from "../engine/cases";
import type { App } from "../app";

/**
 * Paszport bram do druku: siedem pól (jedno na bramę) z datą przebycia, miejsce na pieczęć strażnika, pieczęć biegłego i kod.
 * Dla czytelnika e-booka i dla każdego, kto nie ma strony w książce. Regulamin § 3.2 obiecuje „paszport wydrukowany z Gry".
 */
export function viewPaszport(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in paszport" }, topbar(app, "#/zeszyt"), crumb("Paszport", "#/zeszyt", "Zeszyt"), h("h2", {}, "Paszport bram"));
  const s = app.state;
  const passedAt = (gate: number): string | null => { const g = GESTURE_OF[gate]; if (g && !s.interludesDone.includes(g) && !s.testMode) return null; const e = s.notebook.find((n) => n.meta === `brama ${gate} przebyta`); return e ? fmtWhen(new Date(e.at)) : (s.testMode ? "tryb biegłego" : null); };
  const sheet = h("article", { class: "doc mono sheet" }, h("h4", {}, "Program „Sandomierz Pod Spodem” · Paszport bram"), h("div", { class: "src" }, "Siedem bram, siedem pieczęci. Pieczęć strażnika w polu po prawej. Zamknięty lokal nie blokuje: zdjęcie tego paszportu przy wejściu liczy się jak pieczęć. Pieczęć zastępcza: w punkcie zgłoszeń konkursu (adres w regulaminie)."));
  const rows = h("div", { class: "pp-rows" });
  for (const g of [...app.map.gates].sort((a, b) => a.n - b.n)) {
    const c = app.caseForGate(g.n); const when = passedAt(g.n);
    rows.append(h("div", { class: "pp-row" },
      h("div", { class: "pp-n" }, String(g.n)),
      h("div", { class: "pp-t" }, h("b", {}, g.name), h("small", {}, c ? c.title : ""), h("small", { class: "pp-when" }, when ? `przebyta ${when}` : "jeszcze nieprzebyta")),
      h("div", { class: "pp-stamp", "aria-label": "miejsce na pieczęć" })));
  }
  sheet.append(rows);
  const foot = h("div", { class: "pp-foot" }, seal(app.solvedGates().filter((g) => { const x = GESTURE_OF[g]; return !x || s.interludesDone.includes(x) || s.testMode; }), s.unstableGates, s.seed, 120));
  const meta = h("div", { class: "pp-meta" }, h("p", {}, h("b", {}, "Pieczęć biegłego"), ": siedmiobok z nacięciami, tylko tego gracza."), h("p", { class: "pp-code" }, "Kod biegłego: ", h("code", {}, s.leftSeventhEmpty ? "…" : "po siódmej bramie")));
  if (s.leftSeventhEmpty && !s.finaleAt) s.finaleAt = Date.now();
  if (s.leftSeventhEmpty) expertCode(s.seed, s.finaleAt ?? Date.now()).then((v) => { const c = meta.querySelector("code"); if (c) c.textContent = v; });
  foot.append(meta); sheet.append(foot, h("p", { class: "faint" }, "Paszport nie zawiera danych osobowych. Pseudonim do Rejestru biegłych podaje się dopiero przy wpisie w bibliotece."));
  sec.append(sheet, h("div", { class: "verdict" }, h("button", { class: "primary", onclick: () => window.print() }, "Drukuj"), back("Wróć do zeszytu", "#/zeszyt")));
  return sec;
}
