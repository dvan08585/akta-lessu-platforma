import { h, go, toast, back, next, onLeave, grabMedia, listen } from "./dom";
import { topbar, addrText, crumb } from "./views";
import type { App } from "../app";
import { save } from "../engine/state";
import { detectPitch, closeness, PitchSmoother } from "../engine/pitch";
import { detectDuet } from "../engine/duet";
import { sendEvent, fetchStats, sendHum } from "../engine/wspolny";
import { plural } from "./views";
import { flint, flintSeed, icon } from "./icons";

export interface Interlude {
  id: string; type: "amor" | "talk" | "plate" | "beat" | "still" | "breath" | "fire" | "dark" | "earth" | "spectro" | "compass" | "whistle" | "touch7" | "hold" | "mirror" | "trace" | "steps" | "duet"; after?: number; gate?: number; title: string; level?: string; place?: "brama" | "rozmowa" | "apokryf" | "laboratorium";
  /** Obrzęd bramy: formuła otwarcia, słowo bramy (gest koduje treść), minuty, co sztywne, czego wymaga ciało, formuła zamknięcia (ręka geolożki). */
  rite?: { opening: string; word: string; minutes: number; rigid: string; body: string; closing: string };
  secret?: string[]; steps?: number;
  cycles?: number; inhale?: number; exhale?: number;
  /** Instrukcja osobnym głosem (didaskalia), oddzielona od prozy w intro. */
  cue?: string;
  audio?: string; q?: string; options?: string[]; answer?: number; seconds?: number;
  lines?: string[];
  intro?: string; person?: string; questions?: { q: string; a: string }[]; lie?: number; reveal?: string; wrong?: string;
  targetHz?: number; tolerance?: number;
}

/** Kopia przerywnika z podstawionym znacznikiem rodzaju `{f|m}` we wszystkich polach tekstowych czytanych przez gracza. */
export function withAddress(app: App, i: Interlude): Interlude {
  const t = (s: string | undefined) => (s === undefined ? s : addrText(app, s));
  const arr = (a: string[] | undefined) => a?.map((s) => addrText(app, s));
  return {
    ...i,
    intro: t(i.intro), cue: t(i.cue), reveal: t(i.reveal), wrong: t(i.wrong), q: t(i.q),
    secret: arr(i.secret), lines: arr(i.lines), options: arr(i.options),
    questions: i.questions?.map((qa) => ({ q: addrText(app, qa.q), a: addrText(app, qa.a) })),
    rite: i.rite ? { ...i.rite, opening: addrText(app, i.rite.opening), rigid: addrText(app, i.rite.rigid), body: addrText(app, i.rite.body), closing: addrText(app, i.rite.closing) } : undefined,
  };
}

/** Początek odpowiedzi do listy wyboru kłamstwa: gracz widzi, o które zdanie chodzi, bez przewijania w górę. */
function excerpt(t: string, max = 64): string { if (t.length <= max) return t; const cut = t.slice(0, max); return cut.slice(0, Math.max(cut.lastIndexOf(" "), 30)).replace(/[.,;:!?]+$/, "") + "…"; }
export function interludeAvailable(app: App, i: Interlude): boolean {
  if (app.state.testMode) return true;
  if (i.place === "laboratorium") return false;
  // obrzęd siódmej bramy (pięć palców dwojga) jest drugą drogą do rejestru, więc otwiera się po sześciu bramach, nie po rozwiązaniu sprawy 7
  if (i.id === "siedem-palcow") return app.passed() >= 6;
  if (i.gate !== undefined) { const c = app.caseForGate(i.gate); return !!c && (app.state.solvedCases.includes(c.n) || app.state.testMode); }
  return (i.after ?? 0) <= app.passed();
}
export function interludesFor(app: App): Interlude[] {
  return (app.interludes as Interlude[]).filter((i) => interludeAvailable(app, i)).sort((a, b) => (a.after ?? a.gate ?? 0) - (b.after ?? b.gate ?? 0));
}

export function viewInterlude(app: App, id: string): HTMLElement {
  const found = (app.interludes as Interlude[]).find((i) => i.id === id);
  const sec = h("section", { class: "fade-in interlude" }, topbar(app, "#/mapa"));
  if (!found) { sec.append(h("p", {}, "Nie ma takiego przerywnika.")); return sec; }
  const it: Interlude = withAddress(app, found);
  sec.append(crumb(it.place === "rozmowa" ? "Rozmowa" : it.place === "apokryf" ? "Apokryf" : it.gate !== undefined ? `Brama ${it.gate}` : "Między sprawami"));
  if (!interludeAvailable(app, it)) { sec.append(h("h2", {}, it.title), h("p", { class: "muted" }, it.gate !== undefined ? `Najpierw rozpoznaj bramę ${it.gate} dokumentami.` : `Po ${it.after} ${plural(it.after ?? 0, "przebytej bramie", "przebytych bramach", "przebytych bramach")}.`), h("div", { class: "verdict" }, back())); return sec; }
  const done = app.state.interludesDone.includes(it.id);
  let alive = true; onLeave(() => { alive = false; });
  const acs: AudioContext[] = []; onLeave(() => { for (const a of acs) a.close().catch(() => { /* */ }); });
  sec.append(h("p", { class: "kicker" }, it.place === "apokryf" ? "Apokryf" : it.place === "rozmowa" ? "Rozmowa" : it.gate !== undefined ? `Obrzęd bramy ${it.gate}` : "Między sprawami"), h("h2", {}, it.title));
  if (it.rite && !done) { renderThreshold(); return sec; }
  renderBody();
  return sec;

  /**
   * Próg obrzędu: kontrakt frustracji. Gracz wie z góry, ile to zajmie, co jest sztywne, czego wymaga ciało,
   * że nie ma kary za nieudaną próbę i że nic nie jest nagrywane. Czytanie kontraktu to pierwszy krok obrzędu.
   */
  function renderThreshold() {
    const r = it.rite!;
    const box = h("div", { class: "rite" },
      h("p", { class: "quote" }, r.opening),
      h("p", { class: "rite-word" }, "Słowo tej bramy: ", h("strong", {}, r.word)),
      h("ul", { class: "rite-contract" },
        h("li", {}, `Czas: około ${r.minutes === 1 ? "minuty" : r.minutes + " minut"}.`),
        h("li", {}, `Sztywne: ${r.rigid}`),
        h("li", {}, `Ciało: ${r.body}.`),
        h("li", {}, "Nie ma kary za nieudaną próbę. Jest tylko inny zapis."),
        h("li", {}, "Trzy drogi liczą się tak samo: czujnik, drugi klucz, na słowo."),
        h("li", {}, "Nic nie jest nagrywane ani wysyłane. Liczby liczą się w telefonie i znikają.")),
      h("div", { class: "verdict" }, h("button", { class: "primary", onclick: () => { try { navigator.vibrate?.(40); } catch { /* */ } box.remove(); renderBody(); armPledge(); } }, "Wchodzę"), back("Jeszcze nie")));
    sec.append(box);
  }
  /** Sufit porażki: po trzykrotności czasu obrzędu bez domknięcia brama „drga" i można ją przyjąć na słowo. Koszt zmienia się z sensorycznego na honorowy. */
  function armPledge() {
    const r = it.rite!; const ms = Math.max(90000, r.minutes * 60000 * 3);
    setTimeout(() => {
      if (!alive || app.state.interludesDone.includes(it.id)) return;
      const box = h("div", { class: "gatebox pledge" }, h("p", { class: "kicker" }, "Brama drgnęła"),
        h("p", { class: "muted" }, "Nie otworzyła się. Czujnik nie jest sędzią: możesz spróbować jeszcze raz albo przyjąć tę bramę na słowo. W zeszycie będzie to widać. To nie wstyd, to inny zapis."),
        h("div", { class: "verdict" }, h("button", { onclick: () => { const v = h("div"); sec.append(v); box.remove(); reveal(v, `${it.title}: przyjęto na słowo.`); } }, "Przyjmuję na słowo")));
      sec.append(box);
    }, ms);
  }
  function renderBody() {
  renderKind();
  // Zawsze da się wyjść bez domykania: cichy „Wróć do mapy" na dole, o ile ekran nie ma już własnego.
  if (!done && !sec.querySelector("button.back")) sec.append(h("div", { class: "verdict exit" }, back()));
  }
  function renderKind() {
  if (it.type === "amor") renderAmor(); else if (it.type === "talk") renderTalk(); else if (it.type === "beat") renderBeat(); else if (it.type === "still") renderStill(); else if (it.type === "breath") renderBreath(); else if (it.type === "fire") renderFire(); else if (it.type === "dark") renderDark(); else if (it.type === "earth") renderEarth(); else if (it.type === "spectro") renderSpectro(); else if (it.type === "compass") renderCompass(); else if (it.type === "whistle") renderWhistle(); else if (it.type === "touch7") renderTouch7(); else if (it.type === "hold") renderHold(); else if (it.type === "mirror") renderMirror(); else if (it.type === "trace") renderTrace(); else if (it.type === "steps") renderSteps(); else if (it.type === "duet") renderDuet(); else renderPlate();
  }

  /**
   * Odsłona po geście albo poprawnej odpowiedzi, jedna dla wszystkich przerywników:
   * sterowanie (przyciski, suwaki, wybory) odpływa, ciepło przechodzi przez ekran jak przy zawieszce, iskry lessu,
   * a tekst przyjeżdża na środek ekranu z jednym przyciskiem „dalej". Brama przebyta prowadzi do swojej bramy.
   */
  /** Słowo bramy pisane palcem: ślad na ekranie, nic nie zapisywane, pisma nikt nie ocenia. Liczy się długość kreski, nie kształt. */
  function writeWord(verdict: HTMLElement, word: string, done: () => void) {
    const canvas = h("canvas", { class: "write-pad", width: "600", height: "240" }) as HTMLCanvasElement;
    const box = h("div", { class: "write-word fade-in" }, h("p", { class: "kicker" }, "Słowo tej bramy"), h("p", { class: "big-word" }, word), h("p", { class: "muted" }, "Napisz je palcem. Jak wyjdzie, tak wyjdzie; nikt tego nie sprawdza."), canvas,
      h("div", { class: "verdict" }, h("button", { class: "ghost", onclick: () => { box.remove(); done(); } }, "Bez pisania")));
    verdict.replaceChildren(box);
    const ctx = canvas.getContext("2d")!; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = (getComputedStyle(document.documentElement).getPropertyValue("--sand") || "#c9a86a").trim();
    let drawing = false, len = 0, lx = 0, ly = 0, finished = false;
    const pos = (e: PointerEvent): [number, number] => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) * canvas.width / r.width, (e.clientY - r.top) * canvas.height / r.height]; };
    canvas.addEventListener("pointerdown", (e) => { drawing = true; [lx, ly] = pos(e); try { canvas.setPointerCapture(e.pointerId); } catch { /* */ } });
    canvas.addEventListener("pointermove", (e) => { if (!drawing) return; const [x, y] = pos(e); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.stroke(); len += Math.hypot(x - lx, y - ly); lx = x; ly = y; });
    const up = () => { drawing = false; if (finished || len < 400 + word.length * 50) return; finished = true; try { navigator.vibrate?.(40); } catch { /* */ } setTimeout(() => { box.classList.add("hide-out"); setTimeout(() => { box.remove(); done(); }, 500); }, 700); };
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);
  }
  function reveal(verdict: HTMLElement, note: string, extra: HTMLElement[] = []) {
    sec.querySelector(".verdict.exit")?.remove(); // odsłona ma własny przycisk; bez tego były dwa
    sec.querySelectorAll<HTMLElement>("button, input, select, label, .opts, .verdict, .q, .row, .talk-qs, p.mono, .breath-phase, p.faint").forEach((el) => {
      if (el.closest(".topbar") || verdict.contains(el)) return; el.classList.add("hide-out");
    });
    setTimeout(() => sec.querySelectorAll<HTMLElement>(".hide-out").forEach((el) => (el.style.display = "none")), 500);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Obrzęd: trzy sekundy ciemności i ciepła, jedna wibracja, potem jedno zdanie ręką geolożki. Bez iskier, bez komunikatów.
    const rite = !!it.rite;
    const hushMs = rite && !reduced ? 3000 : 0;
    if (rite && !reduced) { const hush = h("div", { class: "hush" }); document.body.append(hush); setTimeout(() => hush.classList.add("out"), hushMs); setTimeout(() => hush.remove(), hushMs + 900); }
    else if (!reduced) { const glow = h("div", { class: "glow soft" }); glow.style.setProperty("--cx", "50%"); glow.style.setProperty("--cy", "55%"); document.body.append(glow); setTimeout(() => glow.classList.add("out"), 900); setTimeout(() => glow.remove(), 1900); }
    try { navigator.vibrate?.(rite ? 120 : [60, 80, 160]); } catch { /* */ }
    const sol = h("div", { class: "solution fade-in" });
    if (rite) { const r = it.rite!; sol.append(h("article", { class: "doc hand rite-closing" }, h("h4", {}, "Zeszyt geolożki"), h("div", { class: "src" }, `Obrzęd bramy ${it.gate}. Słowo: ${r.word}.${note.includes("na słowo") ? " Przyjęto na słowo." : ""}`), h("p", {}, r.closing))); }
    sol.append(h("p", {}, it.reveal!));
    const to = it.gate !== undefined ? `#/brama/${it.gate}` : "#/mapa";
    const showSolution = () => { verdict.replaceChildren(sol, ...extra, h("div", { class: "verdict" }, next(it.gate !== undefined ? "Wróć do bramy" : "Ruszaj dalej", to))); sol.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); };
    // Obrzęd: po ciemności gracz pisze słowo bramy palcem (efekt wykonania: pamięta się to, co się zrobiło, nie to, co się przeczytało). Potem zapis geolożki.
    if (rite) setTimeout(() => writeWord(verdict, it.rite!.word, showSolution), hushMs + 400);
    else setTimeout(showSolution, reduced ? 0 : 700);
    finish(note);
  }

  function newAC(): AudioContext { const a = new AudioContext(); acs.push(a); return a; }

  function finish(note: string) {
    if (!app.state.interludesDone.includes(it.id)) { app.state.interludesDone.push(it.id); app.addNote(note, it.gate !== undefined ? `brama ${it.gate} przebyta` : "między sprawami"); save(app.state); if (it.gate !== undefined) { sendEvent(app.cfg.backendUrl, app.state, { type: "gesture", gate: it.gate }); } }
  }

  function renderAmor() {
    const art = h("div", { class: "amor-text" });
    it.lines!.forEach((l, i) => { const p = h("p", { style: `animation-delay:${i * 1.2}s` }, l); art.append(p); });
    sec.append(art, h("div", { class: "verdict" }, back(), next("Ruszaj dalej", "#/mapa")));
    finish(`${it.title}.`);
  }

  function renderTalk() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const asked = new Set<number>();
    const log = h("div", { class: "talk-log" });
    const qs = h("div", { class: "talk-qs" });
    const verdict = h("div");
    const tries = (app.state.talkTries ??= {}); const tr = (tries[it.id] ??= { n: 0, until: 0 }); tr.x ??= [];
    const LOCK_H = 12;
    if (done) {
      // Rozpoznane: cała rozmowa do ponownego przeczytania, kłamstwo zaznaczone.
      it.questions!.forEach((q, i) => log.append(h("p", { class: "you" }, q.q), h("p", { class: i === it.lie ? "them lie" : "them" }, h("strong", {}, it.person + ": "), q.a)));
      sec.append(log, h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
      return;
    }
    it.questions!.forEach((q, i) => {
      const b = h("button", { class: "ghost" }, q.q);
      b.addEventListener("click", () => {
        if (asked.has(i)) return; asked.add(i); b.disabled = true;
        log.append(h("p", { class: "you" }, q.q), h("p", { class: "them" }, h("strong", {}, it.person + ": "), q.a));
        log.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        if (asked.size === it.questions!.length) renderPick();
      });
      qs.append(b);
    });
    sec.append(log, qs, verdict);
    if (tr.until > Date.now()) { renderLocked(); }
    function renderLocked() {
      const hrs = Math.max(1, Math.ceil((tr.until - Date.now()) / 3600000));
      qs.replaceChildren(h("div", { class: "callout", role: "status" }, h("span", { class: "ico" }, icon("talk")), h("p", {}, `${it.person} nie ma dziś więcej czasu. Trzy razy wskazane na ślepo to nie rozmowa. Wróć za ${hrs} ${plural(hrs, "godzinę", "godziny", "godzin")} i przeczytaj rozmowę jeszcze raz.`)));
    }
    function renderPick() {
      if (tr.until > Date.now()) { renderLocked(); return; }
      if (tr.until && tr.until <= Date.now()) { tr.n = 0; tr.until = 0; tr.x = []; }
      qs.replaceChildren(h("p", { class: "muted" }, `Które zdanie było kłamstwem? ${tr.n ? (3 - tr.n === 1 ? "Została jedna próba." : "Zostały dwie próby.") : "Masz trzy próby."}`));
      it.questions!.forEach((q, i) => {
        const ruled = tr.x!.includes(i); // już wskazane i odrzucone: zostaje wykreślone, nie da się kliknąć drugi raz
        qs.append(h("button", { class: ruled ? "ruled" : "", disabled: ruled, "aria-disabled": ruled ? "true" : "false", onclick: () => {
          sendEvent(app.cfg.backendUrl, app.state, { type: "choice", id: it.id, option: i });
          if (i === it.lie) {
            tr.n = 0; tr.until = 0; save(app.state);
            log.querySelectorAll(".them")[i]?.classList.add("lie");
            reveal(verdict, `${it.title}: kłamstwo rozpoznane.`);
            fetchStats(app.cfg.backendUrl).then((st) => { const c = st?.choices[it.id]; if (!c) return; const total = Object.values(c).reduce((a, b) => a + b, 0); if (total < 5) return; const mine = c[String(i)] ?? 0; setTimeout(() => verdict.append(h("p", { class: "faint" }, `${Math.round((mine / total) * 100)}% biegłych wskazało to samo zdanie. ${total} rozmów.`)), 1200); });
          } else {
            tr.n += 1;
            if (tr.n >= 3) { tr.until = Date.now() + LOCK_H * 3600000; save(app.state); renderLocked(); }
            else {
              tr.x!.push(i); save(app.state); renderPick();
              // Odpowiedź rozmówcy na błędne wskazanie: osobna karta nad opcjami, z tym, co wskazano i ile zostało; odrzucona opcja jest wykreślona niżej.
              const card = h("div", { class: "talk-reply", role: "status" },
                h("p", { class: "kicker" }, `${it.person} odpowiada`),
                h("p", { class: "said" }, it.wrong!),
                h("p", { class: "faint" }, `Wskazane: odpowiedź ${i + 1}. To nie było kłamstwo. ${3 - tr.n === 1 ? "Została jedna próba." : "Zostały dwie próby."}`));
              qs.prepend(card); card.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }
        } }, `Odpowiedź ${i + 1}`, h("small", {}, excerpt(q.a))));
      });
    }
  }

  /** Dudnienie różnicowe: dwa tony w słuchawkach, 18 Hz powstaje w głowie. */
  function renderBeat() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const audio = h("audio", { controls: true, preload: "none", src: import.meta.env.BASE_URL + it.audio! }) as HTMLAudioElement;
    // Wibracja w rytmie 18 Hz (Android; iOS Safari nie ma Vibration API): 28 ms + 28 ms ≈ 18 Hz
    let vib: number | undefined;
    audio.addEventListener("play", () => { try { vib = window.setInterval(() => navigator.vibrate?.(Array(10).fill(28)), 600); } catch { /* */ } });
    audio.addEventListener("pause", () => { if (vib) clearInterval(vib); try { navigator.vibrate?.(0); } catch { /* */ } });
    sec.append(h("div", { class: "card" }, audio));
    // Bez słuchawek: zobaczysz. Dwie fale (200 i 218 Hz) i ich suma, zwolnione 400 razy, żeby dudnienie 18 Hz było widoczne jako powolny oddech amplitudy. Bez migania.
    const wave = h("canvas", { class: "wave", width: "600", height: "180", "aria-label": "Dwie fale i dudnienie" }) as HTMLCanvasElement;
    wave.setAttribute("aria-label", "Góra: lewe ucho, 250 Hz. Środek: prawe, 268 Hz. Dół: 18 Hz różnicy."); sec.append(wave);
    const wctx = wave.getContext("2d")!;
    const drawWave = (now: number) => {
      const t = now / 400000; // zwolnienie
      const cs = getComputedStyle(document.documentElement); const bg = cs.getPropertyValue("--bg-2").trim() || "#171511", dim = cs.getPropertyValue("--ink-dim").trim() || "#a39a86", sand = cs.getPropertyValue("--sand").trim() || "#c9a86a";
      wctx.fillStyle = bg; wctx.fillRect(0, 0, 600, 180);
      const rows: [number, number, string][] = [[250, 30, dim], [268, 90, dim], [0, 150, sand]];
      for (const [f, y, col] of rows) {
        wctx.beginPath(); wctx.strokeStyle = col; wctx.lineWidth = 1.5;
        for (let x = 0; x <= 600; x += 2) {
          const tt = t + x / 6000;
          const v = f ? Math.sin(2 * Math.PI * f * tt) : (Math.sin(2 * Math.PI * 250 * tt) + Math.sin(2 * Math.PI * 268 * tt)) / 2;
          const yy = y + v * 22; x === 0 ? wctx.moveTo(x, yy) : wctx.lineTo(x, yy);
        }
        wctx.stroke();
      }
      if (alive) requestAnimationFrame(drawWave);
    };
    if (alive) requestAnimationFrame(drawWave);
    const opts = h("div", { class: "opts", role: "radiogroup" });
    it.options!.forEach((o, i) => opts.append(h("label", {}, h("input", { type: "radio", name: "beat", value: String(i) }), o)));
    const verdict = h("div");
    const btn = h("button", { class: "primary" }, "Odpowiedz");
    btn.addEventListener("click", () => {
      const el = sec.querySelector<HTMLInputElement>('input[name="beat"]:checked'); if (!el) { toast("Najpierw posłuchaj."); return; }
      if (Number(el.value) === it.answer) { reveal(verdict, `${it.title}: usłyszane.`); }
      else toast("Posłuchaj jeszcze raz. Obie słuchawki.");
    });
    sec.append(h("div", { class: "q daily" }, h("div", { class: "qt" }, it.q!), opts), btn, verdict);
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Zimno: trzymać telefon nieruchomo. Akcelerometr mierzy drżenie rąk; każde drgnięcie cofa pasek. */
  function renderStill() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const total = it.seconds ?? 30;
    const bar = h("div", { class: "still-bar" }, h("i"));
    const fill = bar.firstElementChild as HTMLElement;
    const status = h("p", { class: "mono muted" }, "0 s");
    const temp = h("p", { class: "muted" }, "36,6°C");
    const start = h("button", { class: "primary" }, "Trzymam");
    const verdict = h("div");
    sec.append(bar, status, temp, h("div", { class: "verdict" }, start), verdict);
    let held = 0, last = 0, running = false, jitter = 0, finished = done, base = 0.12, calib: number[] = [], calibrating = false, resets = 0;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity; if (!a) return;
      const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2);
      if (last) { jitter = Math.abs(mag - last); if (calibrating) calib.push(jitter); } last = mag;
    };
    function tick() {
      if (!running) return;
      if (calibrating) { if (alive) setTimeout(tick, 100); return; }
      if (jitter > base * (2.5 + resets) + 0.08) { held = Math.max(0, held - 1.5); resets = Math.min(4, resets + 0.1); temp.textContent = "Drżysz. 33°C."; } // każde drgnięcie łagodzi próg: frustracja ma sufit
      else { held += 0.1; temp.textContent = `${(36.6 - (held / total) * 5.6).toFixed(1).replace(".", ",")}°C`; }
      fill.style.width = `${Math.min(100, (held / total) * 100)}%`; status.textContent = `${held.toFixed(0)} s`;
      if (held >= total && !finished) { finished = true; running = false; reveal(verdict, `${it.title}: wytrzymane.`); return; }
      if (alive) setTimeout(tick, 100);
    }
    start.addEventListener("click", async () => {
      try {
        const DM = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
        if (DM.requestPermission) { const r = await DM.requestPermission(); if (r !== "granted") throw new Error("denied"); }
        listen("devicemotion", onMotion as EventListener);
      } catch { toast("Bez czujnika ruchu: liczy się samo trzymanie przycisku."); }
      running = true; start.disabled = true; start.textContent = "Kalibruję…"; calibrating = true; calib = [];
      // 2 s kalibracji: mediana drgania TEJ ręki na TYM telefonie = poziom zero (progi absolutne zawodzą między urządzeniami)
      setTimeout(() => { calib.sort((a, b) => a - b); base = calib.length ? calib[Math.floor(calib.length / 2)] : 0.12; calibrating = false; start.textContent = "Nie ruszaj się"; }, 5000);
      tick();
    });
    // zapas bez czujnika: puszczenie przycisku = drgnięcie
    start.addEventListener("pointerdown", () => { jitter = 0; });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Woda: oddech w tempie 5/5 (ok. 6 oddechów na minutę). Tafla gładzi się, gdy wydech jest równy. Mikrofon opcjonalny; zapas: palec na ekranie przy wydechu. */
  function renderBreath() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const cycles = it.cycles ?? 10, tIn = (it.inhale ?? 5) * 1000, tOut = (it.exhale ?? 5) * 1000;
    const canvas = h("canvas", { class: "plate water", width: "600", height: "600", "aria-label": "Tafla wody w krypcie" }) as HTMLCanvasElement;
    const phaseEl = h("p", { class: "breath-phase" }, "…");
    const count = h("p", { class: "mono muted" }, `0 / ${cycles}`);
    const micBtn = h("button", {}, "Tafla bez mikrofonu");
    const start = h("button", { class: "primary" }, "Zacznij");
    const ear = h("p", { class: "mono muted ear" }, "tafla: nie słucha");
    const verdict = h("div");
    sec.append(canvas, phaseEl, count, ear, h("div", { class: "verdict" }, start, micBtn), h("p", { class: "faint", style: "margin-top:0.8rem" }, "Przy wydechu tafla słucha mikrofonu albo czuje palec. Nic nie jest nagrywane ani wysyłane: dźwięk liczy się w telefonie i znika."), verdict);
    const ctx = canvas.getContext("2d")!;
    let running = false, finished = done, done_cycles = 0, calm = 0, touching = false, mic: AnalyserNode | null = null, micBuf: Float32Array<ArrayBuffer> | null = null, baseline = 0.004, level = 0, noMic = false;
    canvas.addEventListener("pointerdown", () => { touching = true; }); listen("pointerup", () => { touching = false; });
    const rms = () => { if (!mic || !micBuf) return null; mic.getFloatTimeDomainData(micBuf); let s = 0; for (let i = 0; i < micBuf.length; i++) s += micBuf[i] * micBuf[i]; return Math.sqrt(s / micBuf.length); };
    let t0 = 0;
    function draw(now: number) {
      const period = tIn + tOut; const elapsed = running ? now - t0 : 0; const cyc = Math.floor(elapsed / period); const ph = elapsed % period; const inhale = ph < tIn;
      const target = inhale ? ph / tIn : 1 - (ph - tIn) / tOut; // 0..1 "pełność płuc"
      // ocena wydechu: mikrofon (szum wydechu powyżej tła) albo dotyk
      // wydech: szum nad ciszą (wygładzony, próg 1,35× tła) ALBO palec na tafli. Wskaźnik mówi, co tafla czuje.
      const lv = rms(); if (lv !== null) level = level * 0.7 + lv * 0.3;
      const heard = lv !== null && level > baseline * 1.35;
      if (running) ear.textContent = touching ? "tafla: czuje palec" : heard ? (inhale ? "tafla: słyszy (to wdech, cicho)" : "tafla: słyszy wydech") : mic ? "tafla: słucha" : "tafla: bez mikrofonu, połóż palec przy wydechu";
      if (running && !inhale) { const ok = heard || touching; calm += ok ? 0.012 : -0.006; }
      calm = Math.max(0, Math.min(1, calm));
      if (running && cyc > done_cycles) { done_cycles = cyc; count.textContent = `${Math.min(cyc, cycles)} / ${cycles}`; }
      phaseEl.textContent = !running ? "…" : inhale ? "wdech" : "wydech";
      // tafla: fale o amplitudzie malejącej z „calm”
      ctx.fillStyle = "#101a1f"; ctx.fillRect(0, 0, 600, 600);
      const amp = 18 * (1 - calm) + 1.5;
      for (let y = 40; y < 600; y += 22) {
        ctx.beginPath(); ctx.strokeStyle = `rgba(90,125,149,${0.25 + 0.5 * calm})`; ctx.lineWidth = 1.2;
        for (let x = 0; x <= 600; x += 6) { const yy = y + Math.sin(x / 38 + now / 700 + y / 50) * amp * Math.sin(now / 900 + y); x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
        ctx.stroke();
      }
      // dno widoczne, gdy spokojnie: spoiny posadzki
      ctx.globalAlpha = calm * 0.8; ctx.strokeStyle = "#c9a86a"; ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(100 * i, 80); ctx.lineTo(100 * i, 520); ctx.stroke(); ctx.beginPath(); ctx.moveTo(80, 100 * i - 20); ctx.lineTo(520, 100 * i - 20); ctx.stroke(); }
      ctx.globalAlpha = 1;
      // krąg oddechu
      const r = 60 + target * 120; ctx.beginPath(); ctx.arc(300, 300, r, 0, Math.PI * 2); ctx.strokeStyle = "#e8e0cf"; ctx.lineWidth = 2; ctx.stroke();
      if (running && cyc >= cycles && !finished) {
        running = false;
        // Liczy się oddech, nie czas: tafla musi być gładka. Bez wydechu (mikrofon) albo palca na tafli przy wydechu „calm" nie urośnie.
        if (calm >= 0.7) { finished = true; phaseEl.textContent = "cisza"; count.textContent = `${cycles} / ${cycles} · siedem sekund ciszy`; setTimeout(() => reveal(verdict, `${it.title}: siedem oddechów.`, [h("p", { class: "faint" }, "Dlaczego to działa: ", h("a", { href: "#/o-ciele" }, "co robi z tobą ta gra"))]), 7000); }
        else { calm = 0; done_cycles = 0; count.textContent = `0 / ${cycles}`; start.disabled = false; start.textContent = "Jeszcze raz"; toast("Tafla drży. Wydech ma być słyszalny albo palec na tafli."); }
      }
      if (alive) requestAnimationFrame(draw);
    }
    if (alive) requestAnimationFrame(draw);
    const begin = () => { running = true; t0 = performance.now(); calm = 0; done_cycles = 0; start.disabled = true; start.textContent = "Oddychaj"; };
    // Mikrofon prosi się sam przy starcie (jedno dotknięcie, nie dwa). Odmowa = tafla czuje palec.
    start.addEventListener("click", async () => {
      if (running) return;
      if (!mic && !noMic) {
        start.disabled = true; start.textContent = "Tafla nasłuchuje ciszy…";
        try {
          const stream = await grabMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
          const ac = newAC(); if (ac.state === "suspended") await ac.resume();
          const src = ac.createMediaStreamSource(stream); mic = ac.createAnalyser(); mic.fftSize = 2048; src.connect(mic); micBuf = new Float32Array(new ArrayBuffer(mic.fftSize * 4));
          // kalibracja: 2 s ciszy = poziom zero (progi absolutne zawodzą między telefonami)
          const samples: number[] = []; await new Promise<void>((res) => { const iv = setInterval(() => { const r = rms(); if (r !== null) samples.push(r); }, 100); setTimeout(() => { clearInterval(iv); res(); }, 2000); });
          samples.sort((a, b) => a - b); baseline = Math.max(0.0015, samples[Math.floor(samples.length / 2)] || 0.004);
          ear.textContent = "tafla: słucha"; micBtn.style.display = "none";
        } catch { noMic = true; ear.textContent = "tafla: bez mikrofonu, połóż palec przy wydechu"; toast("Bez mikrofonu: trzymaj palec na tafli, kiedy wydychasz."); }
      }
      begin();
    });
    micBtn.addEventListener("click", () => { noMic = true; mic = null; ear.textContent = "tafla: bez mikrofonu, połóż palec przy wydechu"; micBtn.style.display = "none"; if (!running) begin(); });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Kamera jako czujnik: mała klatka, średnia koloru i jasności, nic nie opuszcza telefonu. */
  async function openCamera(video: HTMLVideoElement): Promise<boolean> {
    try {
      const stream = await grabMedia({ video: { facingMode: "environment", width: { ideal: 320 } }, audio: false });
      video.srcObject = stream; await video.play(); return true;
    } catch { return false; }
  }
  function sampleFrame(video: HTMLVideoElement, c: HTMLCanvasElement): { red: number; lum: number } | null {
    const w = 32, hh = 24; const x = c.getContext("2d"); if (!x || video.readyState < 2) return null;
    x.drawImage(video, 0, 0, w, hh); const d = x.getImageData(0, 0, w, hh).data;
    let red = 0, lum = 0; const n = w * hh;
    for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; lum += 0.2126 * r + 0.7152 * g + 0.0722 * b; if (r > 90 && r > g * 1.6 && r > b * 1.6) red++; }
    return { red: red / n, lum: lum / n / 255 };
  }

  /** Ogień: czerwień przed kamerą. Zapas: wybór koloru. */
  function renderFire() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const video = h("video", { playsinline: true, muted: true, class: "cam" }) as HTMLVideoElement;
    const probe = h("canvas", { width: "32", height: "24", style: "display:none" }) as HTMLCanvasElement;
    const stone = h("div", { class: "stone" }, h("i"));
    const status = h("p", { class: "mono muted" }, "kamień: zimny");
    const camBtn = h("button", { class: "primary" }, "Pokaż kamieniowi");
    const pick = h("input", { type: "color", value: "#5a7d95", "aria-label": "Zapas: wybierz kolor" }) as HTMLInputElement;
    const verdict = h("div");
    sec.append(video, probe, stone, status, h("div", { class: "verdict" }, camBtn, h("label", { class: "faint", style: "display:inline-flex;align-items:center;gap:.4rem" }, "albo kolor", pick)), verdict);
    let heat = 0, finished = done;
    const bump = (ok: boolean) => { /* ~7 s czerwieni przy próbkowaniu co 120 ms */ heat = Math.max(0, Math.min(1, heat + (ok ? 0.02 : -0.01))); (stone.firstElementChild as HTMLElement).style.opacity = String(heat); status.textContent = heat > 0.95 ? "kamień: pulsuje" : heat > 0.5 ? "kamień: ciepły" : "kamień: zimny"; if (heat >= 1 && !finished) { finished = true; reveal(verdict, `${it.title}: kamień odpowiedział.`); try { navigator.vibrate?.(200); } catch { /* */ } } };
    camBtn.addEventListener("click", async () => {
      if (!(await openCamera(video))) { toast("Bez kamery: wybierz kolor poniżej."); return; }
      camBtn.disabled = true; camBtn.textContent = "Kamień patrzy"; video.style.display = "block";
      setInterval(() => { const f = sampleFrame(video, probe); if (f) bump(f.red > 0.35); }, 120);
    });
    pick.addEventListener("input", () => { const v = pick.value; const r = parseInt(v.slice(1, 3), 16), g = parseInt(v.slice(3, 5), 16), b = parseInt(v.slice(5, 7), 16); const ok = r > 120 && r > g * 1.6 && r > b * 1.6; for (let i = 0; i < 20; i++) bump(ok); });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Ciemność: tekst pojawia się, gdy kamera widzi ciemność (względem kalibracji). Zapas: przytrzymaj „ciemno”. */
  function renderDark() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const video = h("video", { playsinline: true, muted: true, class: "cam", style: "display:none" }) as HTMLVideoElement;
    const probe = h("canvas", { width: "32", height: "24", style: "display:none" }) as HTMLCanvasElement;
    const page = h("article", { class: "doc hand darkpage" });
    const lines = it.secret!.map((t) => h("p", { style: "opacity:0" }, t));
    page.append(h("h4", {}, "Kartka, której nie było w aktach"), ...lines);
    const status = h("p", { class: "mono muted" }, "światło: …");
    const camBtn = h("button", { class: "primary" }, "Niech kamera patrzy");
    const hold = h("button", {}, "Trzymaj: ciemno");
    const verdict = h("div");
    sec.append(video, probe, page, status, h("div", { class: "verdict" }, camBtn, hold), verdict);
    let dark = 0, baseline = 0.5, finished = done, holding = false;
    // Minuta ciemności (tick co 120 ms → 1/500 na tick). Światło cofa, ale nie zeruje: koszt jest w czasie, nie w karze.
    const step = (isDark: boolean) => { dark = Math.max(0, Math.min(1, dark + (isDark ? 1 / 500 : -0.01))); lines.forEach((l, i) => (l.style.opacity = String(Math.max(0, Math.min(1, dark * 3 - i))))); page.style.background = `rgb(${241 - dark * 200},${235 - dark * 200},${221 - dark * 190})`; page.style.color = dark > 0.5 ? "#e8e0cf" : "#1e1a14"; if (dark >= 1 && !finished) { finished = true; reveal(verdict, `${it.title}: przeczytane w ciemności.`); } };
    camBtn.addEventListener("click", async () => {
      if (!(await openCamera(video))) { toast("Bez kamery: przytrzymaj „ciemno”."); return; }
      camBtn.disabled = true; camBtn.textContent = "Kalibruję światło…";
      const samples: number[] = []; const iv = setInterval(() => { const f = sampleFrame(video, probe); if (f) samples.push(f.lum); }, 100);
      setTimeout(() => { clearInterval(iv); samples.sort((a, b) => a - b); baseline = samples[Math.floor(samples.length / 2)] ?? 0.5; camBtn.textContent = "Kamera patrzy"; setInterval(() => { const f = sampleFrame(video, probe); if (f) { status.textContent = `światło: ${(f.lum * 100).toFixed(0)}%`; step(f.lum < Math.max(0.04, baseline * 0.3)); } }, 120); }, 2000);
    });
    hold.addEventListener("pointerdown", () => { holding = true; }); listen("pointerup", () => { holding = false; });
    setInterval(() => { if (holding) step(true); }, 120);
    if (done) { lines.forEach((l) => (l.style.opacity = "1")); verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!))); }
  }

  /** Ziemia: telefon płasko, dwadzieścia kroków. Żyroskop: przechył sypie less na cegłę. Zapas: trzymanie przycisku. */
  function renderEarth() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const total = it.steps ?? 20;
    const canvas = h("canvas", { class: "plate corridor", width: "600", height: "300", "aria-label": "Korytarz i less" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, `0 / ${total} kroków`);
    const start = h("button", { class: "primary" }, "Idę");
    const verdict = h("div");
    sec.append(canvas, status, h("div", { class: "verdict" }, start), verdict);
    const ctx = canvas.getContext("2d")!;
    let tilt = 0, steps = 0, spill = 0, running = false, finished = done, lastStep = 0, sensor = false, holding = false;
    const grains = Array.from({ length: 160 }, () => ({ x: Math.random() * 600, y: Math.random() * 300, v: 0.3 + Math.random() }));
    const onOrient = (e: DeviceOrientationEvent) => { const b = e.beta ?? 0, g = e.gamma ?? 0; tilt = Math.min(1, Math.sqrt(b * b + g * g) / 25); sensor = true; };
    function draw(now: number) {
      ctx.fillStyle = "#171511"; ctx.fillRect(0, 0, 600, 300);
      ctx.fillStyle = "#2a2620"; ctx.fillRect(0, 230, 600, 70);
      ctx.fillStyle = "#7a1f1f"; ctx.globalAlpha = 0.8; ctx.fillRect(520, 150, 60, 80); ctx.globalAlpha = 1; // cegła na końcu
      const level = running && (sensor ? tilt < 0.35 : holding);
      if (running) {
        if (level) { if (now - lastStep > 600) { steps++; lastStep = now; status.textContent = `${steps} / ${total} kroków`; if (steps % 7 === 0) { try { navigator.vibrate?.(20); } catch { /* */ } } } spill = Math.max(0, spill - 0.004); }
        else { spill = Math.min(1, spill + 0.02); if (spill >= 1) { steps = Math.max(0, steps - 77); spill = 0; status.textContent = `Less na cegle. Cofasz się o siedemdziesiąt siedem. ${steps} / ${total}`; } }
      }
      ctx.fillStyle = "#e8e0cf";
      for (const gr of grains) { gr.y += gr.v * (0.2 + (running && !level ? 3 : 0.4)); gr.x += (tilt - 0.2) * 1.5; if (gr.y > 300) { gr.y = -2; gr.x = Math.random() * 600; } ctx.fillRect(gr.x, gr.y, 1.5, 1.5); }
      // less zsunięty na cegłę
      ctx.fillStyle = "#e8e0cf"; ctx.globalAlpha = 0.9; ctx.fillRect(520, 150 - spill * 40, 60, spill * 40); ctx.globalAlpha = 1;
      // pozycja
      const px = 30 + (steps / total) * 470; ctx.beginPath(); ctx.arc(px, 225, 5, 0, Math.PI * 2); ctx.fillStyle = "#c9a86a"; ctx.fill();
      if (steps >= total && !finished) { finished = true; running = false; reveal(verdict, `${it.title}: ${total} kroków.`); }
      if (alive) requestAnimationFrame(draw);
    }
    if (alive) requestAnimationFrame(draw);
    start.addEventListener("click", async () => {
      try {
        const DO = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
        if (DO.requestPermission) { const r = await DO.requestPermission(); if (r !== "granted") throw new Error("denied"); }
        listen("deviceorientation", onOrient as EventListener);
      } catch { toast("Bez żyroskopu: trzymaj przycisk, żeby iść równo."); }
      running = true; start.textContent = "Trzymaj równo"; lastStep = performance.now();
      start.addEventListener("pointerdown", () => { holding = true; }); listen("pointerup", () => { holding = false; });
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Widmo: spektrogram nagrania rysowany na żywo; obraz ukryty w częstotliwościach, których ucho nie złoży. */
  function renderSpectro() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const audio = h("audio", { controls: true, preload: "auto", crossorigin: "anonymous", src: import.meta.env.BASE_URL + it.audio! }) as HTMLAudioElement;
    const canvas = h("canvas", { class: "spectro", width: "720", height: "260", "aria-label": "Spektrogram nagrania" }) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0e0d0b"; ctx.fillRect(0, 0, 720, 260);
    sec.append(audio, canvas, h("p", { class: "faint" }, "Oś pozioma: czas, 26 sekund. Oś pionowa: częstotliwość, 0 do 8 kHz, niskie na dole. Jasność: głośność."));
    let ac: AudioContext | null = null, an: AnalyserNode | null = null, data: Uint8Array<ArrayBuffer> | null = null;
    audio.addEventListener("seeked", () => { if (audio.currentTime < 0.3) { ctx.fillStyle = "#0e0d0b"; ctx.fillRect(0, 0, 720, 260); } });
    audio.addEventListener("play", () => {
      if (!ac) { ac = newAC(); const src = ac.createMediaElementSource(audio); an = ac.createAnalyser(); an.fftSize = 2048; an.smoothingTimeConstant = 0.2; src.connect(an); an.connect(ac.destination); data = new Uint8Array(new ArrayBuffer(an.frequencyBinCount)); }
      if (ac.state === "suspended") ac.resume();
      if (audio.currentTime < 0.3) { ctx.fillStyle = "#0e0d0b"; ctx.fillRect(0, 0, 720, 260); }
      // Kolumna rysowana kryjąco (nie półprzezroczyście), więc kolejne odsłuchy nie rozjaśniają obrazu do białego.
      const draw = () => { if (audio.paused || !an || !data || !ac) return; an.getByteFrequencyData(data); const x = Math.floor((audio.currentTime / 26) * 720); const binHz = ac.sampleRate / an.fftSize; const maxBin = Math.floor(8000 / binHz);
        for (let b = 0; b < maxBin; b++) { const v = Math.pow(data[b] / 255, 1.6); const y = 260 - Math.floor((b / maxBin) * 260); const l = Math.round(14 + v * 218); ctx.fillStyle = `rgb(${l},${Math.round(l * 0.97)},${Math.round(l * 0.9)})`; ctx.fillRect(x, y - 1, 2, 2); }
        if (alive) requestAnimationFrame(draw); };
      if (alive) requestAnimationFrame(draw);
    });
    const opts = h("div", { class: "opts", role: "radiogroup" });
    it.options!.forEach((o, i) => opts.append(h("label", {}, h("input", { type: "radio", name: "spectro", value: String(i) }), o)));
    const verdict = h("div"); const btn = h("button", { class: "primary" }, "Odpowiedz");
    btn.addEventListener("click", () => { const el = sec.querySelector<HTMLInputElement>('input[name="spectro"]:checked'); if (!el) { toast("Najpierw patrz."); return; } if (Number(el.value) === it.answer) { reveal(verdict, `${it.title}: zobaczone.`); } else toast("Patrz wyżej. Ponad dzwonem."); });
    sec.append(h("div", { class: "q daily" }, h("div", { class: "qt" }, it.q!), opts), btn, verdict);
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Kompas-zawieszka: GPS + magnetometr. Grzeje, gdy telefon celuje w najbliższą bramę. Tylko na miejscu. */
  function renderCompass() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const pend = h("div", { class: "pendant big", "data-heat": "0" }, flint(96, flintSeed(app.state.seed)));
    const status = h("p", { class: "mono muted" }, "GPS: czeka, aż wyjmiesz zawieszkę");
    const start = h("button", { class: "primary" }, "Wyjmij zawieszkę");
    const verdict = h("div");
    sec.append(pend, status, h("div", { class: "verdict" }, start), verdict);
    let heading: number | null = null, pos: { lat: number; lon: number } | null = null, hot = 0, finished = done;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const bearing = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => { const y = Math.sin(toRad(b.lon - a.lon)) * Math.cos(toRad(b.lat)); const x = Math.cos(toRad(a.lat)) * Math.sin(toRad(b.lat)) - Math.sin(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.cos(toRad(b.lon - a.lon)); return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360; };
    const dist = (a: { lat: number; lon: number }, b: { lat: number; lon: number }) => { const R = 6371000; const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon); const s1 = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s1)); };
    // iOS: webkitCompassHeading. Android: zdarzenie „absolute" daje alpha względem północy; zwykłe deviceorientation jest względne (od chwili startu), ale lepsze niż cisza.
    let relative = false;
    const onOrient = (e: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      if (typeof e.webkitCompassHeading === "number") { heading = e.webkitCompassHeading; relative = false; return; }
      if (e.alpha === null) return;
      const abs = e.type === "deviceorientationabsolute" || e.absolute;
      if (abs || heading === null) { heading = (360 - e.alpha + (screen.orientation?.angle ?? 0)) % 360; relative = !abs; }
    };
    let ticks = 0;
    function tick() {
      ticks++;
      if (!pos || heading === null) {
        const gps = pos ? "GPS: jest" : ticks > 60 ? "GPS: brak sygnału. Wyjdź spod dachu, włącz lokalizację dla przeglądarki." : "GPS: szukam…";
        const cmp = heading !== null ? "kompas: jest" : ticks > 20 ? "kompas: cisza. Zakreśl telefonem w powietrzu ósemkę (tak kalibruje się kompas w telefonie) i wyjdź spod dachu." : "kompas: czekam na obrót";
        status.textContent = `${gps} · ${cmp}`;
      }
      if (pos && heading !== null) {
        const gates = app.map.gates.filter((g) => g.lat && g.lon).map((g) => ({ g, d: dist(pos!, { lat: g.lat!, lon: g.lon! }), b: bearing(pos!, { lat: g.lat!, lon: g.lon! }) })).sort((a, b) => a.d - b.d);
        const near = gates[0]; const diff = Math.abs(((heading - near.b + 540) % 360) - 180);
        const heat = diff < 12 ? 4 : diff < 25 ? 3 : diff < 50 ? 2 : diff < 90 ? 1 : 0;
        pend.setAttribute("data-heat", String(heat));
        status.textContent = `najbliżej: ${near.g.name}, ${near.d.toFixed(0)} m · kierunek ${near.b.toFixed(0)}° · ty ${heading.toFixed(0)}°`;
        if (near.d > 1500 && !app.state.testMode) status.textContent = `jesteś ${(near.d / 1000).toFixed(near.d > 20000 ? 0 : 1)} km od najbliższej bramy (${near.g.name}). Zawieszka grzeje tylko w Sandomierzu; tu pokazuje kierunek, nie ciepło.`;
        else if (relative) status.textContent += " · kompas względny: obróć się raz dookoła, żeby złapał północ";
        hot = heat === 4 && (near.d <= 1500 || app.state.testMode) ? hot + 1 : 0;
        if (hot > 12 && !finished) { finished = true; reveal(verdict, `${it.title}: ${near.g.name}.`); try { navigator.vibrate?.(300); } catch { /* */ } }
      }
      if (alive) setTimeout(tick, 250);
    }
    start.addEventListener("click", async () => {
      try {
        const DO = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
        if (DO.requestPermission) { const r = await DO.requestPermission(); if (r !== "granted") throw new Error("denied"); }
        listen("deviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation", onOrient as EventListener);
      } catch { toast("Bez kompasu zawieszka nie wie, gdzie patrzysz."); }
      if (!navigator.geolocation) { status.textContent = "GPS: brak"; return; }
      navigator.geolocation.watchPosition((p) => { pos = { lat: p.coords.latitude, lon: p.coords.longitude }; }, (err) => { status.textContent = err.code === 1 ? "GPS: odmowa. Zawieszka milczy bez miejsca. Włącz lokalizację dla tej strony w ustawieniach telefonu." : "GPS: brak sygnału. Wyjdź spod dachu i poczekaj chwilę."; }, { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 });
      start.disabled = true; start.textContent = "Obracaj się powoli"; tick();
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Gwizd: czysty ton wysoko (700–3000 Hz) utrzymany 3 s. Nucenie (poniżej 500 Hz) nie liczy się. */
  function renderWhistle() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const status = h("p", { class: "mono muted" }, "cisza");
    const bar = h("div", { class: "still-bar" }, h("i")); const fill = bar.firstElementChild as HTMLElement;
    const micBtn = h("button", { class: "primary" }, "Gwizdnij");
    const verdict = h("div");
    sec.append(bar, status, h("div", { class: "verdict" }, micBtn), verdict);
    let held = 0, finished = done;
    micBtn.addEventListener("click", async () => {
      try {
        const stream = await grabMedia({ audio: true });
        const ac = newAC(); const src = ac.createMediaStreamSource(stream); const an = ac.createAnalyser(); an.fftSize = 2048; src.connect(an);
        const buf = new Float32Array(new ArrayBuffer(an.fftSize * 4)); const smooth = new PitchSmoother(5);
        micBtn.disabled = true; micBtn.textContent = "Słucham";
        setInterval(() => {
          an.getFloatTimeDomainData(buf); const hz = smooth.push(detectPitch(buf, ac.sampleRate));
          if (hz && hz > 700 && hz < 3000) { held += 0.1; status.textContent = `${hz.toFixed(0)} Hz · czysty`; }
          else if (hz && hz < 500) { held = Math.max(0, held - 0.2); status.textContent = `${hz.toFixed(0)} Hz · to głos, nie gwizd`; }
          else { held = Math.max(0, held - 0.05); status.textContent = hz ? `${hz.toFixed(0)} Hz` : "cisza"; }
          fill.style.width = `${Math.min(100, (held / 3) * 100)}%`;
          if (held >= 3 && !finished) { finished = true; reveal(verdict, `${it.title}: czysty ton.`); }
        }, 100);
      } catch { toast("Bez mikrofonu nie da się gwizdać do telefonu. Wróć, kiedy będzie mikrofon."); }
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Siedem palców: multi-touch, siedem punktów heptagramu dotkniętych jednocześnie przez 3 s. */
  function renderTouch7() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const canvas = h("canvas", { class: "plate hept", width: "600", height: "600", "aria-label": "Heptagram z siedmioma punktami" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, "0 / 5 palców na siedmiu punktach");
    const verdict = h("div");
    sec.append(canvas, status, verdict);
    const ctx = canvas.getContext("2d")!;
    const pts = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return { x: 300 + Math.cos(a) * 220, y: 300 + Math.sin(a) * 220 }; });
    const touches = new Map<number, { x: number; y: number }>(); let held = 0, finished = done;
    const toCanvas = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 600, y: ((e.clientY - r.top) / r.height) * 600 }; };
    canvas.addEventListener("pointerdown", (e) => { touches.set(e.pointerId, toCanvas(e)); });
    canvas.addEventListener("pointermove", (e) => { if (touches.has(e.pointerId)) touches.set(e.pointerId, toCanvas(e)); });
    const up = (e: PointerEvent) => touches.delete(e.pointerId); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("pointerleave", up);
    function draw() {
      ctx.fillStyle = "#171511"; ctx.fillRect(0, 0, 600, 600);
      ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.closePath(); ctx.strokeStyle = "#6b6355"; ctx.lineWidth = 2; ctx.stroke();
      const covered = pts.map((p) => [...touches.values()].some((t) => Math.hypot(t.x - p.x, t.y - p.y) < 60));
      pts.forEach((p, i) => { ctx.beginPath(); ctx.arc(p.x, p.y, 34, 0, Math.PI * 2); ctx.fillStyle = covered[i] ? "#c9a86a" : "#2a2620"; ctx.fill(); ctx.strokeStyle = "#e8e0cf"; ctx.lineWidth = 1.5; ctx.stroke(); });
      const n = covered.filter(Boolean).length; status.textContent = `${n} / 5 palców na siedmiu punktach`;
      // Telefon widzi najwyżej pięć dotknięć naraz (iPhone). Pięć palców dwojga ludzi na pięciu z siedmiu punktów przez trzy sekundy.
      held = n >= 5 ? held + 1 / 60 : 0;
      if (held >= 3 && !finished) { finished = true; reveal(verdict, `${it.title}: siedem palców.`); try { navigator.vibrate?.(300); } catch { /* */ } }
      if (alive) requestAnimationFrame(draw);
    }
    draw();
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Marek trzyma: przycisk trzymany N sekund. Puszczenie = od nowa. Nic się nie dzieje. */
  function renderHold() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const total = it.seconds ?? 90;
    const btn = h("button", { class: "primary hold-btn" }, "Trzymaj");
    const status = h("p", { class: "mono muted" }, `0 / ${total} s`);
    const verdict = h("div");
    sec.append(h("div", { class: "verdict" }, btn), status, verdict);
    let t0 = 0, iv: number | undefined, finished = done;
    const stop = () => { if (iv) clearInterval(iv); iv = undefined; if (!finished) { status.textContent = `0 / ${total} s. Puszczone.`; btn.textContent = "Trzymaj"; } };
    btn.addEventListener("pointerdown", (e) => { e.preventDefault(); t0 = Date.now(); btn.textContent = "…"; iv = window.setInterval(() => { const sec_ = (Date.now() - t0) / 1000; status.textContent = `${sec_.toFixed(0)} / ${total} s`; if (sec_ >= total && !finished) { finished = true; clearInterval(iv); reveal(verdict, `${it.title}: ${total} sekund.`); } }, 250); });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => btn.addEventListener(ev, stop));
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Lustro: tekst w odbiciu, do przeczytania w lustrze. Zero technologii. */
  function renderMirror() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const page = h("article", { class: "doc hand mirror" }, h("h4", {}, "Kartka w odbiciu"));
    it.secret!.forEach((t) => page.append(h("p", {}, t)));
    sec.append(page);
    const opts = h("div", { class: "opts", role: "radiogroup" });
    it.options!.forEach((o, i) => opts.append(h("label", {}, h("input", { type: "radio", name: "mirror", value: String(i) }), o)));
    const verdict = h("div"); const btn = h("button", { class: "primary" }, "Odpowiedz");
    btn.addEventListener("click", () => { const el = sec.querySelector<HTMLInputElement>('input[name="mirror"]:checked'); if (!el) { toast("Najpierw lustro."); return; } if (Number(el.value) === it.answer) { reveal(verdict, `${it.title}: przeczytane w odbiciu.`); } else toast("Lustro nie kłamie. Przeczytaj jeszcze raz."); });
    sec.append(h("div", { class: "q daily" }, h("div", { class: "qt" }, it.q!), opts), btn, verdict);
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Nie podnoś palca: labirynt z trzema rozgałęzieniami, ekran ciemnieje z postępem. Puszczenie albo zła odnoga = powrót. */
  function renderTrace() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const canvas = h("canvas", { class: "plate corridor trace", width: "600", height: "600", "aria-label": "Korytarz" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, "Opatowska");
    const verdict = h("div");
    sec.append(canvas, status, verdict);
    const ctx = canvas.getContext("2d")!;
    // korytarz jako łamana (główna droga) + trzy odnogi (ślepe)
    const path = [[60, 40], [60, 200], [300, 200], [300, 380], [120, 380], [120, 520], [540, 520]]; // Opatowska → S → komnata (W)
    const dead = [[[300, 200], [540, 200], [540, 300]], [[300, 380], [540, 380], [540, 450]], [[120, 520], [60, 520], [60, 580]]];
    const W = 28; let progress = 0, tracing = false, finished = done;
    const near = (x: number, y: number, a: number[], b: number[]) => { const dx = b[0] - a[0], dy = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(x - (a[0] + dx * t), y - (a[1] + dy * t)) < W; };
    const toC = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 600, y: ((e.clientY - r.top) / r.height) * 600 }; };
    const reset = (why: string) => { tracing = false; progress = 0; status.textContent = why; };
    canvas.addEventListener("pointerdown", (e) => { const p = toC(e); if (Math.hypot(p.x - 60, p.y - 40) < 40) { tracing = true; progress = 0; status.textContent = "Opatowska. Nie puszczaj."; } });
    canvas.addEventListener("pointermove", (e) => {
      if (!tracing || finished) return; const p = toC(e);
      for (const d of dead) for (let i = 0; i < d.length - 1; i++) if (near(p.x, p.y, d[i], d[i + 1]) && !near(p.x, p.y, path[Math.min(progress, path.length - 2)], path[Math.min(progress + 1, path.length - 1)])) { reset("Zła odnoga. Wracasz na Opatowską."); return; }
      let onPath = false;
      for (let i = Math.max(0, progress - 1); i < path.length - 1; i++) if (near(p.x, p.y, path[i], path[i + 1])) { onPath = true; if (i > progress) progress = i; }
      if (!onPath) { reset("Ściana. Wracasz na Opatowską."); return; }
      if (Math.hypot(p.x - 540, p.y - 520) < 30 && !finished) { finished = true; tracing = false; reveal(verdict, `${it.title}: komnata.`); }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => canvas.addEventListener(ev, () => { if (tracing && !finished) reset("Palec w górze. Powrót na Opatowską."); }));
    function draw() {
      const dark = tracing ? Math.min(0.85, progress / (path.length - 1)) : 0;
      ctx.fillStyle = "#171511"; ctx.fillRect(0, 0, 600, 600);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = W * 2; ctx.strokeStyle = "#2a2620";
      const stroke = (pts: number[][]) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
      dead.forEach(stroke); stroke(path);
      ctx.fillStyle = "#c9a86a"; ctx.beginPath(); ctx.arc(60, 40, 14, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#7a1f1f"; ctx.beginPath(); ctx.arc(540, 520, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#a39a86"; ctx.font = "13px Georgia"; ctx.fillText("Opatowska", 80, 44); ctx.fillText("komnata", 455, 560);
      ctx.fillStyle = `rgba(14,13,11,${dark})`; ctx.fillRect(0, 0, 600, 600);
      if (alive) requestAnimationFrame(draw);
    }
    draw();
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Kroki: licznik z akcelerometru (szczyty przyspieszenia), zapisywany między dniami. Ostatnie 200 kroków ciemniej. */
  function renderSteps() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const total = it.steps ?? 1200;
    const bar = h("div", { class: "still-bar" }, h("i")); const fill = bar.firstElementChild as HTMLElement;
    const status = h("p", { class: "mono muted" }, `${app.state.steps ?? 0} / ${total} kroków`);
    const start = h("button", { class: "primary" }, "Idę");
    const verdict = h("div");
    sec.append(bar, status, h("div", { class: "verdict" }, start), verdict);
    let last = 0, lastStep = 0, finished = done || (app.state.steps ?? 0) >= total;
    const update = () => { const n = app.state.steps ?? 0; fill.style.width = `${Math.min(100, (n / total) * 100)}%`; status.textContent = `${n} / ${total} kroków${n > total - 200 && n < total ? " · powietrze rzednie" : ""}`; document.body.style.filter = n > total - 200 && n < total ? `brightness(${1 - ((n - (total - 200)) / 200) * 0.6})` : ""; if (n >= total && !finished) { finished = true; document.body.style.filter = ""; reveal(verdict, `${it.title}: na miejscu.`); } };
    const onMotion = (e: DeviceMotionEvent) => { const a = e.accelerationIncludingGravity; if (!a) return; const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2); const now = Date.now(); if (last && mag - last > 1.6 && now - lastStep > 320) { lastStep = now; app.state.steps = (app.state.steps ?? 0) + 1; if (app.state.steps % 10 === 0) save(app.state); update(); } last = mag; };
    start.addEventListener("click", async () => {
      try { const DM = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> }; if (DM.requestPermission) { const r = await DM.requestPermission(); if (r !== "granted") throw new Error("denied"); } listen("devicemotion", onMotion as EventListener); start.disabled = true; start.textContent = "Liczę kroki"; }
      catch { toast("Bez czujnika ruchu kroków nie policzę. Wróć na telefonie."); }
    });
    addEventListener("hashchange", () => { document.body.style.filter = ""; save(app.state); }, { once: true });
    update();
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  /** Dwa głosy: widmo (FFT 8192), dwie rodziny harmonicznych, warunek kwinty 3:2. Solo: telefon gra drugi głos z głośnika. */
  function renderDuet() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const canvas = h("canvas", { class: "plate", width: "600", height: "600", "aria-label": "Płyta z piaskiem, dwa głosy" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, "cisza");
    const micBtn = h("button", { class: "primary" }, "Włącz mikrofon");
    const soloBtn = h("button", {}, "Jestem sam: zanuć za mnie");
    const verdict = h("div");
    sec.append(canvas, status, h("div", { class: "verdict" }, micBtn, soloBtn), verdict);
    const ctx = canvas.getContext("2d")!;
    const N = 1400; const pts = Array.from({ length: N }, () => { const a = Math.random() * Math.PI * 2, r = Math.random(); return { a, r, j: Math.random(), x: 300 + Math.cos(a) * r * 270, y: 300 + Math.sin(a) * r * 270 }; });
    let res: { f1: number | null; f2: number | null; fifth: boolean; ratio: number | null } = { f1: null, f2: null, fifth: false, ratio: null };
    let hold = 0, finished = done, cSmooth = 0, ac: AudioContext | null = null, osc: OscillatorNode | null = null;
    function draw() {
      const c = res.fifth ? 1 : res.f1 && res.f2 ? 0.5 : res.f1 ? 0.2 : 0;
      cSmooth += (c - cSmooth) * 0.08;
      ctx.fillStyle = "#1a1813"; ctx.fillRect(0, 0, 600, 600); ctx.fillStyle = "#e8e0cf";
      for (const p of pts) {
        // jeden głos: siedem ramion; dwa głosy w kwincie: siedem ramion + wewnętrzny pierścień o pięciu (3:2 → 7 i 5 węzłów)
        const star7 = 0.55 + 0.35 * Math.abs(Math.cos(3.5 * p.a)); const ring5 = 0.22 + 0.1 * Math.abs(Math.cos(2.5 * p.a));
        const shape = p.j < 0.6 ? star7 : ring5; const target = p.j < 0.6 ? shape : (cSmooth > 0.75 ? ring5 : star7);
        const r = (p.r * (1 - cSmooth) + target * cSmooth) * 270;
        const tx = 300 + Math.cos(p.a) * r + (1 - cSmooth) * (p.j - 0.5) * 30, ty = 300 + Math.sin(p.a) * r + (1 - cSmooth) * (p.j - 0.5) * 30;
        p.x += (tx - p.x) * 0.12; p.y += (ty - p.y) * 0.12; ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      status.textContent = res.f1 ? `${res.f1.toFixed(1)} Hz${res.f2 ? ` + ${res.f2.toFixed(1)} Hz · ${res.ratio!.toFixed(2)}` : " · jeden głos"}${res.fifth ? " · kwinta" : ""}` : "cisza";
      hold = res.fifth ? hold + 1 : Math.max(0, hold - 2);
      if (hold > 180 && !finished) { finished = true; if (osc) { osc.stop(); osc = null; } reveal(verdict, `${it.title}: kwinta.`); try { navigator.vibrate?.(300); } catch { /* */ } }
      if (alive) requestAnimationFrame(draw);
    }
    draw();
    micBtn.addEventListener("click", async () => {
      try {
        const stream = await grabMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
        ac = ac ?? newAC(); const src = ac.createMediaStreamSource(stream); const an = ac.createAnalyser(); an.fftSize = 8192; an.smoothingTimeConstant = 0.6; src.connect(an);
        const spec = new Float32Array(new ArrayBuffer(an.frequencyBinCount * 4)); const binHz = ac.sampleRate / an.fftSize;
        micBtn.disabled = true; micBtn.textContent = "Płyta słucha";
        setInterval(() => { an.getFloatFrequencyData(spec); res = detectDuet(spec, binHz); }, 120);
      } catch { toast("Bez mikrofonu płyta nie usłyszy ani jednego głosu."); }
    });
    soloBtn.addEventListener("click", () => {
      ac = ac ?? newAC(); if (ac.state === "suspended") ac.resume();
      if (osc) { osc.stop(); osc = null; soloBtn.textContent = "Jestem sam: zanuć za mnie"; return; }
      // telefon nuci 294 Hz (D) z głośnika; ty nucisz 196 Hz (G) niżej. Mikrofon słyszy oba.
      osc = ac.createOscillator(); osc.type = "triangle"; osc.frequency.value = 294; const g = ac.createGain(); g.gain.value = 0.25; osc.connect(g).connect(ac.destination); osc.start();
      soloBtn.textContent = "Telefon nuci 294 Hz. Ty nuć niżej (G). Stop";
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }

  function renderPlate() {
    sec.append(h("p", { class: "quote" }, it.intro!)); if (it.cue) sec.append(h("p", { class: "cue" }, it.cue));
    const canvas = h("canvas", { class: "plate", width: "600", height: "600", "aria-label": "Płyta z piaskiem" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, "cisza");
    const slider = h("input", { type: "range", min: "80", max: "400", value: "120", "aria-label": "Ton (suwak zapasowy)" }) as HTMLInputElement;
    const micBtn = h("button", { class: "primary" }, "Włącz mikrofon");
    const verdict = h("div");
    sec.append(canvas, status, h("div", { class: "verdict" }, micBtn), h("p", { class: "faint", style: "margin:0.2rem 0" }, "albo suwak:"), slider, verdict);
    const ctx = canvas.getContext("2d")!;
    const N = 1400; const pts = Array.from({ length: N }, () => { const a = Math.random() * Math.PI * 2, r = Math.random(); return { a, r, j: Math.random(), x: 300 + Math.cos(a) * r * 270, y: 300 + Math.sin(a) * r * 270 }; });
    let hz: number | null = null, finished = done, cSmooth = 0, stableSince = 0;
    const target = it.targetHz ?? 196, tol = it.tolerance ?? 6;
    function draw() {
      const c = hz ? closeness(hz, target, tol) : 0;
      cSmooth += (c - cSmooth) * 0.08; // bezwładność wzoru: piasek nie przeskakuje, dogania
      ctx.fillStyle = "#1a1813"; ctx.fillRect(0, 0, 600, 600);
      ctx.fillStyle = "#e8e0cf";
      for (const p of pts) {
        // Przy c→1 piasek wędruje do linii węzłowych siedmioramiennej gwiazdy; przy c→0 leży losowo. Każde ziarno dogania swój cel (lerp), więc ruch jest ciągły.
        const star = 0.55 + 0.35 * Math.abs(Math.cos(3.5 * p.a));
        const r = (p.r * (1 - cSmooth) + star * cSmooth) * 270;
        const tx = 300 + Math.cos(p.a) * r + (1 - cSmooth) * (p.j - 0.5) * 30;
        const ty = 300 + Math.sin(p.a) * r + (1 - cSmooth) * (p.j - 0.5) * 30;
        p.x += (tx - p.x) * 0.12; p.y += (ty - p.y) * 0.12;
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }
      status.textContent = hz ? `${hz.toFixed(1)} Hz · ${c > 0.9 ? "siedem ramion" : c > 0.5 ? "blisko" : "piasek nie słucha"}` : "cisza";
      // Osiem sekund stałego tonu (stałość, nie wysokość): piasek siada, kiedy głos się nie waha.
      if (c > 0.9 && !finished) { if (!stableSince) stableSince = performance.now(); status.textContent += ` · ${Math.min(8, (performance.now() - stableSince) / 1000).toFixed(0)}/8 s`; if (performance.now() - stableSince > 8000) { finished = true; reveal(verdict, `${it.title}: ton znaleziony.`); } } else stableSince = 0;
      if (alive) requestAnimationFrame(draw);
    }
    draw();
    slider.addEventListener("input", () => { hz = Number(slider.value); });
    micBtn.addEventListener("click", async () => {
      try {
        const stream = await grabMedia({ audio: true });
        const ac = newAC(); const src = ac.createMediaStreamSource(stream); const an = ac.createAnalyser(); an.fftSize = 4096; src.connect(an);
        const buf = new Float32Array(new ArrayBuffer(an.fftSize * 4));
        const smooth = new PitchSmoother(7);
        micBtn.disabled = true; micBtn.textContent = "Mikrofon słucha";
        setInterval(() => { an.getFloatTimeDomainData(buf); const p = smooth.push(detectPitch(buf, ac.sampleRate)); hz = p; }, 50);
        // Nucenie razem: co 30 s meldunek „nucę teraz"; w dniu premiery o 12:00 strona pokaże, ilu naraz
        const humTick = async () => { if (hz) { const n = await sendHum(app.cfg.backendUrl, app.state); if (n !== null && n > 1) status.title = `nuci teraz ${n} osób`; } };
        setInterval(humTick, 30000);
      } catch { toast("Bez mikrofonu. Użyj suwaka."); }
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)), h("div", { class: "verdict" }, back()));
  }
}
