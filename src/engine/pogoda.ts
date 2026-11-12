/** Pogoda w Sandomierzu z open-meteo (bez klucza). Śnieg naprawdę pada = sanki na Pimpo Limpo. Cisza przy braku sieci. */
const KEY = "akta-lessu:pogoda";
export interface Pogoda { snowing: boolean; tempC: number; at: string }
export async function fetchPogoda(): Promise<Pogoda | null> {
  try { const c = JSON.parse(localStorage.getItem(KEY) || "null") as Pogoda | null; if (c && Date.now() - new Date(c.at).getTime() < 3 * 3600000) return c; } catch { /* */ }
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
    const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.68&longitude=21.75&current=temperature_2m,snowfall,weather_code&timezone=Europe%2FWarsaw", { signal: ctl.signal });
    clearTimeout(t);
    const j = (await res.json()) as { current?: { temperature_2m?: number; snowfall?: number; weather_code?: number } };
    const cur = j.current; if (!cur) return null;
    const code = cur.weather_code ?? 0; const snowing = (cur.snowfall ?? 0) > 0 || (code >= 71 && code <= 77) || code === 85 || code === 86;
    const w: Pogoda = { snowing, tempC: cur.temperature_2m ?? 0, at: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(w)); } catch { /* */ }
    return w;
  } catch { return null; }
}
