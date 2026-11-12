/** Karta do udostępnienia bez spoilerów: siedem wzgórz, zapalone bramy, próby, seria. */
export function shareCard(opts: { solved: number[]; unstable?: number[]; attempts: number; streak: number; url: string; hashtag: string; caseN?: number; halfKey?: string; readings?: string[]; silent?: number[] }): string {
  const row = [1, 2, 3, 4, 5, 6, 7].map((n) => (opts.unstable?.includes(n) ? "▲" : opts.solved.includes(n) ? "●" : opts.silent?.includes(n) ? "·" : "○")).join(" ");
  const head = opts.caseN ? `Akta Lessu · Brama ${opts.caseN}/7` : `Akta Lessu · ${opts.solved.length}/7`;
  const tries = opts.attempts === 1 ? "za pierwszym razem" : `${opts.attempts} próby`;
  const streak = opts.streak > 1 ? ` · seria ${opts.streak} dni` : "";
  const key = opts.halfKey ? `\nklucz: ${opts.halfKey}` : "";
  const rd = opts.readings?.length ? `\nodczyt: ${opts.readings.join(" ")}` : "";
  return `${head}\n${row}\n${tries}${streak}${rd}${key}\n${opts.hashtag} ${opts.url}`;
}

export async function shareText(text: string): Promise<"shared" | "copied" | "failed"> {
  try {
    const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
    if (nav.share) { await nav.share({ text }); return "shared"; }
  } catch { /* użytkownik anulował */ }
  try { await navigator.clipboard.writeText(text); return "copied"; } catch { return "failed"; }
}
