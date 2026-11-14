/**
 * Klucze między ludźmi, weryfikowalne bez serwera.
 * Każdy token = treść + 2 znaki sumy kontrolnej (SHA-256). Losowy ciąg przechodzi z prawdopodobieństwem 1/256.
 * To nie jest kryptografia obronna: to zamek na pamiętnik, wystarczający, żeby „abcdef0" nie otwierało finału.
 */
async function sha(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function withCheck(body: string): Promise<string> { return body + (await sha("akta-lessu:chk:" + body)).slice(0, 2); }
export async function verifyCheck(token: string): Promise<boolean> {
  const t = token.trim().toLowerCase();
  if (t.length < 3) return false;
  const body = t.slice(0, -2);
  return (await withCheck(body)) === t;
}

/**
 * Połowa klucza (sprawa 7): „k" + 4 znaki z ziarna + 2 kontrolne = 7. Prefiks „k" odróżnia ją od odczytu wzgórza (cyfra 1–7),
 * więc własny odczyt z karty NIE otwiera finału. Bez serwera to nadal zamek na pamiętnik: pełną obietnicę daje dopiero wydanie przez Worker.
 */
export async function halfKey(seed: string): Promise<string> {
  return withCheck("k" + (await sha("akta-lessu:pair:" + seed)).slice(0, 4));
}
export function looksLikeHalfKey(v: string): boolean { return /^k[0-9a-f]{6}$/i.test(v.trim()); }

/** Mapa 5/7: dwa wzgórza, na których zawieszka TEGO gracza milczy. Deterministyczne z ziarna. Nigdy 4 (pierwsza sprawa) ani 7 (finał). */
export async function silentHills(seed: string): Promise<[number, number]> {
  const pool = [1, 2, 3, 5, 6];
  const h = await sha("akta-lessu:silent:" + seed);
  const a = parseInt(h.slice(0, 2), 16) % pool.length;
  let b = parseInt(h.slice(2, 4), 16) % (pool.length - 1);
  if (b >= a) b += 1;
  return [pool[a], pool[b]].sort((x, y) => x - y) as [number, number];
}

/** Odczyt cudzej zawieszki: token dla wzgórza, które u dawcy reaguje. Format: <wzgórze><4 hex><2 kontrolne> = 7 znaków. */
export async function readingToken(seed: string, hill: number): Promise<string> {
  return withCheck(String(hill) + (await sha(`akta-lessu:reading:${seed}:${hill}`)).slice(0, 4));
}
export function parseReading(token: string): { hill: number; token: string } | null {
  const t = token.trim().toLowerCase();
  if (!/^[1-7][0-9a-f]{6}$/.test(t)) return null;
  return { hill: Number(t[0]), token: t };
}
