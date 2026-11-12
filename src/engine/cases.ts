import type { CaseData, SaveState } from "./types";

export interface Verdict { correct: number; total: number; perQuestion: boolean[]; heat: 0 | 1 | 2 | 3 | 4; solved: boolean }

/** Zawieszka: ciepło rośnie z liczbą trafień, ale nie mówi, które. */
export function evaluate(c: CaseData, answers: number[]): Verdict {
  // Pytanie „month" nie ma poprawnej odpowiedzi: liczy się jako trafione, gdy podano miesiąc.
  const per = c.questions.map((q, i) => (q.kind === "month" ? answers[i] >= 1 && answers[i] <= 12 : answers[i] === q.answer));
  const correct = per.filter(Boolean).length;
  const total = c.questions.length;
  const ratio = total ? correct / total : 0;
  const heat: Verdict["heat"] = ratio === 1 ? 4 : ratio >= 0.75 ? 3 : ratio >= 0.5 ? 2 : ratio > 0 ? 1 : 0;
  return { correct, total, perQuestion: per, heat, solved: correct === total };
}

export const heatLabel = ["zimna", "letnia", "ciepła", "gorąca", "pulsuje"] as const;

export function recordAttempt(s: SaveState, c: CaseData, v: Verdict): SaveState {
  const list = s.attempts[c.id] ?? [];
  list.push({ at: Date.now(), correct: v.correct, total: v.total });
  s.attempts[c.id] = list;
  if (v.solved && !s.solvedCases.includes(c.n)) s.solvedCases.push(c.n);
  return s;
}

export function caseAvailable(s: SaveState, c: CaseData, chapterUnlocked: (n: number) => boolean): boolean {
  if (c.requires.solvedCases !== undefined && s.solvedCases.length < c.requires.solvedCases) return false;
  if (c.requires.chapter === undefined) return true;
  return chapterUnlocked(c.requires.chapter);
}

/** Połowa klucza (sprawa 7): 7 znaków z ziarna gracza. Pojawia się w karcie dopiero po sześciu sprawach. */
export async function halfKey(seed: string): Promise<string> {
  const data = new TextEncoder().encode("akta-lessu:pair:" + seed);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).slice(0, 4).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 7);
}
export function looksLikeHalfKey(v: string): boolean { return /^[0-9a-f]{7}$/i.test(v.trim()); }
