import { describe, it, expect } from "vitest";
import { normalizeCode, unlockDate, isTimeUnlocked, placeFromUrl } from "../src/engine/unlock";
import { evaluate } from "../src/engine/cases";
import { shareCard } from "../src/engine/share";
import { emptyState, exportCode, importCode, touchStreak } from "../src/engine/state";
import type { CaseData } from "../src/engine/types";

const cfg = { premiereDate: "2027-10-15T00:00:00+02:00", timeline: { chapterOffsets: { "0": -60, "1": -53 } } };

describe("kody z książki", () => {
  it("normalizuje polskie znaki, spacje i wielkość liter", () => {
    expect(normalizeCode(" gołąb ")).toBe("GOLAB");
    expect(normalizeCode("Słyszę")).toBe("SLYSZE");
    expect(normalizeCode("rtęć!")).toBe("RTEC");
  });
});

describe("odblokowanie czasem", () => {
  it("liczy datę od premiery", () => {
    const d = unlockDate(cfg, 0)!;
    expect(d.toISOString().slice(0, 10)).toBe("2027-08-15");
    expect(isTimeUnlocked(cfg, 0, new Date("2027-08-14T00:00:00Z"))).toBe(false);
    expect(isTimeUnlocked(cfg, 0, new Date("2027-08-16T00:00:00Z"))).toBe(true);
  });
  it("rozdział bez offsetu nigdy nie otwiera się czasem", () => {
    expect(unlockDate(cfg, 18)).toBeNull();
    expect(isTimeUnlocked(cfg, 18, new Date("2099-01-01"))).toBe(false);
  });
});

describe("klucz miejsca", () => {
  it("czyta ?qr=", () => {
    expect(placeFromUrl("?qr=Opatowska")).toBe("opatowska");
    expect(placeFromUrl("?x=1")).toBeNull();
  });
});

describe("sprawa: zawieszka", () => {
  const c = { n: 1, id: "t", gate: 4, title: "", subtitle: "", epigraph: "", requires: {}, docs: [], solution: [],
    questions: [{ id: "a", text: "", options: ["x", "y"], answer: 1 }, { id: "b", text: "", options: ["x", "y"], answer: 0 }] } as CaseData;
  it("ciepło rośnie z trafieniami, nie zdradza których", () => {
    expect(evaluate(c, [0, 1]).heat).toBe(0);
    expect(evaluate(c, [1, 1]).heat).toBe(2);
    expect(evaluate(c, [1, 0]).solved).toBe(true);
    expect(evaluate(c, [1, 0]).heat).toBe(4);
  });
});

describe("karta do udostępnienia", () => {
  it("nie zawiera rozwiązania, tylko siedem wzgórz", () => {
    const card = shareCard({ solved: [4], attempts: 1, streak: 3, url: "u", hashtag: "#A", caseN: 1 });
    expect(card).toContain("○ ○ ○ ● ○ ○ ○");
    expect(card).toContain("za pierwszym razem");
    expect(card).toContain("seria 3 dni");
  });
});

describe("stan: kod wznowienia i seria", () => {
  it("eksport/import zachowuje postęp", () => {
    const s = emptyState(); s.unlockedChapters = [0, 1]; s.solvedCases = [1]; s.chapterCursor = 1;
    const back = importCode(exportCode(s))!;
    expect(back.unlockedChapters).toEqual([0, 1]); expect(back.solvedCases).toEqual([1]); expect(back.chapterCursor).toBe(1);
  });
  it("seria rośnie dzień po dniu i wybacza jedną przerwę w tygodniu", () => {
    const s = emptyState();
    touchStreak(s, new Date("2027-03-01T10:00:00Z")); expect(s.streak.days).toBe(1);
    touchStreak(s, new Date("2027-03-02T10:00:00Z")); expect(s.streak.days).toBe(2);
    touchStreak(s, new Date("2027-03-04T10:00:00Z")); expect(s.streak.days).toBe(3); // zamrożenie
    touchStreak(s, new Date("2027-03-06T10:00:00Z")); expect(s.streak.days).toBe(1); // drugie w tym tygodniu: reset
  });
});

describe("nowe typy spraw", () => {
  it("pytanie month liczy się jako trafione przy podanym miesiącu", () => {
    const c = { n: 3, id: "m", gate: 2, title: "", subtitle: "", epigraph: "", requires: {}, docs: [], solution: [],
      questions: [{ id: "q0", kind: "month", text: "", options: [], answer: -1 }, { id: "q1", text: "", options: ["a", "b"], answer: 0 }] } as CaseData;
    expect(evaluate(c, [0, 0]).solved).toBe(false);
    expect(evaluate(c, [11, 0]).solved).toBe(true);
  });
  it("karta zaznacza bramę niestabilną trójkątem i dodaje połowę klucza", () => {
    const card = shareCard({ solved: [4, 3], unstable: [1], attempts: 2, streak: 0, url: "u", hashtag: "#A", halfKey: "abc1234" });
    expect(card).toContain("▲ ○ ● ● ○ ○ ○");
    expect(card).toContain("klucz: abc1234");
  });
});
