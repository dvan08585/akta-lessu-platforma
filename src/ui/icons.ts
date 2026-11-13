/** Ikony typów przerywników: proste linie w palecie, identyczne na każdym telefonie (bez emoji). 24×24, stroke currentColor. */
const P: Record<string, string> = {
  amor: "M12 21c-3.3 0-5.5-1.8-5.5-4 0-2.6 2.6-5 5.5-5s5.5 2.4 5.5 5c0 2.2-2.2 4-5.5 4zM6 11a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 6 11zM10 8a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 10 8zM14 8a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 14 8zM18 11a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 18 11z", // łapa psa
  sunrise: "M3 18h18M7 14a5 5 0 0 1 10 0M12 4v4M5 9l1.5 1.5M19 9l-1.5 1.5",               // wschód
  temp: "M10 5a2 2 0 0 1 4 0v8.5a3.5 3.5 0 1 1-4 0zM12 9v6",                             // termometr
  river: "M3 10c3-3 6-3 9 0s6 3 9 0M3 16c3-3 6-3 9 0s6 3 9 0",                            // rzeka
  stamp: "M12 3l2.6 5.4 6 .8-4.3 4.2 1 5.9-5.3-2.8-5.3 2.8 1-5.9L3.6 9.2l6-.8z",
  talk: "M4 5h16v10H9l-5 4z",                                                           // dymek
  plate: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12h8M12 8v8",                           // płyta
  beat: "M3 12h3l2-5 3 10 3-8 2 3h5",                                                    // fala
  still: "M12 3v18M3 12h18M6 6l12 12M18 6L6 18",                                          // śnieżynka
  breath: "M3 15c3-4 6-4 9 0s6 4 9 0M3 9c3-4 6-4 9 0s6 4 9 0",                            // woda
  fire: "M12 3c2 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 2-7 2 1 3 3 4 4 0-3-1-5 0-8z",          // płomień
  dark: "M12 3a9 9 0 1 0 9 9c-5 1-9-3-9-9z",                                              // księżyc
  earth: "M3 18h18M5 18V9l7-5 7 5v9",                                                    // dom/skarpa
  spectro: "M4 20V4M4 20h16M8 16v-6M12 16V8M16 16v-3",                                   // słupki
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9l-2 6-4 2 2-6z",                   // kompas
  whistle: "M4 14h8l4-4v8l-4-4M16 12h4",                                                 // gwizdek
  touch7: "M8 11V5a1 1 0 0 1 2 0v6M11 10V4a1 1 0 0 1 2 0v6M14 11V6a1 1 0 0 1 2 0v8a5 5 0 0 1-10 0v-3",  // dłoń
  hold: "M12 3v6M12 15v6M3 12h6M15 12h6",                                                 // krzyż celownika
  mirror: "M12 3v18M4 6l5 3v6l-5 3zM20 6l-5 3v6l5 3z",                                   // lustro
  trace: "M4 4h8v8H8v8h12",                                                               // ścieżka
  steps: "M7 20l2-6 3 1-2 6zM13 12l2-6 3 1-2 6z",                                         // kroki
  duet: "M9 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 15V4l7 2M19 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", // nuty
};
export function icon(type: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("width", "20"); svg.setAttribute("height", "20"); svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", P[type] ?? P.plate); path.setAttribute("fill", "none"); path.setAttribute("stroke", "currentColor"); path.setAttribute("stroke-width", "1.5"); path.setAttribute("stroke-linecap", "round"); path.setAttribute("stroke-linejoin", "round");
  svg.append(path); return svg;
}

/**
 * Krzemień pasiasty. Pasy to coraz bardziej przesunięte elipsy: po jednej stronie zbite i cienkie, po drugiej szerokie,
 * kontur zdeformowany szumem jak słoje. Rysowany RAZ jako obraz (filtr liczony jeden raz), ciepło to osobna, tania warstwa
 * nad obrazem (opacity), więc pulsowanie nie kosztuje przeliczania filtra.
 */
export function flint(size = 96, seed = 7): HTMLElement {
  const pts = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return [Math.cos(a) * 46, Math.sin(a) * 46] as const; });
  const poly = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const clip = pts.map(([x, y]) => `${(50 + x).toFixed(1)}% ${(50 + y).toFixed(1)}%`).join(", ");
  const tones = ["#d6c8a6", "#4e473d", "#b9a98a", "#3b3630", "#8f8470"];
  const widths = [1.2, 1.8, 0.9, 2.2, 0.7];
  // ogniska pasów: start blisko lewego górnego rogu, każdy kolejny pierścień przesuwa się w prawo-dół i rośnie szybciej w poziomie
  const rings = Array.from({ length: 34 }, (_, i) => {
    const t = i / 33; const cx = -20 + t * 30, cy = -16 + t * 22; const rx = 3 + i * 2.9 + t * t * 20, ry = 3 + i * 2.1 + t * 6;
    const k = i % 5; const w = widths[k] * (0.6 + t * 0.9); // cieńsze w środku (zbite), grubsze na zewnątrz (rozszerzone)
    return `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="none" stroke="${tones[k]}" stroke-width="${w.toFixed(2)}" transform="rotate(-18 ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
  }).reverse().join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100" width="${size * 3}" height="${size * 3}">
    <defs><clipPath id="c"><polygon points="${poly}"/></clipPath>
      <filter id="f" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.022 0.03" numOctaves="3" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="11" xChannelSelector="R" yChannelSelector="G"/></filter></defs>
    <g clip-path="url(#c)"><rect x="-60" y="-60" width="120" height="120" fill="#3a3630"/><g filter="url(#f)">${rings}<ellipse cx="-20" cy="-16" rx="2.4" ry="1.8" fill="#eee6d2"/></g></g>
    <polygon points="${poly}" fill="none" stroke="#a39a86" stroke-width="1.1"/></svg>`;
  const img = document.createElement("img");
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); img.width = size; img.height = size; img.alt = ""; img.className = "flint-img"; img.decoding = "async"; img.draggable = false;
  const heat = document.createElement("i"); heat.className = "flint-heat"; heat.style.clipPath = `polygon(${clip})`;
  const wrap = document.createElement("span"); wrap.className = "flint"; wrap.style.width = size + "px"; wrap.style.height = size + "px";
  wrap.append(img, heat);
  return wrap;
}
