/** Wspólny stan: klient. Bez adresu w config nic nie wysyła i nic nie pobiera. Gracz = skrót ziarna (8 hex), nie dane osobowe. */
import type { SaveState } from "./types";
let who = "";
export async function playerId(s: SaveState): Promise<string> {
  if (who) return who;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("akta-lessu:who:" + s.seed));
  who = Array.from(new Uint8Array(buf)).slice(0, 6).map((b) => b.toString(16).padStart(2, "0")).join("");
  return who;
}
export interface Stats { players: number; gates: Record<string, { solved: number; gesture: number }>; seventh: { empty: number; total: number }; choices: Record<string, Record<string, number>>; hum: { now: number; total: number } }

export async function sendEvent(url: string, s: SaveState, ev: { type: string; gate?: number; id?: string; option?: string | number }): Promise<void> {
  if (!url) return;
  try { await fetch(url.replace(/\/$/, "") + "/event", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ who: await playerId(s), ...ev }), keepalive: true }); } catch { /* offline: trudno */ }
}
export async function fetchStats(url: string): Promise<Stats | null> {
  if (!url) return null;
  try { const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 5000); const r = await fetch(url.replace(/\/$/, "") + "/stats", { signal: ctl.signal }); clearTimeout(t); return (await r.json()) as Stats; } catch { return null; }
}
export async function sendHum(url: string, s: SaveState): Promise<number | null> {
  if (!url) return null;
  try { const r = await fetch(url.replace(/\/$/, "") + "/hum", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ who: await playerId(s) }) }); return ((await r.json()) as { now: number }).now; } catch { return null; }
}
export async function fetchRejestr(url: string): Promise<{ active: boolean; header: string; lines: string[]; updatedAt: string } | null> {
  if (!url) return null;
  try { const r = await fetch(url.replace(/\/$/, "") + "/rejestr", { cache: "no-store" }); return await r.json(); } catch { return null; }
}
