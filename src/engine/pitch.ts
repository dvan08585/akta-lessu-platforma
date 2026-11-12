/**
 * Wykrywanie wysokości dźwięku z mikrofonu (autokorelacja znormalizowana).
 * Błąd oktawy: sygnał o okresie T pasuje też do 2T, więc czysty kamerton „migał" między 136 a 68 Hz.
 * Lekarstwo: wybieramy NAJMNIEJSZE opóźnienie, którego korelacja sięga progu względem maksimum (pierwszy mocny szczyt),
 * doprecyzowane parabolą; wynik wygładza mediana z ostatnich klatek (PitchSmoother).
 */
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  let rms = 0; for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length); if (rms < 0.01) return null;
  const size = buf.length;
  const minLag = Math.floor(sampleRate / 1000), maxLag = Math.floor(sampleRate / 50);
  const corr = new Float32Array(maxLag + 1);
  let energy = 0; for (let i = 0; i < size; i++) energy += buf[i] * buf[i];
  for (let lag = minLag; lag <= maxLag; lag++) {
    let c = 0; for (let i = 0; i < size - lag; i++) c += buf[i] * buf[i + lag];
    corr[lag] = c / (energy * (size - lag) / size); // znormalizowana: ~1 przy idealnym dopasowaniu
  }
  let best = 0; for (let lag = minLag; lag <= maxLag; lag++) if (corr[lag] > best) best = corr[lag];
  if (best < 0.3) return null;
  const threshold = best * 0.75;
  // pierwszy lokalny szczyt powyżej progu = okres podstawowy, nie jego wielokrotność
  let lag = -1;
  for (let l = minLag + 1; l < maxLag; l++) {
    if (corr[l] >= threshold && corr[l] >= corr[l - 1] && corr[l] >= corr[l + 1]) { lag = l; break; }
  }
  if (lag < 0) return null;
  // interpolacja paraboliczna wokół szczytu
  const a = corr[lag - 1], b = corr[lag], c = corr[lag + 1];
  const denom = a - 2 * b + c;
  const shift = denom !== 0 ? 0.5 * (a - c) / denom : 0;
  return sampleRate / (lag + shift);
}

/** Mediana z ostatnich N odczytów + trzymanie oktawy: odczyt równy połowie albo podwojeniu stabilnego tonu jest poprawiany do tej samej oktawy. */
export class PitchSmoother {
  private buf: number[] = [];
  private stable: number | null = null;
  constructor(private n = 7) {}
  push(hz: number | null): number | null {
    if (hz === null) { this.buf = []; this.stable = null; return null; }
    if (this.stable) {
      const r = hz / this.stable;
      if (r > 0.47 && r < 0.53) hz *= 2; else if (r > 1.9 && r < 2.1) hz /= 2;
    }
    this.buf.push(hz); if (this.buf.length > this.n) this.buf.shift();
    const s = [...this.buf].sort((x, y) => x - y);
    const med = s[Math.floor(s.length / 2)];
    if (this.buf.length >= 3) this.stable = med;
    return med;
  }
}

/** Jak blisko siedmiu ramion: 1 = idealnie, 0 = daleko. */
export function closeness(hz: number, target: number, tolerance: number): number {
  const d = Math.abs(hz - target);
  return Math.max(0, 1 - d / (tolerance * 4));
}
