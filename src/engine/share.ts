/** Karta do udostępnienia bez spoilerów: siedem wzgórz, zapalone bramy, próby, seria. */
export function shareCard(opts: { solved: number[]; unstable?: number[]; attempts: number; streak?: number; url: string; hashtag: string; caseN?: number; passed?: number; halfKey?: string; readings?: string[]; silent?: number[] }): string {
  const row = [1, 2, 3, 4, 5, 6, 7].map((n) => (opts.unstable?.includes(n) ? "▲" : opts.solved.includes(n) ? "●" : opts.silent?.includes(n) ? "◌" : "○")).join(" ");
  const passed = opts.passed ?? opts.solved.length;
  const head = `Akta Lessu · ${passed}/7`;
  const tries = opts.attempts === 1 ? "za pierwszym razem" : `${opts.attempts} próby`;
  const tokens = [opts.readings?.length ? `odczyt: ${opts.readings.join(" ")}` : "", opts.halfKey ? `klucz: ${opts.halfKey}` : ""].filter(Boolean).join("\n");
  return `${head}\n${row}\n${tries}\n${opts.hashtag} ${opts.url}${tokens ? "\n\n" + tokens : ""}`;
}

export async function shareText(text: string): Promise<"shared" | "copied" | "failed"> {
  try {
    const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
    if (nav.share) { await nav.share({ text }); return "shared"; }
  } catch { /* użytkownik anulował */ }
  try { await navigator.clipboard.writeText(text); return "copied"; } catch { return "failed"; }
}
