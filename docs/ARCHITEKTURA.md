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

## Klucze między ludźmi (`engine/pair.ts`)
Bez serwera nie da się sprawdzić, kto wygenerował token. Da się sprawdzić, że token nie jest zmyślony: każdy ma 2 znaki sumy kontrolnej (SHA-256), losowy ciąg przechodzi z prawdopodobieństwem 1/256. To zamek na pamiętnik, nie kryptografia obronna; wystarcza, żeby finału nie otwierało „abcdef0".
- **Połowa klucza** (sprawa 7): 5 znaków z ziarna gracza + 2 kontrolne. W karcie dopiero po 6 przebytych bramach.
- **Odczyt zawieszki** (mapa 5/7): cyfra wzgórza + 4 znaki + 2 kontrolne. W karcie dla każdego wzgórza, które gracz rozpoznał i na którym jego zawieszka reaguje.

## Mapa 5/7 (mechanika społeczna)
Z ziarna gracza losowane są dwa wzgórza z {1,2,3,5,6}, na których jego zawieszka milczy. Spraw na tych wzgórzach nie otworzy sam: potrzebuje odczytu z karty innego biegłego, u którego to wzgórze reaguje. Pełna mapa istnieje tylko między ludźmi. Kto pociągnął cegłę (sprawa 6), ma bramę niestabilną: liczy się jako przebyta, ale w finale potrzebuje dwóch połówek klucza zamiast jednej.

## Znacznik AR (`public/ar/`)
A-Frame + AR.js (marker-based, z CDN, ładowane tylko na stronie `ar/`). Znacznik: siedmiobok w czarnej ramce (`znacznik.png`), wzorzec `znacznik.patt` generowany skryptem z obrazu (16×16, 4 obroty, BGR). Parametr `?brama=N` ustawia, która brama świeci nad stroną. Arkusz do druku: `ar/druk.html`. Działa w Safari i Chrome bez aplikacji; wymaga HTTPS (GitHub Pages ma) i zgody na kamerę. Nieprzetestowane z kamerą w tej sesji: sprawdzić na telefonie przy dobrym świetle, znacznik 30–62 mm, matowy druk.

## Brama = dedukcja + gest (od v0.4)
Sprawa rozwiązana dokumentami daje status „rozpoznana". Bramę liczy się jako „przebytą" dopiero po geście ciała przypisanym do wzgórza (`GESTURE_OF` w `engine/cases.ts`: 4 ogień, 3 płyta, 2 woda, 5 zimno, 6 ciemność, 1 ziemia; 7 jest parą). Kolejne sprawy odblokowuje liczba bram przebytych, nie rozpoznanych. Powód: zrzut ekranu i model językowy rozwiążą quiz, ale nie zanucą tonu ani nie zakryją kamery. Brama niestabilna (pociągnięta cegła) liczy się jako przebyta bez gestu, z ceną w finale.

## Pytania z lukami (`kind: "fill"`)
Kluczowe ustalenie każdej sprawy to zdanie z lukami i bank 12 słów, w tym fałszywe (wzór: Golden Idol). Wybór kodowany jako jedna liczba (`encodeFill`), więc stan zostaje liczbowy. Puste luki blokują sprawdzenie.

## Miasto 3D (`public/miasto/`) i sceny (`public/sceny/`)
Miasto: MapLibre GL (CDN) + kafelki wektorowe OpenFreeMap (OSM, bez klucza) + teren AWS Terrarium (bez klucza), budynki jako bryły w palecie gry, siedem bram jako znaczniki, GPS „idź za mną", kompas obraca mapę, zawieszka grzeje w stronę najbliższej bramy. Nieprzetestowane w tej sesji (CDN i kafelki zablokowane): pierwsza próba na telefonie. Jeśli bryły nie mają wysokości (braki w OSM), warstwa `akta-buildings` daje 9 m domyślnie.
Sceny: Three.js + Spark (CDN) jako przeglądarka plików splat nagranych telefonem (Scaniverse/Polycam/Luma). Pliki w `public/sceny/`, lista w README tamże.
