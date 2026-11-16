# Grafika: język wizualny i brief dla ilustratora

Stan: w aplikacji są ryciny wektorowe rysowane kodem (`src/ui/vignettes.ts`): panorama siedmiu wzgórz na wejściu i siedem winiet żywiołów w nagłówkach spraw. To szkielet w jednym stylu i miejsca, w które wejdą prawdziwe ilustracje. Poziom „1000% zgrany z książką” wymaga ręki ilustratora albo serii obrazów generowanych pod ten brief i potem redagowanych. Ten dokument jest po to, żeby taka osoba dostała wszystko w jednym pliku.

## 1. Język wizualny (jedno zdanie)
Drzeworyt i rycina z XIX-wiecznego atlasu geologicznego, w którym ktoś zostawił ślady palców w lessie: kreska atramentu na papierze, szrafowanie zamiast cieni, ciepło tylko tam, gdzie fabuła go wymaga.

## 2. Zasady
- **Dwa tryby:** ciemny (atrament jasny na niemal czarnym tle) i jasny (atrament na papierze). Ilustracje muszą działać w obu: dostarczać jako grafiki z przezroczystym tłem, jednokolorowe (czerń), które aplikacja barwi kolorem atramentu. Wyjątek: dokumenty (zawsze na papierze).
- **Paleta:** atrament `#e8e0cf` (ciemny tryb) / `#1e1a14` (jasny), piasek `#c9a86a`, ciepło `#d9843a` i `#ff9c4a`, krew `#7a1f1f`, zimno `#5a7d95`, papier `#f1ebdd`. Nic poza tym. Kolor pojawia się jako jeden akcent na obraz, nigdy jako wypełnienie.
- **Bez twarzy.** Postacie tylko od tyłu, w kadrze bez głowy, jako dłonie, buty, kożuch, plecy. Czytelnik ma własne twarze z powieści.
- **Bez ikon, bez „magii”.** Siedmiobok jest figurą geometryczną, nie symbolem fantasy. Zawieszka to kamień, nie klejnot.
- **Materia przed sceną.** Każda ilustracja ma mieć fakturę: pasy krzemienia, słoje belki, spoiny posadzki, ziarno lessu, cegła. Jeśli nie wiadomo, co narysować, rysuje się materiał.
- **Kreska drży.** Kontur nie jest wektorowo gładki. Jak odbitka z klocka, który był używany.

## 3. Lista ilustracji (priorytet, miejsce w aplikacji, wymiar)

| # | Co | Gdzie | Wymiar (px, @2x) | Uwagi |
|---|---|---|---|---|
| 1 | **Panorama siedmiu wzgórz nad Wisłą** z przekrojem lessu pod spodem, dzwonnicą katedry i św. Jakubem, gołąb nad Świętojakubskim | wejście (`viewIntro`), dziś `hero()` | 1200×440, przezroczyste tło | najważniejsza grafika, pierwsze, co widzi czytelnik |
| 2 | Krzemień pasiasty, siedmiobok, w dłoni (dłoń od spodu, bez twarzy) | wejście, ekran „Połóż palec na kamieniu” | 800×800 | dziś kamień rysowany kodem (`flint()`); ilustracja może go zastąpić jako tło z przezroczystością |
| 3–9 | **Siedem winiet żywiołów**: ziemia (łuk korytarza, less sypie się z łuku, cegła wysunięta), woda (spoiny posadzki, kręgi od spodu), dźwięk (dzwon, kręgi w dół, w ziemię), ogień (kamień z pasami, smuga czerwieni), zimno (sklepienie piwnicy, szron), ciemność (kartka, litery gasną, zdmuchnięta świeca), powietrze (siedem punktów, dwie dłonie, dwa puste) | nagłówek sprawy (`case-head`), lista bram | 480×330 każda | dziś `vignette()` w kodzie, do zastąpienia 1:1 |
| 10 | Dziedziniec św. Jakuba z góry: warstwa II pod trawnikiem, sondaż S-3 przy skarpie | sprawa 1, Dokument V (na miejscu) | 900×600 | plan jak z protokołu archeologicznego, ręcznie kreskowany |
| 11 | Wieża katedry w południe, dłoń na murze | sprawa 2, Dokument V | 900×600 | |
| 12 | Nawa katedry, dwanaście ram obrazów i trzynasta bez miesiąca, zejście do krypt | sprawa 3, Dokument I | 900×600 | obrazy jako puste ramy ze szrafowaniem, bez treści |
| 13 | Kamienica na Opatowskiej, piwnica, ściana z cegłą nowszą niż reszta | sprawa 4, Dokument I | 900×600 | |
| 14 | Mur z cegłą wysuniętą o centymetr (zbliżenie) | sprawa 6 | 900×600 | |
| 15 | Rejestr statusów Fundacji: nagłówek papieru firmowego (siedmiobok w okręgu, krój urzędowy) | stopka dokumentów, strona Fundacji | 600×200 | dziś pieczęć kodem |
| 16 | Siedem pieczęci strażników (po jednej na bramę): motyw miejsca jak japoński eki stamp | paszport bram w książce, karta udostępnienia | 300×300 każda, do druku też w wektorze | ręcznie rysowane, jedna barwa (krew) |
| 17 | Mapa psychograficzna siedmiu wzgórz (nie kartograficzna): profil wzgórz, less, bramy jako siedmioboki | mapa (`map.ts`) jako tło pod warstwą interaktywną | 1600×980 | ma zastąpić dzisiejsze SVG z kodu |
| 18 | Amor (pies) od tyłu, na bruku Rynku, trzy obroty | apokryfy Amora, mikro-akta | 800×500 | jedyna „postać”; nigdy pysk na wprost |
| 19 | Open Graph / okładka strony: panorama + tytuł | `public/og.png` | 1200×630 | |
| 20 | Ikona aplikacji: siedmiobok z pasami krzemienia | manifest | 512×512 | |

Dokumenty (papier) dostają osobny zestaw drobiazgów: plamy po kubku, zagięcie rogu, ślad pieczęci, stempel „KOPIA DLA BIEGŁEGO”. To są nakładki PNG z przezroczystością, 3–5 wariantów, losowane per dokument z ziarna.

## 4. Referencje do podania ilustratorowi
- XIX-wieczne ryciny Sandomierza (Napoleon Orda; widoki z Tygodnika Ilustrowanego), zbiory Narodowego Archiwum Cyfrowego i Polony: tylko jako referencja stylu, nie do kopiowania.
- Atlasy geologiczne z przekrojami warstw (szrafowanie warstw lessu, piaskowca, kredy).
- Krzemień pasiasty z Krzemionek: zdjęcia makro pasów, które są nieregularne i zbite po jednej stronie.
- Płyta Chladniego: fotografie wzorów z piasku.
- Drzeworyty Stanisława Ostoi-Chrostowskiego i ryciny Jana Lebensteina jako punkt odniesienia dla kreski.

## 5. Co dostarczyć i jak to wchodzi do aplikacji
- Format: SVG (zoptymalizowany) dla winiet, panoramy, pieczęci i mapy; PNG @2x z przezroczystością dla scen; wszystkie monochromatyczne (czerń), z jednym akcentem kolorem tylko tam, gdzie brief go wymienia.
- Nazwy: `public/ryciny/01-panorama.svg`, `03-ziemia.svg` … `20-ikona.png`.
- Podmiana: `hero()` i `vignette()` w `src/ui/vignettes.ts` zaczną ładować pliki z `public/ryciny/`, jeśli istnieją; w przeciwnym razie zostaje kreska z kodu. To znaczy, że ilustracje można dostarczać po jednej, bez czekania na komplet.

## 6. Co da się zrobić bez ilustratora (i co już jest)
- Winiety i panorama kodem (jest).
- Krzemień pasiasty kodem, z ziarnem gracza (jest).
- Faktura papieru i ziarno lessu (jest).
- Pieczęć Fundacji (jest).
- Zdjęcia własne z Sandomierza (Rynek, skarpa, mur) przetworzone w aplikacji na „rycinę” filtrem: progowanie i szrafowanie w SVG. To realne i tanie, ale wymaga Twoich zdjęć (prawa). Jeśli je przyślesz do repo w `content-prywatne/zdjecia/`, przygotuję przetworzenie.
