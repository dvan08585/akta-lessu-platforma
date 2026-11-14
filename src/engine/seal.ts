import type { CaseData } from "./types";
import { normalizeCode, sha256 } from "./unlock";

/** Klucz pieczęci z kodu rozdziału: ten sam kod, który otwiera rozdział, otwiera akta. */
export async function sealKeyFromCode(code: string): Promise<string> { return sha256("akta-lessu:seal:" + normalizeCode(code)); }

const b64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
/** Odpieczętowanie ładunku AES-GCM kluczem (hex). Zły klucz = null, bez wyjątku. */
export async function unseal(payload: { iv: string; ct: string }, keyHex: string): Promise<CaseData | null> {
  try {
    const raw = Uint8Array.from(keyHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
    const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(payload.iv) }, key, b64(payload.ct));
    return JSON.parse(new TextDecoder().decode(plain)) as CaseData;
  } catch { return null; }
}
