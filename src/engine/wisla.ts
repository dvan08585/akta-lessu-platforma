/**
 * Żywa Wisła: stan wody na wodowskazie Sandomierz z otwartego API IMGW. Jeśli API nie odpowiada (CORS, sieć, zmiana formatu),
 * strona pokazuje średnią z wodowskazu z dokumentu. Odpowiedź trzymana w localStorage przez 6 godzin.
 */
const KEY = "akta-lessu:wisla";
const MEAN = [231, 248, 312, 338, 301, 290, 276, 221, 198, 187, 210, 224];
export interface Wisla { cm: number; at: string; live: boolean }

export function monthlyMean(d = new Date()): number { return MEAN[d.getMonth()]; }

export async function fetchWisla(now = new Date()): Promise<Wisla> {
  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || "null") as Wisla | null;
    if (cached && Date.now() - new Date(cached.at).getTime() < 6 * 3600 * 1000) return cached;
  } catch { /* brak storage */ }
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 6000);
    const res = await fetch("https://danepubliczne.imgw.pl/api/data/hydro", { signal: ctl.signal });
    clearTimeout(t);
    const rows = (await res.json()) as { stacja?: string; stan_wody?: string; stan_wody_data_pomiaru?: string }[];
    const row = rows.find((r) => (r.stacja || "").toLowerCase().startsWith("sandomierz"));
    if (row && row.stan_wody) {
      const w: Wisla = { cm: Number(row.stan_wody), at: new Date().toISOString(), live: true };
      try { localStorage.setItem(KEY, JSON.stringify(w)); } catch { /* noop */ }
      return w;
    }
  } catch { /* API niedostępne: zapas */ }
  return { cm: monthlyMean(now), at: now.toISOString(), live: false };
}

/** Śnieg na mapie: listopad–marzec. */
export function isSnowSeason(d = new Date()): boolean { const m = d.getMonth(); return m >= 10 || m <= 2; }
