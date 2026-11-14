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
export function back(label = "Wróć do mapy", to = "#/mapa"): HTMLButtonElement { return h("button", { class: "ghost back", onclick: () => go(to) }, `← ${label}`); }
export function next(label: string, to: string, cls = "primary"): HTMLButtonElement { return h("button", { class: `${cls} next`, onclick: () => go(to) }, `${label} →`); }

/** Cykl życia widoku: każdy renderer rejestruje sprzątanie (strumienie, czujniki, pętle), router woła je przed podmianą ekranu. */
const leaveFns: (() => void)[] = [];
export function onLeave(fn: () => void): void { leaveFns.push(fn); }
export function leaveView(): void { const fns = leaveFns.splice(0); for (const fn of fns) { try { fn(); } catch { /* sprzątanie nie może zepsuć nawigacji */ } } }
/** Strumień z kamery/mikrofonu, który gaśnie przy wyjściu z widoku (dioda kamery nie świeci po opuszczeniu ekranu). */
export async function grabMedia(c: MediaStreamConstraints): Promise<MediaStream> { const s = await navigator.mediaDevices.getUserMedia(c); onLeave(() => s.getTracks().forEach((t) => t.stop())); return s; }
/** Nasłuch czujnika zdejmowany przy wyjściu. */
export function listen(name: string, fn: EventListener, opts?: AddEventListenerOptions): void { addEventListener(name, fn, opts); onLeave(() => removeEventListener(name, fn, opts)); }
