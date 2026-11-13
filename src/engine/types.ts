export type GateStatus = "locked" | "open" | "solved" | "unstable" | "silent";

export interface Gate {
  n: number; id: string; name: string; element: string;
  x: number; peak: number; depth: number; silent?: boolean;
  /** Wysokość n.p.m. i źródło (dane albo szacunek do weryfikacji). */
  elev?: number; elevSource?: string;
  /** Współrzędne przybliżone (kompas-zawieszka na miejscu). */
  lat?: number; lon?: number;
}
export interface Corridor { id: string; from: number; to: number; revealChapter: number }
export interface MapData { viewBox: string; layers: { id: string; label: string; y: number; h: number }[]; gates: Gate[]; corridors: Corridor[]; wisla?: { elev: number; note: string }; scale?: { minElev: number; maxElev: number; groundY: number; skyY: number } }

export interface Chapter {
  n: number; title: string; date: string; gate: number; amor: boolean; underground: boolean; line: string; codeHash: string;
}

export interface Doc {
  id: string; title: string; source: string; style?: "chronicle" | "mono" | "hand" | "plain"; paragraphs: string[];
  /** Dokument widoczny tylko po zeskanowaniu kodu QR o tym id (tryb „na miejscu"). */
  requiresPlace?: string;
  /** Plik audio (sprawa 2). Ścieżka względem base. */
  audio?: string;
  /** Stopka programu. Domyślnie z config.footer; pusty string = brak. */
  footer?: string;
  /** Dokument czytelny tylko o świcie (wschód słońca + godzina, Sandomierz). */
  requiresDawn?: boolean;
  /** Dokument czytelny tylko między 12:00 a 12:59 czasu lokalnego (dwanaście uderzeń). */
  requiresNoon?: boolean;
}
export type QuestionKind = "choice" | "reject" | "month" | "fill";
export interface Question {
  id: string; text: string; options: string[]; answer: number; hint?: string;
  /** choice (domyślnie) · reject: opcje to tytuły dokumentów, odrzuć fałszywy · month: bez poprawnej odpowiedzi, personalizacja */
  kind?: QuestionKind;
  /** month: 12 zdań, po jednym na miesiąc. */
  monthLines?: string[];
  monthClosing?: string;
  /** fill: zdanie z lukami „___", bank słów (z fałszywymi), poprawne słowa po kolei. */
  bank?: string[];
  answerWords?: string[];
}
export type CaseType = "deduction" | "decision" | "pair";
export interface CaseData {
  n: number; id: string; gate: number; title: string; subtitle: string; epigraph: string;
  /** deduction (domyślnie) · decision: jedna decyzja, zła = brama niestabilna · pair: wymaga połowy klucza drugiej osoby */
  type?: CaseType;
  requires: { chapter?: number; solvedCases?: number; release?: string };
  docs: Doc[]; questions: Question[];
  solution: string[]; reward?: { kind: "text"; title: string; file: string };
  decision?: { prompt: string; open: string; leave: string; buried: string[]; correct: "open" | "leave" };
  pair?: { prompt: string; promptUnstable: string; ask: string; refuse: string; register: string; registerQuestion: string; yes: string; no: string; yesRefused: string; finale: string[] };
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
  /** Bramy, które gracz otworzył, choć nie powinien (sprawa 6). Trwałe. */
  unstableGates: number[];
  /** Ziarno połowy klucza (sprawa 7). */
  seed: string;
  /** Miesiąc urodzenia podany w sprawie 3 (1–12). */
  month: number;
  /** Czy gracz już zobaczył, kto wysyła akta (po sprawie 4). */
  sawFooter: boolean;
  /** Odczyty cudzych zawieszek: wzgórze -> token dawcy. Otwierają wzgórza, na których własna zawieszka milczy. */
  readings: Record<string, string>;
  /** Czy gracz zostawił siódmą pozycję pustą (finał). */
  leftSeventhEmpty: boolean;
  /** Przerywniki między sprawami, które gracz już przeszedł. */
  interludesDone: string[];
  /** Rozmowy: liczba nietrafionych wskazań i blokada (ms) po trzech. */
  talkTries?: Record<string, { n: number; until: number }>;
  /** Mikro-akta: data -> czy trafione. */
  daily: Record<string, boolean>;
  /** Czy gracz zostawił e-mail (my go nie znamy, tylko fakt). */
  subscribed: boolean;
  /** Tryb testowy autora: bez kolejności, bez kalendarza, bez milczenia. */
  testMode: boolean;
  /** Czy gracz przeszedł wejście (pierwsze 90 sekund). */
  onboarded?: boolean;
  /** Kroki zliczone akcelerometrem (przerywnik „kroki"), między dniami. */
  steps?: number;
  /** Wiadomości od postaci: zaplanowane (id -> czas), przeczytane, odpowiedzi. */
  inbox?: { scheduled: Record<string, number>; read: string[]; replies: Record<string, number> };
}
