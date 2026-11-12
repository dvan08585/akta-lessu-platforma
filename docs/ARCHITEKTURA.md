# Architektura

## Decyzje
| Decyzja | Dlaczego |
|---------|----------|
| Statyczna strona, zero backendu | Zero kosztów stałych, zero awarii, działa offline. Konwersja (newsletter) przez zewnętrzny formularz. |
| Vanilla TS zamiast frameworka | Payload 14 KB, ładowanie < 1 s na telefonie. Treść zmienia się częściej niż kod. |
| Treść w JSON | Autor dopisuje sprawy bez dotykania kodu. |
| Mapa w SVG z danych | Jedna mapa, dwa tryby (dom / miejsce), suwak rozdziałów, zero obrazków. |
| Kody jako SHA-256 w repo | Kod z książki nie da się odczytać ze źródeł strony. |
| Klucz czasu po stronie przeglądarki | Prosty; „na żywo” w dniu premiery robimy podmianą pliku stanu. Do rozważenia: podpisany plik z serwera, jeśli ktoś będzie przestawiał zegar. |

## Trzy klucze odblokowania (`engine/unlock.ts`)
1. **Kod** z końca rozdziału → `codeMatches()` → `state.unlockedChapters`.
2. **Czas** → `config.timeline.chapterOffsets` (dni względem `premiereDate`).
3. **Miejsce** → `?qr=<id>` w adresie (kod QR w Sandomierzu) → `state.placeVisits`.

`isChapterUnlocked()` = kod LUB czas. Prolog (0) zawsze otwarty.

## Stan (`engine/state.ts`)
`localStorage["akta-lessu:v1"]`. Kod wznowienia = base64url z postępu. Seria dni z jednym „zamrożeniem” na tydzień.

## Sprawa (`engine/cases.ts`)
Dokumenty + pytania zamknięte. Zawieszka podaje tylko liczbę trafień jako ciepło (0–4), nie które. Podpowiedź po trzeciej próbie. Rozwiązanie = kilka zdań prozy + karta + nagroda (tekst).

## Rozwój
- Sprawy 2–7: patrz `docs/SCENARIUSZ_7_SPRAW.md`. Nowe typy pytań (audio, dwuosobowe) dochodzą jako `kind` w `Question`.
- Tryb „na miejscu”: `?qr=` już działa; dokumenty tylko-na-miejscu = `docs[].requiresPlace`.
- Wersja EN: `src/content/i18n/` + ten sam JSON spraw z kluczem `lang`.
- Sceny 3D (splat): osobny host, ładowane leniwie z poziomu sprawy.
