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
    const card = shareCard({ solved: [4], attempts: 1, url: "u", hashtag: "#A", passed: 1, readings: ["4abc123"] });
    expect(card).toContain("○ ○ ○ ● ○ ○ ○");
    expect(card).toContain("Akta Lessu · 1/7");
    expect(card).toContain("za pierwszym razem");
    expect(card.indexOf("odczyt:")).toBeGreaterThan(card.indexOf("#A"));
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

import { halfKey, verifyCheck, silentHills, readingToken, parseReading } from "../src/engine/pair";
describe("klucze między ludźmi", () => {
  it("połowa klucza ma sumę kontrolną, losowy hex jej nie ma", async () => {
    const k = await halfKey("seed-a");
    expect(k).toMatch(/^[0-9a-f]{7}$/);
    expect(await verifyCheck(k)).toBe(true);
    expect(await verifyCheck("abcdef0")).toBe(false);
    expect(await halfKey("seed-a")).toBe(k);
    expect(await halfKey("seed-b")).not.toBe(k);
  });
  it("milczące wzgórza: dwa różne, nigdy 4 ani 7, deterministyczne", async () => {
    for (const seed of ["a", "b", "c", "d", "e", "f", "g", "h"]) {
      const [x, y] = await silentHills(seed);
      expect(x).not.toBe(y); expect([4, 7]).not.toContain(x); expect([4, 7]).not.toContain(y);
      expect(await silentHills(seed)).toEqual([x, y]);
    }
  });
  it("odczyt niesie numer wzgórza i sumę kontrolną", async () => {
    const t = await readingToken("seed-a", 3);
    expect(parseReading(t)?.hill).toBe(3);
    expect(await verifyCheck(t)).toBe(true);
    expect(parseReading("3zzzzzz")).toBeNull();
    expect(await verifyCheck("3abcdef")).toBe(false);
  });
});

import { pickDaily, dayIndex } from "../src/engine/daily";
describe("mikro-akta", () => {
  it("ten sam dzień = ten sam dokument dla wszystkich; kolejny dzień = następny", () => {
    const pool = Array.from({ length: 5 }, (_, i) => ({ id: "m" + i, title: "", doc: "", q: "", options: [], answer: 0 }));
    const a = pickDaily(pool, new Date("2027-01-01T08:00:00Z")), b = pickDaily(pool, new Date("2027-01-01T22:00:00Z")), c = pickDaily(pool, new Date("2027-01-02T08:00:00Z"));
    expect(a.id).toBe(b.id); expect(c.id).not.toBe(a.id);
    expect(dayIndex(new Date("2027-01-02T00:00:00Z")) - dayIndex(new Date("2027-01-01T00:00:00Z"))).toBe(1);
  });
});

import { detectPitch, PitchSmoother } from "../src/engine/pitch";
describe("wysokość dźwięku bez błędu oktawy", () => {
  const sr = 44100;
  const tone = (hz: number, n = 4096) => Float32Array.from({ length: n }, (_, i) => 0.5 * Math.sin((2 * Math.PI * hz * i) / sr));
  it.each([64, 128, 136, 196, 261.6, 440])("czysty ton %s Hz daje właściwą oktawę", (hz) => {
    const got = detectPitch(tone(hz), sr)!;
    expect(Math.abs(got - hz) / hz).toBeLessThan(0.02);
  });
  it("mediana tłumi pojedynczy przeskok", () => {
    const s = new PitchSmoother(5);
    [136, 136, 68, 136, 136].forEach((v) => s.push(v));
    expect(s.push(136)).toBe(136);
  });
});

import { encodeFill, expectedAnswer, passedCount, GESTURE_OF } from "../src/engine/cases";
describe("luki z bankiem słów i bramy przebyte gestem", () => {
  it("koduje wybór słów jednoznacznie i rozpoznaje poprawny", () => {
    const bank = ["a", "b", "c", "d"];
    expect(encodeFill(bank, ["a", "c"])).not.toBe(encodeFill(bank, ["c", "a"]));
    const q = { kind: "fill", answer: -1, bank, answerWords: ["b", "d"] };
    expect(expectedAnswer(q)).toBe(encodeFill(bank, ["b", "d"]));
    expect(encodeFill(bank, ["b", ""])).not.toBe(expectedAnswer(q));
  });
  it("sprawa rozpoznana bez gestu nie liczy się jako przebyta", () => {
    const s = emptyState(); s.solvedCases = [1]; const gateOf = (n: number) => (n === 1 ? 4 : undefined);
    expect(passedCount(s, gateOf)).toBe(0);
    s.interludesDone.push(GESTURE_OF[4]); expect(passedCount(s, gateOf)).toBe(1);
    s.unstableGates.push(1); expect(passedCount(s, gateOf)).toBe(2);
  });
});

import { sunrise, isDawn } from "../src/engine/sun";
import { schedule, due, pending, unreadCount } from "../src/engine/messages";
describe("świt i listy", () => {
  it("wschód słońca w Sandomierzu: grudzień ok. 7:30, czerwiec ok. 4:20 czasu lokalnego PL", () => {
    const dec = sunrise(new Date("2026-12-21T12:00:00Z")); const jun = sunrise(new Date("2026-06-21T12:00:00Z"));
    const hDec = dec.getUTCHours() + dec.getUTCMinutes() / 60 + 1; const hJun = jun.getUTCHours() + jun.getUTCMinutes() / 60 + 2; // CET / CEST
    expect(hDec).toBeGreaterThan(7.2); expect(hDec).toBeLessThan(7.8);
    expect(hJun).toBeGreaterThan(4.1); expect(hJun).toBeLessThan(4.6);
    expect(isDawn(new Date(dec.getTime() + 20 * 60000))).toBe(true);
    expect(isDawn(new Date(dec.getTime() + 90 * 60000))).toBe(false);
  });
  it("listy planują się po zdarzeniu i przychodzą po opóźnieniu", () => {
    const s = emptyState(); const rules = [{ id: "a", after: "case:1", delayMin: 30, from: "W", text: "t" }, { id: "b", after: "start", delayMin: 0, from: "Z", text: "u" }];
    const t0 = 1_000_000;
    schedule(s, rules, t0); expect(due(s, rules, t0).map((r) => r.id)).toEqual(["b"]); expect(pending(s, rules, t0)).toHaveLength(0);
    s.solvedCases.push(1); schedule(s, rules, t0); expect(pending(s, rules, t0).map((r) => r.id)).toEqual(["a"]);
    expect(due(s, rules, t0 + 31 * 60000).map((r) => r.id)).toEqual(["b", "a"]); expect(unreadCount(s, rules, t0 + 31 * 60000)).toBe(2);
  });
});

describe("trzymanie oktawy", () => {
  it("odczyt o połowę niższy od stabilnego tonu jest poprawiany do tej samej oktawy", () => {
    const s = new PitchSmoother(5);
    [200, 201, 199, 200].forEach((v) => s.push(v));
    expect(s.push(100)).toBeGreaterThan(190);
    expect(s.push(400)).toBeLessThan(210);
  });
});

import { detectDuet } from "../src/engine/duet";
describe("dwa głosy: analiza widma", () => {
  const sr = 44100, N = 8192, binHz = sr / N;
  // syntetyczne widmo w dB: harmoniczne podanych tonów z malejącą energią, tło -90 dB
  const spectrum = (tones: number[]) => { const s = new Float32Array(N / 2).fill(-90); for (const f of tones) for (let k = 1; k <= 5; k++) { const b = Math.round((f * k) / binHz); if (b < s.length) s[b] = Math.max(s[b], -10 - k * 6); } return s; };
  it("jeden głos: f1 bez f2", () => { const r = detectDuet(spectrum([196]), binHz); expect(Math.abs(r.f1! - 196)).toBeLessThan(4); expect(r.f2).toBeNull(); expect(r.fifth).toBe(false); });
  it("kwinta G–D: oba głosy i warunek spełniony", () => { const r = detectDuet(spectrum([196, 294]), binHz); expect(Math.abs(r.f1! - 196)).toBeLessThan(4); expect(Math.abs(r.f2! - 294)).toBeLessThan(5); expect(r.fifth).toBe(true); });
  it("oktawa to nie drugi głos", () => { const r = detectDuet(spectrum([196, 392]), binHz); expect(r.f2).toBeNull(); });
  it("tercja to dwa głosy, ale nie kwinta", () => { const r = detectDuet(spectrum([196, 247]), binHz); expect(r.f2).not.toBeNull(); expect(r.fifth).toBe(false); });
  it("cisza", () => { expect(detectDuet(new Float32Array(N / 2).fill(-100), binHz).f1).toBeNull(); });
});

import { plural } from "../src/ui/views";
describe("odmiana", () => {
  it("po 1 bramie, po 2 bramach, 5 bram, 22 bramy", () => {
    expect(plural(1, "bramie", "bramach", "bramach")).toBe("bramie");
    expect(plural(2, "brama", "bramy", "bram")).toBe("bramy");
    expect(plural(5, "brama", "bramy", "bram")).toBe("bram");
    expect(plural(12, "brama", "bramy", "bram")).toBe("bram");
    expect(plural(22, "brama", "bramy", "bram")).toBe("bramy");
  });
});
