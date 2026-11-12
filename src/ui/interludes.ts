import { h, go, toast } from "./dom";
import { topbar } from "./views";
import type { App } from "../app";
import { save } from "../engine/state";
import { detectPitch, closeness, PitchSmoother } from "../engine/pitch";

export interface Interlude {
  id: string; type: "amor" | "talk" | "plate" | "beat" | "still" | "breath" | "fire" | "dark" | "earth"; after?: number; gate?: number; title: string;
  secret?: string[]; steps?: number;
  cycles?: number; inhale?: number; exhale?: number;
  audio?: string; q?: string; options?: string[]; answer?: number; seconds?: number;
  lines?: string[];
  intro?: string; person?: string; questions?: { q: string; a: string }[]; lie?: number; reveal?: string; wrong?: string;
  targetHz?: number; tolerance?: number;
}

export function interludeAvailable(app: App, i: Interlude): boolean {
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
  const it: Interlude = found;
  if (!interludeAvailable(app, it)) { sec.append(h("h2", {}, it.title), h("p", { class: "muted" }, it.gate !== undefined ? `Najpierw rozpoznaj bramę ${it.gate} dokumentami.` : `Po ${it.after} przebytych bramach.`), h("button", { onclick: () => go("#/mapa") }, "Mapa")); return sec; }
  const done = app.state.interludesDone.includes(it.id);
  sec.append(h("p", { class: "faint" }, "Między sprawami"), h("h2", {}, it.title));
  if (it.type === "amor") renderAmor(); else if (it.type === "talk") renderTalk(); else if (it.type === "beat") renderBeat(); else if (it.type === "still") renderStill(); else if (it.type === "breath") renderBreath(); else if (it.type === "fire") renderFire(); else if (it.type === "dark") renderDark(); else if (it.type === "earth") renderEarth(); else renderPlate();
  return sec;

  function finish(note: string) {
    if (!app.state.interludesDone.includes(it.id)) { app.state.interludesDone.push(it.id); app.addNote(note, it.gate !== undefined ? `brama ${it.gate} przebyta` : "między sprawami"); save(app.state); if (it.gate !== undefined) toast(`Brama ${it.gate} przebyta. Ciałem.`); }
  }

  function renderAmor() {
    const art = h("div", { class: "amor-text" });
    it.lines!.forEach((l, i) => { const p = h("p", { style: `animation-delay:${i * 1.2}s` }, l); art.append(p); });
    sec.append(art, h("button", { onclick: () => { finish(`${it.title}.`); go("#/mapa"); } }, "Wróć do mapy"));
    finish(`${it.title}.`);
  }

  function renderTalk() {
    sec.append(h("p", { class: "quote" }, it.intro!));
    const asked = new Set<number>();
    const log = h("div", { class: "talk-log" });
    const qs = h("div", { class: "talk-qs" });
    const verdict = h("div");
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
    if (done) renderPick();
    function renderPick() {
      qs.replaceChildren(h("p", { class: "muted" }, "Które zdanie było kłamstwem?"));
      it.questions!.forEach((q, i) => {
        qs.append(h("button", { onclick: () => {
          if (i === it.lie) { verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!))); finish(`${it.title}: kłamstwo rozpoznane.`); qs.replaceChildren(h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); }
          else toast(it.wrong!);
        } }, `Odpowiedź ${i + 1}`));
      });
    }
  }

  /** Dudnienie różnicowe: dwa tony w słuchawkach, 18 Hz powstaje w głowie. */
  function renderBeat() {
    sec.append(h("p", { class: "quote" }, it.intro!));
    const audio = h("audio", { controls: true, preload: "none", src: import.meta.env.BASE_URL + it.audio! }) as HTMLAudioElement;
    // Wibracja w rytmie 18 Hz (Android; iOS Safari nie ma Vibration API): 28 ms + 28 ms ≈ 18 Hz
    let vib: number | undefined;
    audio.addEventListener("play", () => { try { vib = window.setInterval(() => navigator.vibrate?.(Array(10).fill(28)), 600); } catch { /* */ } });
    audio.addEventListener("pause", () => { if (vib) clearInterval(vib); try { navigator.vibrate?.(0); } catch { /* */ } });
    sec.append(h("div", { class: "card" }, audio, h("p", { class: "faint" }, "Słuchawki na obu uszach. Głośnik telefonu tego nie odda: nie dlatego, że jest słaby, tylko dlatego, że to powstaje dopiero między uszami.")));
    // Bez słuchawek: zobaczysz. Dwie fale (200 i 218 Hz) i ich suma, zwolnione 400 razy, żeby dudnienie 18 Hz było widoczne jako powolny oddech amplitudy. Bez migania.
    const wave = h("canvas", { class: "wave", width: "600", height: "180", "aria-label": "Dwie fale i dudnienie" }) as HTMLCanvasElement;
    sec.append(wave, h("p", { class: "faint" }, "Góra: lewe ucho. Środek: prawe. Dół: to, co powstaje między nimi. Bez słuchawek zobaczysz, nie usłyszysz."));
    const wctx = wave.getContext("2d")!;
    const drawWave = (now: number) => {
      const t = now / 400000; // zwolnienie
      wctx.fillStyle = "#171511"; wctx.fillRect(0, 0, 600, 180);
      const rows: [number, number, string][] = [[110, 30, "#a39a86"], [128, 90, "#a39a86"], [0, 150, "#c9a86a"]];
      for (const [f, y, col] of rows) {
        wctx.beginPath(); wctx.strokeStyle = col; wctx.lineWidth = 1.5;
        for (let x = 0; x <= 600; x += 2) {
          const tt = t + x / 6000;
          const v = f ? Math.sin(2 * Math.PI * f * tt) : (Math.sin(2 * Math.PI * 110 * tt) + Math.sin(2 * Math.PI * 128 * tt)) / 2;
          const yy = y + v * 22; x === 0 ? wctx.moveTo(x, yy) : wctx.lineTo(x, yy);
        }
        wctx.stroke();
      }
      requestAnimationFrame(drawWave);
    };
    requestAnimationFrame(drawWave);
    const opts = h("div", { class: "opts", role: "radiogroup" });
    it.options!.forEach((o, i) => opts.append(h("label", {}, h("input", { type: "radio", name: "beat", value: String(i) }), o)));
    const verdict = h("div");
    const btn = h("button", { class: "primary" }, "Odpowiedz");
    btn.addEventListener("click", () => {
      const el = sec.querySelector<HTMLInputElement>('input[name="beat"]:checked'); if (!el) { toast("Najpierw posłuchaj."); return; }
      if (Number(el.value) === it.answer) { verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: usłyszane.`); }
      else toast("Posłuchaj jeszcze raz. Obie słuchawki.");
    });
    sec.append(h("div", { class: "q daily" }, h("div", { class: "qt" }, it.q!), opts), btn, verdict);
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }

  /** Zimno: trzymać telefon nieruchomo. Akcelerometr mierzy drżenie rąk; każde drgnięcie cofa pasek. */
  function renderStill() {
    sec.append(h("p", { class: "quote" }, it.intro!));
    const total = it.seconds ?? 30;
    const bar = h("div", { class: "still-bar" }, h("i"));
    const fill = bar.firstElementChild as HTMLElement;
    const status = h("p", { class: "mono muted" }, "0 s");
    const temp = h("p", { class: "muted" }, "36,6°C");
    const start = h("button", { class: "primary" }, "Trzymam");
    const verdict = h("div");
    sec.append(bar, status, temp, h("div", { class: "verdict" }, start), verdict);
    let held = 0, last = 0, running = false, jitter = 0, finished = done;
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity; if (!a) return;
      const mag = Math.sqrt((a.x ?? 0) ** 2 + (a.y ?? 0) ** 2 + (a.z ?? 0) ** 2);
      if (last) jitter = Math.abs(mag - last); last = mag;
    };
    function tick() {
      if (!running) return;
      if (jitter > 0.35) { held = Math.max(0, held - 1.5); temp.textContent = "Drżysz. 33°C."; }
      else { held += 0.1; temp.textContent = `${(36.6 - (held / total) * 5.6).toFixed(1).replace(".", ",")}°C`; }
      fill.style.width = `${Math.min(100, (held / total) * 100)}%`; status.textContent = `${held.toFixed(0)} s`;
      if (held >= total && !finished) { finished = true; running = false; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: wytrzymane.`); return; }
      setTimeout(tick, 100);
    }
    start.addEventListener("click", async () => {
      try {
        const DM = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
        if (DM.requestPermission) { const r = await DM.requestPermission(); if (r !== "granted") throw new Error("denied"); }
        addEventListener("devicemotion", onMotion);
      } catch { toast("Bez czujnika ruchu: liczy się samo trzymanie przycisku."); }
      running = true; start.disabled = true; start.textContent = "Nie ruszaj się"; tick();
    });
    // zapas bez czujnika: puszczenie przycisku = drgnięcie
    start.addEventListener("pointerdown", () => { jitter = 0; });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }

  /** Woda: oddech w tempie 5/5 (ok. 6 oddechów na minutę). Tafla gładzi się, gdy wydech jest równy. Mikrofon opcjonalny; zapas: palec na ekranie przy wydechu. */
  function renderBreath() {
    sec.append(h("p", { class: "quote" }, it.intro!));
    const cycles = it.cycles ?? 10, tIn = (it.inhale ?? 5) * 1000, tOut = (it.exhale ?? 5) * 1000;
    const canvas = h("canvas", { class: "plate water", width: "600", height: "600", "aria-label": "Tafla wody w krypcie" }) as HTMLCanvasElement;
    const phaseEl = h("p", { class: "breath-phase" }, "…");
    const count = h("p", { class: "mono muted" }, `0 / ${cycles}`);
    const micBtn = h("button", {}, "Pozwól tafli słuchać");
    const start = h("button", { class: "primary" }, "Zacznij");
    const verdict = h("div");
    sec.append(canvas, phaseEl, count, h("div", { class: "verdict" }, start, micBtn), h("p", { class: "faint" }, "Nic nie jest nagrywane ani wysyłane: dźwięk liczy się w telefonie i znika."), verdict);
    const ctx = canvas.getContext("2d")!;
    let running = false, finished = done, done_cycles = 0, calm = 0, touching = false, mic: AnalyserNode | null = null, micBuf: Float32Array<ArrayBuffer> | null = null, baseline = 0.004;
    canvas.addEventListener("pointerdown", () => { touching = true; }); addEventListener("pointerup", () => { touching = false; });
    const rms = () => { if (!mic || !micBuf) return null; mic.getFloatTimeDomainData(micBuf); let s = 0; for (let i = 0; i < micBuf.length; i++) s += micBuf[i] * micBuf[i]; return Math.sqrt(s / micBuf.length); };
    let t0 = 0;
    function draw(now: number) {
      const period = tIn + tOut; const elapsed = running ? now - t0 : 0; const cyc = Math.floor(elapsed / period); const ph = elapsed % period; const inhale = ph < tIn;
      const target = inhale ? ph / tIn : 1 - (ph - tIn) / tOut; // 0..1 "pełność płuc"
      // ocena wydechu: mikrofon (szum wydechu powyżej tła) albo dotyk
      if (running && !inhale) { const r = rms(); const ok = r !== null ? r > baseline * 1.6 : touching; calm += ok ? 0.012 : -0.006; }
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
      if (running && cyc >= cycles && !finished) { finished = true; running = false; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("p", { class: "faint" }, "Dlaczego to działa: ", h("a", { href: "#/o-ciele" }, "co robi z tobą ta gra")), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: dziesięć oddechów.`); }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    start.addEventListener("click", () => { if (running) return; running = true; t0 = performance.now(); start.disabled = true; start.textContent = "Oddychaj"; });
    micBtn.addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new AudioContext(); const src = ac.createMediaStreamSource(stream); mic = ac.createAnalyser(); mic.fftSize = 2048; src.connect(mic); micBuf = new Float32Array(new ArrayBuffer(mic.fftSize * 4));
        micBtn.disabled = true; micBtn.textContent = "Tafla słucha. Kalibruję ciszę…";
        // kalibracja: 2,5 s ciszy = poziom zero (badania: progi absolutne zawodzą między telefonami)
        const samples: number[] = []; const iv = setInterval(() => { const r = rms(); if (r !== null) samples.push(r); }, 100);
        setTimeout(() => { clearInterval(iv); samples.sort((a, b) => a - b); baseline = Math.max(0.002, samples[Math.floor(samples.length / 2)] || 0.004); micBtn.textContent = "Tafla słucha"; }, 2500);
      } catch { toast("Bez mikrofonu: trzymaj palec na tafli, kiedy wydychasz."); }
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }

  /** Kamera jako czujnik: mała klatka, średnia koloru i jasności, nic nie opuszcza telefonu. */
  async function openCamera(video: HTMLVideoElement): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 320 } }, audio: false });
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
    sec.append(h("p", { class: "quote" }, it.intro!));
    const video = h("video", { playsinline: true, muted: true, class: "cam" }) as HTMLVideoElement;
    const probe = h("canvas", { width: "32", height: "24", style: "display:none" }) as HTMLCanvasElement;
    const stone = h("div", { class: "stone" }, h("i"));
    const status = h("p", { class: "mono muted" }, "kamień: zimny");
    const camBtn = h("button", { class: "primary" }, "Pokaż kamieniowi");
    const pick = h("input", { type: "color", value: "#5a7d95", "aria-label": "Zapas: wybierz kolor" }) as HTMLInputElement;
    const verdict = h("div");
    sec.append(video, probe, stone, status, h("div", { class: "verdict" }, camBtn, h("span", { class: "faint" }, "albo kolor:"), pick), verdict);
    let heat = 0, finished = done;
    const bump = (ok: boolean) => { heat = Math.max(0, Math.min(1, heat + (ok ? 0.06 : -0.03))); (stone.firstElementChild as HTMLElement).style.opacity = String(heat); status.textContent = heat > 0.95 ? "kamień: pulsuje" : heat > 0.5 ? "kamień: ciepły" : "kamień: zimny"; if (heat >= 1 && !finished) { finished = true; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: kamień odpowiedział.`); try { navigator.vibrate?.(200); } catch { /* */ } } };
    camBtn.addEventListener("click", async () => {
      if (!(await openCamera(video))) { toast("Bez kamery: wybierz kolor poniżej."); return; }
      camBtn.disabled = true; camBtn.textContent = "Kamień patrzy"; video.style.display = "block";
      setInterval(() => { const f = sampleFrame(video, probe); if (f) bump(f.red > 0.35); }, 120);
    });
    pick.addEventListener("input", () => { const v = pick.value; const r = parseInt(v.slice(1, 3), 16), g = parseInt(v.slice(3, 5), 16), b = parseInt(v.slice(5, 7), 16); const ok = r > 120 && r > g * 1.6 && r > b * 1.6; for (let i = 0; i < 20; i++) bump(ok); });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }

  /** Ciemność: tekst pojawia się, gdy kamera widzi ciemność (względem kalibracji). Zapas: przytrzymaj „ciemno”. */
  function renderDark() {
    sec.append(h("p", { class: "quote" }, it.intro!));
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
    const step = (isDark: boolean) => { dark = Math.max(0, Math.min(1, dark + (isDark ? 0.03 : -0.05))); lines.forEach((l, i) => (l.style.opacity = String(Math.max(0, Math.min(1, dark * 3 - i))))); page.style.background = `rgb(${241 - dark * 200},${235 - dark * 200},${221 - dark * 190})`; page.style.color = dark > 0.5 ? "#e8e0cf" : "#1e1a14"; if (dark >= 1 && !finished) { finished = true; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: przeczytane w ciemności.`); } };
    camBtn.addEventListener("click", async () => {
      if (!(await openCamera(video))) { toast("Bez kamery: przytrzymaj „ciemno”."); return; }
      camBtn.disabled = true; camBtn.textContent = "Kalibruję światło…";
      const samples: number[] = []; const iv = setInterval(() => { const f = sampleFrame(video, probe); if (f) samples.push(f.lum); }, 100);
      setTimeout(() => { clearInterval(iv); samples.sort((a, b) => a - b); baseline = samples[Math.floor(samples.length / 2)] ?? 0.5; camBtn.textContent = "Kamera patrzy"; setInterval(() => { const f = sampleFrame(video, probe); if (f) { status.textContent = `światło: ${(f.lum * 100).toFixed(0)}%`; step(f.lum < Math.max(0.04, baseline * 0.3)); } }, 120); }, 2000);
    });
    hold.addEventListener("pointerdown", () => { holding = true; }); addEventListener("pointerup", () => { holding = false; });
    setInterval(() => { if (holding) step(true); }, 120);
    if (done) { lines.forEach((l) => (l.style.opacity = "1")); verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!))); }
  }

  /** Ziemia: telefon płasko, dwadzieścia kroków. Żyroskop: przechył sypie less na cegłę. Zapas: trzymanie przycisku. */
  function renderEarth() {
    sec.append(h("p", { class: "quote" }, it.intro!));
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
        if (level) { if (now - lastStep > 900) { steps++; lastStep = now; status.textContent = `${steps} / ${total} kroków`; try { navigator.vibrate?.(20); } catch { /* */ } } spill = Math.max(0, spill - 0.004); }
        else { spill = Math.min(1, spill + 0.02); if (spill >= 1) { steps = 0; spill = 0; status.textContent = `Less na cegle. Wracasz. 0 / ${total}`; } }
      }
      ctx.fillStyle = "#e8e0cf";
      for (const gr of grains) { gr.y += gr.v * (0.2 + (running && !level ? 3 : 0.4)); gr.x += (tilt - 0.2) * 1.5; if (gr.y > 300) { gr.y = -2; gr.x = Math.random() * 600; } ctx.fillRect(gr.x, gr.y, 1.5, 1.5); }
      // less zsunięty na cegłę
      ctx.fillStyle = "#e8e0cf"; ctx.globalAlpha = 0.9; ctx.fillRect(520, 150 - spill * 40, 60, spill * 40); ctx.globalAlpha = 1;
      // pozycja
      const px = 30 + (steps / total) * 470; ctx.beginPath(); ctx.arc(px, 225, 5, 0, Math.PI * 2); ctx.fillStyle = "#c9a86a"; ctx.fill();
      if (steps >= total && !finished) { finished = true; running = false; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: dwadzieścia kroków.`); }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    start.addEventListener("click", async () => {
      try {
        const DO = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
        if (DO.requestPermission) { const r = await DO.requestPermission(); if (r !== "granted") throw new Error("denied"); }
        addEventListener("deviceorientation", onOrient);
      } catch { toast("Bez żyroskopu: trzymaj przycisk, żeby iść równo."); }
      running = true; start.textContent = "Trzymaj równo"; lastStep = performance.now();
      start.addEventListener("pointerdown", () => { holding = true; }); addEventListener("pointerup", () => { holding = false; });
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }

  function renderPlate() {
    sec.append(h("p", { class: "quote" }, it.intro!));
    const canvas = h("canvas", { class: "plate", width: "600", height: "600", "aria-label": "Płyta z piaskiem" }) as HTMLCanvasElement;
    const status = h("p", { class: "mono muted" }, "cisza");
    const slider = h("input", { type: "range", min: "80", max: "400", value: "120", "aria-label": "Ton (suwak zapasowy)" }) as HTMLInputElement;
    const micBtn = h("button", { class: "primary" }, "Włącz mikrofon");
    const verdict = h("div");
    sec.append(canvas, status, h("div", { class: "verdict" }, micBtn, h("span", { class: "faint" }, "albo suwak:")), slider, verdict);
    const ctx = canvas.getContext("2d")!;
    const N = 1400; const pts = Array.from({ length: N }, () => ({ a: Math.random() * Math.PI * 2, r: Math.random(), j: Math.random() }));
    let hz: number | null = null, hold = 0, finished = done;
    const target = it.targetHz ?? 196, tol = it.tolerance ?? 6;
    function draw() {
      const c = hz ? closeness(hz, target, tol) : 0;
      ctx.fillStyle = "#1a1813"; ctx.fillRect(0, 0, 600, 600);
      ctx.fillStyle = "#e8e0cf";
      for (const p of pts) {
        // Przy c→1 piasek wędruje do linii węzłowych siedmioramiennej gwiazdy; przy c→0 leży losowo.
        const star = 0.55 + 0.35 * Math.abs(Math.cos(3.5 * p.a));
        const r = (p.r * (1 - c) + star * c) * 270;
        const x = 300 + Math.cos(p.a) * r + (1 - c) * (p.j - 0.5) * 30;
        const y = 300 + Math.sin(p.a) * r + (1 - c) * (p.j - 0.5) * 30;
        ctx.fillRect(x, y, 1.6, 1.6);
      }
      status.textContent = hz ? `${hz.toFixed(0)} Hz · ${c > 0.9 ? "siedem ramion" : c > 0.5 ? "blisko" : "piasek nie słucha"}` : "cisza";
      if (c > 0.9 && !finished) { hold++; if (hold > 25) { finished = true; verdict.replaceChildren(h("div", { class: "solution fade-in" }, h("p", {}, it.reveal!)), h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")); finish(`${it.title}: ton znaleziony.`); } } else hold = 0;
      requestAnimationFrame(draw);
    }
    draw();
    slider.addEventListener("input", () => { hz = Number(slider.value); });
    micBtn.addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new AudioContext(); const src = ac.createMediaStreamSource(stream); const an = ac.createAnalyser(); an.fftSize = 4096; src.connect(an);
        const buf = new Float32Array(an.fftSize);
        const smooth = new PitchSmoother(7);
        micBtn.disabled = true; micBtn.textContent = "Mikrofon słucha";
        setInterval(() => { an.getFloatTimeDomainData(buf); const p = smooth.push(detectPitch(buf, ac.sampleRate)); if (p) hz = p; }, 60);
      } catch { toast("Bez mikrofonu. Użyj suwaka."); }
    });
    if (done) verdict.append(h("div", { class: "solution" }, h("p", {}, it.reveal!)));
  }
}
