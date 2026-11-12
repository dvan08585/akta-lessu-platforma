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
  // Wzgórza (powierzchnia)
  const ground = 230;
  const path = map.gates.map((g, i) => {
    const prevX = i === 0 ? 0 : (map.gates[i - 1].x + g.x) / 2;
    return `${i === 0 ? `M 0 ${ground} L 0 ${ground - 20}` : ""} Q ${prevX} ${ground - 10} ${g.x} ${g.peak}`;
  }).join(" ") + ` Q 780 ${ground - 10} 800 ${ground - 25} L 800 ${ground} Z`;
  svg.append(s("path", { d: path, class: "hill" }));
  // Wisła po prawej
  svg.append(s("text", { x: "770", y: "222", "text-anchor": "end", style: "font-size:11px;fill:var(--ink-faint)" }, "Wisła →"));
  // Nazwy wzgórz
  for (const g of map.gates) svg.append(s("text", { x: String(g.x), y: String(g.peak - 14), "text-anchor": "middle" }, g.name));

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
    gate.append(s("circle", { r: "16" }));
    gate.append(s("polygon", { points: hept(11) }));
    gate.append(s("text", { y: "32" }, String(g.n)));
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
  const box = h("div", {}, wrap, sliderRow);
  if (max < chapters.length - 1) box.append(h("p", { class: "faint" }, `Mapa pokazuje tylko to, co Aneta już wie. Dalsze rozdziały otwiera kod z książki albo data.`));
  return box;
}

function cursorLabel(c: Chapter): string { return c.n === 0 ? "Prolog" : `R.${c.n} · ${c.title}`; }
function maxReadable(ctx: MapCtx): number {
  let m = 0;
  for (const c of ctx.chapters) if (ctx.isUnlocked(c.n)) m = c.n; else break;
  return m;
}
export function statusLabel(st: GateStatus): string {
  return ({ locked: "nieznana", open: "otwarta do śledztwa", solved: "rozpoznana", unstable: "niestabilna", silent: "zawieszka milczy" } as const)[st];
}
export function hept(r: number): string {
  return Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`; }).join(" ");
}
