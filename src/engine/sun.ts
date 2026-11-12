/** Wschód słońca dla Sandomierza (50,68°N, 21,75°E), algorytm NOAA w uproszczeniu. Dokładność ±2 min: wystarczy na świt. */
const LAT = 50.68, LON = 21.75;
const rad = (d: number) => (d * Math.PI) / 180, deg = (r: number) => (r * 180) / Math.PI;
export function sunrise(date = new Date()): Date {
  const y = date.getFullYear(), m = date.getMonth(), d = date.getDate();
  const noonUtc = Date.UTC(y, m, d, 12);
  const jd = noonUtc / 86400000 + 2440587.5; const T = (jd - 2451545) / 36525;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const C = Math.sin(rad(M)) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(rad(2 * M)) * (0.019993 - 0.000101 * T) + Math.sin(rad(3 * M)) * 0.000289;
  const trueLong = L0 + C; const omega = 125.04 - 1934.136 * T; const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const eps0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60; const eps = eps0 + 0.00256 * Math.cos(rad(omega));
  const decl = deg(Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda))));
  const yv = Math.tan(rad(eps / 2)) ** 2; const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const eqt = 4 * deg(yv * Math.sin(2 * rad(L0)) - 2 * e * Math.sin(rad(M)) + 4 * e * yv * Math.sin(rad(M)) * Math.cos(2 * rad(L0)) - 0.5 * yv * yv * Math.sin(4 * rad(L0)) - 1.25 * e * e * Math.sin(2 * rad(M)));
  const ha = deg(Math.acos(Math.cos(rad(90.833)) / (Math.cos(rad(LAT)) * Math.cos(rad(decl))) - Math.tan(rad(LAT)) * Math.tan(rad(decl))));
  const minutesUtc = 720 - 4 * (LON + ha) - eqt; // minuty od północy UTC
  return new Date(Date.UTC(y, m, d) + minutesUtc * 60000);
}
/** Świt w grze: od wschodu do godziny po wschodzie, czasu lokalnego urządzenia. */
export function isDawn(now = new Date()): boolean { const s = sunrise(now).getTime(); return now.getTime() >= s && now.getTime() <= s + 3600000; }
export function nextDawnLabel(now = new Date()): string {
  let s = sunrise(now); if (now.getTime() > s.getTime() + 3600000) s = sunrise(new Date(now.getTime() + 86400000));
  return s.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}
