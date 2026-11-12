import { h, go, toast } from "./dom";
import { topbar } from "./views";
import type { App } from "../app";
import { save } from "../engine/state";
import { detectPitch, closeness, PitchSmoother } from "../engine/pitch";

export interface Interlude {
  id: string; type: "amor" | "talk" | "plate" | "beat" | "still"; after: number; title: string;
  audio?: string; q?: string; options?: string[]; answer?: number; seconds?: number;
  lines?: string[];
  intro?: string; person?: string; questions?: { q: string; a: string }[]; lie?: number; reveal?: string; wrong?: string;
  targetHz?: number; tolerance?: number;
}

export function interludesFor(app: App): Interlude[] {
  const passed = app.state.solvedCases.length + app.state.unstableGates.length;
  return (app.interludes as Interlude[]).filter((i) => i.after <= passed);
}

export function viewInterlude(app: App, id: string): HTMLElement {
  const found = (app.interludes as Interlude[]).find((i) => i.id === id);
  const sec = h("section", { class: "fade-in interlude" }, topbar(app, "#/mapa"));
  if (!found) { sec.append(h("p", {}, "Nie ma takiego przerywnika.")); return sec; }
  const it: Interlude = found;
  const passed = app.state.solvedCases.length + app.state.unstableGates.length;
  if (it.after > passed) { sec.append(h("h2", {}, it.title), h("p", { class: "muted" }, `Po ${it.after} przebytych bramach.`), h("button", { onclick: () => go("#/mapa") }, "Mapa")); return sec; }
  const done = app.state.interludesDone.includes(it.id);
  sec.append(h("p", { class: "faint" }, "Między sprawami"), h("h2", {}, it.title));
  if (it.type === "amor") renderAmor(); else if (it.type === "talk") renderTalk(); else if (it.type === "beat") renderBeat(); else if (it.type === "still") renderStill(); else renderPlate();
  return sec;

  function finish(note: string) {
    if (!app.state.interludesDone.includes(it.id)) { app.state.interludesDone.push(it.id); app.addNote(note, "między sprawami"); save(app.state); }
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
    sec.append(h("div", { class: "card" }, audio, h("p", { class: "faint" }, "Słuchawki na obu uszach. Głośnik telefonu tego nie odda: nie dlatego, że jest słaby, tylko dlatego, że to powstaje dopiero między uszami.")));
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
