/** Mikro-akta: jeden dokument i jedno pytanie dziennie, to samo dla wszystkich (NYT: jeden puzzle, jedna rozmowa). */
export interface Mikro { id: string; title: string; doc: string; q: string; options: string[]; answer: number }
export function dayKey(d = new Date()): string { return d.toISOString().slice(0, 10); }
export function dayIndex(d = new Date()): number { return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000); }
export function pickDaily(pool: Mikro[], d = new Date()): Mikro { return pool[dayIndex(d) % pool.length]; }
