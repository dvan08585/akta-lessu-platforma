/** Ikony typów przerywników: proste linie w palecie, identyczne na każdym telefonie (bez emoji). 24×24, stroke currentColor. */
const P: Record<string, string> = {
  amor: "M4 14c0-4 3-7 7-7h2c4 0 7 3 7 7v3H4zM8 10v-3M16 10v-3",                       // uszy psa
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

/** Krzemień pasiasty: siedmiobok z nieregularnymi pasami krzemienia i kwarcu (feTurbulence + displacement). Pasy jaśnieją od ciepła przez data-heat na rodzicu. */
export function flint(size = 96): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "-50 -50 100 100"); svg.setAttribute("width", String(size)); svg.setAttribute("height", String(size)); svg.setAttribute("class", "flint"); svg.setAttribute("aria-hidden", "true");
  const id = "fl" + Math.random().toString(36).slice(2, 7);
  const pts = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return `${(Math.cos(a) * 46).toFixed(1)},${(Math.sin(a) * 46).toFixed(1)}`; }).join(" ");
  svg.innerHTML = `
    <defs>
      <clipPath id="${id}c"><polygon points="${pts}"/></clipPath>
      <filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
      <radialGradient id="${id}g" cx="40%" cy="40%" r="70%"><stop offset="0" stop-color="#ffb066"/><stop offset="0.5" stop-color="#d9843a"/><stop offset="1" stop-color="#7a1f1f" stop-opacity="0"/></radialGradient>
    </defs>
    <g clip-path="url(#${id}c)">
      <rect x="-60" y="-60" width="120" height="120" fill="#3a3630"/>
      <g filter="url(#${id}f)" class="bands">
        ${[44, 38, 33, 28, 23, 18, 13, 8].map((r, i) => `<circle cx="-6" cy="-4" r="${r}" fill="none" stroke="${i % 2 ? "#cdbf9f" : "#5b5449"}" stroke-width="${i % 2 ? 2.4 : 3.2}"/>`).join("")}
        <circle cx="-6" cy="-4" r="3" fill="#e8e0cf"/>
      </g>
      <rect x="-60" y="-60" width="120" height="120" fill="url(#${id}g)" class="heat"/>
    </g>
    <polygon points="${pts}" fill="none" stroke="#a39a86" stroke-width="1.2"/>`;
  return svg;
}
