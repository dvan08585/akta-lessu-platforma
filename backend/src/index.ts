/**
 * Wspólny stan „Akt Lessu": liczniki społeczności, rejestr na żywo, nucenie w południe.
 * Zero danych osobowych: identyfikator gracza to skrót ziarna (nieodwracalny), nie zapisujemy IP ani adresów.
 *
 * API (JSON, CORS na ALLOWED_ORIGIN):
 *   POST /event   { who, type, gate?, id?, option? }   type: solved | gesture | seventh_empty | choice | reply
 *   GET  /stats   → { players, gates:{n:{solved,gesture}}, seventh:{empty,total}, choices:{id:{option:count}}, hum:{now,total} }
 *   POST /hum     { who }                               nucenie teraz (TTL 90 s); GET /stats zwraca ilu naraz
 *   GET  /rejestr → { active, header, lines, updatedAt }
 *   PUT  /rejestr (Authorization: Bearer ADMIN_TOKEN) { active, header, lines }
 */
export interface Env { STATS: DurableObjectNamespace; ALLOWED_ORIGIN: string; ADMIN_TOKEN?: string }

const json = (data: unknown, origin: string, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin, "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, PUT, OPTIONS", "cache-control": "no-store" } });

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || "*";
    if (req.method === "OPTIONS") return json({}, origin);
    const url = new URL(req.url);
    if (url.pathname === "/rejestr" && req.method === "PUT") {
      const auth = req.headers.get("authorization") || "";
      if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: "brak uprawnień" }, origin, 401);
    }
    const id = env.STATS.idFromName("global");
    const stub = env.STATS.get(id);
    const res = await stub.fetch(req);
    const body = await res.text();
    return new Response(body, { status: res.status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin, "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, PUT, OPTIONS", "cache-control": "no-store" } });
  },
};

type Counts = { players: Record<string, number>; gates: Record<string, { solved: number; gesture: number }>; seventh: { empty: number; total: number }; choices: Record<string, Record<string, number>>; humTotal: number };
const empty = (): Counts => ({ players: {}, gates: {}, seventh: { empty: 0, total: 0 }, choices: {}, humTotal: 0 });

export class Stats {
  state: DurableObjectState;
  constructor(state: DurableObjectState) { this.state = state; }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const counts = (await this.state.storage.get<Counts>("counts")) ?? empty();
    const seen = (await this.state.storage.get<Record<string, number>>("seen")) ?? {}; // who+type+gate -> 1, żeby jeden gracz liczył się raz
    const hum = (await this.state.storage.get<Record<string, number>>("hum")) ?? {};
    const now = Date.now();
    const ok = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status });

    if (url.pathname === "/stats" && req.method === "GET") {
      const humNow = Object.values(hum).filter((t) => now - t < 90000).length;
      return ok({ players: Object.keys(counts.players).length, gates: counts.gates, seventh: counts.seventh, choices: counts.choices, hum: { now: humNow, total: counts.humTotal } });
    }
    if (url.pathname === "/event" && req.method === "POST") {
      const b = (await req.json().catch(() => null)) as { who?: string; type?: string; gate?: number; id?: string; option?: string } | null;
      if (!b || typeof b.who !== "string" || !/^[0-9a-f]{8,16}$/.test(b.who) || typeof b.type !== "string") return ok({ error: "zły wpis" }, 400);
      counts.players[b.who] = now;
      const key = `${b.who}:${b.type}:${b.gate ?? ""}:${b.id ?? ""}`;
      if (seen[key]) return ok({ ok: true, dup: true });
      seen[key] = 1;
      if ((b.type === "solved" || b.type === "gesture") && b.gate && b.gate >= 1 && b.gate <= 7) { const g = (counts.gates[String(b.gate)] ??= { solved: 0, gesture: 0 }); g[b.type] += 1; }
      else if (b.type === "seventh_empty") { counts.seventh.empty += 1; counts.seventh.total += 1; }
      else if (b.type === "seventh_filled") { counts.seventh.total += 1; }
      else if ((b.type === "choice" || b.type === "reply") && b.id && b.option !== undefined) { const c = (counts.choices[b.id.slice(0, 40)] ??= {}); const o = String(b.option).slice(0, 20); c[o] = (c[o] ?? 0) + 1; }
      else return ok({ error: "nieznany typ" }, 400);
      await this.state.storage.put("counts", counts); await this.state.storage.put("seen", seen);
      return ok({ ok: true });
    }
    if (url.pathname === "/hum" && req.method === "POST") {
      const b = (await req.json().catch(() => null)) as { who?: string } | null;
      if (!b || typeof b.who !== "string" || !/^[0-9a-f]{8,16}$/.test(b.who)) return ok({ error: "zły wpis" }, 400);
      if (!hum[b.who] || now - hum[b.who] > 90000) counts.humTotal += 1;
      hum[b.who] = now;
      for (const k of Object.keys(hum)) if (now - hum[k] > 3600000) delete hum[k];
      await this.state.storage.put("hum", hum); await this.state.storage.put("counts", counts);
      return ok({ ok: true, now: Object.values(hum).filter((t) => now - t < 90000).length });
    }
    if (url.pathname === "/rejestr" && req.method === "GET") {
      return ok((await this.state.storage.get("rejestr")) ?? { active: false, header: "", lines: [], updatedAt: "" });
    }
    if (url.pathname === "/rejestr" && req.method === "PUT") {
      const b = (await req.json().catch(() => null)) as { active?: boolean; header?: string; lines?: string[] } | null;
      if (!b || !Array.isArray(b.lines)) return ok({ error: "zły wpis" }, 400);
      const rec = { active: !!b.active, header: String(b.header ?? "").slice(0, 200), lines: b.lines.slice(0, 12).map((l) => String(l).slice(0, 200)), updatedAt: new Date().toISOString() };
      await this.state.storage.put("rejestr", rec);
      return ok(rec);
    }
    return ok({ error: "nie ma takiej ścieżki" }, 404);
  }
}
