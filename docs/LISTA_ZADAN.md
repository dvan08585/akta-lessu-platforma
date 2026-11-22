# Lista zadań „Akta Lessu” (wersja 2, 22 XI 2026, po recenzji czerwonego zespołu)

Źródła: MASTERPLAN, STRATEGIA_POZIOM_WYZEJ, synteza drugiego panelu i siedem raportów, DO_DECYZJI_AUTORA (25–37), audyty UX i logiki fabuły, TRESC_PRYWATNA, REGULAMIN_KONKURSU, STRAZNICY, BACKEND, GRAFIKA, PLAYTEST, QR, dziennik zmian w git i stan kodu. Recenzja szkicu z uwagami: `docs/LISTA_ZADAN_RECENZJA.md` (55 braków, 18 błędów, 12 zależności); ta wersja je wchłania.

Cztery grupy: (A) tylko Ty, (B) tylko ja, (C) razem, (D) teren, serwery, aplikacje, instytucje. Priorytety: **M** musi przed premierą, **P** powinno, **m** może. Godziny to Twoje godziny (czytanie, decyzja, test na telefonie, wyjazd), bo to one są wąskim gardłem; moje godziny sesji podaję tylko tam, gdzie są duże.

## 0. Uczciwość co do czasu (przeczytaj najpierw)

Masterplan daje Ci na grę 150–230 godzin do premiery. Pełna lista poniżej to 230–280 godzin, czyli o jedną trzecią za dużo. Dlatego każda pozycja ma priorytet, a na końcu jest sekcja „MVP za 150 godzin”: co zostaje, gdy czas się skończy. Reguła: każda godzina mojej sesji to Twoja godzina na przeczytanie, decyzję i test na telefonie. Nowe pomysły (sekcja B1) są ostatnie w kolejce, nie pierwsze.

Stan na dziś: gra przechodzi od wejścia do finału na Androidzie; treść siedmiu spraw po redakcji i dwóch audytach; serwer wspólny wdrożony (statystyki, rejestr, pokój dwóch telefonów w kodzie, hasło rejestru ustawione). Nieprzetestowane przez Ciebie: komnata v6, laboratorium skanu, pokój dwóch telefonów na dwóch fizycznych telefonach, iPhone w całości.

---

## A. Tylko Ty

### A1. Decyzje kanoniczne (M, realnie 4–6 godzin z czytaniem; DO_DECYZJI_AUTORA 25–37 i tropy z LOGIKA_FABULY A i B)
1. Rok słoika Heleny: 2020 (zalecane) albo bez roku.
2. „H.” profesora: Halina (jak dziś) czy Helena.
3. Piwnice hotelu i Opatowskiej: trop zamierzony czy nie.
4. Gdzie mieszka Aneta w czasie gry.
5. Chronologia profesora względem „dnia 1” Anety (czy rozdział 6 jest o nieobecnym).
6. Brama 5 „Zamkowe” na dokumentach z Opatowskiej.
7. Kompot jako nośnik rtęci.
8. Linia Sudomir: ile widać przed książką.
9. Zeszyt geolożki jako czyny Anety: sprawdzić rozdział po rozdziale wobec aktu III.
10. Mikro-akt „Barka”: zostaje czy wypada.
11. Do akceptacji, wprowadzone na próbę: słowo bramy Zimna „dwa stopnie”; usunięte „Nie jestem sama”; pięć palców dwojga w wariancie „słowa nie kłamią” (A) czy „sześć dotknięć na Androidzie” (B).
12. Z panelu naukowego: fizyka dzwonu w sprawie 2; brama 6 bez ekranu i przechyłu (krokomierz, wibracja co 111 kroków) czy obecna „taca z wodą”; oddech 4/6; ciemność do przypominania zamiast czytania.
13. Tropy z audytów logiki, każdy jedno „tak/nie”: gdzie jest Halina (luka zamierzona); notatki Anety w kopertach Fundacji (oddane czy wyniesione); Fundacja od dwudziestu lat; „boję się od dwudziestu lat” Wandy; pies odmawia piwnicy hotelu; krew/czerwień budzi kamień a lista zakazana; komisarz współwinny (7/G); kiedy było zawalenie (karta Berbecia); „Sama.” na wydruku tlenu; zawieszka pod ziemią (m40) a obrzędy pod ziemią; kwarc profesora kontra Anzelma; ojciec w Prologu jako Piotr z Krępy; czy Berbeć dokłada cudze kartki do kopert.

### A2. Kanon, który tylko Ty znasz (M)
14. Akt III w pierwszej wersji do końca lutego 2027 (kill-switch).
15. Ostateczne teksty spraw 5–7 po akcie III (lipiec 2027).
16. Prawdziwe kody z końców rozdziałów i decyzja: jednowyrazowe czy dwuwyrazowe z solą (maj 2027, razem z B).
17. Lista „do pasjonaty” (DO_DECYZJI 37 i raporty): dzwony katedry i „Piotr”, trasa pod Rynkiem 27, Pimpo Limpo i Piszczele, kamienica Lazarczyka, dziewięć pokoi, 69 tysięcy biletów, róże, Florek o kopcu, Gąssowski zamiast Saramy poza grą.

### A3. Decyzje o kształcie (P, z datami)
18. Styl grafiki do końca marca 2027 (panorama, siedem pieczęci do druku, OG, ikona muszą być przed zamrożeniem składu w czerwcu).
19. Daty: październik 2027 z punktem decyzyjnym 31 marca, czy maj 2028.
20. Repo prywatne i Cloudflare Pages (decyzja; wykonanie w D59). Zalecane w grudniu.
21. Analityka: Cloudflare Web Analytics za 0 zł, licznik w Workerze, czy nic (ja: 1 h po decyzji).
22. Zawieszka: jubiler na barter czy czeka na wydawcę i edycję Strażnika.
23. Duet i gwizd: apokryfy w „Poza aktami” czy laboratorium.
24. Prolog (sprawa 1) publicznie od grudnia 2026: tak czy nie, komu i jak; jeśli tak, jeden nowy apokryf na kwartał, inaczej prolog umiera.
25. Kanon siedmiu wzgórz: dziś ustalony; „które są główne” zostaje tajemnicą.

### A4. Rzeczy, do których tylko Ty masz dostęp (M)
26. Kopia zapasowa `content-prywatne/` (poza gitem).
27. Test na telefonach po każdej paczce (Redmi, Huawei, iPhone): komnata v6, laboratorium skanu, pokój dwóch telefonów, iPhone w całości (zapis po 7 dniach, haptyka, kamera w bramie 5, mikrofon w 2 i 3). Realnie 10–12 h do premiery.
28. Grudzień 2026: rekrutacja dziesięciu osób do Playtestu 1 według profilu z PLAYTEST.md (trzy spoza Sandomierza, dwie powyżej 60 lat, dwie 16–22, trzy iPhone’y, trzy Androidy); lista siedmiu potencjalnych strażników z telefonami, bez obiecywania.
29. Stypendium MKiDN 2027 i Młoda Polska 2027: jedyne programy bez podmiotu, nabór jesienią 2026, składasz osobiście.

---

## B. Tylko ja

### B0. Co jest, żeby nie liczyć tego dwa razy
Kontrakt frustracji przed każdą bramą, przyjęcie „na słowo” po trzykrotności czasu, ciemność i zapis geolożki, jedno ustalenie z lukami i konkurencyjną hipotezą w sprawach 1–4, formularz przed aktami i wypełnione ustalenie po, słowo bramy palcem, kotwice słów, protokół, pieczęć, dziennik miasta, listy z ciągiem dalszym, pokój dwóch telefonów (kod), statystyka siódmej pozycji po sześciu bramach.

### B1. Musi (M)
30. Luty z masterplanu, część brakująca: jeden gest wejścia dla siedmiu obrzędów (telefon ekranem w dół, trzy sekundy, jedna wibracja, formuła otwarcia), zero komunikatów porażki, drugi klucz tej samej rangi dla każdego obrzędu według partytury. (ja 12–16 h, Ty 6 h testów)
31. Marzec z masterplanu, część brakująca: kotwica każdej luki w dokumencie dostępnym w domu, sprawdzona sprawa po sprawie (w sprawie 1 „biały gołąb z gołębnika” jest w Dokumencie IV, „grodu” do sprawdzenia; w sprawie 2 `requiresNoon`, w 3 `requiresPlace`); konkurencyjna hipoteza, która upada na dokumentach, w każdej ze spraw 1–4. (ja 8 h, Ty 4 h czytania)
32. Zdarzenia lejka do Workera przed Playtestem 2: instalacja jako aplikacja, czas i liczba prób obrzędu, pora dnia, czy czytano część przed sprawą, czy odczyt odwzajemniony. Bez tego kill-switch na Web Push nie ma danych. (ja 4 h, Ty: `wrangler deploy`)
33. Kalendarz spraw względny do jednej daty premiery (dziś daty bezwzględne), żeby przesunięcie premiery było jednym parametrem.
34. Paszport do druku z gry (siedem pól, daty, pieczęć biegłego): regulamin § 3.2 już to obiecuje.
35. Regulamin w grze (zakładka Akta), jak obiecuje § 9.1; księga Rejestru z dwiema kolumnami (dedukcja, obecność) w § 4.
36. Luki wsteczne i jedna luka na sprawę wyłącznie z książki: to jest kod, nie tylko słowa (ja 6 h; słowa z Tobą w C).
37. Kody dwuwyrazowe z solą i Worker podpisujący połówki (maj 2027, po A16).
38. Próba generalna we wrześniu: osobne wdrożenie z przestawionym zegarem, test południa z pięcioma telefonami, test wznowienia na nowym telefonie, finał we dwoje na iPhonie; dopiero PO niej usunięcie kodów BIEGŁY i KONIEC, opróżnienie `klucze.json`, prawdziwe kody. (ja 8 h, Ty 12 h i telefony)
39. Procedura awaryjna na dzień premiery (backend pada: zapas `rejestr.json` jest, instrukcja i skrypt na godziny nie) i próg nucących ustawiany ręcznie.
40. README jako checklista po przerwie (dziś nieaktualne: scenariusz, Worker, komnata, skan, kody testowe) i dokumentacja „jak to utrzymać przez dekadę” na dzień przekazania wydawcy.

### B2. Powinno (P)
41. Bramy całoroczne i sezonowe jawnie w grze; komunikat „strażnik tej bramy odszedł, brama pamięta” z pieczęcią zastępczą (po D66).
42. Strona HTML do weryfikacji kodu biegłego dla biblioteki, offline.
43. Wake Lock w oddechu, bezruchu, kompasie i krokach; kompas z komunikatem „zrób ósemkę” przy słabej dokładności; AudioContext na iOS odtwarzany z gestu po powrocie z tła.
44. PLAYTEST.md: miary transportu (TS-SF) i rodzaju wyzwania (CORGIS), punkty kontrolne dla komnaty i pokoju dwóch telefonów.
45. Ponowny, niezależny audyt UI/UX na stanie końcowym, dopiero po A1 i B30–B31 (inaczej audytuje tekst, który się zmieni).
46. Napisy biegłych ze słownika akt na bramach i jednobitowe podziękowanie dla dawcy: nowy punkt końcowy w Workerze i magazyn per brama (ja 2 dni, nie jedna tura).
47. Archiwum Fundacji przeszukiwane słowem (silnik; dokumenty w C49).
48. Rejestr biegłych online jako lustro księgi: wymaga wysyłania pseudonimów do Workera, czyli Twojej decyzji i zapisu w regulaminie.
49. Odcisk dzwonu (pięć składowych widma, trzy dni) po nagraniu z C46; przejście skanu na Spark i format SPZ po pierwszym prawdziwym skanie.
50. Odpowiedź impulsowa Podziemi nałożona na wstępy spraw i kody (po D67).
51. Nocny dopisek (jedno zdanie widoczne tylko w trybie nocnym) i dokument, który blaknie, z warunkiem: blaknąć może tylko to, co nie jest dowodem.
52. Regulamin Nocy na szablonie IPN i Instytutu Pileckiego plus pismo do UM (2 h); komunikat kryzysowy na wypadek wycieku treści („to szkice sprzed roku”).

### B3. Może (m), po wszystkim innym
53. „Brama w twoim mieście” dla gracza zdalnego; census postrzeżeń po bramie 5 i list do siebie po bramie 1; potwierdzanie trójkami w sprawach 3–7 (tylko w wersji komfortowej); NMT 1 m z GUGiK w Mieście; nowe identyfikatory QR z dokumentami „na miejscu” po decyzji o lokalach.
54. Odłożone decyzją czerwonego zespołu albo Twoją: Web Push (po PT2, jeśli co najmniej 30 procent instaluje), NFC (po jubilerze), pełna ścieżka bez czujników (wstrzymana), echo bram (nagrywanie kłóci się z „nic nie jest nagrywane”, wymaga Twojej decyzji), Wisła jako zegar oddechu (łamie sztywny skrypt siedmiu cykli), Gromniczna (2 lutego 2028 wypada po sezonie I; apokryf sezonu II).

---

## C. Razem

### C1. Musi (M)
55. Playtest 1, styczeń 2027: Ty prowadzisz (15 h), ja poprawiam w tydzień (8 h). Kill-switch: mniej niż 5 z 10 kończy sprawę 1.
56. Playtest 2 zdalny, kwiecień 2027: 20–30 osób, sprawy 1–3, osobne wdrożenie z kodem testowym; wymaga B32.
57. Treść rejestru godzinowego na dzień premiery: 6–12 wierszy w MVP, 24 w wersji komfortowej, każdy coś koduje.
58. Siedem zdań dla lektora audiobooku (po A16).
59. Regulamin konkursu: Ty wypełniasz nawiasy po wizycie (liczba pieczęci, lokale), idziesz do prawnika (1–2 h, 500–1000 zł), ja poprawiam tekst i wkładam do gry (B35).
60. Lista 20 faktów do Towarzystwa Naukowego Sandomierskiego i parafii: ja spisuję, Ty wysyłasz.

### C2. Powinno (P)
61. Playtest 3 terenowy, lipiec 2027: pięć do ośmiu osób w Sandomierzu (Ty 15 h, 500 zł).
62. Skany miejsc: pokój na próbę (teraz), potem piwnica, Rynek w południe, trasa za zgodą SCK (dwa weekendy). Ja: dokument z luką, odchudzenie, offline.
63. Nagranie dzwonu w południe, najlepiej binauralne (300–1500 zł sprzęt, jedno południe); wcześniej parafia potwierdza godziny bicia (A17).
64. Słoiki lessu na lady strażników (poniżej 100 zł) i zdania „to miejsce pamięta” od właścicieli (po wizycie).
65. Dokumenty „spoza spraw” do archiwum Fundacji: trzy do pięciu tekstów (Sudomir, Helena S., Memoria Nieruchomości).
66. Jedna strona w książce jako klucz finału (tablica siedmiu znaków) i łańcuch słów bramy; marginalia geolożki i akrostych (redakcja ma weto).
67. Dwa PDF: „sprawa 1 w ciemności, 45 minut” na Noc Bibliotek 2027 i protokół dla Dyskusyjnych Klubów Książki; wysyłka do koordynatorów. Zero złotych.
68. Noc Siedmiu Bram jako zestaw zadań: siedem ścieżek audio po 4–7 minut (Noc bez prowadzącego), baza na Rynku, nić i kontrakt czytany na głos, steward bezpieczeństwa, umowa z SCK do 30 IX 2027, Rejestr czytany na głos 24 XII w bibliotece, koperta otwierana 2 II 2028.
69. Nagranie „sekretarki hotelu” na stronie Fundacji (czerwiec; Twój głos lub lektor, ja 1 h).
70. Zdjęcia własne z Sandomierza do `content-prywatne/zdjecia/` jako zapas na ryciny, gdy ilustratora nie będzie.

### C3. Może (m)
71. Jubensha: dwie próby scenariusza przed Nocą albo rezygnacja w sezonie I. Test krzemienia z tagiem 12 mm (200 zł) przed rozmową z jubilerem. Karta dźwięku w książce (pięć kresek składowych dzwonu). Lekcja dla szkół „1260 i 1287” i Noc w siedmiu miastach: po premierze.

---

## D. Teren, serwery, aplikacje, instytucje

### D1. Serwery i konta (M)
72. Worker: wdrożony, hasło rejestru ustawione. Po każdej mojej zmianie w `backend/` jeszcze raz `npx wrangler deploy` (mówię kiedy; najbliższe przy B32). Sprawdzić raz, że `PUT /rejestr` z hasłem działa.
73. Repo prywatne i, jeśli zdecydujesz (A20), Cloudflare Pages. Uwaga na łańcuch: domena decyduje o adresie w QR, `share.url`, `og:image` i `ALLOWED_ORIGIN`; nic z adresem nie drukować przed tą decyzją.
74. Domena Fundacji z autoodpowiedzią „Dziękuję. Pięknie.” (60 zł rocznie; KRS, bez zbierania adresów).
75. Dzień premiery: dyżur (rejestr godzinowy co godzinę, próg południa ręcznie, grupa wymiany odczytów: gdzie, do ustalenia; plan B z tygodnia 6: tablica par online).

### D2. Aplikacje na telefonie (P)
76. Scaniverse (Android): skan pokoju na próbę, eksport `.splat`/`.ply`, wczytanie w „Skan (próba)”; zapas KIRI Engine. Dyktafon do ambientu; mikrofony douszne, jeśli nagranie ma być binauralne.

### D3. Sandomierz: realnie cztery do sześciu wyjazdów, nie jeden (P; wizyta 1 w maju 20 h i 400 zł, skany dwa weekendy, południe z dzwonem, Playtest 3 w lipcu, Festiwal Krzemienia we wrześniu, Noc w listopadzie)
77. **Do 30 XI 2026, telefonicznie, nie na wizycie:** Miejska Biblioteka Publiczna (Sokolnickiego 6) o wniosku do programów Ministra na 2027 (biblioteka jako podmiot). Potem na wizycie: księga Rejestru, pieczęć zastępcza, punkt zgłoszeń konkursu, spotkanie dla mieszkańców.
78. PTTK Oddział Sandomierz: trasa siedmiu bram, przewodnicy, pieczęć gościnna, spotkanie dla przewodników.
79. Dwa, trzy lokale na Rynku i Opatowskiej jako strażnicy całoroczni (STRAZNICY.md): zdanie „to miejsce pamięta”, słoik lessu, księga; naklejka na drzwi i stojak QR z czytelną domeną i logo (druk dopiero po D73 i wydawcy).
80. SCK i Podziemna Trasa: brama 5 w ramach biletu, Noc po godzinach (500–1500 zł), zgoda na skan, odpowiedź impulsowa (lipiec, 2–4 tysiące zł). Jedna rozmowa, od której wiszą C62, B50 i brama 5 w Nocy.
81. Dominikanie i proboszcz katedry: teksty o 1260 i o katedrze przed drukiem; nazwy dzwonów i godziny bicia; brama 2 to skwer.
82. Muzeum Zamkowe (strażnik bramy 4, pieczęć questu), Hotel Pod Ciżemką (nazwa w fikcji, piwnice jako zapas bramy 5 i baza Nocy), jubiler (zawieszka w konkursie biżuterii w lipcu, pokaz na Festiwalu Krzemienia we wrześniu; Jaromin w grze, prawdziwy Łutowicz poza nią).
83. Szlak Winiarski: Noc jako pozycja programu Święta Młodego Wina 2027, mail do końca lutego 2027.
84. Towarzystwo Naukowe Sandomierskie, grupa „Sandomierzanie i Sympatycy Sandomierza”, dr Gawałkiewicz z AGH (model 3D trasy), opiekunowie skrzynek geocaching (pierwsi testerzy trasy), PTTK Opatów, OSM Polska, Fundacja Questingu; Leliwa i Radio Kielce dopiero po premierze. Pismo do Burmistrza z prośbą o dane frekwencji; mapa A3 w CIT i „Dzień Siedmiu Bram” po pierwszych recenzjach.
85. Pieczęcie: siedem motywów plus biblioteczna i zastępcza, zamówić po potwierdzeniu lokali i stylu grafiki (40–60 zł sztuka).
86. Zamknięcie sezonu I 24 XII 2027: wpis kohorty do księgi, retrospektywa z liczbami wobec lejka 400–700 skanów.

### D4. Wydawca i instytucje (M dla premiery z książką)
87. Wysyłka rękopisu w marcu 2027 (Czwarta Strona, Marginesy, WL, W.A.B., Filia, SQN, Mova; Audioteka jako partner audio); punkt decyzyjny 31 marca.
88. Klauzule: prawa do gry u autora, kody w książce i czytane w audiobooku, paszport wszyty, „gra nie zbiera danych”, archiwum gry drukowane w drugim wydaniu, edycja Strażnika z termochromią (próba w drukarni wiosną, decyzja przy zamrożeniu składu), ARC 60–80 egzemplarzy w lipcu, stoisko na Targach z obrzędem na żywo, przedsprzedaż edycji Strażnika.
89. Nagrody i programy (terminy dla książki z października 2027 to edycje 2028): Kryminalna Piła 15 I 2028, Conrad 30 IV 2028, Wielki Kaliber 2028; programy Ministra (nabory X–XI, podmiot), Kultura–Interwencje NCK (marzec), świętokrzyskie regionalne.
90. Prawo: opinia radcy na regulaminie, zgłoszenie Nocy do UM 14 dni przed, OC na jeden dzień (150–400 zł), nic na elewacjach.

---

## Zależności, które ustawiają kolejność

1. Akt III → sprawy 5–7 → prawdziwe kody → pieczętowanie i `klucze.json` → zdania dla lektora → zamrożenie składu (czerwiec). Spóźniony akt III przesuwa wszystko w prawo do maja 2028.
2. Wydawca (31 III) → styl grafiki → pieczęcie, paszport w książce, OG, ikona, QR z logo → skład. Bez wydawcy paszport PDF z gry jest jedyną drogą.
3. Repo i domena → adres w QR, `share.url`, `og:image`, `ALLOWED_ORIGIN` → jakikolwiek druk z adresem.
4. Wizyta 1 → zdania strażników → liczba pieczęci i bramy sezonowe w regulaminie → prawnik → regulamin w grze.
5. Playtest 1 → poprawki → luty (B30) → marzec (B31) → Playtest 2; lejek w Workerze (B32) → Playtest 2 → Web Push i „na słowo” jako domyślne.
6. SCK → skan Podziemi i odpowiedź impulsowa → ambient → brama 5 w Nocy. Parafia → nagranie dzwonu → odcisk. Jubiler → zawieszka → NFC → nagroda A w regulaminie.
7. Decyzje kanoniczne (A1) → teksty → ponowne pieczętowanie → audyt UX na stanie końcowym.
8. Kody testowe i `klucze.json` ze szkicami muszą przeżyć wszystkie playtesty i próbę generalną; usuwa się je po niej.
9. Grudzień decyduje o styczniu: rekrutacja do PT1 i lista strażników (A28) idą przed repo i domeną.

## Kill-switche

| Kiedy | Warunek | Jeśli nie |
|---|---|---|
| 30 XI 2026 | rozmowa z biblioteką o wniosku | wniosek w 2028, Noc 2027 za własne 1–2 tys. zł |
| styczeń 2027 | PT1: co najmniej 5 z 10 kończy sprawę 1 | zamrozić wszystko poza sprawą 1 i obrzędem |
| koniec II 2027 | akt III w pierwszej wersji | gra w trybie utrzymania, czas w powieść |
| 31 III 2027 | zainteresowanie wydawcy | harmonogram maj 2028, nic datowanego |
| maj 2027 | zero strażników po wizycie | paszport z pieczęcią biblioteki i QR w SCK |
| wrzesień 2027 | finał we dwoje działa na iPhonie | finał awaryjny jednoosobowy z listem z archiwum |
| tydzień 2 po premierze | co najmniej 150 skanów, obrzęd u 70 procent | poniżej 80 skanów lub obrzęd poniżej 35: „na słowo” domyślnie |
| tydzień 6 | odczyt społeczny u 40 procent, 15 finałów | odczyt poniżej 20: tablica par; poniżej 5 finałów: finał solo |
| tydzień 12 | 500 skanów, 50 finałów | poniżej 20 finałów i 300 skanów: sezon II odwołany, tryb muzeum |

## MVP za 150 godzin (co zostaje, gdy czasu zabraknie)

A1 i A2 w całości; A28; Playtest 1; B30 i B31; B32–B35, B38–B40; C57, C59, C60; D72, D77, D79 (jeden do dwóch lokali), D80, D81, D87–D88, D90. Wszystko z B3, C2 poza C62 (jeden skan pokoju) i C3, oraz D84–D85 to lista do skreślenia w pierwszej kolejności.

## Czego nie ma na liście celowo (czerwony zespół)
Stała instalacja lub lokal, aplikacja natywna, migotanie ekranu, wolny tekst graczy przypięty do miejsc, punkty i rankingi, ósmy gest, skrzynki geocaching i wpisy OSM pod marką gry, „pierwsza w Polsce”, nagrody „dla pierwszych siedmiu”, cokolwiek na elewacjach, nikt pod ziemię poza trasą, obietnice „niepodrabialnego” dzwonu albo zawieszki.
