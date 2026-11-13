#!/usr/bin/env python3
"""Widmo: dzwon Piotra + siedmiobok narysowany dźwiękiem.
Siedmiobok jest foremny W PIKSELACH spektrogramu strony (720×260 px, 26 s × 0–8 kHz), nie w sekundach i hercach:
promień 85 px = 3,07 s w poziomie i 2615 Hz w pionie. Środek: 16 s, 4923 Hz, wysoko ponad dzwonem.
Użycie: python3 scripts/gen-widmo.py  (potrzebuje ffmpeg i numpy). Wynik: public/audio/widmo.mp3
"""
import subprocess, numpy as np, wave, struct, math, os
SR = 44100; DUR = 26.0; W, H = 720, 260; PX_S = W / DUR; PX_HZ = H / 8000
CX_S, CY_HZ, R_PX = 16.0, 4923.0, 85.0
bell = subprocess.run(["ffmpeg", "-v", "error", "-i", "public/audio/dzwon-piotr.mp3", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
bell = np.frombuffer(bell, dtype=np.float32).astype(np.float64)
n = int(SR * DUR); out = np.zeros(n); out[:min(n, len(bell))] = bell[:n] * 0.8
# wierzchołki w pikselach (jeden na górze), potem na (s, Hz)
pts = []
for i in range(7):
    a = -math.pi / 2 + i * 2 * math.pi / 7
    px, py = W * CX_S / DUR + math.cos(a) * R_PX, H - CY_HZ * PX_HZ + math.sin(a) * R_PX
    pts.append((px / PX_S, (H - py) / PX_HZ))
t = np.arange(n) / SR
for k in range(7):
    (t1, f1), (t2, f2) = pts[k], pts[(k + 1) % 7]
    if t2 < t1: (t1, f1), (t2, f2) = (t2, f2), (t1, f1)
    seg = (t >= t1) & (t <= t2)
    if not seg.any(): continue
    tt = t[seg]; f = f1 + (f2 - f1) * (tt - t1) / max(1e-6, t2 - t1)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.ones_like(tt); e = int(0.02 * SR)
    if len(tt) > 2 * e: env[:e] = np.linspace(0, 1, e); env[-e:] = np.linspace(1, 0, e)
    out[seg] += 0.22 * env * np.sin(ph)
out = np.clip(out / max(1.0, np.abs(out).max()), -1, 1)
os.makedirs("public/audio", exist_ok=True)
with wave.open("/tmp/widmo.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/tmp/widmo.wav", "-codec:a", "libmp3lame", "-b:a", "160k", "public/audio/widmo.mp3"], check=True)
print("ok", [(round(a, 2), round(b)) for a, b in pts])
