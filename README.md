# Akta Lessu — platforma

Interaktywna księga-gra do powieści **„Siedem Bram Lessu”** (Sandomierz). Śledztwo z dokumentów, mapa siedmiu wzgórz z przekrojem pod ziemią, trzy klucze odblokowania: kod z książki, czas, miejsce.

Zasada: **gra jest przedsionkiem, książka jest domem.** Nic w grze nie zdradza zakończenia.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:5173/akta-lessu-platforma/
npm test           # testy silnika (vitest)
npm run build      # dist/
```

## Stos

- Vite + TypeScript, bez frameworka. Treść w JSON (`src/content`). Mapa w SVG rysowanym z danych.
- Stan w `localStorage` + kod wznowienia (bez serwera, bez konta).
- PWA: `public/sw.js`, `manifest.webmanifest`.
- Hosting: GitHub Pages, deploy automatyczny z `main` (`.github/workflows/deploy.yml`).
- Payload całości: ~14 KB gzip.

## Struktura

```
src/
  engine/   state.ts (zapis, seria, kod wznowienia) · unlock.ts (kod/czas/miejsce) · cases.ts (zawieszka) · share.ts (karta)
  ui/       map.ts (dwie warstwy + suwak rozdziałów) · views.ts (ekrany) · less.ts (tło) · dom.ts
  content/  config.json · map.json · chapters.json · cases/*.json · rewards.json
docs/       ARCHITEKTURA.md · TRESC.md (jak dodać sprawę) · KODY.md · SCENARIUSZ_7_SPRAW.md
scripts/    hash-codes.mjs (kody z książki -> hashe)
```

## Stan treści

Siedem spraw jest zaimplementowanych i grywalnych (`src/content/cases/`). Dokumenty i rozwiązania to szkice w głosie źródeł, do redakcji przez autora. Mechaniki: dedukcja (1–5), odrzucenie fałszywego dokumentu (5), decyzja z trwałym skutkiem (6), sprawa dwuosobowa (7), pytanie „twój miesiąc” (3), audio z tonem 18 Hz i wibracją (2), stopka Fundacji ujawniana po sprawie 4.

## Włączenie GitHub Pages (jednorazowo)

Settings → Pages → Build and deployment → Source: **GitHub Actions**. Potem każdy push na `main` publikuje stronę pod `https://dvan08585.github.io/akta-lessu-platforma/`.

## Kody z książki

Kody nie są w repozytorium. Plik `codes.local.json` (ignorowany przez git) → `node scripts/hash-codes.mjs codes.local.json` wpisuje hashe do `src/content/chapters.json`. Szczegóły: `docs/KODY.md`.
