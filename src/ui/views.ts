import { h, go, toast } from "./dom";
import { renderMap, statusLabel } from "./map";
import type { App } from "../app";
import type { CaseData, Doc } from "../engine/types";
import { evaluate, heatLabel, recordAttempt, halfKey, looksLikeHalfKey } from "../engine/cases";
import { shareCard, shareText } from "../engine/share";
import { codeMatches, unlockDate, placeFromUrl } from "../engine/unlock";
import { exportCode, importCode, save, reset } from "../engine/state";

export function pendant(heat: 0 | 1 | 2 | 3 | 4, label?: string): HTMLElement {
  return h("span", { class: "pendant", "data-heat": String(heat), "aria-live": "polite" }, h("i"), label ?? `zawieszka: ${heatLabel[heat]}`);
}

export function topbar(app: App, active: string): HTMLElement {
  const nav = h("nav");
  for (const [hash, name] of [["#/mapa", "Mapa"], ["#/zeszyt", "Zeszyt"], ["#/akta", "Akta"]]) {
    nav.append(h("button", { class: active === hash ? "" : "ghost", onclick: () => go(hash), "aria-current": active === hash ? "page" : "false" }, name));
  }
  return h("header", { class: "topbar" }, h("a", { class: "brand", href: "#/" }, app.cfg.title), nav);
}

export function viewIntro(app: App): HTMLElement {
  const solved = app.state.solvedCases.length;
  return h("section", { class: "intro fade-in" },
    h("p", { class: "faint" }, "Sandomierz · siedem wzgórz · pod nimi"),
    h("h1", {}, "Akta Lessu"),
    h("p", { class: "quote" }, "Less nie był pyłem. Less był materią, która pamięta. ", h("em", {}, "Jak skóra okładki, jak wosk na pieczęci, jak zapach jabłek w piwnicy.")),
    h("p", { class: "muted" }, "Śledztwo z dokumentów. Siedem bram pod miastem. Jedna sprawa na raz, dziesięć minut, bez logowania. Mapa pokazuje tylko to, co już wiesz."),
    h("div", { class: "cta" },
      h("button", { class: "primary", onclick: () => go(solved ? "#/mapa" : "#/brama/4") }, solved ? "Wróć do mapy" : "Otwórz akta"),
      h("button", { onclick: () => go("#/akta") }, "Mam kod z książki")),
    h("p", { class: "faint" }, "Do powieści „Siedem Bram Lessu”. Nic tutaj nie zdradza zakończenia."));
}

export function viewMap(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in" }, topbar(app, "#/mapa"));
  sec.append(h("h2", {}, "Siedem wzgórz, jeden przekrój"));
  sec.append(renderMap({
    map: app.map, chapters: app.chapters, state: app.state,
    isUnlocked: (n) => app.isUnlocked(n), gateStatus: (n) => app.gateStatus(n),
    onCursor: (n) => { app.state.chapterCursor = n; save(app.state); },
  }));
  const list = h("div", { class: "gates-list" });
  for (const g of app.map.gates) {
    const st = app.gateStatus(g.n);
    const c = app.caseForGate(g.n);
    list.append(h("div", { class: "gate-row", "data-status": st, role: "button", tabindex: "0", onclick: () => go(`#/brama/${g.n}`) },
      h("span", { class: "n" }, String(g.n)),
      h("span", { class: "t" }, g.name, h("small", {}, `żywioł: ${g.element}${c ? " · " + c.title : ""}`)),
      h("span", { class: "s" }, statusLabel(st))));
  }
  sec.append(h("h3", {}, app.state.sawFooter ? "Rejestr statusów — Fundacja Sandomierska Memoria" : "Rejestr statusów"), list);
  return sec;
}

export function viewGate(app: App, n: number): HTMLElement {
  const g = app.map.gates.find((x) => x.n === n);
  const sec = h("section", { class: "fade-in" }, topbar(app, "#/mapa"));
  if (!g) { sec.append(h("p", {}, "Nie ma takiej bramy.")); return sec; }
  const c = app.caseForGate(n);
  const st = app.gateStatus(n);
  sec.append(h("p", { class: "faint" }, `Brama ${n} · ${g.name} · żywioł: ${g.element}`));
  if (!c) {
    sec.append(h("h2", {}, g.silent ? "Zawieszka milczy." : "Status: nieznany"),
      h("p", { class: "muted" }, g.silent ? "Na tym wzgórzu zawieszka nie reaguje. Nie dlatego, że nie ma tu bramy." : "Ta sprawa otworzy się później. Mapa jest psychograficzna, nie kartograficzna."),
      h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy"));
    return sec;
  }
  if (st === "locked") {
    const need = c.requires.solvedCases !== undefined && app.state.solvedCases.length < c.requires.solvedCases
      ? `Ta sprawa otwiera się po ${c.requires.solvedCases} rozpoznanych bramach. Masz ${app.state.solvedCases.length}.`
      : `Ta sprawa wymaga rozdziału ${c.requires.chapter}.`;
    sec.append(h("h2", {}, c.title), h("p", { class: "muted" }, need),
      h("button", { onclick: () => go("#/akta") }, "Wpisz kod z książki"), " ", h("button", { onclick: () => go("#/mapa") }, "Mapa"));
    return sec;
  }
  return viewCase(app, c, sec);
}

function docEl(app: App, d: Doc): HTMLElement {
  const el = h("article", { class: `doc ${d.style ?? ""}` }, h("h4", {}, d.title), h("div", { class: "src" }, d.source));
  for (const p of d.paragraphs) el.append(h("p", {}, p));
  if (d.audio) {
    const audio = h("audio", { controls: true, preload: "none", src: import.meta.env.BASE_URL + d.audio }) as HTMLAudioElement;
    // Synestezja jako interfejs: ton, którego nie słychać, czuć w dłoni.
    audio.addEventListener("play", () => { try { navigator.vibrate?.([120, 880, 120, 880, 120, 880]); } catch { /* brak API */ } });
    el.append(h("div", { class: "audio" }, audio, h("div", { class: "src" }, "Jeśli nic nie słyszysz, połóż telefon na dłoni.")));
  }
  const footer = d.footer ?? app.cfg.footer;
  if (footer) el.append(h("div", { class: `footer ${app.state.sawFooter ? "seen" : ""}` }, footer));
  return el;
}

function visibleDocs(app: App, c: CaseData): Doc[] {
  return c.docs.filter((d) => !d.requiresPlace || app.state.placeVisits.includes(d.requiresPlace));
}

const MONTHS = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];

export function viewCase(app: App, c: CaseData, sec: HTMLElement): HTMLElement {
  const solvedAlready = app.state.solvedCases.includes(c.n);
  const unstable = app.state.unstableGates.includes(c.gate);
  sec.append(h("h2", {}, c.title), h("p", { class: "muted" }, c.subtitle), h("p", { class: "faint" }, c.epigraph));

  // Dokumenty: nawigacja zakładkami, jeden na ekran (telefon).
  const docs = visibleDocs(app, c);
  const docNav = h("div", { class: "doc-nav", role: "tablist" });
  const docBox = h("div");
  const show = (i: number) => {
    docBox.replaceChildren(docEl(app, docs[i]));
    docNav.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(i === j)));
  };
  docs.forEach((d, i) => docNav.append(h("button", { role: "tab", onclick: () => show(i) }, d.title.replace("Dokument ", ""))));
  show(0);
  sec.append(h("h3", {}, "Dokumenty"), docNav, docBox);
  const hiddenCount = c.docs.length - docs.length;
  if (hiddenCount) sec.append(h("p", { class: "faint" }, `${hiddenCount} ${hiddenCount === 1 ? "dokument jest dostępny" : "dokumenty są dostępne"} tylko na miejscu, w Sandomierzu.`));

  const solutionBox = h("div");
  if (unstable) { renderBuried(); return sec; }
  if (c.type === "decision") { renderDecision(); if (solvedAlready) renderSolution(1); return sec; }
  if (c.type === "pair") { renderPair(); if (solvedAlready) renderSolution(1); return sec; }

  // Pytania (deduction)
  const saved = app.state.answers[c.id] ?? [];
  const grid = h("div", { class: "grid" });
  c.questions.forEach((q, qi) => {
    const block = h("div", { class: "q", id: `q-${qi}` }, h("div", { class: "qt" }, `${qi + 1}. ${q.text}`));
    if (q.kind === "month") {
      const sel = h("select", { name: q.id, "aria-label": q.text }) as HTMLSelectElement;
      sel.append(h("option", { value: "0" }, "wybierz miesiąc"));
      MONTHS.forEach((m, i) => sel.append(h("option", { value: String(i + 1) }, m)));
      if (saved[qi] >= 1) sel.value = String(saved[qi]);
      const line = h("p", { class: "month-line" });
      const showLine = () => { const m = Number(sel.value); if (m >= 1 && q.monthLines?.[m - 1]) { line.replaceChildren(h("span", {}, q.monthLines[m - 1] + " "), h("em", {}, q.monthClosing ?? "")); app.state.month = m; save(app.state); } else line.replaceChildren(); };
      sel.addEventListener("change", showLine); showLine();
      block.append(sel, line);
    } else {
      const options = q.kind === "reject" ? docs.map((d) => `${d.title}: ${d.source.length > 90 ? d.source.slice(0, 88) + "…" : d.source}`) : q.options;
      const opts = h("div", { class: "opts", role: "radiogroup", "aria-label": q.text });
      options.forEach((o, oi) => {
        const input = h("input", { type: "radio", name: q.id, value: String(oi) }) as HTMLInputElement;
        if (saved[qi] === oi) input.checked = true;
        opts.append(h("label", {}, input, o));
      });
      block.append(opts);
    }
    grid.append(block);
  });
  sec.append(h("h3", {}, "Ustal"), grid);

  const pend = pendant(0);
  const result = h("div", { class: "verdict" }, pend);
  const btn = h("button", { class: "primary" }, "Sprawdź zawieszką") as HTMLButtonElement;
  btn.addEventListener("click", async () => {
    const answers = c.questions.map((q) => {
      if (q.kind === "month") { const el = sec.querySelector<HTMLSelectElement>(`select[name="${q.id}"]`); return el ? Number(el.value) : 0; }
      const el = sec.querySelector<HTMLInputElement>(`input[name="${q.id}"]:checked`); return el ? Number(el.value) : -1;
    });
    if (answers.some((a) => a < 0) || c.questions.some((q, i) => q.kind === "month" && answers[i] < 1)) { toast("Odpowiedz na wszystkie pytania. Zawieszka nie reaguje na puste miejsca."); return; }
    app.state.answers[c.id] = answers;
    const v = evaluate(c, answers);
    recordAttempt(app.state, c, v);
    save(app.state);
    const cold = c.gate === 5; // Brama Zamkowa: żywioł zimno. Zawieszka ziębi zamiast grzać.
    pend.replaceWith(pendant(v.heat, cold ? `zawieszka: ${["zimna", "zimniejsza", "lodowata", "parzy zimnem", "zamarza"][v.heat]}` : undefined));
    if (v.solved) { grid.querySelectorAll(".q").forEach((el) => el.classList.add("ok")); renderSolution((app.state.attempts[c.id] ?? []).length || 1); }
    else {
      const tries = (app.state.attempts[c.id] ?? []).length;
      const hints = c.questions.filter((q, i) => !v.perQuestion[i] && q.hint).map((q) => q.hint!);
      toast(tries >= 3 && hints.length ? hints[0] : `Zawieszka: ${heatLabel[v.heat]}. ${v.correct} z ${v.total}.`);
    }
  });
  sec.append(result, btn, solutionBox);
  if (solvedAlready) { pend.replaceWith(pendant(4)); renderSolution((app.state.attempts[c.id] ?? []).length || 1); }
  return sec;

  function renderDecision() {
    const d = c.decision!;
    const box = h("div", { class: "decision" }, h("p", { class: "quote" }, d.prompt));
    const open = h("button", { class: "primary" }, d.open);
    const leave = h("button", {}, d.leave);
    open.addEventListener("click", () => {
      if (d.correct === "open") { markSolved(); renderSolution(1); return; }
      if (!app.state.unstableGates.includes(c.gate)) app.state.unstableGates.push(c.gate);
      app.addNote(`Brama ${c.gate}: otwarto. Status: niestabilna.`, "decyzja");
      save(app.state); box.remove(); renderBuried();
    });
    leave.addEventListener("click", () => {
      if (d.correct === "leave") { markSolved(); box.remove(); renderSolution(1); return; }
      toast("Zawieszka milczy."); 
    });
    box.append(h("div", { class: "verdict" }, open, leave));
    if (!solvedAlready) sec.append(box);
    sec.append(solutionBox);
  }

  function renderBuried() {
    const d = c.decision!;
    const art = h("div", { class: "buried" });
    for (const p of d.buried) art.append(h("p", {}, p));
    const cover = h("div", { class: "less-cover" });
    const box = h("div", { class: "buried-wrap" }, art, cover);
    sec.append(h("h3", {}, "Status: niestabilna"), box, h("p", { class: "faint" }, "Ta brama zostanie w twojej karcie jako ▲. Na zawsze."),
      h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy"));
    requestAnimationFrame(() => box.classList.add("go"));
  }

  function renderPair() {
    const p = c.pair!;
    const box = h("div", { class: "pair" }, h("p", { class: "quote" }, p.prompt));
    const mine = h("span", { class: "mono" }, "…");
    halfKey(app.state.seed).then((k) => (mine.textContent = k));
    box.append(h("p", { class: "muted" }, "Twoja połowa klucza: ", mine, ". Jest też w twojej karcie udostępnienia."));
    const input = h("input", { type: "text", placeholder: "POŁOWA KLUCZA DRUGIEJ OSOBY", "aria-label": "Połowa klucza drugiej osoby", style: "text-transform:none;letter-spacing:0.1em" }) as HTMLInputElement;
    const btn = h("button", { class: "primary" }, "Oddychaj razem");
    btn.addEventListener("click", async () => {
      const v = input.value.trim().toLowerCase();
      const own = await halfKey(app.state.seed);
      if (!looksLikeHalfKey(v)) { toast("To nie jest połowa klucza. Siedem znaków, z czyjejś karty."); return; }
      if (v === own) { toast(p.refuse); return; }
      markSolved(); app.addNote(`Brama ${c.gate}: oddech we dwoje. Klucz partnera: ${v}.`, "para");
      box.remove(); renderSolution(1);
    });
    const ask = h("button", { onclick: async () => { const own = await halfKey(app.state.seed); const r = await shareText(`${p.ask}\n${own}\n${app.cfg.share.url}#/brama/${c.gate}`); toast(r === "shared" ? "Wysłano." : r === "copied" ? "Skopiowano prośbę do schowka." : "Nie udało się."); } }, "Poproś kogoś");
    box.append(h("div", { class: "row" }, input, btn), h("div", { class: "verdict" }, ask));
    if (!solvedAlready) sec.append(box);
    sec.append(solutionBox);
  }

  function markSolved() {
    if (!app.state.solvedCases.includes(c.n)) app.state.solvedCases.push(c.n);
    const list = app.state.attempts[c.id] ?? []; list.push({ at: Date.now(), correct: 1, total: 1 }); app.state.attempts[c.id] = list;
    save(app.state);
  }

  function renderSolution(tries: number) {
    if (c.gate === 5 && !app.state.sawFooter) { app.state.sawFooter = true; save(app.state); }
    const sol = h("div", { class: "solution fade-in" });
    for (const p of c.solution) sol.append(h("p", {}, p));
    const build = async () => {
      const hk = app.state.solvedCases.length >= 6 ? await halfKey(app.state.seed) : undefined;
      return shareCard({ solved: app.solvedGates(), unstable: app.state.unstableGates, attempts: tries, streak: app.state.streak.days, url: app.cfg.share.url, hashtag: app.cfg.share.hashtag, caseN: c.n, halfKey: hk });
    };
    const pre = h("pre", {}, "…");
    build().then((card) => (pre.textContent = card));
    const share = h("div", { class: "share" }, h("h3", {}, "Zostaw ślad"), pre,
      h("div", { class: "verdict" },
        h("button", { class: "primary", onclick: async () => { const r = await shareText(await build()); toast(r === "shared" ? "Udostępniono." : r === "copied" ? "Skopiowano do schowka." : "Nie udało się. Zaznacz i skopiuj."); } }, "Udostępnij"),
        h("button", { onclick: () => go("#/mapa") }, "Wróć do mapy")));
    solutionBox.replaceChildren(sol, share);
    if (c.pair) for (const p of c.pair.finale) sol.append(h("p", { class: "finale" }, p));
    if (c.reward) {
      const r = app.rewards[c.reward.file];
      if (r) {
        const art = h("article", { class: "doc hand" }, h("h4", {}, r.title), h("div", { class: "src" }, r.note));
        for (const p of r.paragraphs) art.append(h("p", {}, p));
        solutionBox.append(h("h3", {}, "Nagroda: tekst"), art);
      }
    }
    if (!solvedAlready) app.addNote(`Brama ${c.gate} rozpoznana: ${c.title}.`, `próby: ${tries}`);
    sol.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function viewNotebook(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in notebook" }, topbar(app, "#/zeszyt"), h("h2", {}, "Zeszyt"));
  sec.append(h("p", { class: "muted" }, `Rozpoznane bramy: ${app.state.solvedCases.length}/7${app.state.unstableGates.length ? ` · niestabilne: ${app.state.unstableGates.join(", ")}` : ""} · seria: ${app.state.streak.days} ${app.state.streak.days === 1 ? "dzień" : "dni"}`));
  if (!app.state.notebook.length) sec.append(h("p", { class: "faint" }, "Pusty. Geolożka szukała nazwy."));
  for (const e of [...app.state.notebook].reverse()) {
    sec.append(h("div", { class: "entry" }, h("div", { class: "meta" }, `${new Date(e.at).toLocaleString("pl-PL")} · ${e.meta}`), h("div", {}, e.text)));
  }
  const code = exportCode(app.state);
  sec.append(h("h3", {}, "Kod wznowienia"), h("p", { class: "faint" }, "Wpisz go na innym urządzeniu w zakładce Akta. Bez konta, bez serwera."), h("pre", { class: "mono", style: "white-space:pre-wrap;word-break:break-all" }, code));
  return sec;
}

export function viewAkta(app: App): HTMLElement {
  const sec = h("section", { class: "fade-in" }, topbar(app, "#/akta"), h("h2", {}, "Akta"));
  // Klucz 1: kod z książki
  const input = h("input", { type: "text", placeholder: "KOD Z KOŃCA ROZDZIAŁU", "aria-label": "Kod z książki", autocomplete: "off", autocapitalize: "characters" }) as HTMLInputElement;
  const btn = h("button", { class: "primary" }, "Otwórz");
  btn.addEventListener("click", async () => {
    const val = input.value.trim(); if (!val) return;
    let hit: number | null = null;
    for (const ch of app.chapters) if (ch.codeHash && (await codeMatches(val, ch.codeHash))) { hit = ch.n; break; }
    if (hit === null) { toast("Zawieszka zimna. To nie ten kod."); return; }
    if (!app.state.unlockedChapters.includes(hit)) { app.state.unlockedChapters.push(hit); app.state.chapterCursor = Math.max(app.state.chapterCursor, hit); save(app.state); }
    app.addNote(`Otwarto ${hit === 0 ? "Prolog" : "rozdział " + hit} kodem z książki.`, "klucz: kod");
    toast(`Otwarto: ${hit === 0 ? "Prolog" : "R." + hit}.`); input.value = ""; go("#/mapa");
  });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });
  sec.append(h("div", { class: "gatebox" }, h("h3", {}, "Klucz pierwszy: kod z książki"), h("p", { class: "muted" }, "Każdy rozdział kończy się siedmiobokiem i jednym słowem. Wpisz je tutaj."), h("div", { class: "row" }, input, btn)));

  // Klucz 2: czas
  const next = app.nextLocked();
  const box2 = h("div", { class: "gatebox" }, h("h3", {}, "Klucz drugi: czas"));
  if (next) {
    const d = unlockDate(app.cfg, next.n);
    box2.append(h("p", { class: "muted" }, d ? `${next.n === 0 ? "Prolog" : "Rozdział " + next.n} otworzy się sam: ${d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}.` : `Rozdział ${next.n} nie otwiera się czasem. Tylko kodem.`));
    const cd = h("div", { class: "countdown" }); box2.append(cd);
    const tick = () => { if (!d) return; const ms = d.getTime() - Date.now(); if (ms <= 0) { cd.textContent = "Otwarte."; return; } const dd = Math.floor(ms / 86400000), hh = Math.floor((ms % 86400000) / 3600000), mm = Math.floor((ms % 3600000) / 60000); cd.textContent = `za ${dd} dni ${hh} h ${mm} min`; };
    tick(); setInterval(tick, 30000);
  } else box2.append(h("p", { class: "muted" }, "Wszystko, co można otworzyć czasem, jest otwarte."));
  box2.append(h("p", { class: "faint" }, `Premiera: ${new Date(app.cfg.premiereDate).toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" })}. W dniu premiery rejestr statusów zmienia się co godzinę.`));
  sec.append(box2);

  // Klucz 3: miejsce
  const qr = placeFromUrl(location.search);
  sec.append(h("div", { class: "gatebox" }, h("h3", {}, "Klucz trzeci: miejsce"), h("p", { class: "muted" }, qr ? `Jesteś przy punkcie „${qr}”. Zapisano w zeszycie.` : "Kody QR w Sandomierzu otwierają dokumenty, których nie ma w trybie domowym. Zeskanuj je na miejscu."),
    h("p", { class: "faint" }, `Odwiedzone punkty: ${app.state.placeVisits.length ? app.state.placeVisits.join(", ") : "brak"}`)));

  // Wznowienie
  const inp2 = h("input", { type: "text", placeholder: "KOD WZNOWIENIA", "aria-label": "Kod wznowienia", style: "text-transform:none;letter-spacing:0" }) as HTMLInputElement;
  const b2 = h("button", { onclick: () => { const st = importCode(inp2.value); if (!st) { toast("Nieprawidłowy kod."); return; } Object.assign(app.state, st); save(app.state); toast("Wznowiono."); go("#/mapa"); } }, "Wznów");
  sec.append(h("div", { class: "gatebox" }, h("h3", {}, "Wznowienie na innym urządzeniu"), h("div", { class: "row" }, inp2, b2)));
  sec.append(h("p", {}, h("button", { class: "ghost", onclick: () => { if (confirm("Wyczyścić cały postęp na tym urządzeniu?")) { reset(); location.reload(); } } }, "Zacznij od nowa")));
  return sec;
}
