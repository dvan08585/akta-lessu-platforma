import type { CaseData, SaveState } from "./types";

export interface Verdict { correct: number; total: number; perQuestion: boolean[]; heat: 0 | 1 | 2 | 3 | 4; solved: boolean }

/** Zawieszka: ciepło rośnie z liczbą trafień, ale nie mówi, które. */
/** Luki: wybór słów z banku zakodowany jako jedna liczba (indeks_k * N^k). */
export function encodeFill(bank: string[], words: string[]): number {
  const N = bank.length + 1; let v = 0;
  words.forEach((w, k) => { const i = bank.indexOf(w); v += (i < 0 ? 0 : i + 1) * Math.pow(N, k); });
  return v;
}
export function expectedAnswer(q: { kind?: string; answer: number; bank?: string[]; answerWords?: string[] }): number {
  return q.kind === "fill" && q.bank && q.answerWords ? encodeFill(q.bank, q.answerWords) : q.answer;
}

/** Luka po luce: ile słów ustalenia się zgadza. Zawieszka grzeje od tego, nie mówi, które. */
export function fillGaps(q: { bank?: string[]; answerWords?: string[] }, value: number): { ok: number; total: number } {
  if (!q.bank || !q.answerWords) return { ok: 0, total: 1 };
  const N = q.bank.length + 1; let v = value; let ok = 0;
  for (const w of q.answerWords) { const i = v % N; v = Math.floor(v / N); if (i === q.bank.indexOf(w) + 1) ok++; }
  return { ok, total: q.answerWords.length };
}

export function evaluate(c: CaseData, answers: number[]): Verdict {
  // Pytanie „month" nie ma poprawnej odpowiedzi: liczy się jako trafione, gdy podano miesiąc.
  const per = c.questions.map((q, i) => (q.kind === "month" ? answers[i] >= 1 && answers[i] <= 12 : answers[i] === expectedAnswer(q)));
  // Pytanie „reject": dopóki fałszywy dokument nie jest odrzucony, żadne inne ustalenie się nie liczy.
  const rejectIdx = c.questions.findIndex((q) => q.kind === "reject");
  if (rejectIdx >= 0 && !per[rejectIdx]) per.fill(false);
  // Ciepło liczone po lukach (ustalenie z sześcioma lukami grzeje stopniowo), inne pytania po jednym.
  let correct = 0, total = 0;
  c.questions.forEach((q, i) => {
    if (q.kind === "fill" && q.bank && q.answerWords) { const g = fillGaps(q, answers[i] ?? 0); correct += rejectIdx >= 0 && !per[rejectIdx] ? 0 : g.ok; total += g.total; }
    else { correct += per[i] ? 1 : 0; total += 1; }
  });
  const ratio = total ? correct / total : 0;
  const heat: Verdict["heat"] = ratio === 1 ? 4 : ratio >= 0.75 ? 3 : ratio >= 0.5 ? 2 : ratio > 0 ? 1 : 0;
  return { correct, total, perQuestion: per, heat, solved: per.every(Boolean) };
}

export const heatLabel = ["zimna", "letnia", "ciepła", "gorąca", "pulsuje"] as const;

export function recordAttempt(s: SaveState, c: CaseData, v: Verdict): SaveState {
  const list = s.attempts[c.id] ?? [];
  list.push({ at: Date.now(), correct: v.correct, total: v.total });
  s.attempts[c.id] = list;
  if (v.solved && !s.solvedCases.includes(c.n)) s.solvedCases.push(c.n);
  return s;
}

/** Gest ciała przypisany do bramy: po dedukcji brama jest „rozpoznana", po geście „przebyta". */
export const GESTURE_OF: Record<number, string> = { 4: "ogien", 3: "plyta", 2: "woda", 5: "zimno", 6: "ciemnosc", 1: "ziemia" };
export function gestureDone(s: SaveState, gate: number): boolean { const g = GESTURE_OF[gate]; return !g || s.interludesDone.includes(g) || s.testMode; }

/** Bramy „przebyte": rozpoznane dedukcją I przejęte gestem, albo otwarte na siłę (niestabilne). */
export function passedCount(s: SaveState, gateOfCase?: (n: number) => number | undefined): number {
  const solvedPassed = s.solvedCases.filter((n) => { const g = gateOfCase ? gateOfCase(n) : undefined; return g === undefined ? true : gestureDone(s, g); }).length;
  return solvedPassed + s.unstableGates.length;
}

/** Postęp zawsze; potem: kod z książki (rozdział) LUB data publikacji. Brak obu wymagań = otwarta. */
export function caseAvailable(s: SaveState, c: CaseData, chapterUnlocked: (n: number) => boolean, released: (key: string) => boolean = () => false, gateOfCase?: (n: number) => number | undefined): boolean {
  if (c.requires.solvedCases !== undefined && passedCount(s, gateOfCase) < c.requires.solvedCases) return false;
  if (c.requires.chapter === undefined && c.requires.release === undefined) return true;
  if (c.requires.release !== undefined && released(c.requires.release)) return true;
  if (c.requires.chapter !== undefined && s.unlockedChapters.includes(c.requires.chapter)) return true;
  if (c.requires.chapter !== undefined && c.requires.release === undefined) return chapterUnlocked(c.requires.chapter);
  return false;
}

export { halfKey, looksLikeHalfKey } from "./pair";
