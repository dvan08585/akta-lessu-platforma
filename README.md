# Akta Lessu

Gra-dodatek do powieści **„Siedem Bram Lessu”** (Sandomierz): siedem spraw z dokumentów, siedem obrzędów ciałem, mapa siedmiu wzgórz z przekrojem pod ziemią, listy od postaci, milczące wzgórza dopełniane cudzym odczytem, finał we dwoje. Strona statyczna na telefon, bez konta, bez danych osobowych.

Zasada: **gra jest przedsionkiem, książka jest domem.** Nic w grze nie zdradza zakończenia.

## Checklista po przerwie (przeczytaj, zanim cokolwiek ruszysz)

1. `docs/LISTA_ZADAN.md`: co jest do zrobienia, przez kogo, w jakiej kolejności; `docs/LISTA_ZADAN_RECENZJA.md`: uwagi czerwonego zespołu.
2. `content-prywatne/DO_DECYZJI_AUTORA.md`: decyzje kanoniczne, które czekają na autora (punkty 25–37). Ten katalog jest poza gitem: zrób kopię.
3. `docs/ARCHITEKTURA.md`: jak działa gra (zasady, klucze, obrzędy, forma zwracania się, wersja i pamięć podręczna).
4. `docs/DZIEN_PREMIERY.md`: procedura dnia D i awarie. `docs/BACKEND.md`: serwer wspólny.
5. Kody testowe **BIEGŁY** i **KONIEC** (`testCodeHash`, `doneCodeHash` w `src/content/config.json`) i klucze spraw 5–7 w `public/live/klucze.json` są tymczasowe: usuwa się je po próbie generalnej, przed premierą.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:5173/akta-lessu-platforma/
npm test           # testy silnika (vitest)
npm run build      # dist/ (zapisuje też version.json z tym samym znacznikiem, co __BUILD__)
```

Podgląd zbudowanej wersji: `npx vite preview --port 4173`.

## Stos

- Vite + TypeScript, bez frameworka; treść w JSON (`src/content`); mapa w SVG z danych; cel budowy es2020 / Safari 14 / Chrome 90.
- Stan w `localStorage` i w kodzie wznowienia z sumą kontrolną (bez serwera, bez konta). Kod biegłego (po finale) i pieczęć biegłego (siedmiobok) liczone z ziarna gracza.
- PWA: `public/sw.js` (nawigacje i `live/` z sieci, zasoby z pamięci; zapytania do innych domen nigdy z pamięci), `manifest.webmanifest`. Nowa wersja zgłasza się paskiem „Odśwież”.
- Serwer wspólny (opcjonalny): Cloudflare Worker w `backend/` (statystyki bez osób, rejestr na żywo, nucenie w południe, pokój dwóch telefonów przez WebSocket). Adres w `config.json` jako `backendUrl`; bez adresu gra działa w całości lokalnie.
- Sprawy 5–7 zapieczętowane AES-GCM kluczem z kodu rozdziału (`scripts/seal-cases.mjs`); jawne teksty w `content-prywatne/` poza gitem.
- Hosting: GitHub Pages, wdrożenie z `main` (`.github/workflows/deploy.yml`).

## Struktura

```
src/
  engine/   state.ts (zapis, kod wznowienia) · unlock.ts (kod, czas, miejsce; kalendarz względny do premiery) · cases.ts (luki, zawieszka)
            pair.ts (połówki klucza, odczyty, kod biegłego) · seal.ts (pieczęć AES) · messages.ts (listy, także po odpowiedzi) · share.ts · sun.ts · wspolny.ts (serwer)
  ui/       views.ts (ekrany) · interludes.ts (obrzędy, rozmowy, apokryfy) · map.ts · protokol.ts · paszport.ts · icons.ts · vignettes.ts · dom.ts · less.ts
  content/  config.json · map.json · chapters.json · cases/*.json (5–7: tylko nagłówki) · interludia.json · wiadomosci.json · mikroakta.json · rewards.json
public/     sw.js · live/ (klucze, rejestr) · akta/ (zapieczętowane sprawy) · fundacja/ · regulamin/ · komnata/ · skan/ · miasto/ · ar/ · vendor/ (three, gsplat)
backend/    Cloudflare Worker: Stats (liczniki, rejestr, nucenie) i Room (pokój dwóch telefonów)
scripts/    hash-codes.mjs · seal-cases.mjs · verify-code.mjs · build-regulamin.mjs · rejestr-dnia.mjs
docs/       ARCHITEKTURA · LISTA_ZADAN · MASTERPLAN · STRATEGIA_POZIOM_WYZEJ · PANEL_2026-11_SYNTEZA · panel-2026-11/ · DZIEN_PREMIERY · BACKEND · REGULAMIN_KONKURSU · STRAZNICY · PLAYTEST · GRAFIKA · KATALOG_MECHANIK · KODY · QR · TRESC · TRESC_PRYWATNA
content-prywatne/  (poza gitem) pełne sprawy 5–7, scenariusz, decyzje autora, audyty, harmonogram rejestru
tests/      engine.test.ts
```

## Kody z książki

Kody nie są w repozytorium. `codes.local.json` (ignorowany przez git): `node scripts/hash-codes.mjs codes.local.json` wpisuje hashe do rozdziałów, `node scripts/seal-cases.mjs codes.local.json` pieczętuje sprawy 5–7. Weryfikacja kodu biegłego, połówki klucza i odczytu bez gry: `node scripts/verify-code.mjs <kod>`.

## Laboratoria (poza grą, z Ustawień)

Komnata 3D (`public/komnata/`), miasto 3D z otwartych danych (`public/miasto/`), znacznik AR (`public/ar/`), przeglądarka skanów gaussian splatting z telefonu (`public/skan/`). Nie są częścią siedmiu bram; służą do prób.
