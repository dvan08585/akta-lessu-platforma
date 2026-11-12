/** Wykrywanie wysokości dźwięku z mikrofonu (autokorelacja). Zwraca Hz albo null, gdy cisza. Bez zależności. */
export function detectPitch(buf: Float32Array, sampleRate: number): number | null {
  let rms = 0; for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length); if (rms < 0.01) return null;
  const size = buf.length; let best = -1, bestCorr = 0;
  const minLag = Math.floor(sampleRate / 1000), maxLag = Math.floor(sampleRate / 60);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0; for (let i = 0; i < size - lag; i++) corr += buf[i] * buf[i + lag];
    corr /= size - lag;
    if (corr > bestCorr) { bestCorr = corr; best = lag; }
  }
  if (best < 0 || bestCorr < 0.001) return null;
  return sampleRate / best;
}

/** Jak blisko siedmiu ramion: 1 = idealnie, 0 = daleko. */
export function closeness(hz: number, target: number, tolerance: number): number {
  const d = Math.abs(hz - target);
  return Math.max(0, 1 - d / (tolerance * 4));
}
