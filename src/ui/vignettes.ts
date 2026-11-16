/**
 * Ryciny: siedem winiet żywiołów i panorama siedmiu wzgórz. Jeden język: kreska w kolorze atramentu (currentColor),
 * szrafowanie wzorem, kontur lekko drżący (feTurbulence + feDisplacementMap, liczone raz, bez animacji),
 * ciepło tylko tam, gdzie fabuła go wymaga (ogień). Żadnych gradientów „magii", żadnych ikon. Drzeworyt, nie aplikacja.
 */
import { s, h } from "./dom";

/** Ryciny dostarczone (public/ryciny). Gdy plik jest na liście, zastępuje kreskę z kodu. Dodawaj po jednej, bez czekania na komplet. */
const PLATES: Record<string, string> = {}; // puste: ryciny rastrowe zdjęte do czasu wyboru stylu; wrócą po jednej do public/ryciny
export function plate(key: string, cls: string, alt = ""): HTMLImageElement | null {
  const f = PLATES[key]; if (!f) return null;
  return h("img", { src: import.meta.env.BASE_URL + "ryciny/" + f, class: `rycina ${cls}`, alt, loading: "lazy", decoding: "async" });
}

const NS = "http://www.w3.org/2000/svg";
let uid = 0;

function defs(id: string, seed: number): SVGDefsElement {
  const d = s("defs");
  // szrafowanie: ukośne, gęste i rzadkie
  const hatch = s("pattern", { id: `${id}-h`, width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(-30)" }, s("line", { x1: "0", y1: "0", x2: "0", y2: "6", stroke: "currentColor", "stroke-width": "0.7", opacity: "0.55" }));
  const hatch2 = s("pattern", { id: `${id}-h2`, width: "4", height: "4", patternUnits: "userSpaceOnUse", patternTransform: "rotate(35)" }, s("line", { x1: "0", y1: "0", x2: "0", y2: "4", stroke: "currentColor", "stroke-width": "0.6", opacity: "0.4" }));
  const cross = s("pattern", { id: `${id}-x`, width: "5", height: "5", patternUnits: "userSpaceOnUse" },
    s("line", { x1: "0", y1: "0", x2: "5", y2: "5", stroke: "currentColor", "stroke-width": "0.5", opacity: "0.5" }),
    s("line", { x1: "5", y1: "0", x2: "0", y2: "5", stroke: "currentColor", "stroke-width": "0.5", opacity: "0.5" }));
  const f = s("filter", { id: `${id}-f`, x: "-5%", y: "-5%", width: "110%", height: "110%" },
    s("feTurbulence", { type: "fractalNoise", baseFrequency: "0.06", numOctaves: "2", seed: String(seed), result: "n" }),
    s("feDisplacementMap", { in: "SourceGraphic", in2: "n", scale: "1.6", xChannelSelector: "R", yChannelSelector: "G" }));
  d.append(hatch, hatch2, cross, f);
  return d;
}

function frame(w: number, h: number, seed: number, cls: string): { svg: SVGSVGElement; g: SVGGElement; id: string } {
  const id = `v${++uid}`;
  const svg = s("svg", { viewBox: `0 0 ${w} ${h}`, class: `vignette ${cls}`, "aria-hidden": "true", fill: "none", stroke: "currentColor", "stroke-width": "1.1", "stroke-linecap": "round", "stroke-linejoin": "round" });
  svg.append(defs(id, seed));
  const g = s("g", { filter: `url(#${id}-f)` });
  svg.append(g);
  return { svg, g, id };
}

const P = (d: string, extra: Record<string, string> = {}) => s("path", { d, ...extra });

/** Panorama: siedem wzgórz nad Wisłą, less w przekroju, dzwonnica, gołąb nad czwartym. */
export function hero(): HTMLElement | SVGSVGElement {
  const img = plate("panorama", "hero", "Siedem wzgórz Sandomierza nad Wisłą, pod nimi warstwy lessu"); if (img) return img;
  const { svg, g, id } = frame(600, 220, 3, "hero");
  // niebo: nic. Wzgórza, od zachodu: 7, 4, 1, 5, 2, 3, 6 (wysokości jak na mapie)
  const hills = "M0 150 C40 120 70 70 110 72 C150 74 160 110 200 112 C230 113 245 92 270 92 C300 92 310 118 340 118 C365 118 380 95 405 96 C430 97 440 82 470 80 C505 78 520 105 560 100 C580 98 590 108 600 112 L600 150 Z";
  g.append(P(hills, { fill: `url(#${id}-h)` }));
  g.append(P(hills.replace(" L600 150 Z", ""), { "stroke-width": "1.4" }));
  // less: warstwy pod wzgórzami, nierówne
  for (let i = 0; i < 5; i++) {
    const y = 156 + i * 9; const amp = 2 + i;
    g.append(P(`M0 ${y} C100 ${y - amp} 200 ${y + amp} 300 ${y} S500 ${y + amp} 600 ${y - amp}`, { opacity: String(0.8 - i * 0.12), "stroke-width": "0.8" }));
  }
  // Wisła: poziome kreski
  for (let i = 0; i < 6; i++) { const y = 203 + i * 3; g.append(P(`M${10 + (i % 2) * 20} ${y} H${590 - (i % 3) * 30}`, { "stroke-width": "0.6", opacity: "0.6" })); }
  // dzwonnica na wzgórzu 2 (katedralne) i kościół św. Jakuba na 4
  g.append(P("M338 118 V96 H348 V118 M339 96 L343 88 L347 96 M341 104 h4 M341 110 h4", { "stroke-width": "1" }));
  g.append(P("M104 72 V58 H116 V72 M104 58 L110 50 L116 58 M108 65 v7", { "stroke-width": "1" }));
  // gołąb nad 4
  g.append(P("M96 40 c4 -5 8 -5 12 -1 c3 -4 7 -5 11 -2 M100 44 c3 2 8 2 11 0", { "stroke-width": "1" }));
  // siedmiobok ledwo widoczny w ziemi
  const pts = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return `${(300 + Math.cos(a) * 14).toFixed(1)},${(176 + Math.sin(a) * 10).toFixed(1)}`; }).join(" ");
  g.append(s("polygon", { points: pts, "stroke-width": "0.7", opacity: "0.5" }));
  return svg;
}

/** Winieta żywiołu: 160×110, do nagłówka sprawy i do listy bram. */
export function vignette(element: string): HTMLElement | SVGSVGElement {
  const key = element.replace(/^żywioł:\s*/, "").split(/\s|,/)[0].toLowerCase();
  const img = plate(key, "el"); if (img) return img;
  const { svg, g, id } = frame(160, 110, key.length + 5, `el-${key}`);
  switch (key) {
    case "ziemia": {
      // łuk ceglany korytarza, less sypie się z łuku, cegła wysunięta
      g.append(P("M20 100 V50 C20 25 140 25 140 50 V100", { "stroke-width": "1.4" }));
      for (let i = 0; i < 7; i++) g.append(P(`M${28 + i * 16} ${100 - (i % 2) * 6} h12`, { "stroke-width": "0.8" }));
      g.append(P("M30 42 C50 32 110 32 130 42", { "stroke-width": "0.8", opacity: "0.6" }));
      g.append(P("M118 68 h14 v10 h-14 z", { fill: `url(#${id}-x)` }));
      for (let i = 0; i < 18; i++) g.append(s("circle", { cx: String(60 + (i * 37) % 60), cy: String(48 + (i * 23) % 40), r: "0.8", fill: "currentColor", stroke: "none", opacity: "0.7" }));
      g.append(P("M36 100 C60 92 100 92 124 100", { fill: `url(#${id}-h2)` }));
      break;
    }
    case "woda": {
      // posadzka krypty w spoinach, woda w kręgach od spodu
      for (let i = 0; i < 5; i++) g.append(P(`M${20 + i * 30} 30 V96`, { "stroke-width": "0.7", opacity: "0.5" }));
      for (let i = 0; i < 4; i++) g.append(P(`M20 ${30 + i * 22} H140`, { "stroke-width": "0.7", opacity: "0.5" }));
      [8, 18, 30, 44].forEach((r, i) => g.append(s("ellipse", { cx: "80", cy: "64", rx: String(r * 1.4), ry: String(r * 0.55), "stroke-width": String(1.3 - i * 0.25) })));
      g.append(P("M60 96 C70 90 90 90 100 96 M50 102 C65 96 95 96 110 102", { "stroke-width": "0.8" }));
      break;
    }
    case "dźwięk": case "dzwiek": {
      // dzwon i kręgi w dół, w ziemię
      g.append(P("M80 18 C62 18 56 40 54 62 L46 70 H114 L106 62 C104 40 98 18 80 18 Z", { fill: `url(#${id}-h)`, "stroke-width": "1.3" }));
      g.append(s("circle", { cx: "80", cy: "76", r: "4", fill: "currentColor", stroke: "none" }));
      g.append(P("M80 14 v-6"));
      [12, 24, 38].forEach((r, i) => g.append(P(`M${80 - r} 88 Q80 ${88 + r * 0.6} ${80 + r} 88`, { "stroke-width": String(1.1 - i * 0.2), opacity: String(0.9 - i * 0.25) })));
      break;
    }
    case "ogień": case "ogien": {
      // krzemień (siedmiobok) z pasami i smuga czerwieni
      const pts = Array.from({ length: 7 }, (_, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 7; return `${(80 + Math.cos(a) * 34).toFixed(1)},${(58 + Math.sin(a) * 34).toFixed(1)}`; }).join(" ");
      g.append(s("polygon", { points: pts, "stroke-width": "1.3" }));
      for (let i = 0; i < 6; i++) g.append(s("ellipse", { cx: String(70 - i), cy: String(50 - i * 0.5), rx: String(5 + i * 6), ry: String(4 + i * 4.5), transform: "rotate(-18 70 50)", "stroke-width": "0.8", opacity: String(0.9 - i * 0.1) }));
      g.append(P("M50 92 C70 84 96 86 112 94", { stroke: "var(--warm)", "stroke-width": "3", opacity: "0.8", "stroke-linecap": "round" }));
      break;
    }
    case "zimno": {
      // sklepienie piwnicy, szron: kryształy
      g.append(P("M16 100 V60 C16 30 144 30 144 60 V100", { "stroke-width": "1.3" }));
      g.append(P("M16 100 H144", { "stroke-width": "0.8" }));
      const star = (x: number, y: number, r: number) => { for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; g.append(P(`M${x - Math.cos(a) * r} ${y - Math.sin(a) * r} L${x + Math.cos(a) * r} ${y + Math.sin(a) * r}`, { "stroke-width": "0.7" })); } };
      star(50, 60, 9); star(84, 50, 12); star(116, 64, 8); star(70, 82, 6);
      g.append(P("M30 96 h100", { "stroke-width": "0.5", opacity: "0.5" }));
      break;
    }
    case "ciemność": case "ciemnosc": {
      // kartka, litery gasną, świeca zdmuchnięta
      g.append(P("M34 16 h70 l16 16 v70 H34 Z", { "stroke-width": "1.2" }));
      g.append(P("M104 16 v16 h16", { "stroke-width": "0.9" }));
      for (let i = 0; i < 7; i++) g.append(P(`M44 ${34 + i * 9} h${64 - i * 8}`, { "stroke-width": "0.9", opacity: String(1 - i * 0.14) }));
      g.append(P("M126 100 v-18 M122 82 h8 M126 76 c-3 -4 0 -8 1 -10", { "stroke-width": "0.9", opacity: "0.6" }));
      break;
    }
    case "powietrze": {
      // siedem punktów, dwie dłonie (kontury), dwa puste
      const pts = Array.from({ length: 7 }, (_, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 7; return [80 + Math.cos(a) * 36, 56 + Math.sin(a) * 36] as const; });
      g.append(s("polygon", { points: pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "), "stroke-width": "0.8", opacity: "0.7" }));
      pts.forEach(([x, y], k) => g.append(s("circle", { cx: x.toFixed(1), cy: y.toFixed(1), r: "4", fill: k === 2 || k === 5 ? "none" : "currentColor", stroke: "currentColor", "stroke-width": "0.9" })));
      g.append(P("M10 104 C20 90 30 86 42 92 M118 92 C130 86 140 90 150 104", { "stroke-width": "0.9", opacity: "0.6" }));
      break;
    }
    default: {
      g.append(s("circle", { cx: "80", cy: "56", r: "30" }));
    }
  }
  return svg;
}
