import type { SaveState } from "./types";

const KEY = "akta-lessu:v1";

export function emptyState(): SaveState {
  return {
    v: 1, createdAt: Date.now(), unlockedChapters: [], solvedCases: [], attempts: {}, answers: {},
    chapterCursor: 0, streak: { days: 0, last: "", freezeUsed: "" }, notebook: [], placeVisits: [],
    unstableGates: [], seed: randomSeed(), month: 0, sawFooter: false, readings: {}, leftSeventhEmpty: false, interludesDone: [], daily: {}, subscribed: false,
  };
}

function randomSeed(): string {
  try { const a = new Uint8Array(8); crypto.getRandomValues(a); return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join(""); }
  catch { return Math.random().toString(16).slice(2, 18); }
}

export function load(): SaveState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const s = JSON.parse(raw) as SaveState;
    if (s.v !== 1) return emptyState();
    return { ...emptyState(), ...s };
  } catch { return emptyState(); }
}

export function save(s: SaveState): void {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* prywatne okno: trudno */ }
}

export function reset(): void {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}

/** Kod wznowienia: base64url z JSON (bez serwera). */
export function exportCode(s: SaveState): string {
  const slim = { u: s.unlockedChapters, s: s.solvedCases, c: s.chapterCursor, d: s.streak.days, l: s.streak.last, x: s.unstableGates, e: s.seed, m: s.month, r: s.readings, f: s.sawFooter };
  const json = JSON.stringify(slim);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function importCode(code: string): SaveState | null {
  try {
    const b64 = code.trim().replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64 + "===".slice((b64.length + 3) % 4))));
    const slim = JSON.parse(json) as { u: number[]; s: number[]; c: number; d: number; l: string; x?: number[]; e?: string; m?: number; r?: Record<string, string>; f?: boolean };
    const s = emptyState();
    s.unlockedChapters = slim.u ?? []; s.solvedCases = slim.s ?? []; s.chapterCursor = slim.c ?? 0;
    s.unstableGates = slim.x ?? []; if (slim.e) s.seed = slim.e; s.month = slim.m ?? 0; s.readings = slim.r ?? {}; s.sawFooter = slim.f ?? false;
    s.streak = { days: slim.d ?? 0, last: slim.l ?? "", freezeUsed: "" };
    return s;
  } catch { return null; }
}

/** Seria dni z jednym „zamrożeniem" na tydzień (Duolingo: seria z wybaczeniem). */
export function touchStreak(s: SaveState, today = new Date()): SaveState {
  const d = today.toISOString().slice(0, 10);
  if (s.streak.last === d) return s;
  const last = s.streak.last ? new Date(s.streak.last + "T00:00:00Z") : null;
  const diff = last ? Math.round((Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - last.getTime()) / 86400000) : 0;
  const week = d.slice(0, 7) + "-" + Math.floor(today.getUTCDate() / 7);
  if (!last || diff === 1) s.streak.days += 1;
  else if (diff === 2 && s.streak.freezeUsed !== week) { s.streak.days += 1; s.streak.freezeUsed = week; }
  else s.streak.days = 1;
  s.streak.last = d;
  return s;
}
