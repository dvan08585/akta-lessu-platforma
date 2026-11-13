import { App } from "./app";
import { startLess } from "./ui/less";
import { viewIntro, viewMap, viewGate, viewNotebook, viewAkta, viewBody, viewInbox, viewOnboarding } from "./ui/views";
import { viewInterlude } from "./ui/interludes";
import { installAnalytics } from "./engine/track";

const app = new App();
installAnalytics(app.cfg.analyticsDomain);
const root = document.getElementById("app")!;
startLess(document.getElementById("less") as HTMLCanvasElement);

function route() {
  const hash = location.hash || "#/";
  const m = /^#\/brama\/(\d+)/.exec(hash);
  const mi = /^#\/miedzy\/([a-z0-9-]+)/.exec(hash);
  let view: HTMLElement;
  if (m) view = viewGate(app, Number(m[1]));
  else if (mi) view = viewInterlude(app, mi[1]);
  else if (hash.startsWith("#/mapa")) view = viewMap(app);
  else if (hash.startsWith("#/zeszyt")) view = viewNotebook(app);
  else if (hash.startsWith("#/akta")) view = viewAkta(app);
  else if (hash.startsWith("#/o-ciele")) view = viewBody(app);
  else if (hash.startsWith("#/wiadomosci")) view = viewInbox(app);
  else if (hash.startsWith("#/wejscie")) view = viewOnboarding(app);
  else if (!app.state.onboarded && !app.state.solvedCases.length && !app.state.testMode && (hash === "#/" || hash === "")) view = viewOnboarding(app);
  else view = viewIntro(app);
  view.id = "tresc"; view.setAttribute("tabindex", "-1"); root.replaceChildren(view);
  window.scrollTo({ top: 0 });
}
addEventListener("hashchange", route);
app.ready.then(route);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js").catch(() => {});
}
