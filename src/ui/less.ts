/** Less opada. Tło: drobny, biały, cierpliwy pył. Lekkie dla baterii, szanuje reduce-motion. */
export function startLess(canvas: HTMLCanvasElement): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let w = 0, h = 0, dpr = Math.min(devicePixelRatio || 1, 2);
  const N = reduce ? 0 : 90;
  const p = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: 0.4 + Math.random() * 1.1, v: 0.00008 + Math.random() * 0.00025, d: Math.random() * 6.28 }));
  function resize() { w = innerWidth; h = innerHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); }
  resize(); addEventListener("resize", resize);
  const ink = () => getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#e8e0cf";
  let last = performance.now();
  function frame(t: number) {
    const dt = Math.min(50, t - last); last = t;
    ctx!.clearRect(0, 0, w, h);
    ctx!.fillStyle = ink(); ctx!.globalAlpha = 0.5;
    for (const q of p) {
      q.y += q.v * dt; q.d += 0.0006 * dt; q.x += Math.sin(q.d) * 0.00004 * dt;
      if (q.y > 1.02) { q.y = -0.02; q.x = Math.random(); }
      ctx!.beginPath(); ctx!.arc(q.x * w, q.y * h, q.r, 0, 6.28); ctx!.fill();
    }
    if (!document.hidden) requestAnimationFrame(frame);
  }
  if (N) requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && N) { last = performance.now(); requestAnimationFrame(frame); } });
}
