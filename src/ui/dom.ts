export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string | boolean | ((e: Event) => void)> = {}, ...children: (Node | string | null | undefined)[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === "function") el.addEventListener(k.replace(/^on/, "").toLowerCase(), v as EventListener);
    else if (typeof v === "boolean") { if (v) el.setAttribute(k, ""); }
    else if (k === "class") el.className = v;
    else el.setAttribute(k, v);
  }
  for (const c of children) if (c !== null && c !== undefined) el.append(typeof c === "string" ? document.createTextNode(c) : c);
  return el;
}
export const svgNS = "http://www.w3.org/2000/svg";
export function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, ...children: (Node | string)[]): SVGElementTagNameMap[K] {
  const el = document.createElementNS(svgNS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const c of children) el.append(typeof c === "string" ? document.createTextNode(c) : c);
  return el;
}
export function toast(msg: string): void {
  const t = h("div", { class: "toast", role: "status" }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), Math.min(9000, 2600 + msg.length * 30));
}
export function go(hash: string): void { if (location.hash === hash) dispatchEvent(new HashChangeEvent("hashchange")); else location.hash = hash; }
/** Przyciski nawigacji: „wstecz” zawsze cichy ze strzałką w lewo, „dalej” zawsze główny ze strzałką w prawo. Jeden język na całej stronie. */
/** Strzałka jako rysunek, nie znak z czcionki: na Androidzie „←” z zapasowego kroju wyglądało jak kreska ze strzałką. */
export function arrow(dir: "l" | "r"): SVGSVGElement {
  const NS = "http://www.w3.org/2000/svg"; const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("class", "arr"); s.setAttribute("aria-hidden", "true");
  const p = document.createElementNS(NS, "path"); p.setAttribute("d", dir === "l" ? "M19 12H6M11 6l-6 6 6 6" : "M5 12h13M13 6l6 6-6 6");
  p.setAttribute("fill", "none"); p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "1.6"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round");
  s.append(p); return s;
}
export function back(label = "Wróć do mapy", to = "#/mapa"): HTMLButtonElement { return h("button", { class: "ghost back", onclick: () => go(to) }, arrow("l"), ` ${label}`); }
export function next(label: string, to: string, cls = "primary"): HTMLButtonElement { return h("button", { class: `${cls} next`, onclick: () => go(to) }, `${label} `, arrow("r")); }
/** iPhone/iPad: Safari kasuje zapis strony po 7 dniach bez wizyty, chyba że strona jest na ekranie początkowym. */
export function isIOS(): boolean { return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
export function isStandalone(): boolean { return matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true; }

/** Cykl życia widoku: każdy renderer rejestruje sprzątanie (strumienie, czujniki, pętle), router woła je przed podmianą ekranu. */
const leaveFns: (() => void)[] = [];
export function onLeave(fn: () => void): void { leaveFns.push(fn); }
/** Ekran nie gaśnie w trakcie obrzędu (Wake Lock, gdzie jest); zwalniany przy wyjściu z ekranu i odnawiany po powrocie do karty. */
export function keepAwake(): void {
  type WL = { release: () => Promise<void> }; let lock: WL | null = null; let active = true;
  const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<WL> } };
  const ask = async () => { if (!active || !nav.wakeLock || document.visibilityState !== "visible") return; try { lock = await nav.wakeLock.request("screen"); } catch { /* bateria albo brak zgody: nic */ } };
  const onVis = () => { if (document.visibilityState === "visible") ask(); };
  document.addEventListener("visibilitychange", onVis); ask();
  onLeave(() => { active = false; document.removeEventListener("visibilitychange", onVis); lock?.release().catch(() => { /* */ }); lock = null; });
}
export function leaveView(): void { const fns = leaveFns.splice(0); for (const fn of fns) { try { fn(); } catch { /* sprzątanie nie może zepsuć nawigacji */ } } }
/** Strumień z kamery/mikrofonu, który gaśnie przy wyjściu z widoku (dioda kamery nie świeci po opuszczeniu ekranu). */
export async function grabMedia(c: MediaStreamConstraints): Promise<MediaStream> { const s = await navigator.mediaDevices.getUserMedia(c); onLeave(() => s.getTracks().forEach((t) => t.stop())); return s; }
/** Nasłuch czujnika zdejmowany przy wyjściu. */
export function listen(name: string, fn: EventListener, opts?: AddEventListenerOptions): void { addEventListener(name, fn, opts); onLeave(() => removeEventListener(name, fn, opts)); }
