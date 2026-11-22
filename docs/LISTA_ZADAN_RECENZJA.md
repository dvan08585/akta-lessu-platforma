# Recenzja szkicu LISTA_ZADAN.md (czerwony zespół, 22 XI 2026)

Porównano szkic z: MASTERPLAN (sekcje 3, 4, 6, 7, 8, 9, 10, 11), STRATEGIA_POZIOM_WYZEJ (4–7), PANEL_2026-11_SYNTEZA (2, 5, 6), siedem raportów panelu (propozycje i listy „do sprawdzenia”), DO_DECYZJI_AUTORA (25–37), AUDYT_UX_3, LOGIKA_FABULY_A i _B, TRESC_PRYWATNA, REGULAMIN_KONKURSU, STRAZNICY, BACKEND, GRAFIKA, PLAYTEST, KODY, QR, README, git log (60 ostatnich commitów) oraz ze stanem kodu w `src/`, `backend/`, `public/`. Oznaczenia jak w szkicu: grupa A/B/C/D, priorytet M/P/m.

Ogólnie: szkic trafnie zbiera decyzje autora (A1–A3), Sandomierz (D3) i wydawcę (D4). Największe dziury są w środku planu: luty i marzec 2027 z masterplanu (łuk obrzędów, kotwice luk, konkurencyjna hipoteza) w ogóle nie występują, a kilka pozycji grupy B jest opisanych jako gotowych, choć kod ich nie ma.

---

## 1. BRAKUJE

### A. Tylko autor

- **(A, M)** Rekrutacja dziesięciu osób do Playtestu 1 według profilu z PLAYTEST.md (3 spoza Sandomierza, 2 powyżej 60 lat, 2 w wieku 16–22, 3 iPhone’y, 3 Androidy), do końca grudnia. Źródło: MASTERPLAN 11.5, PLAYTEST „Kogo”.
- **(A, M)** Decyzje z tropów audytu logiki, których w A1 nie ma: luka „gdzie jest Halina” jako zamierzona; notatki Anety w kopertach Fundacji (oddane komendzie czy wyniesione z pokoju); Fundacja działa od dwudziestu lat; „boję się od dwudziestu lat” Wandy; pies odmawia piwnicy hotelu; krew/czerwień budzi kamień a „heptagram otwiera”; komisarz współwinny (7/G); kiedy było zawalenie korytarza (karta Berbecia); „Sama.” na wydruku tlenu; zawieszka pod ziemią (m40) a obrzędy pod ziemią; kwarc profesora kontra Anzelma; ojciec w Prologu jako kasztelan Piotr z Krępy; czy Berbeć dokłada cudze kartki do kopert. Źródło: LOGIKA_FABULY_A sekcje 2 i 3; LOGIKA_FABULY_B sekcja 2.
- **(A, P)** Punkt 28 (pięć palców dwojga: wariant A „słowa nie kłamią” czy B „sześć dotknięć na Androidzie”) nie ma w A1, choć wprowadzono A tylko na próbę. Źródło: DO_DECYZJI 28.
- **(A, P)** Decyzja o zawieszce: jubiler na barter czy czeka na wydawcę i edycję Strażnika. D71 zakłada barter bez tej decyzji. Źródło: MASTERPLAN 11.4.
- **(A, P)** Lista siedmiu potencjalnych strażników z telefonami, bez obiecywania, w grudniu (przed wizytą, nie w jej trakcie). Źródło: MASTERPLAN 8, grudzień.
- **(A, P)** Stypendium MKiDN 2027 i Młoda Polska 2027: nabór trwa jesienią 2026, składa autor osobiście, jedyny program bez podmiotu. Źródło: panel 05, kalendarz naborów.
- **(A, P)** Decyzja, czy prolog (sprawa 1) jest ogłaszany publicznie od grudnia 2026, komu i jak; w harmonogramie alternatywnym „jeden nowy apokryf na kwartał, inaczej prolog umiera”. Źródło: MASTERPLAN 8 (październik i alternatywa), panel 07 propozycja 2.
- **(A, P)** Termin decyzji o stylu grafiki: panorama, siedem pieczęci (druk w paszporcie), OG i ikona muszą być gotowe przed zamrożeniem składu w czerwcu, więc wybór ilustratora do marca. Szkic A17 nie ma daty. Źródło: GRAFIKA 3 (poz. 1, 16, 19, 20), MASTERPLAN 8 czerwiec.

### B. Tylko AI

- **(B, M)** Kotwica każdej luki w dokumencie dostępnym w domu. Szybkie sprawdzenie: w sprawie 1 pełne brzmienie „biały gołąb z gołębnika grodu” stoi tylko w Dokumencie VI (`requiresDawn`); Dokument IV ma gołębnik bez „biały” i „grodu”. Przegląd spraw 1–4 pod tym kątem (w tym `requiresNoon` w sprawie 2 i `requiresPlace` w 3). Źródło: MASTERPLAN 8 marzec; STRATEGIA 4, Etap 1.3.
- **(B, M)** Konkurencyjna hipoteza w sprawach 1–4, która musi upaść na dokumentach (w sprawie 1 „zdrajczyni” Rocznika). Źródło: MASTERPLAN 8 marzec; STRATEGIA 4, Etap 1.2.
- **(B, M, AI 20 h, autor 6 h)** Luty 2027 z masterplanu: formuła otwarcia i zamknięcia ta sama siedem razy (telefon ekranem w dół, trzy sekundy, jedna wibracja), kontrakt frustracji przed każdą bramą (ile zajmie, co sztywne, czego wymaga ciało, brak kary, nic nie nagrywane), drugi klucz tej samej rangi dla każdego obrzędu według partytury, odsłona „trzy sekundy ciszy i zdanie”, zero komunikatów porażki. W kodzie są ciemność, wibracja i zdanie geolożki; nie ma wspólnej formuły otwarcia ani kontraktu. To największa pojedyncza pozycja nieobecna w szkicu. Źródło: MASTERPLAN 1, 4, 8 luty, 11; panel 04 propozycja 9.
- **(B, M)** Zdarzenia lejka do Workera przed Playtestem 2: instalacja PWA (decyduje o Web Push, B42), czas trwania i liczba prób obrzędu, pora dnia, czy gracz czytał część przed sprawą, czy odczyt został odwzajemniony. Dziś Worker przyjmuje start, solved, gesture, seventh, choice, reply, hum. Bez tego miary PT2 z masterplanu nie istnieją. Źródło: MASTERPLAN 8 kwiecień, 9 „Lejek i progi”; BACKEND „Co strona wysyła”.
- **(B, M)** Kalendarz spraw względny do jednej daty: `releases` w `config.json` to daty bezwzględne, osobno od `premiereDate`. Plan B na „data przesunięta po zamrożeniu” zakłada jeden parametr. Źródło: MASTERPLAN 9, ryzyka; `src/content/config.json`.
- **(B, M)** Paszport do druku z gry. Regulamin § 3.2 już obiecuje paszport „wydrukowany z Gry”, a w kodzie jest tylko pieczęć biegłego jako zrzut ekranu. Szkic ma to jako B31 w grupie P. Źródło: REGULAMIN § 3.2; MASTERPLAN 7 MVP („paszport jako jedna strona w książce plus PDF”).
- **(B, M)** Regulamin dostępny w grze (§ 9.1: „w Grze, zakładka Akta”); dziś nie ma go w `src/`. Źródło: REGULAMIN § 9.1.
- **(B, P)** Bramy całoroczne i sezonowe w grze, jawnie przed wyruszeniem; komunikat „strażnik tej bramy odszedł, brama pamięta” ze wskazaniem pieczęci zastępczej. Brak w kodzie. Po D66. Źródło: STRAZNICY „Notatki dla autora”; MASTERPLAN 6.
- **(B, P)** Jedna strona HTML do weryfikacji kodu biegłego dla biblioteki (offline, z `verify-code.mjs`). Źródło: REGULAMIN, notatki.
- **(B, P)** Screen Wake Lock w oddechu, bezruchu, kompasie i krokach (brak w `src/`); `webkitCompassAccuracy` z komunikatem „zrób ósemkę”; AudioContext po powrocie z tła na iOS zamykać i tworzyć nowy z gestu; `getSettings()` po mikrofonie. Źródło: STRATEGIA 7 „Poprawki pilne”; panel 03 sekcja I.
- **(B, P)** Procedura awaryjna, gdy backend padnie w dniu premiery (zapas `rejestr.json` jest, instrukcji i skryptu na godziny nie ma); próg nucących ustawiany ręcznie. Źródło: MASTERPLAN 8 sierpień i październik.
- **(B, P)** PLAYTEST.md uzupełnić o TS-SF (6 pozycji) po części z grą i bez gry oraz CORGIS po obrzędzie i po lukach; dodać punkt kontrolny dla komnaty i pokoju dwóch telefonów. Źródło: panel 06 rekomendacja 10.
- **(B, P)** README jest nieaktualny: wymienia `docs/SCENARIUSZ_7_SPRAW.md` (dziś poza gitem), „14 KB gzip”, „ton 18 Hz” jako cechę, nie zna Workera, komnaty, skanu, kodów testowych. Masterplan traktuje README jako checklistę po przerwie (ryzyko wypalenia), więc nie może czekać na B41. Źródło: MASTERPLAN 9 ryzyka; README.
- **(B, P)** Odpowiedź impulsowa Podziemi nałożona na wstępy spraw i kody (strona AI; D67 ma tylko zdjęcie IR w terenie). Źródło: SYNTEZA 2 „Osobno”; panel 05 propozycja 4.
- **(B, m)** Nowe identyfikatory QR (opatowska, rynek, podziemia, zamek, collegium, pieprzowki, pimpo-limpo) z dokumentami „na miejscu” po decyzji o lokalach; `share.url`, `og:image`, adres w QR i `ALLOWED_ORIGIN` w `wrangler.toml` wiszą na github.io i zmienią się z domeną. Źródło: QR.md; `config.json`; `backend/wrangler.toml`.
- **(B, m)** Regulamin Nocy na szablonie IPN i Instytutu Pileckiego (2 h) plus pismo do UM. Źródło: panel 05 propozycja 8.
- **(B, m)** Księga Rejestru z dwiema kolumnami (dedukcja i obecność), jedno zdanie w § 4 regulaminu. Źródło: panel 04 propozycja 8.
- **(B, m)** Komunikat kryzysowy na wyciek treści („to szkice sprzed roku”) gotowy do wysłania. Źródło: MASTERPLAN 9 ryzyka.
- **(B, m)** „Brama w twoim mieście” dla gracza zdalnego (własne Miejskie, 777 kroków do niego). Źródło: panel 01 propozycja 3.
- **(B, m)** Census postrzeżeń po bramie 5 i list do siebie po bramie 1 oddany po bramie 7. Źródło: panel 04 propozycja 10.
- **(B, m)** Potwierdzanie trójkami w sprawach 3–7, tylko w wersji komfortowej (wydawca do marca, akt III do lutego). Źródło: MASTERPLAN 7; panel 02 propozycja 3.
- **(B, m)** NMT 1 m z GUGiK w Mieście i poprawka współrzędnych bram z OSM. Źródło: panel 07 propozycja 5.

### C. Razem

- **(C, M)** Treść wierszy rejestru godzinowego na dzień premiery (6–12 w MVP, 24 w wersji komfortowej), każdy coś koduje. D61 ma tylko komendę. Źródło: MASTERPLAN 7 MVP, 8 sierpień; STRATEGIA 4, Etap 2.6.
- **(C, M, po prawdziwych kodach)** Siedem zdań dla lektora audiobooku (kody czytane). W szkicu jest tylko klauzula w umowie (76). Źródło: SYNTEZA 2 ruch 11; panel 05 propozycja 1.
- **(C, P)** Dwa PDF: scenariusz „sprawa 1 w ciemności, 45 minut” na Noc Bibliotek 2027 i protokół dla Dyskusyjnych Klubów Książki; wysyłka do CEO i koordynatorów DKK. Zero złotych. Źródło: SYNTEZA 2 ruch 11; panel 04 propozycja 7.
- **(C, P)** Noc Siedmiu Bram jako zestaw zadań, nie jedna pozycja programu (72): siedem ścieżek audio 4–7 minut (Noc bez prowadzącego), baza na Rynku, nić i kontrakt czytany na głos, steward bezpieczeństwa, Rejestr czytany na głos 24 XII w bibliotece, koperta otwierana 2 II 2028, umowa z SCK do 30 IX 2027. Źródło: MASTERPLAN 6 i 8 listopad; SYNTEZA 2 ruch 12; panel 01 propozycja 5; panel 05 kalendarz.
- **(C, P)** Nagranie „sekretarki hotelu” odtwarzane na stronie Fundacji (czerwiec, AI 1 h, głos do nagrania). Źródło: MASTERPLAN 6 „Królicza nora”, 8 czerwiec.
- **(C, P)** Zdjęcia własne z Sandomierza (Rynek, skarpa, mur) do `content-prywatne/zdjecia/` i przetworzenie filtrem na ryciny jako zapas, gdy ilustratora nie będzie. Źródło: GRAFIKA 6.
- **(C, m)** Jubensha: dwie próby scenariusza przed Nocą albo rezygnacja z niego w sezonie I. Źródło: MASTERPLAN 8 listopad; WIECZOR_JUBENSHA (wersja 0.1).
- **(C, m)** Test krzemienia z tagiem 12 mm (pięć kamieni, żywica, pięć telefonów, 200 zł) przed rozmową z jubilerem. Źródło: panel 07 propozycja 7.
- **(C, m)** Karta dźwięku w książce: pięć kresek składowych dzwonu na skali do porównania ze spektrogramem w telefonie. Źródło: panel 03 propozycja 8.
- **(C, m, po premierze)** Lekcja dla szkół „1260 i 1287: źródła i mit”; Noc w siedmiu miastach z gospodarzami w księgarniach. Źródło: STRATEGIA 6; panel 02 propozycja 7.

### D. Teren, serwery, aplikacje, instytucje

- **(D, M)** `npx wrangler secret put ADMIN_TOKEN` i sprawdzenie, że hasło działa (`PUT /rejestr`), zanim D61 zacznie zakładać, że jest. Źródło: BACKEND „Wdrożenie”.
- **(D, M)** Dyżur autora w dniu D: rejestr godzinowy, próg południa ręcznie, grupa wymiany odczytów (gdzie ona ma być, nie ustalono); plan B z tygodnia 6: tablica par online. Źródło: MASTERPLAN 8 październik, 9 „Lejek i progi”.
- **(D, P)** Pismo do Burmistrza i prośba o dane frekwencji 2023–2025 przy wizycie; mapa A3 w CIT i „Dzień Siedmiu Bram” dopiero po pierwszych recenzjach. Źródło: panel 05 kalendarz maj; panel 01 propozycja 10.
- **(D, P)** Naklejka „Strażnik bramy N” na drzwi i stojak QR na ladę (szkic obiecuje je lokalom): projekt, druk, QR z czytelnym adresem domeny i logo wydawcy, bez skracaczy. Źródło: STRAZNICY „Co lokal dostaje”; STRATEGIA 5 „Nieufność wobec QR”.
- **(D, P, wydawca)** ARC 60–80 egzemplarzy do Lubimyczytać, DKK, booktuberów i podcastów z działającym produktem (lipiec), cel 40–60 recenzji przedpremierowych. Źródło: MASTERPLAN 3 i 8 lipiec.
- **(D, P, wydawca)** Stoisko na Targach w Krakowie z obrzędem na żywo (cel 200 skanów); przedsprzedaż edycji Strażnika jako dowód popytu (250–600 pakietów). Źródło: MASTERPLAN 8 sierpień i październik.
- **(D, P)** Spotkanie przedpremierowe dla mieszkańców w bibliotece i dla przewodników PTTK. Źródło: MASTERPLAN 8 sierpień; STRATEGIA 5.
- **(D, P)** Zamknięcie sezonu I 24 XII 2027: wpis kohorty do księgi, retrospektywa z liczbami kontra lejek 400–700 skanów. Źródło: MASTERPLAN 8 grudzień.
- **(D, m)** Pozostałe adresy z tabeli 15: opiekunowie skrzynek geocaching jako pierwsi testerzy trasy, PTTK Opatów, OSM Polska, Leliwa i Radio Kielce (po premierze), Fundacja Questingu. D73 ma trzech. Źródło: panel 07 „Lista osób i społeczności”.
- **(D, m)** Pakiet dla 10 escape roomów (egzemplarze wydawcy, listopad 2027); zdjęcie Nocy dla mediów regionalnych (200–300 zł); pokaz gry na Festiwalu Krzemienia Pasiastego we wrześniu 2027 (D71 ma tylko rozmowę w lipcu). Źródło: panel 05 propozycje 7 i 9; MASTERPLAN 8 wrzesień.

### Kalendarz kill-switchy: brakujące wiersze

- wrzesień 2027: finał we dwoje nie działa na iOS Safari → finał awaryjny jednoosobowy z listem z archiwum. Źródło: MASTERPLAN 8 wrzesień.
- tygodnie 2, 6 i 12 po premierze: poniżej 80 skanów lub obrzęd poniżej 35% → obrzęd „na słowo” domyślny; odczyt poniżej 20% → tablica par; poniżej 5 finałów → finał solo; poniżej 20 finałów i 300 skanów → sezon II odwołany, tryb muzeum. Źródło: MASTERPLAN 9 „Lejek i progi”.

---

## 2. BŁĘDNE

- **B34 „silnik gotowy”:** w `src/` nie ma mechanizmu luk wstecznych (o sprawie poprzedniej) ani oznaczenia luki „wyłącznie z książki”; jest zwykły `fill` z bankiem. To zadanie B z kodem, nie samo wpisanie słów. Źródło: `src/engine/cases.ts`, `src/ui/views.ts`; panel 06 rekomendacja 2.
- **B32 „Worker już jest”:** Worker jest, ale nie ma punktu końcowego na napisy ani magazynu per brama; synteza szacuje dwa dni, nie jedną turę. Niedoszacowane. Źródło: `backend/src/index.ts`; SYNTEZA 2 ruch 4.
- **B35:** statystyka siódmej pozycji jest już w grze po sześciu bramach (commit 9153add); „Rejestr biegłych online jako lustro księgi” wymaga wysyłania pseudonimów do Workera, czyli decyzji autora i zapisu w regulaminie (dziś gra nic takiego nie wysyła). Częściowo zrobione, reszta nie jest „tylko B”.
- **B27 „Echo bram, lokalnie”:** źródło (panel 04 propozycja 5) mówi o 7 s tła nagranych przy bramie w Sandomierzu i granych graczowi zdalnemu przez Worker. Wersja lokalna traci sens propozycji, a każda wersja nagrywa mikrofonem i kłóci się z kontraktem frustracji „nic nie jest nagrywane” (MASTERPLAN 1). Do decyzji, czy w ogóle, nie do zrobienia „w jednej turze”.
- **B28 „Wisła jako zegar bramy wody”:** partytura ma „7 cykli, liczba cykli, nie czas” jako element sztywny, a zasada masterplanu to „sztywny skrypt, miękkie progi”. Liczba oddechów z rzeki łamie sztywny skrypt i wymaga sieci w obrzędzie. Sprzeczne z MASTERPLAN 1 i 4.
- **B29 „Dokument na Gromniczną”:** 2 lutego 2028 wypada po zamknięciu sezonu I (24 XII 2027), więc w sezonie I nikt go nie przeczyta. Jeśli zostaje, to jako apokryf sezonu II.
- **B30 „Dokument, który blaknie”:** jeśli znikająca linijka jest kotwicą luki, łamie „dowód nigdy w dokumencie warunkowym” (STRATEGIA Etap 1.3). Potrzebny warunek: blaknąć może tylko to, co nie jest dowodem.
- **B31 „Paszport do druku” jako P:** regulamin § 3.2 już obiecuje paszport wydrukowany z gry, więc to M (patrz BRAKUJE).
- **A1 „1–2 godziny czytania”:** 12 punktów plus około 13 tropów z audytów plus punkt 9 (zeszyt geolożki rozdział po rozdziale) to 4–6 godzin, nie 1–2.
- **A20 „Analityka 0 zł”:** kod ma tylko haczyk na Plausible (ok. 500 zł rocznie według MASTERPLAN 7). Wersja 0 zł (Cloudflare Web Analytics albo licznik w Workerze) to decyzja A plus 1 h B. Szkic pokazuje samą decyzję.
- **A25 „usunięcie kodów testowych”:** przypisane do A, a wykonuje B (szkic sam to mówi). Należy do próby generalnej we wrześniu (B37), nie do A4.
- **A19 i D59:** ta sama rzecz (repo prywatne, Cloudflare Pages) liczona dwa razy, raz jako decyzja, raz jako czynność.
- **D58 „Worker: zrobione” i „Stan ogólny: pokój dwóch telefonów działa”:** działa w kodzie; nie ma potwierdzenia na dwóch fizycznych telefonach (A24 wymienia komnatę i skan jako nieprzetestowane, pokój też nim jest) ani informacji, czy `ADMIN_TOKEN` ustawiono. Za mocne.
- **D3 „jedna wizyta wiosną 2027”:** masterplan i grupa C zakładają: wizytę 1 w maju (20 h), skany „dwa weekendy” (C45), nagranie dzwonu w południe (C46), Playtest 3 w lipcu (15 h), Festiwal Krzemienia we wrześniu, Noc w listopadzie. To cztery do sześciu wyjazdów, nie jeden. Nieprawdziwe co do kosztu czasu i pieniędzy.
- **D64 pod nagłówkiem „wizyta wiosną”:** rozmowa z biblioteką o wniosku musi być telefoniczna do 30 XI 2026; umieszczenie jej w D3 sugeruje, że czeka na wiosnę.
- **D77 „Kryminalna Piła (termin 15 I)”:** liczy rok poprzedni, więc dla książki z października 2027 to 15 I 2028, a Wielki Kaliber i Conrad to edycje 2028. Szkic czyta się jak zadanie na styczeń 2027.
- **C57 „Nagrania ambientu”:** masterplan i raport 05 mówią „głos w studiu, podziemia jako pogłos i ambient”; ambient jest P tylko razem z odpowiedzią impulsową (D67). Bez tego zadania C57 wisi bez odbiorcy w kodzie.
- **„Czego nie ma celowo”:** poprawne, ale brakuje w nim rzeczy, które masterplan też odłożył i które szkic mimo to wpisał jako B1: Web Push jest w B42 (dobrze), lecz B28 i B30 to nowe mechaniki dołożone do siedmiu obrzędów bez przejścia przez czerwony zespół.

---

## 3. ZALEŻNOŚCI, których szkic nie pokazuje

1. **Akt III (A13) → sprawy 5–7 (A14) → prawdziwe kody (A15) → pieczętowanie i `klucze.json` (A25) → siedem zdań dla lektora → zamrożenie składu (czerwiec).** Jeśli akt III się spóźni, cała prawa strona łańcucha przesuwa się do harmonogramu alternatywnego (maj 2028).
2. **Wydawca (D75, 31 III) → styl grafiki (A17) → pieczęcie (D74), paszport w książce, OG, ikona, QR z logo (D naklejki) → zamrożenie składu.** Bez wydawcy nie ma logo na QR ani wszytego paszportu; wtedy paszport PDF z gry (B31) staje się jedyną drogą.
3. **Repo prywatne i Cloudflare Pages (A19/D59) → domena Fundacji (D60) → adres w QR, `share.url`, `og:image`, `ALLOWED_ORIGIN` → druk czegokolwiek z adresem.** Druk naklejek i QR przed decyzją o domenie to druk do kosza.
4. **Wizyta 1 (D64–D70) → zdania „to miejsce pamięta” (C48) → liczba pieczęci w regulaminie i lista bram całorocznych/sezonowych (B) → prawnik (C56) → regulamin w grze.** Prawnik przed wizytą dostaje regulamin z nawiasami.
5. **Playtest 1 (C52) → poprawki (tydzień) → luty: łuk obrzędów i kontrakt frustracji (B, brak w szkicu) → marzec: kotwice luk i konkurencyjna hipoteza (B, brak) → Playtest 2 (C53).** PT2 na sprawach 1–3 bez tych dwóch miesięcy testuje stan z listopada 2026.
6. **Zdarzenia lejka w Workerze (B, brak) → Playtest 2 → decyzja o Web Push (B42) i o obrzędzie „na słowo” jako domyślnym.** Bez pomiaru instalacji PWA kill-switch na Push nie ma danych.
7. **Zgoda SCK (D67) → skan Podziemi (C45) i odpowiedź impulsowa → ambient na wstępach spraw (B) → brama 5 w Nocy.** C45 i C57 wiszą na jednej rozmowie.
8. **Nagranie dzwonu w południe (C46) → odcisk dzwonu (B39) → dokument ze spektrogramem.** Jedno południe w Sandomierzu jest wąskim gardłem; bez niego B39 nie ma danych, a parafia musi wcześniej potwierdzić godziny bicia (A16).
9. **Jubiler (D71) → decyzja o zawieszce (A, brak) → NFC (B43) → nagroda A w regulaminie (§ 4.2).** Regulamin ma już wariant bez jubilera, ale test tagu w krzemieniu (C, brak) powinien poprzedzić rozmowę.
10. **Decyzje kanoniczne (A1) → teksty do redakcji → ponowne pieczętowanie 5–7 → audyt UX na stanie końcowym (B40).** B40 przed A1 audytuje tekst, który się zmieni.
11. **Kod testowy BIEGŁY i `klucze.json` ze szkicami 5–7 → każdy playtest.** Usunięcie (A25) musi nastąpić dopiero po próbie generalnej, nie „przed premierą” luzem; w próbie generalnej z przestawionym zegarem kody muszą jeszcze działać.
12. **Styczeń 2027 decyduje o grudniu 2026:** rekrutacja PT1 (A, brak) i lista strażników (A, brak) to zadania grudniowe, a szkic zaczyna grudzień od repo i domeny.

---

## 4. Czy lista jest uczciwa co do czasu

Nie całkiem. Szkic nie sumuje godzin, a masterplan sumuje: sam plan bazowy daje autorowi około 170 h sesji i testów na grę (PT1 15, luty 6, marzec 25, kwiecień 10, maj 20, czerwiec 15, lipiec 45, sierpień 4, wrzesień 12, październik 20), do czego grupa C dokłada skany (dwa weekendy, około 20 h), dzwon, słoiki, dokumenty spoza spraw i pięć wyjazdów, grupa D kilkanaście rozmów i listów (10–15 h), a A4 test na trzech telefonach po każdej z około dwudziestu paczek (10–12 h); razem 230–280 h przy budżecie 150–230 h, czyli lista jest przekroczona o 30–50 procent, zanim dopiszemy luty i marzec, których w niej nie ma. Uczciwa wersja musi powiedzieć wprost, że przy 150 h wchodzi tylko MVP z masterplanu (sekcja 7): PT1, łuk pięciu obrzędów, kotwice luk, jedna wizyta, regulamin C, rejestr godzinowy, próba generalna; a cała grupa B1 (26–35), C45–C51, C57, D62–D63 i wszystko „m” to lista życzeń do skreślenia w pierwszej kolejności, bo każda godzina sesji AI jest godziną autora na czytanie, decyzję i test na telefonie.
