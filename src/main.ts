import { App } from "./app";
import { startLess } from "./ui/less";
import { viewIntro, viewMap, viewGate, viewNotebook, viewAkta, viewBody, viewInbox, viewOnboarding, viewSettings } from "./ui/views";
import { viewProtokol } from "./ui/protokol";
import { viewPaszport } from "./ui/paszport";
import { sendEvent } from "./engine/wspolny";
import { save } from "./engine/state";
import { viewInterlude } from "./ui/interludes";
import { installAnalytics } from "./engine/track";
import { isNight } from "./engine/sun";
import { leaveView } from "./ui/dom";

const app = new App();
installAnalytics(app.cfg.analyticsDomain);
const root = document.getElementById("app")!;
startLess(document.getElementById("less") as HTMLCanvasElement);

/** Motyw: za słońcem Sandomierza, chyba że gracz wybrał ręcznie. */
export function applyTheme(): void {
  const t = app.state.theme ?? "sun";
  const dark = t === "dark" || (t === "sun" && isNight());
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
}
setInterval(applyTheme, 60000);

function route() {
  applyTheme();
  navigator.storage?.persist?.().catch(() => { /* przeglądarka bez trwałego zapisu */ });
  // Liczba biegłych w programie: kto przyjął zlecenie, ten się liczy (raz na urządzenie, bez danych)
  if (app.state.onboarded && !app.state.hello && app.cfg.backendUrl) sendEvent(app.cfg.backendUrl, app.state, { type: "start" }).then(() => { app.state.hello = true; save(app.state); });
  // Lejek: instalacja jako aplikacja (decyduje o Web Push po Playteście 2); raz na urządzenie
  if (app.cfg.backendUrl && !app.state.pwaSent && (matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true)) sendEvent(app.cfg.backendUrl, app.state, { type: "pwa" }).then(() => { app.state.pwaSent = true; save(app.state); });
  const hash = location.hash || "#/";
  const m = /^#\/brama\/(\d+)/.exec(hash);
  const mi = /^#\/miedzy\/([a-z0-9-]+)/.exec(hash);
  leaveView(); // zgaś kamerę, mikrofon, czujniki i pętle poprzedniego widoku
  let view: HTMLElement;
  if (m) view = viewGate(app, Number(m[1]));
  else if (mi) view = viewInterlude(app, mi[1]);
  else if (hash.startsWith("#/mapa")) view = viewMap(app);
  else if (hash.startsWith("#/zeszyt")) view = viewNotebook(app);
  else if (hash.startsWith("#/protokol")) view = viewProtokol(app);
  else if (hash.startsWith("#/paszport")) view = viewPaszport(app);
  else if (hash.startsWith("#/ustawienia")) view = viewSettings(app);
  else if (hash.startsWith("#/akta")) view = viewAkta(app);
  else if (hash.startsWith("#/o-ciele")) view = viewBody(app);
  else if (hash.startsWith("#/wiadomosci")) view = viewInbox(app);
  else if (hash.startsWith("#/wejscie")) view = viewOnboarding(app);
  else if (!app.state.onboarded && !app.state.solvedCases.length && !app.state.testMode && (hash === "#/" || hash === "")) view = viewOnboarding(app);
  else if (hash.startsWith("#/zlecenie")) view = viewIntro(app);
  else if (app.state.solvedCases.length) view = viewMap(app); // po pierwszej sprawie strona główna to mapa; pismo komisarza zostaje pod #/zlecenie
  else view = viewIntro(app);
  view.id = "tresc"; view.setAttribute("tabindex", "-1"); root.replaceChildren(view);
  window.scrollTo({ top: 0 });
}
addEventListener("hashchange", route);
app.ready.then(route);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {});
}

// Nowa wersja na serwerze: karta otwarta od dawna (albo ekran początkowy) nie robi nawigacji, więc sama by jej nie zobaczyła.
// Porównujemy version.json ze znacznikiem wbudowanym w ten plik; różnica to pasek z jednym przyciskiem. Bez pytania o nic.
let askedForReload = false;
async function checkVersion(): Promise<void> {
  if (!import.meta.env.PROD || askedForReload) return;
  try {
    const r = await fetch(import.meta.env.BASE_URL + "version.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return;
    const j = (await r.json()) as { build?: string };
    if (j.build && j.build !== __BUILD__) {
      askedForReload = true;
      const bar = document.createElement("div"); bar.className = "update-bar"; bar.setAttribute("role", "status");
      bar.append("Akta zostały uzupełnione. ");
      const b = document.createElement("button"); b.className = "primary"; b.textContent = "Odśwież";
      b.addEventListener("click", () => location.reload());
      bar.append(b); document.body.append(bar);
    }
  } catch { /* bez sieci: nic */ }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") checkVersion(); });
setInterval(checkVersion, 10 * 60 * 1000);
setTimeout(checkVersion, 15000);
