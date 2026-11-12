export type GateStatus = "locked" | "open" | "solved" | "unstable" | "silent";

export interface Gate {
  n: number; id: string; name: string; element: string;
  x: number; peak: number; depth: number; silent?: boolean;
}
export interface Corridor { id: string; from: number; to: number; revealChapter: number }
export interface MapData { viewBox: string; layers: { id: string; label: string; y: number; h: number }[]; gates: Gate[]; corridors: Corridor[] }

export interface Chapter {
  n: number; title: string; date: string; gate: number; amor: boolean; underground: boolean; line: string; codeHash: string;
}

export interface Doc {
  id: string; title: string; source: string; style?: "chronicle" | "mono" | "hand" | "plain"; paragraphs: string[];
}
export interface Question {
  id: string; text: string; options: string[]; answer: number; hint?: string;
}
export interface CaseData {
  n: number; id: string; gate: number; title: string; subtitle: string; epigraph: string;
  requires: { chapter?: number };
  docs: Doc[]; questions: Question[];
  solution: string[]; reward?: { kind: "text"; title: string; file: string };
}

export interface Attempt { at: number; correct: number; total: number }
export interface SaveState {
  v: 1;
  createdAt: number;
  unlockedChapters: number[];
  solvedCases: number[];
  attempts: Record<string, Attempt[]>;
  answers: Record<string, number[]>;
  chapterCursor: number;
  streak: { days: number; last: string; freezeUsed: string };
  notebook: { at: number; text: string; meta: string }[];
  placeVisits: string[];
}
