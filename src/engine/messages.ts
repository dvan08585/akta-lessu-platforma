/** Wiadomości od postaci w czasie rzeczywistym (wzór: Lifeline). Zdarzenie w grze planuje wiadomość z opóźnieniem; „pomiń czekanie" jest zawsze dostępne. */
import type { SaveState } from "./types";
export interface MessageRule { id: string; after: string; delayMin: number; from: string; text: string; reply?: string[] }
export interface Inbox { scheduled: Record<string, number>; read: string[]; replies: Record<string, number> }

export function ensureInbox(s: SaveState & { inbox?: Inbox }): Inbox { if (!s.inbox) s.inbox = { scheduled: {}, read: [], replies: {} }; return s.inbox; }

/** Zdarzenia, które już zaszły: case:N, gesture:ID, interlude:ID, start. */
export function events(s: SaveState): Set<string> {
  const e = new Set<string>(["start"]);
  s.solvedCases.forEach((n) => e.add(`case:${n}`));
  s.interludesDone.forEach((id) => e.add(`interlude:${id}`));
  if (s.sawFooter) e.add("footer");
  if (s.leftSeventhEmpty) e.add("finale");
  return e;
}
/** Zaplanuj wiadomości, których zdarzenie zaszło, a nie są jeszcze zaplanowane. */
export function schedule(s: SaveState & { inbox?: Inbox }, rules: MessageRule[], now = Date.now()): void {
  const inbox = ensureInbox(s); const ev = events(s);
  for (const r of rules) if (ev.has(r.after) && inbox.scheduled[r.id] === undefined) inbox.scheduled[r.id] = now + r.delayMin * 60000;
}
export function due(s: SaveState & { inbox?: Inbox }, rules: MessageRule[], now = Date.now()): MessageRule[] {
  const inbox = ensureInbox(s);
  return rules.filter((r) => inbox.scheduled[r.id] !== undefined && inbox.scheduled[r.id] <= now).sort((a, b) => inbox.scheduled[a.id] - inbox.scheduled[b.id]);
}
export function pending(s: SaveState & { inbox?: Inbox }, rules: MessageRule[], now = Date.now()): MessageRule[] {
  const inbox = ensureInbox(s);
  return rules.filter((r) => inbox.scheduled[r.id] !== undefined && inbox.scheduled[r.id] > now);
}
export function unreadCount(s: SaveState & { inbox?: Inbox }, rules: MessageRule[], now = Date.now()): number {
  const inbox = ensureInbox(s); return due(s, rules, now).filter((r) => !inbox.read.includes(r.id)).length;
}
