import type { CaseData, Chapter, GateStatus, MapData, SaveState } from "./engine/types";
import { isChapterUnlocked, nextLockedChapter, placeFromUrl, type TimeConfig } from "./engine/unlock";
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
import { caseAvailable } from "./engine/cases";

export interface Config extends TimeConfig { title: string; share: { url: string; hashtag: string }; footer: string; newsletterUrl: string; bookUrl: string }
export type Reward = { title: string; note: string; paragraphs: string[] };

export class App {
  cfg: Config = configJson as Config;
  map: MapData = mapJson as MapData;
  chapters: Chapter[] = chaptersJson as Chapter[];
  cases: CaseData[] = [case01, case02, case03, case04, case05, case06, case07] as CaseData[];
  rewards: Record<string, Reward> = rewardsJson as Record<string, Reward>;
  state: SaveState = load();
  now = () => new Date();

  constructor() {
    touchStreak(this.state);
    const qr = placeFromUrl(location.search);
    if (qr && !this.state.placeVisits.includes(qr)) { this.state.placeVisits.push(qr); this.addNote(`Punkt w Sandomierzu: ${qr}.`, "klucz: miejsce"); }
    save(this.state);
  }
  isUnlocked(n: number): boolean { const ch = this.chapters.find((c) => c.n === n); return ch ? isChapterUnlocked(this.state, this.cfg, ch, this.now()) : false; }
  nextLocked(): Chapter | null { return nextLockedChapter(this.state, this.cfg, this.chapters, this.now()); }
  caseForGate(n: number): CaseData | undefined { return this.cases.find((c) => c.gate === n); }
  gateStatus(n: number): GateStatus {
    const g = this.map.gates.find((x) => x.n === n);
    const c = this.caseForGate(n);
    if (this.state.unstableGates.includes(n)) return "unstable";
    if (c && this.state.solvedCases.includes(c.n)) return "solved";
    if (c && caseAvailable(this.state, c, (k) => this.isUnlocked(k))) return "open";
    if (g?.silent) return "silent";
    return "locked";
  }
  solvedGates(): number[] { return this.state.solvedCases.map((n) => this.cases.find((c) => c.n === n)?.gate ?? n); }
  addNote(text: string, meta: string): void { this.state.notebook.push({ at: Date.now(), text, meta }); save(this.state); }
}
