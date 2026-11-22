/**
 * Wspólny stan „Akt Lessu": liczniki społeczności, rejestr na żywo, nucenie w południe.
 * Zero danych osobowych: identyfikator gracza to skrót ziarna (nieodwracalny), nie zapisujemy IP ani adresów.
 *
 * API (JSON, CORS na ALLOWED_ORIGIN):
 *   POST /event   { who, type, gate?, id?, option?, seconds?, pledged?, hour? }   type: start | pwa | solved | gesture | rite | reading_back | seventh_empty | choice | reply
 *   GET  /stats   → { players, gates:{n:{solved,gesture}}, seventh:{empty,total}, choices:{id:{option:count}}, hum:{now,total} }
 *   POST /hum     { who }                               nucenie teraz (TTL 90 s); GET /stats zwraca ilu naraz
 *   GET  /rejestr → { active, header, lines, updatedAt }
 *   PUT  /rejestr (Authorization: Bearer ADMIN_TOKEN) { active, header, lines }
 *   GET  /pokoj/<kod>  (Upgrade: websocket)  pokój dwóch telefonów: każda wiadomość idzie do drugiego gniazda; najwyżej dwa gniazda; nic nie zapisywane
 */
export interface Env { STATS: DurableObjectNamespace; ROOM: DurableObjectNamespace; ALLOWED_ORIGIN: string; ADMIN_TOKEN?: string }

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
    const room = /^\/pokoj\/([a-z0-9]{4,8})$/i.exec(url.pathname);
    if (room) {
      if (req.headers.get("upgrade")?.toLowerCase() !== "websocket") return json({ error: "tu jest tylko WebSocket" }, origin, 426);
      return env.ROOM.get(env.ROOM.idFromName(room[1].toLowerCase())).fetch(req);
    }
    const id = env.STATS.idFromName("global");
    const stub = env.STATS.get(id);
    const res = await stub.fetch(req);
    const body = await res.text();
    return new Response(body, { status: res.status, headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": origin, "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, PUT, OPTIONS", "cache-control": "no-store" } });
  },
};

type Counts = { players: Record<string, number>; gates: Record<string, { solved: number; gesture: number }>; seventh: { empty: number; total: number }; choices: Record<string, Record<string, number>>; humTotal: number; rites?: Record<string, { n: number; pledged: number; seconds: number; hours: number[] }>; pwa?: number; readingsBack?: number };
const empty = (): Counts => ({ players: {}, gates: {}, seventh: { empty: 0, total: 0 }, choices: {}, humTotal: 0, rites: {}, pwa: 0, readingsBack: 0 });

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
      return ok({ players: Object.keys(counts.players).length, gates: counts.gates, seventh: counts.seventh, choices: counts.choices, hum: { now: humNow, total: counts.humTotal }, rites: counts.rites ?? {}, pwa: counts.pwa ?? 0, readingsBack: counts.readingsBack ?? 0 });
    }
    if (url.pathname === "/event" && req.method === "POST") {
      const b = (await req.json().catch(() => null)) as { who?: string; type?: string; gate?: number; id?: string; option?: string; seconds?: number; pledged?: number; hour?: number } | null;
      if (!b || typeof b.who !== "string" || !/^[0-9a-f]{8,16}$/.test(b.who) || typeof b.type !== "string") return ok({ error: "zły wpis" }, 400);
      counts.players[b.who] = now;
      const key = `${b.who}:${b.type}:${b.gate ?? ""}:${b.id ?? ""}`;
      if (seen[key]) return ok({ ok: true, dup: true });
      seen[key] = 1;
      if (b.type === "start") { /* tylko obecność gracza, policzona wyżej */ }
      else if (b.type === "pwa") { counts.pwa = (counts.pwa ?? 0) + 1; }
      else if (b.type === "reading_back") { counts.readingsBack = (counts.readingsBack ?? 0) + 1; }
      else if (b.type === "rite" && b.gate && b.gate >= 1 && b.gate <= 7) {
        // lejek obrzędów: liczba, ile „na słowo", suma sekund, rozkład godzin; bez identyfikatorów (seen zapobiega podwójnemu liczeniu tej samej bramy)
        const rr = ((counts.rites ??= {})[String(b.gate)] ??= { n: 0, pledged: 0, seconds: 0, hours: Array(24).fill(0) });
        rr.n += 1; if (b.pledged) rr.pledged += 1; rr.seconds += Math.max(0, Math.min(3600, Number(b.seconds) || 0)); const hr = Number(b.hour); if (hr >= 0 && hr < 24) rr.hours[hr] += 1;
      }
      else if ((b.type === "solved" || b.type === "gesture") && b.gate && b.gate >= 1 && b.gate <= 7) { const g = (counts.gates[String(b.gate)] ??= { solved: 0, gesture: 0 }); g[b.type] += 1; }
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


/**
 * Pokój dwóch telefonów. Dwa gniazda WebSocket (hibernowane: nie płaci się za czekanie), każda wiadomość (do 2 KB)
 * trafia do drugiego gniazda bez zaglądania w treść. Przy wejściu i wyjściu obaj dostają {"t":"peers","n":liczba}.
 * Trzecie gniazdo jest odrzucane. Nic nie jest zapisywane: pokój znika, gdy oba telefony się rozłączą.
 */
export class Room {
  state: DurableObjectState;
  constructor(state: DurableObjectState) { this.state = state; }
  async fetch(req: Request): Promise<Response> {
    if (this.state.getWebSockets().length >= 2) return new Response(JSON.stringify({ error: "pokój pełny" }), { status: 409 });
    const pair = new WebSocketPair(); const [client, server] = [pair[0], pair[1]];
    this.state.acceptWebSocket(server);
    this.broadcast(null, JSON.stringify({ t: "peers", n: this.state.getWebSockets().length }));
    return new Response(null, { status: 101, webSocket: client });
  }
  broadcast(from: WebSocket | null, msg: string): void {
    for (const ws of this.state.getWebSockets()) { if (ws === from) continue; try { ws.send(msg); } catch { /* gniazdo już zamknięte */ } }
  }
  webSocketMessage(ws: WebSocket, msg: string | ArrayBuffer): void {
    if (typeof msg !== "string" || msg.length > 2048) return;
    this.broadcast(ws, msg);
  }
  webSocketClose(ws: WebSocket): void { try { ws.close(); } catch { /* */ } this.broadcast(ws, JSON.stringify({ t: "peers", n: Math.max(0, this.state.getWebSockets().length - 1) })); }
  webSocketError(ws: WebSocket): void { this.webSocketClose(ws); }
}
