import { h, s, go } from "./dom";
import type { Chapter, MapData, SaveState, GateStatus } from "../engine/types";

export interface MapCtx { map: MapData; chapters: Chapter[]; state: SaveState; isUnlocked: (n: number) => boolean; gateStatus: (n: number) => GateStatus; onCursor: (n: number) => void }

/** Mapa dwuwarstwowa: siedem wzgórz nad ziemią i przekrój pod nimi. Suwak rozdziałów = tyle, ile Aneta już wie. */
export function renderMap(ctx: MapCtx): HTMLElement {
  const { map, chapters, state } = ctx;
  const cursor = Math.min(state.chapterCursor, maxReadable(ctx));
  const ch = chapters[cursor] ?? chapters[0];
  const wrap = h("div", { class: "map-wrap" });
  const svg = s("svg", { viewBox: map.viewBox, role: "img", "aria-label": "Mapa siedmiu wzgórz Sandomierza i przekrój pod nimi" });

  // Niebo i horyzont
  svg.append(s("rect", { x: "0", y: "0", width: "800", height: "230", fill: "transparent" }));
  // Warstwy przekroju
  for (const l of map.layers) {
    svg.append(s("rect", { x: "0", y: String(l.y), width: "800", height: String(l.h), class: `layer-${l.id}` }));
    svg.append(s("text", { x: "12", y: String(l.y + 16), class: "layer-label" }, l.label));
  }
  // Wzgórza (powierzchnia): wysokość z danych, proporcjonalnie między linią Wisły a górą rysunku.
  const ground = 230;
  const sc = map.scale ?? { minElev: 140, maxElev: 195, groundY: 230, skyY: 60 };
  const peakOf = (g: typeof map.gates[number]) => g.elev ? sc.groundY - ((g.elev - sc.minElev) / (sc.maxElev - sc.minElev)) * (sc.groundY - sc.skyY) : g.peak;
  for (const g of map.gates) g.peak = Math.round(peakOf(g));
  const path = map.gates.map((g, i) => {
    const prevX = i === 0 ? 0 : (map.gates[i - 1].x + g.x) / 2;
    return `${i === 0 ? `M 0 ${ground} L 0 ${ground - 20}` : ""} Q ${prevX} ${ground - 10} ${g.x} ${g.peak}`;
  }).join(" ") + ` Q 780 ${ground - 10} 800 ${ground - 25} L 800 ${ground} Z`;
  svg.append(s("path", { d: path, class: "hill" }));
  // Linia Wisły i strony świata
  svg.append(s("line", { x1: "0", y1: String(ground), x2: "800", y2: String(ground), stroke: "var(--cold)", "stroke-width": "1", opacity: "0.6" }));
  svg.append(s("text", { x: "12", y: String(ground - 6), style: "font-size:10px;fill:var(--cold)" }, `Wisła ~${map.wisla?.elev ?? 140} m n.p.m.`));
  svg.append(s("text", { x: "12", y: "20", style: "font-size:10px;fill:var(--ink-faint);letter-spacing:0.14em" }, "ZACHÓD · PIMPO LIMPO"));
  svg.append(s("text", { x: "788", y: "20", "text-anchor": "end", style: "font-size:10px;fill:var(--ink-faint);letter-spacing:0.14em" }, "SKARPA · WSCHÓD"));
  // Nazwy wzgórz i wysokości
  map.gates.forEach((g, i) => {
    const dy = i % 2 ? -40 : -16;
    const short = g.name.replace("Wzgórze ", "");
    // skrajne etykiety kotwiczone do środka rysunku, żeby nie wychodziły poza krawędź telefonu
    const anchor = i === 0 ? "start" : i === map.gates.length - 1 ? "end" : "middle";
    const lx = i === 0 ? g.x - 40 : i === map.gates.length - 1 ? g.x + 30 : g.x;
    svg.append(s("text", { x: String(lx), y: String(g.peak + dy), "text-anchor": anchor }, short));
    if (g.elev) svg.append(s("text", { x: String(lx), y: String(g.peak + dy + 16), "text-anchor": anchor, style: "font-size:14px;fill:var(--ink-faint)" }, `${g.elev} m`));
  });

  // Korytarze (ujawniają się rozdziałem)
  for (const c of map.corridors) {
    const a = map.gates.find((g) => g.n === c.from)!; const b = map.gates.find((g) => g.n === c.to)!;
    const known = c.revealChapter <= cursor;
    const midY = Math.max(a.depth, b.depth) + 25;
    svg.append(s("path", { d: `M ${a.x} ${a.depth} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.depth}`, class: `corridor ${known ? "known" : ""}`, id: c.id }));
  }
  // Szyby (pion od wzgórza do bramy)
  for (const g of map.gates) {
    const status = ctx.gateStatus(g.n);
    const seen = status === "open" || status === "solved" || status === "unstable";
    svg.append(s("line", { x1: String(g.x), y1: String(ground), x2: String(g.x), y2: String(g.depth - 14), class: `corridor ${seen ? "known" : ""}` }));
    const gate = s("g", { class: `gate ${status}`, transform: `translate(${g.x} ${g.depth})`, tabindex: "0", role: "button", "aria-label": `Brama ${g.n}: ${g.name}, ${statusLabel(status)}` });
    gate.append(s("rect", { class: "hit", x: "-28", y: "-28", width: "56", height: "56" }));
    gate.append(s("circle", { r: "22" }));
    gate.append(s("polygon", { points: hept(15) }));
    gate.append(s("text", { y: "42" }, String(g.n)));
    gate.addEventListener("click", () => go(`#/brama/${g.n}`));
    gate.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Enter") go(`#/brama/${g.n}`); });
    svg.append(gate);
  }
  // Aneta i Amor
  const at = map.gates.find((g) => g.n === ch.gate) ?? map.gates[2];
  const ay = ch.underground ? at.depth - 40 : at.peak - 2;
  svg.append(s("circle", { cx: String(at.x), cy: String(ay), r: "4", class: "aneta" }));
  svg.append(s("text", { x: String(at.x), y: String(ay - 8), class: "marker-label" }, "Aneta"));
  if (ch.amor) {
    svg.append(s("circle", { cx: String(at.x + 12), cy: String(ch.underground ? ay : ay + 1), r: "2.5", class: "amor" }));
  } else if (ch.n > 0) {
    svg.append(s("text", { x: String(at.x + 14), y: String(ground - 6), class: "marker-label", style: "text-anchor:start" }, "Amor nie schodzi"));
  }
  wrap.append(svg);

  // Suwak rozdziałów
  const max = maxReadable(ctx);
  const slider = h("input", { type: "range", min: "0", max: String(max), value: String(cursor), "aria-label": "Jestem po rozdziale" }) as HTMLInputElement;
  const label = h("span", { class: "label" }, cursorLabel(ch));
  slider.addEventListener("input", () => { const n = Number(slider.value); label.textContent = cursorLabel(chapters[n]); ctx.onCursor(n); });
  const sliderRow = h("div", { class: "chapter-slider" }, h("span", { class: "faint" }, "Jestem po:"), slider, label);
  return h("div", {}, wrap, sliderRow);
}

function cursorLabel(c: Chapter): string { return c.n === 0 ? "Prolog" : `R.${c.n} · ${c.title}`; }
function maxReadable(ctx: MapCtx): number {
  let m = 0;
  for (const c of ctx.chapters) if (ctx.isUnlocked(c.n)) m = c.n; else break;
  return m;
}
export function statusLabel(st: GateStatus): string {
  return ({ locked: "nieznana", open: "otwarta", solved: "przebyta", unstable: "niestabilna", silent: "milczy" } as const)[st];
}
export function hept(r: number): string {
  return Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`; }).join(" ");
}
