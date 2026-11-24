import { h, back } from "./dom";
import { topbar, crumb } from "./views";
import { fetchStats, type Stats } from "../engine/wspolny";
import type { App } from "../app";

/**
 * Liczby dla autora: to, co liczy serwer, w układzie progów z masterplanu (tygodnie 2, 6, 12). Same liczby, bez wykresów.
 * Dostępne tylko w trybie biegłego (kod testowy), nie dla graczy.
 */
export function viewLiczby(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in" }, topbar(app, "#/akta"), crumb("Liczby", "#/ustawienia", "Ustawienia"), h("h2", {}, "Liczby programu"));
  if (!app.state.testMode) { sec.append(h("p", { class: "muted" }, "Tylko w trybie biegłego."), h("div", { class: "verdict" }, back())); return sec; }
  if (!app.cfg.backendUrl) { sec.append(h("p", { class: "muted" }, "Brak adresu serwera w konfiguracji."), h("div", { class: "verdict" }, back())); return sec; }
  const box = h("div", { class: "gatebox" }, h("p", { class: "muted" }, "Pobieram…"));
  sec.append(box, h("div", { class: "verdict" }, back("Wróć do ustawień", "#/ustawienia")));
  fetchStats(app.cfg.backendUrl).then((st) => { box.replaceChildren(...(st ? render(st) : [h("p", { class: "muted" }, "Serwer nie odpowiada.")])); });
  return sec;

  function render(st: Stats): HTMLElement[] {
    const row = (k: string, v: string | number) => h("p", { class: "mono" }, h("b", {}, k + ": "), String(v));
    const out: HTMLElement[] = [h("h3", {}, "Teraz")];
    out.push(row("Biegłych (przyjęte zlecenie)", st.players), row("Instalacje jako aplikacja", st.pwa ?? 0), row("Odczyty odwzajemnione", st.readingsBack ?? 0));
    out.push(row("Siódma pozycja: pusta / rozstrzygnięte", `${st.seventh.empty} / ${st.seventh.total}`), row("Nucących teraz / łącznie", `${st.hum.now} / ${st.hum.total}`));
    out.push(h("h3", {}, "Bramy"));
    for (let g = 1; g <= 7; g++) {
      const gg = st.gates[String(g)] ?? { solved: 0, gesture: 0 }; const r = st.rites?.[String(g)];
      const avg = r && r.n ? Math.round(r.seconds / r.n) : 0; const pledged = r && r.n ? Math.round((r.pledged / r.n) * 100) : 0;
      const peak = r ? r.hours.indexOf(Math.max(...r.hours)) : -1;
      out.push(row(`Brama ${g}`, `rozpoznana ${gg.solved}, przebyta ${gg.gesture}${r && r.n ? `, obrzęd śr. ${avg} s, na słowo ${pledged}%, szczyt ${peak}:00` : ""}`));
    }
    out.push(h("h3", {}, "Progi z masterplanu (tygodnie po premierze)"));
    const s1 = st.gates["4"]?.solved ?? 0; const g1 = st.gates["4"]?.gesture ?? 0; const pl = Math.max(1, st.players);
    const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
    const tab = h("table", { class: "mono thresholds" });
    const tr = (a: string, b: string, c: string) => h("tr", {}, h("td", {}, a), h("td", {}, b), h("td", {}, c));
    tab.append(tr("Tydzień 2", "co najmniej 150 skanów; sprawa 1 u 60%; obrzęd u 70%", `biegłych ${st.players}; sprawa 1: ${pct(s1, pl)}%; obrzęd: ${pct(g1, Math.max(1, s1))}%`));
    tab.append(tr("Tydzień 6", "350 skanów; 15 finałów; odczyt u 40% po sprawie 2", `biegłych ${st.players}; finałów ${st.seventh.total}; odczyty ${st.readingsBack ?? 0}`));
    tab.append(tr("Tydzień 12", "500 skanów; 50 finałów", `biegłych ${st.players}; finałów ${st.seventh.total}`));
    out.push(tab, h("p", { class: "faint" }, "Skany liczymy jako „biegłych” (przyjęte zlecenie). Kill-switche w docs/DZIEN_PREMIERY.md. Nic tu nie identyfikuje osób."));
    return out;
  }
}
