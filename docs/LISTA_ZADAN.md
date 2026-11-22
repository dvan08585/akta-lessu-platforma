# Lista zadań „Akta Lessu” (stan 22 XI 2026)

Źródła: MASTERPLAN (harmonogram i kill-switche), STRATEGIA_POZIOM_WYZEJ, synteza drugiego panelu (siedem raportów), DO_DECYZJI_AUTORA (punkty 25–37), audyty UX i logiki fabuły, TRESC_PRYWATNA, REGULAMIN_KONKURSU, STRAZNICY, BACKEND. Cztery grupy, jak prosiłeś: (A) tylko Ty, (B) tylko ja, (C) razem, (D) teren, serwery, aplikacje, instytucje. W każdej grupie kolejność według pilności. Oznaczenia: **M** musi być przed premierą, **P** powinno, **m** może. Szacunki czasu są uczciwe, nie optymistyczne.

Stan ogólny: gra jest grywalna od wejścia do finału na dwóch systemach, treść siedmiu spraw po redakcji i audycie logiki, serwer wspólny wdrożony, pokój dwóch telefonów działa. To, co zostało, to decyzje, których nie podejmę za Ciebie, rzeczy fizyczne w Sandomierzu, wydawca i testy z obcymi ludźmi.

---

## A. Tylko Ty (decyzje i rzeczy, do których nie mam dostępu)

### A1. Decyzje kanoniczne (M, 1–2 godziny czytania, DO_DECYZJI_AUTORA.md punkty 25–37)
1. Rok słoika Heleny: 2020 (zalecane) albo bez roku. Dziś 1998 i „dwadzieścia lat” nie składają się z 2040.
2. „H.” profesora: Halina (jak dziś przesądza sprawa 5) czy Helena. Zmienia trop sprawy 5 i kartkę Berbecia.
3. Piwnice hotelu i Opatowskiej: trop zamierzony (jedno zdanie-ogniwo u Wandy) czy nie (m22 do przepisania).
4. Gdzie mieszka Aneta w czasie gry: nadal w siódemce (gracz w ósemce) czy wyprowadziła się.
5. Chronologia profesora względem „dnia 1” Anety: czy rozdział 6 „Profesor” jest o nieobecnym.
6. Brama 5 „Zamkowe” na dokumentach z Opatowskiej: korytarz w stronę zamku w akcie czy zostawić.
7. Kompot jako nośnik rtęci: tak (m44 do zmiany) czy nie.
8. Linia Sudomir: ile ma być widoczne przed książką.
9. Zeszyt geolożki zapisujący czyny gracza jako czyny Anety: sprawdzić rozdział po rozdziale, czy nie przeczy aktowi III.
10. Mikro-akt „Barka” (m58): zostaje w nowym brzmieniu czy wypada.
11. Dwa wprowadzone na próbę, do akceptacji: słowo bramy Zimna „dwa stopnie” zamiast „Helena”; usunięte „Nie jestem sama” z zeszytu przy bramie 7.
12. Z panelu naukowego: fizyka dzwonu w sprawie 2 (36 cetnarów to ton około d’, nie G: zmienić masę, uczynić G tonem dolnym albo zostawić jako fikcję); brama 6 bez ekranu i przechyłu (krokomierz, wibracja co 111 kroków) czy obecna „taca z wodą”; oddech 4 s wdech / 6 s wydech; ciemność do przypominania (trzy zdania głosem, potem pytanie) zamiast czytania.

### A2. Kanon, który tylko Ty znasz (M)
13. Akt III powieści ukończony w pierwszej wersji do końca lutego 2027 (kill-switch z masterplanu: inaczej od marca cały czas idzie w powieść, gra w trybie utrzymania).
14. Ostateczne teksty spraw 5–7 po akcie III (lipiec 2027), potem zapieczętowanie z prawdziwymi kodami.
15. Prawdziwe kody z końców rozdziałów (dziś `codes.local.json` to kody robocze) i decyzja, czy zostają jednowyrazowe, czy dwuwyrazowe z solą (maj 2027).
16. Lista „do sprawdzenia u pasjonaty” z DO_DECYZJI punkt 37 i z raportów: nazwy dzwonów katedry i czy jest „Piotr”, czy trasa biegnie pod Rynkiem 27, Pimpo Limpo i Wąwóz Piszczele, kamienica Lazarczyka, dziewięć pokoi w Ciżemce, 69 tysięcy biletów, róże na Pieprzówkach, Florek o kopcu, Gąssowski zamiast fikcyjnego Saramy w materiałach poza grą.

### A3. Decyzje o kształcie (P)
17. Styl grafiki: ręka ilustratora, generator z redakcją, czy kreska z kodu (ryciny rastrowe zdjęte, brief w GRAFIKA.md, prompty w PROMPTY_RYCIN.md). Bez tej decyzji panorama na wejściu, siedem winiet i ikona aplikacji stoją na szkicu.
18. Daty: październik 2027 jako założenie bazowe z punktem decyzyjnym 31 marca, czy od razu maj 2028 (Tydzień Bibliotek).
19. Repo prywatne i przejście na Cloudflare Pages (dziś każdy może czytać kod i rozpakować sprawy 1–4). Zalecane w grudniu.
20. Analityka 0 zł: czy w ogóle (zdarzenia już idą do Workera; osobna analityka jest opcjonalna).
21. Duet i gwizd: wrócić jako apokryfy w „Poza aktami” (z uzasadnieniem fabularnym) czy zostać w laboratorium.
22. Nazwa i kanon siedmiu wzgórz: dziś Świętopawelskie, Świętojakubskie, Żmigrodzkie, Zamkowe, Katedralne, Miejskie, Collegium; „które są główne” zostaje tajemnicą (Twoja decyzja z 16 XI).

### A4. Rzeczy, do których tylko Ty masz dostęp (M)
23. Kopia zapasowa `content-prywatne/` (pełne sprawy 5–7, scenariusz, decyzje, raporty logiki). Jest poza gitem; jeśli zniknie środowisko, zniknie.
24. Test na telefonach po każdej paczce: Redmi (Android), Huawei P30 Pro, iPhone (Safari: zapis po 7 dniach, haptyka, kamera w bramie 5, mikrofon w bramie 2 i 3). Komnata v6 i laboratorium skanu nadal nieprzetestowane przez Ciebie.
25. Przed premierą: usunięcie kodów testowych BIEGŁY i KONIEC z konfiguracji (`testCodeHash`, `doneCodeHash`), opróżnienie `public/live/klucze.json`, prawdziwe kody. To zrobię ja, ale na Twoje „teraz”.

---

## B. Tylko ja (bez Ciebie, w kolejnych turach)

### B1. Z syntezy panelu i nowych pomysłów (P, po jednej turze każdy)
26. Nocny dopisek: jedno zdanie dokumentu widoczne tylko w trybie nocnym (motyw za słońcem).
27. Echo bram: siedem sekund tła po każdym obrzędzie, lokalnie, odsłuch po siódmej bramie.
28. Wisła jako zegar bramy wody: liczba oddechów z prawdziwego stanu rzeki, dokument w sprawie 3 to tłumaczy.
29. Dokument na Gromniczną (2 lutego): czytelny tylko tego dnia.
30. Dokument, który blaknie: jeden na sprawę traci linijkę tygodniowo, zeszyt zatrzymuje, co przepisano.
31. Paszport do druku z kodu wznowienia: siedem pól z datami, dla czytelnika e-booka.
32. Napisy biegłych ze słownika akt na bramach (Worker już jest) i jednobitowe podziękowanie dla dawcy odczytu.
33. Archiwum Fundacji przeszukiwane słowem (silnik; treść dokumentów „spoza spraw” z Tobą, patrz C).
34. Luki wsteczne i jedna luka na sprawę wyłącznie z książki (silnik gotowy; słowa z Tobą).
35. Statystyka siódmej pozycji po finale w protokole; Rejestr biegłych online jako lustro księgi (lista pseudonimów z kodów biegłego).

### B2. Technika i jakość (M/P)
36. Kody dwuwyrazowe z solą i Worker podpisujący połówki klucza (maj 2027, razem z ostatecznymi tekstami).
37. Test południa z pięcioma telefonami i próba generalna w osobnym wdrożeniu z przestawionym zegarem (wrzesień 2027, Ty dostarczasz telefony).
38. Przejście laboratorium skanu z gsplat na Spark i format SPZ/SOG, gdy przyjdzie pierwszy prawdziwy skan.
39. Odcisk dzwonu: kod detekcji pięciu składowych widma (trzy dni), gdy przyślesz nagranie z południa.
40. Ponowny, niezależny audyt UI/UX na stanie końcowym (po B1), bo ostatni był przed paczkami z paneli.
41. Dokumentacja i README na dzień przekazania wydawcy; instrukcja „jak to utrzymać przez dekadę”.

### B3. Odłożone celowo przez czerwony zespół (m)
42. Web Push (dopiero po Playteście 2, jeśli co najmniej 30 procent instaluje jako aplikację).
43. NFC w zawieszce (dopiero po partnerze-jubilerze).
44. Pełna ścieżka bez czujników jako równorzędna droga (wstrzymane przez Ciebie).

---

## C. Razem (Ty dostarczasz, ja wbudowuję)

45. **Skany miejsc** (P): nagranie Scaniverse pokoju na próbę, potem piwnica, Rynek w południe, trasa (za zgodą SCK). Ja: osadzenie jako dokument z luką, odchudzenie do 300–600 tysięcy plamek, offline.
46. **Nagranie dzwonu w południe** (P): jedno nagranie z Rynku, najlepiej binauralne (mikrofony douszne 300–1500 zł). Ja: odcisk i dokument ze spektrogramem.
47. **Słoiki lessu** (P): siedem słoików z etykietą geologiczną na lady strażników (poniżej 100 zł). Ja: zdanie w instrukcji i w grze.
48. **Zdania „to miejsce pamięta”** od właścicieli lokali (po wizycie). Ja: wpisanie do gry przy bramach.
49. **Dokumenty „spoza spraw”** do archiwum Fundacji przeszukiwanego słowem: trzy do pięciu krótkich tekstów (Sudomir, Helena S., Memoria Nieruchomości). Ty piszesz albo zatwierdzasz moje szkice.
50. **Jedna strona w książce jako klucz finału** (tablica siedmiu znaków) i łańcuch słów bramy: Ty w składzie, ja w grze.
51. **Marginalia geolożki i akrostych** na stronach z kodami (redakcja ma prawo weta).
52. **Playtest 1** (M, styczeń 2027): dziesięć osób, trzy iPhone’y, trzy Androidy, protokół w PLAYTEST.md. Ty prowadzisz, ja poprawiam w tydzień po. Kill-switch: mniej niż pięć z dziesięciu kończy sprawę 1.
53. **Playtest 2 zdalny** (M, kwiecień 2027): 20–30 osób, sprawy 1–3, osobne wdrożenie z kodem testowym.
54. **Playtest 3 terenowy** (P, lipiec 2027): pięć do ośmiu osób w Sandomierzu, QR, GPS, kompas, strażnicy.
55. **Lista 20 faktów** do Towarzystwa Naukowego Sandomierskiego i parafii: ja spisuję, Ty wysyłasz.
56. **Regulamin konkursu** (M): Ty wypełniasz nawiasy i idziesz do prawnika (1–2 godziny), ja poprawiam tekst.
57. **Nagrania ambientu**: dzwon, skarpa, trasa, deszcz na Rynku; Ty nagrywasz, ja wkładam pod wstępy spraw.

---

## D. Teren, serwery, aplikacje, instytucje (Ty, z moją instrukcją)

### D1. Serwery i konta (M)
58. Worker na Cloudflare: zrobione (statystyki, rejestr, pokój). Jeszcze raz `npx wrangler deploy` po każdej mojej zmianie w `backend/` (mówię, kiedy).
59. Repo prywatne na GitHubie i, jeśli zdecydujesz, Cloudflare Pages zamiast GitHub Pages (wtedy `ALLOWED_ORIGIN` w Workerze do zmiany).
60. Domena Fundacji z autoodpowiedzią „Dziękuję. Pięknie.” (60 zł rocznie; sprawdzić KRS, nie zbierać adresów piszących).
61. Dzień premiery: rejestr Fundacji na żywo poleceniem z BACKEND.md, co godzinę, z Twoim hasłem.

### D2. Aplikacje na telefonie (P)
62. Scaniverse (Android): skan pokoju na próbę, eksport `.splat` lub `.ply`, wczytanie w laboratorium „Skan (próba)”. Zapas: KIRI Engine.
63. Mikrofony douszne do nagrania binauralnego (opcjonalnie) i dyktafon telefonu do ambientu.

### D3. Sandomierz, jedna wizyta wiosną 2027 (P), kolejność z masterplanu i raportu 07
64. Miejska Biblioteka Publiczna (Sokolnickiego 6): księga Rejestru biegłych, pieczęć zastępcza, punkt zgłoszeń konkursu, wniosek do programów Ministra (podmiot). **Rozmowa o wniosku do 30 XI 2026, bo nabory są teraz.**
65. PTTK Oddział Sandomierz: trasa siedmiu bram, przewodnicy, pieczęć gościnna.
66. Dwa, trzy lokale na Rynku i Opatowskiej jako strażnicy całoroczni (instrukcja STRAZNICY.md, zdanie „to miejsce pamięta”, słoik lessu, księga).
67. SCK i Podziemna Trasa Turystyczna: brama 5 (60 s ciemności w ramach biletu), Noc po godzinach, zgoda na skan, zdjęcie odpowiedzi impulsowej (lipiec 2027, 2–4 tysiące zł).
68. Dominikanie u św. Jakuba i proboszcz katedry: teksty o 1260 i o katedrze do pokazania przed drukiem; nazwy dzwonów; brama 2 to skwer, nie wnętrze.
69. Muzeum Zamkowe: strażnik bramy 4, połączenie pieczęci questu „Tajemnica Królewskiego Strażnika” z pieczęcią bramy.
70. Hotel Pod Ciżemką: zgoda na nazwę w fikcji, piwnice jako zapas bramy 5 i baza Nocy.
71. Jubiler z krzemieniem pasiastym: zawieszka jako praca w konkursie biżuterii (lipiec), barter za obecność w książce. Pamiętać: Jaromin w grze, prawdziwy Łutowicz poza nią.
72. Szlak Winiarski: Noc Siedmiu Bram jako pozycja programu Święta Młodego Wina 2027, mail do końca lutego 2027.
73. Towarzystwo Naukowe Sandomierskie, grupa „Sandomierzanie i Sympatycy Sandomierza”, dr Gawałkiewicz z AGH (model 3D trasy): listy z listą faktów i prośbą o model.
74. Pieczęcie: siedem motywów plus biblioteczna i zastępcza (brief GRAFIKA.md poz. 16), zamówić dopiero po potwierdzeniu lokali (40–60 zł sztuka).

### D4. Wydawca i instytucje (M dla premiery z książką)
75. Lista wydawców z raportu 05 (Czwarta Strona, Marginesy, WL, W.A.B., Filia, SQN, Mova; Audioteka jako partner audio), wysyłka rękopisu w marcu 2027; punkt decyzyjny 31 marca.
76. Klauzule do umowy: prawa do gry u autora, kody w książce i w audiobooku czytane przez lektora, paszport bram wszyty, zasada „gra nie zbiera danych”, archiwum gry jako dodatek drukowany w drugim wydaniu, edycja Strażnika z termochromią (próba w drukarni wiosną, decyzja przy zamrożeniu składu).
77. Nagrody i programy: Kryminalna Piła (termin 15 I, liczy rok poprzedni), Conrad dla debiutu (30 IV), programy Ministra (nabory X–XI, wymagają podmiotu), Kultura–Interwencje NCK (marzec), świętokrzyskie programy regionalne.
78. Prawo: opinia radcy na regulaminie (500–1000 zł), zgłoszenie Nocy do UM 14 dni przed, OC na jeden dzień (150–400 zł), nic na elewacjach (uchwała krajobrazowa).

---

## Kalendarz kill-switchy (z masterplanu, żeby lista nie udawała, że wszystko się zmieści)

| Kiedy | Warunek | Jeśli nie |
|---|---|---|
| 30 XI 2026 | rozmowa z biblioteką o wniosku | wniosek w 2028, Noc 2027 za własne 1–2 tys. zł |
| koniec II 2027 | akt III w pierwszej wersji | gra w trybie utrzymania, czas autora w powieść |
| styczeń 2027 | Playtest 1: co najmniej 5 z 10 kończy sprawę 1 | zamrozić wszystko poza sprawą 1 i obrzędem |
| 31 III 2027 | zainteresowanie wydawcy | harmonogram alternatywny: maj 2028, nic datowanego |
| maj 2027 | zero strażników po wizycie | paszport tylko z pieczęcią biblioteki i QR w SCK |

## Czego nie ma na tej liście celowo (czerwony zespół)
Stała instalacja lub lokal, aplikacja natywna, migotanie ekranu, wolny tekst graczy przypięty do miejsc, punkty i rankingi, ósmy gest, skrzynki geocaching i wpisy OSM pod marką gry, „pierwsza w Polsce”, nagrody „dla pierwszych siedmiu”, cokolwiek na elewacjach, nikt pod ziemię poza trasą.
