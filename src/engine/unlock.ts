import type { Chapter, SaveState } from "./types";

/** Normalizacja kodu z książki: wielkie litery, bez polskich znaków, bez spacji. */
export function normalizeCode(input: string): string {
  return input
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l").replace(/Ł/g, "L")
    .toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function codeMatches(input: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  const h = await sha256("akta-lessu:" + normalizeCode(input));
  return h === hash;
}

export interface TimeConfig { premiereDate: string; timeline: { chapterOffsets: Record<string, number> }; releases?: Record<string, string>; releaseOffsets?: Record<string, number>; releaseHours?: Record<string, number> }

/** Data publikacji sprawy z kalendarza (klucz czasu). */
/** Data publikacji sprawy: bezwzględna z `releases`, a gdy jej nie ma, `releaseOffsets` (dni po premierze, godzina z `releaseHours`, domyślnie 18:00 lokalnie). Przesunięcie premiery to wtedy jeden parametr. */
export function releaseDate(cfg: TimeConfig, key: string): Date | null {
  const v = cfg.releases?.[key]; if (v && /^\d{4}-/.test(v)) return new Date(v);
  const off = cfg.releaseOffsets?.[key]; if (off === undefined) return null;
  const d = new Date(cfg.premiereDate); d.setDate(d.getDate() + off); d.setHours(cfg.releaseHours?.[key] ?? 18, 0, 0, 0); return d;
}
export function isReleased(cfg: TimeConfig, key: string, now = new Date()): boolean { const d = releaseDate(cfg, key); return d !== null && now.getTime() >= d.getTime(); }

/** Odblokowanie czasowe: rozdział n otwiera się o dacie premiery + offset (dni). Brak wpisu = nie otwiera się czasem. */
export function unlockDate(cfg: TimeConfig, chapter: number): Date | null {
  const off = cfg.timeline.chapterOffsets[String(chapter)];
  if (off === undefined) return null;
  const p = new Date(cfg.premiereDate);
  return new Date(p.getTime() + off * 86400000);
}

export function isTimeUnlocked(cfg: TimeConfig, chapter: number, now = new Date()): boolean {
  const d = unlockDate(cfg, chapter);
  return d !== null && now.getTime() >= d.getTime();
}

/** Klucz miejsca: ?qr=<id> w adresie (kod QR w Sandomierzu). */
export function placeFromUrl(search: string): string | null {
  const m = /[?&]qr=([a-z0-9-]+)/i.exec(search);
  return m ? m[1].toLowerCase() : null;
}

export function isChapterUnlocked(s: SaveState, cfg: TimeConfig, ch: Chapter, now = new Date()): boolean {
  if (ch.n === 0) return true; // Prolog zawsze otwarty: to jest wejście.
  if (s.unlockedChapters.includes(ch.n)) return true;
  return isTimeUnlocked(cfg, ch.n, now);
}

/** Pierwszy rozdział, który nie jest jeszcze otwarty (do odliczania). */
export function nextLockedChapter(s: SaveState, cfg: TimeConfig, chapters: Chapter[], now = new Date()): Chapter | null {
  return chapters.find((c) => !isChapterUnlocked(s, cfg, c, now)) ?? null;
}
