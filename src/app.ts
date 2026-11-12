import type { CaseData, Chapter, GateStatus, MapData, SaveState } from "./engine/types";
import { isChapterUnlocked, nextLockedChapter, placeFromUrl, isReleased, type TimeConfig } from "./engine/unlock";
import { load, save, touchStreak } from "./engine/state";
import mapJson from "./content/map.json";
import chaptersJson from "./content/chapters.json";
import configJson from "./content/config.json";
import rewardsJson from "./content/rewards.json";
import case01 from "./content/cases/01-staromiejskie.json";
import case02 from "./content/cases/02-miejskie.json";
import case03 from "./content/cases/03-katedralne.json";
import case04 from "./content/cases/04-zamkowe.json";
import case05 from "./content/cases/05-collegium.json";
import case06 from "./content/cases/06-zmigrod.json";
import case07 from "./content/cases/07-swietopawlowskie.json";
import { caseAvailable, passedCount, gestureDone } from "./engine/cases";
import interludesJson from "./content/interludia.json";
import mikroJson from "./content/mikroakta.json";
import type { Mikro } from "./engine/daily";
import { silentHills } from "./engine/pair";

export interface Config extends TimeConfig { testCodeHash?: string; title: string; share: { url: string; hashtag: string }; footer: string; bookUrl: string; newsletter: { action: string; fieldName: string; method: string }; analyticsDomain: string }
export type Reward = { title: string; note: string; paragraphs: string[] };

export class App {
  cfg: Config = configJson as Config;
  map: MapData = mapJson as MapData;
  chapters: Chapter[] = chaptersJson as Chapter[];
  cases: CaseData[] = [case01, case02, case03, case04, case05, case06, case07] as CaseData[];
  rewards: Record<string, Reward> = rewardsJson as Record<string, Reward>;
  interludes: unknown[] = interludesJson as unknown[];
  mikro: Mikro[] = mikroJson as Mikro[];
  state: SaveState = load();
  now = () => new Date();
  /** Wzgórza, na których zawieszka TEGO gracza milczy (mapa 5/7). Ustalane z ziarna przy starcie. */
  silent: number[] = [];
  ready: Promise<void>;

  constructor() {
    touchStreak(this.state);
    const qr = placeFromUrl(location.search);
    if (qr && !this.state.placeVisits.includes(qr)) { this.state.placeVisits.push(qr); this.addNote(`Punkt w Sandomierzu: ${qr}.`, "klucz: miejsce"); }
    save(this.state);
    this.ready = silentHills(this.state.seed).then((h) => { this.silent = h; });
  }
  /** Milczy u tego gracza i nie ma jeszcze odczytu od kogoś innego. */
  isSilentFor(n: number): boolean { return !this.state.testMode && this.silent.includes(n) && !this.state.readings[String(n)]; }
  isUnlocked(n: number): boolean { const ch = this.chapters.find((c) => c.n === n); return ch ? isChapterUnlocked(this.state, this.cfg, ch, this.now()) : false; }
  nextLocked(): Chapter | null { return nextLockedChapter(this.state, this.cfg, this.chapters, this.now()); }
  caseForGate(n: number): CaseData | undefined { return this.cases.find((c) => c.gate === n); }
  gateOfCase = (n: number): number | undefined => this.cases.find((c) => c.n === n)?.gate;
  passed(): number { return passedCount(this.state, this.gateOfCase); }
  /** Brama rozpoznana dedukcją, ale jeszcze nie przebyta gestem. */
  awaitingGesture(n: number): boolean { const c = this.caseForGate(n); return !!c && this.state.solvedCases.includes(c.n) && !gestureDone(this.state, n); }
  gateStatus(n: number): GateStatus {
    const g = this.map.gates.find((x) => x.n === n);
    const c = this.caseForGate(n);
    if (this.state.unstableGates.includes(n)) return "unstable";
    if (c && this.state.solvedCases.includes(c.n)) return "solved";
    if (this.isSilentFor(n)) return "silent";
    if (c && this.state.testMode) return "open";
    if (c && caseAvailable(this.state, c, (k) => this.isUnlocked(k), (k) => isReleased(this.cfg, k, this.now()), this.gateOfCase)) return "open";
    if (!c && g?.silent) return "silent";
    return "locked";
  }
  solvedGates(): number[] { return this.state.solvedCases.map((n) => this.cases.find((c) => c.n === n)?.gate ?? n); }
  addNote(text: string, meta: string): void { this.state.notebook.push({ at: Date.now(), text, meta }); save(this.state); }
}
