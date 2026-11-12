/**
 * Dwa głosy naraz: analiza widma zamiast autokorelacji.
 * Dla każdej kandydatki f (80–600 Hz) liczymy sumę harmoniczną: energia w f, 2f, 3f, 4f, 5f (wagi malejące).
 * Najlepsza f1 wygrywa; jej harmoniczne wycinamy z widma i szukamy f2. Kwinta: f2/f1 ≈ 3/2 (albo 2/3), tolerancja ±4%.
 * Wejście: widmo w dB z AnalyserNode (getFloatFrequencyData) i rozdzielczość binów.
 */
export interface DuetResult { f1: number | null; f2: number | null; fifth: boolean; ratio: number | null }

function magAt(spec: Float32Array, binHz: number, hz: number): number {
  const b = hz / binHz; const i = Math.floor(b); if (i < 1 || i + 1 >= spec.length) return 0;
  const t = b - i; const a = lin(spec[i]), c = lin(spec[i + 1]);
  return a * (1 - t) + c * t;
}
const lin = (db: number) => (db <= -120 ? 0 : Math.pow(10, db / 20));

export function harmonicSum(spec: Float32Array, binHz: number, f: number, mask?: (hz: number) => boolean): number {
  let s = 0; const w = [1, 0.8, 0.6, 0.45, 0.3];
  for (let k = 1; k <= 5; k++) { const hz = f * k; if (mask && mask(hz)) continue; s += w[k - 1] * magAt(spec, binHz, hz); }
  return s;
}

export function bestFundamental(spec: Float32Array, binHz: number, lo = 80, hi = 600, mask?: (hz: number) => boolean): { f: number; score: number } {
  let best = { f: 0, score: 0 };
  for (let f = lo; f <= hi; f += 1) { const sc = harmonicSum(spec, binHz, f, mask); if (sc > best.score) best = { f, score: sc }; }
  // doprecyzowanie o 0,25 Hz wokół zwycięzcy
  for (let f = best.f - 1; f <= best.f + 1; f += 0.25) { const sc = harmonicSum(spec, binHz, f, mask); if (sc > best.score) best = { f, score: sc }; }
  return best;
}

export function detectDuet(spec: Float32Array, binHz: number, noiseFloorDb = -70): DuetResult {
  // cisza?
  let maxDb = -200; for (let i = 2; i < spec.length; i++) if (spec[i] > maxDb) maxDb = spec[i];
  if (maxDb < noiseFloorDb) return { f1: null, f2: null, fifth: false, ratio: null };
  const a = bestFundamental(spec, binHz);
  if (a.score <= 0) return { f1: null, f2: null, fifth: false, ratio: null };
  // maska: harmoniczne f1 ±2,5% i okolice oktaw f1 (unikamy „drugiego głosu" będącego tym samym głosem)
  const maskA = (hz: number) => { for (let k = 1; k <= 6; k++) if (Math.abs(hz - a.f * k) < a.f * k * 0.025) return true; return false; };
  const b = bestFundamental(spec, binHz, 80, 600, maskA);
  const sameVoice = b.f === 0 || Math.abs(b.f / a.f - 1) < 0.06 || Math.abs(b.f / a.f - 2) < 0.08 || Math.abs(b.f / a.f - 0.5) < 0.04;
  if (b.score < a.score * 0.25 || sameVoice) return { f1: a.f, f2: null, fifth: false, ratio: null };
  const lo = Math.min(a.f, b.f), hi = Math.max(a.f, b.f); const ratio = hi / lo;
  const fifth = Math.abs(ratio - 1.5) < 0.06;
  return { f1: lo, f2: hi, fifth, ratio };
}
