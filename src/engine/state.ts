import type { SaveState } from "./types";

const KEY = "akta-lessu:v1";

export function emptyState(): SaveState {
  return {
    v: 1, createdAt: Date.now(), unlockedChapters: [], solvedCases: [], attempts: {}, answers: {},
    chapterCursor: 0, streak: { days: 0, last: "", freezeUsed: "" }, notebook: [], placeVisits: [],
    unstableGates: [], seed: randomSeed(), month: 0, sawFooter: false, readings: {}, leftSeventhEmpty: false, interludesDone: [], daily: {}, subscribed: false, testMode: false, inbox: { scheduled: {}, read: [], replies: {} },
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
/** Suma kontrolna FNV-1a (4 hex). Nie kryptografia: wykrywa literówkę w przepisanym kodzie. */
function fnv(str: string): string { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return (h >>> 0).toString(16).padStart(8, "0").slice(0, 4); }
/** Kod wznowienia: cały postęp, który ma znaczenie na nowym telefonie (sprawy, gesty, miejsca, listy, mikro-akta, decyzje). */
export function exportCode(s: SaveState): string {
  const slim = { v: 2, u: s.unlockedChapters, s: s.solvedCases, c: s.chapterCursor, x: s.unstableGates, e: s.seed, m: s.month, r: s.readings, f: s.sawFooter,
    i: s.interludesDone, p: s.placeVisits, o: s.onboarded ? 1 : 0, n: s.leftSeventhEmpty ? 1 : 0, y: s.daily,
    b: { s: Object.fromEntries(Object.entries(s.inbox?.scheduled ?? {}).map(([k, v]) => [k, Math.round(v / 60000)])), r: s.inbox?.read ?? [], a: s.inbox?.replies ?? {} } };
  const json = JSON.stringify(slim);
  const body = btoa(unescape(encodeURIComponent(json))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return body + "." + fnv(body);
}
export function importCode(code: string): SaveState | null {
  try {
    const raw = code.trim();
    const [body, chk] = raw.includes(".") ? raw.split(".") : [raw, null];
    if (chk !== null && fnv(body) !== chk) return null;
    const b64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64 + "===".slice((b64.length + 3) % 4))));
    const slim = JSON.parse(json) as { u: number[]; s: number[]; c: number; x?: number[]; e?: string; m?: number; r?: Record<string, string>; f?: boolean;
      i?: string[]; p?: string[]; o?: number; n?: number; y?: Record<string, boolean>; b?: { s: Record<string, number>; r: string[]; a: Record<string, number> } };
    const s = emptyState();
    s.unlockedChapters = slim.u ?? []; s.solvedCases = slim.s ?? []; s.chapterCursor = slim.c ?? 0;
    s.unstableGates = slim.x ?? []; if (slim.e) s.seed = slim.e; s.month = slim.m ?? 0; s.readings = slim.r ?? {}; s.sawFooter = slim.f ?? false;
    s.interludesDone = slim.i ?? []; s.placeVisits = slim.p ?? []; s.onboarded = !!slim.o; s.leftSeventhEmpty = !!slim.n; s.daily = slim.y ?? {};
    if (slim.b) s.inbox = { scheduled: Object.fromEntries(Object.entries(slim.b.s ?? {}).map(([k, v]) => [k, v * 60000])), read: slim.b.r ?? [], replies: slim.b.a ?? {} };
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
