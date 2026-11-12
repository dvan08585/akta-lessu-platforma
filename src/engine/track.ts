/** Pomiar bez ciasteczek: Plausible (jeśli skonfigurowany w config.analyticsDomain) + nic więcej. Zdarzenia: nazwa + props. */
declare global { interface Window { plausible?: (name: string, opts?: { props?: Record<string, string | number> }) => void } }
export function track(name: string, props?: Record<string, string | number>): void {
  try { window.plausible?.(name, props ? { props } : undefined); } catch { /* brak analityki */ }
}
export function installAnalytics(domain: string): void {
  if (!domain) return;
  const s = document.createElement("script"); s.defer = true; s.setAttribute("data-domain", domain); s.src = "https://plausible.io/js/script.js";
  document.head.append(s);
}
