# Panel 02: książka plus gra. Światowe wzorce i nisze dla „Akt Lessu”

Stan: 18 listopada 2026. Skład panelu: projektant gier dedukcyjnych, redaktor książek eksperymentalnych, twórca escape roomów i puzzle huntów. Materiał własny przeczytany przed pracą: `docs/MASTERPLAN.md` (sekcje 1-5), `docs/ARCHITEKTURA.md`, sprawy `01-staromiejskie.json` i `04-zamkowe.json`, rozmowa `wanda` z `interludia.json`, trzy pierwsze mikro-akta, `wiadomosci.json`, skróty spraw 2, 3, 5, 6, 7 oraz `STRATEGIA_POZIOM_WYZEJ.md` i `KATALOG_MECHANIK.md`.

## Metoda i uczciwe zastrzeżenie

Wykonaliśmy 25 wyszukiwań internetowych i każda pozycja oparta na nich ma adres URL. Potem limit wyszukiwań w tej sesji się skończył, a bezpośrednie odczyty stron (Wikipedia, strony wydawców, GDC Vault, Portal Games, Rebel, Hidden Games, Dear Holmes, Puzzled Pint) zostały zablokowane przez ustawienia sieci sesji. Pozycje, których nie udało się zweryfikować w tej sesji, są oznaczone **[W]** (wiedza panelu, bez świeżego potwierdzenia) i powinny zostać sprawdzone przed cytowaniem na zewnątrz. Daty i liczby przy pozycjach bez [W] pochodzą z odnalezionych źródeł.

Nie znaleźliśmy w tej sesji polskich przykładów druku termochromowego w książkach ani polskich hybryd „powieść plus gra z kodami w rozdziałach”. Potwierdza to wcześniejsze ustalenie paneli ze `STRATEGIA_POZIOM_WYZEJ.md`, ale jest to brak dowodu, nie dowód braku.

## 0. Nasze mechaniki w języku wzorców (co już mamy i skąd to pochodzi)

| Mechanika w „Aktach Lessu” | Najbliższy pierwowzór | Czego nam brakuje względem pierwowzoru |
|---|---|---|
| „Ustalenie biegłego”: zdanie z lukami, bank 22-27 słów, hipoteza konkurencyjna | The Case of the Golden Idol (2022) | Golden Idol sortuje bank na kategorie i mówi „dwa lub mniej błędów”; my grzejemy od liczby trafień. Nasz bank jest jednym worem. |
| Rozwiązanie jako nowy dokument (`solutionDoc`) | epilogi Golden Idol, „Zapis gołębnika” | Nic. To jest nasz mocny punkt. |
| Rozmowa z pięcioma pytaniami i jednym kłamstwem (Wanda) | przesłuchania z Ace Attorney [W], Overboard! (2021) | Kłamstwo rozpoznaje się dziś z samej rozmowy. Nie wymaga dokumentu z akt. |
| Listy z opóźnieniem (`delayMin`) | Dear Holmes (listy pocztą co tydzień) [W], Hunt A Killer (pudełka miesięczne) [W] | Rytm fizyczny i możliwość odpisania. Mamy `reply`, ale odpowiedź nic nie zmienia. |
| Zapieczętowane odcinki otwierane kodem z rozdziału | Infocom „feelies” (1982), Escape Room: The Game (2016) | U Infocomu dokument fizyczny był treścią i zabezpieczeniem jednocześnie. U nas kod jest tylko kluczem. |
| Odczyty od innych graczy, mapa 5/7 | Keep Talking and Nobody Explodes (2015), Animal Well (2024) | KTANE daje obu osobom różne źródła informacji, nie tylko token. |
| Dokument „tylko o świcie”, „tylko w południe”, „tylko na miejscu” | Outer Wilds (knowledge gating czasem i miejscem), Masquerade / The Secret (książka wskazuje miejsce) | Pionierskie w literaturze polskiej; patrz sekcja E. |

## A. Książki hybrydowe i eksperymentalne

### A1. „S.” (J.J. Abrams, Doug Dorst, 2013)
1. Powieść „Ship of Theseus” fikcyjnego autora Straki z marginaliami dwojga czytelników (Jen i Eric) pisanymi w różnych kolorach i czasach oraz z około dwudziestoma luźnymi wkładkami (listy, pocztówki, kserokopie, koło szyfrowe). Źródła: https://strangehorizons.com/non-fiction/reviews/s-by-j-j-abrams-and-doug-dorst/ , https://muse.jhu.edu/article/589639/pdf , https://jyx.jyu.fi/bitstream/123456789/62693/1/narrating%20selves%20amid%20library%20shelves%20final%20draft.pdf
2. Mechanizm: **dwie warstwy czasu na jednej stronie** (kolor tuszu mówi, kiedy notatka powstała) i **wkładka jako dokument dowodowy**. Czytelnik sam wybiera strategię lektury (tekst, potem marginalia, albo razem).
3. Dla nas: marginalia geolożki w powieści. Na stronach kończących części z kodami jedna lub dwie linie jej ręką (ten sam głos, który zamyka obrzędy w `rite.closing`). W grze te same zdania wracają jako dokumenty `hand`. Sprawa 3 („Twój miesiąc”): kartka z zeszytu terenowego mogłaby mieć swój „pierwszy zapis” na marginesie rozdziału o katedrze, a w aktach wersję z dopiskiem po zalaniu. Pytanie w luce: „Zapis z marginesu i zapis z akt różnią się ___” (bank: datą, wysokością wody, nazwiskiem konserwatora...).
4. Koszt: zero w druku, jeśli marginalia są czarne w kroju odręcznym (druga farba to dodatkowe tysiące złotych na arkusz). Ryzyko dla czytelnika, który nie gra: małe, marginalia czyta się jak drugi głos, bez konieczności działania. Ryzyko produkcyjne: wkładki wypadają, biblioteki je gubią (opinia z Literary Review w źródłach). Wkładek nie robić w edycji standardowej.
5. Pionierskość w Polsce: polskiego odpowiednika „S.” nie znamy; „S.” nie miało polskiego wydania [W]. Marginalia w powieści gatunkowej byłyby w Polsce nowością.

### A2. „House of Leaves” (Mark Z. Danielewski, 2000)
1. Powieść-labirynt: przypisy odsyłające do przypisów, strony do obracania, słowo „house” zawsze w niebieskim kolorze. Analizy: https://scholarlypublications.universiteitleiden.nl/access/item%3A2733111/download , https://centaur.reading.ac.uk/120352/20/Ferrer%20Andres_RedactedThesis.pdf , https://litreactor.com/columns/post-mortem-house-of-leaves-by-mark-z-danielewski
2. Mechanizm: **typografia inscenizująca** (układ strony odgrywa przestrzeń) i **jedno słowo wyróżnione w całej książce**.
3. Dla nas: nasza zasada „czcionka mówi, czym dokument był napisany” to już ten sam gatunek. Do przeniesienia: jedno słowo (np. „less” albo „siedem”) złożone w całej powieści minimalnie inaczej (inny krój, nie kolor). Gracz, który je policzy w rozdziale, dostaje liczbę; liczba jest drugim kluczem do zapieczętowanego odcinka, gdyby zgubił kod. Dla sprawy 6 („Nie tędy”): dokument o zamurowanym korytarzu złożony tak, że akapity schodzą w dół strony jak korytarz, a ostatnie zdanie jest zamurowane (tekst w ramce z cegieł, czytelny tylko po zaznaczeniu).
4. Koszt: skład, kilka godzin. Ryzyko dla nie-gracza: zero, jeśli różnica kroju jest ledwo widoczna; duże, jeśli książka zacznie wyglądać jak eksperyment (czytelnik thrillera odłoży).
5. Pionierskość: „Dom z liści” ma polskie wydanie (MAG, 2020) [W], więc wzorzec jest w Polsce znany. Zastosowanie w thrillerze głównego nurtu byłoby nowe.

### A3. „Cain's Jawbone” (Edward Powys Mathers „Torquemada”, 1934; wznowienie Unbound 2019; renesans 2021-2024)
1. Sto stron powieści kryminalnej w złej kolejności; trzeba ustalić porządek i sześć morderstw. Rozwiązali: dwie osoby w latach 30., John Finnemore w 2020, potem jeszcze jedna osoba (źródła różnią się: „cztery osoby”). Film Sarah Scannell na TikToku (listopad 2021, ponad 4,8 mln wyświetleń) wyprzedał nakład; Unbound dodrukowało najpierw 10 tys., potem 70 tys. egzemplarzy; w 2024 Unbound ogłosiło konkurs z użyciem AI. Źródła: https://www.thebookseller.com/news/unbound-reprints-70000-copies-literary-mystery-puzzle-tik-tok-sensation-continues-1292483 , https://crimereads.com/the-tortuous-literary-puzzle-cains-jawbone-has-been-solved-for-the-first-time-since-1934/ , https://thebookseller.com/news/unbound-partners-with-ai-platform-for-cains-jawbone-challenge , https://www.mentalfloss.com/literature/books/cains-jawbone-book-puzzle
2. Mechanizm: **kolejność jako rozwiązanie** oraz **„murder board” jako widowisko**: postęp gracza jest fizyczny (ściana z kartkami) i nadaje się do pokazania innym. To był silnik renesansu, nie sama zagadka.
3. Dla nas: sprawa 5 („Fałszywa strona”: cztery strony z notatnika i kalendarz). Zamiast pytać „która strona jest fałszywa”, dać cztery strony do ułożenia w kolejności (24 permutacje, rozsądnie) i dopiero wtedy jedna nie pasuje do kalendarza. Dedukcja: „strona z datą czternastego” (list Berbecia w `wiadomosci.json`) jest fałszywa, bo czternastego archiwum było zamknięte albo czternasty był dniem, w którym profesor był gdzie indziej (dokument z innej sprawy). Pytanie fill: „Kolejność kartek: ___, ___, ___, ___. Nie pasuje ___, bo tego dnia ___.”
4. Koszt: treść plus nowy `kind` pytania (porządek), jeden dzień kodu. Ryzyko: Cain's Jawbone jest nierozwiązywalne dla 99,99% ludzi; to działa przy 100 tys. nakładu i memie, nie przy 150 graczach. Trzymać się czterech kartek.
5. Pionierskość: brak polskiego wydania Cain's Jawbone [W]. Zagadka porządku kartek w polskiej powieści: nie znamy precedensu.

### A4. „Journal 29” (Dimitris Chassapakis, 2017; „Revelation” 2019; „The Cypher Files” 2020)
1. Książka escape: 63 zagadki, każda ma własny adres URL, pod którym wpisuje się odpowiedź; odpowiedzi („klucze”) wracają jako składniki dalszych zagadek. Źródła: https://roomescapeartist.com/2017/10/08/journal29-review , https://puzzleprime.com/?p=71230 , https://escapetalk.nl/en/news-articles/tested-journal-29-interactive-book/
2. Mechanizm: **klucz z zagadki n jest narzędziem w zagadce n+k** (łańcuch), a sprawdzenie odpowiedzi jest na stronie, nie w książce.
3. Dla nas: to jest dokładnie nasz układ (książka daje kod, strona sprawdza), więc do wzięcia jest brakujący element: **łańcuch**. Słowo bramy z obrzędu 1 (`rite.word`) powinno być jednym ze słów w banku sprawy 3, a słowo z obrzędu 4 słowem z banku sprawy 6. Siedem słów bramy razem to bank finału (sprawa 7). Kto nie przeszedł obrzędów, zobaczy w finale luki bez banku.
4. Koszt: tylko treść i pole `bankFrom` w JSON. Ryzyko dla nie-gracza: zero. Ryzyko dla gracza: krytyka Journal 29 mówi o „europejskich skojarzeniach” niezrozumiałych dla innych; nasze słowa muszą być w dokumentach, nie w głowie autora.
5. Pionierskość: Journal 29 było wydane po polsku [W]. Polskie „escape booki” istnieją (seria Escape Quest wymieniona w `STRATEGIA_POZIOM_WYZEJ.md`). Łańcuch między sprawami powieści: nowość.

### A5. „The Unfortunates” (B.S. Johnson, 1969)
1. Powieść w pudełku: 27 nieoprawionych sekcji, tylko pierwsza i ostatnia oznaczone; resztę czyta się w dowolnej kolejności. Źródła: https://www.nysun.com/article/arts-shuffling-through-memories-bs-johnsons , https://andithomas.substack.com/p/the-unfortunates-by-bs-johnson , https://www.eyemagazine.com/feature/article/random-thoughts
2. Mechanizm: **swobodna kolejność ze stałym początkiem i końcem**; forma odgrywa treść (pamięć, która wraca bez porządku).
3. Dla nas: sprawy 1-3 (trzy wzgórza, trzy żywioły: ziemia i ogień, dźwięk, woda) mogłyby być otwarte w dowolnej kolejności po prologu, a dopiero sprawa 4 wymagać trzech rozwiązanych. To rozbraja problem z `STRATEGIA`: 40% graczy blokowanych na milczącym wzgórzu 3 po sprawie 1. Gracz, któremu wzgórze 3 milczy, idzie na wzgórze 2.
4. Koszt: zmiana `requires` w trzech plikach i jeden warunek w `cases.ts`. Ryzyko: listy z opóźnieniem (`after: "case:1"`) zakładają kolejność; trzeba przejrzeć `wiadomosci.json`. Dla nie-gracza: zero.
5. Pionierskość: „Gra w klasy” Cortazara i „Słownik chazarski” Pavicia są w Polsce znane [W]; w thrillerze z grą to nowość organizacyjna, nie literacka.

### A6. „Night Film” (Marisha Pessl, 2013)
1. Thriller z ukrytymi symbolami (czerwone ptaki) w ilustracjach, które darmowa aplikacja „Night Film Decoder” skanowała, odblokowując audio, opowiadanie i zdjęcia. Źródła: https://www.tpr.org/2013-08-19/app-secret-sites-create-the-immersive-world-of-night-film , https://www.mprnews.org/story/2013/09/05/daily-circuit-night-film , https://appadvice.com/appnn/2013/08/its-time-to-get-creeped-out-on-marisha-pessi-night-film
2. Mechanizm: **dokument fikcyjny w tekście jako drzwi** (artykuły, strony internetowe, raporty policyjne wplecione w powieść) plus **aplikacja dekodująca**.
3. Dla nas: lekcja negatywna i pozytywna. Pozytywna: dokumenty w powieści (wycinki, protokoły) to już nasz język, a Pessl pokazała, że czytelnik thrillera je przyjmuje. Negatywna: aplikacja z 2013 roku dziś nie działa w sklepach (zmiany iOS), treść przepadła. Nasza decyzja „strona, nie aplikacja” jest słuszna; QR z `?qr=` i znacznik AR w przeglądarce są odporniejsze.
4. Koszt: zero. Ryzyko: żadne, to ostrzeżenie.
5. Pionierskość: polskie wydanie „Nocnego filmu” (W.A.B., 2014) [W] miało te same symbole, ale aplikacja była anglojęzyczna. Polska powieść z własnym dekoderem: brak precedensu, który znamy.

### A7. „The Twyford Code” (Janice Hallett, 2022) i „Murdle” (G.T. Karber, 2023) [W]
1. Hallett pisze powieści z dokumentów (maile, transkrypcje), a w „The Twyford Code” ukryła akrostych, który czytelnicy rozszyfrowywali po lekturze. „Murdle” to seria książek z codziennymi zagadkami logicznymi (kto, czym, gdzie) ze szczątkową fabułą, bestseller 2023-2024. Oba [W]: nie zweryfikowane w tej sesji; adresy do sprawdzenia: https://en.wikipedia.org/wiki/The_Twyford_Code , https://en.wikipedia.org/wiki/Murdle
2. Mechanizm: Hallett: **kod w tekście, który istnieje bez gry** (nagroda dla czytelnika, który nie wchodzi na stronę). Murdle: **rytm dzienny małych dedukcji** (to są nasze mikro-akta).
3. Dla nas: jeden kod w powieści, który da się złamać bez telefonu (np. pierwsze litery zdań zamykających siedem części dają słowo), a jego rozwiązanie jest też kodem w grze. Czytelnik bez gry ma własną satysfakcję; gracz dostaje drugą drogę do zapieczętowanego odcinka.
4. Koszt: redakcyjny, zero złotych. Ryzyko: akrostych wymusza zdania; redaktor musi mieć prawo odmówić.
5. Pionierskość: w polskiej literaturze gatunkowej nie znamy thrillera z jawnie rozwiązywalnym kodem dla czytelnika [W].

### A8. Armchair treasure hunts: „Masquerade” (Kit Williams, 1979) i „The Secret” (Byron Preiss, 1982) [W]
1. Książki wskazujące fizyczne miejsce ukrycia przedmiotu; „The Secret” ma 12 skrytek, trzy znalezione (1983 Chicago, 2004 Cleveland, 2019 Boston). Adres do sprawdzenia: https://en.wikipedia.org/wiki/The_Secret_(treasure_hunt)
2. Mechanizm: **książka jako mapa do realnego miejsca**, długie życie społeczności (40 lat).
3. Dla nas: pręt geodezyjny „S-3 · 6,1 m” ze `STRATEGIA` to już ten wzorzec. Rozwinięcie: jedno miejsce w Sandomierzu opisane tylko w powieści (nie w grze), rozpoznawalne po przeczytaniu protokołu Saramy w sprawie 1. Kto tam dotrze, znajduje kod QR bez oznaczeń, który daje dokument „Sondaż S-4”.
4. Koszt: 150-300 zł i zgoda właściciela terenu. Ryzyko: kopanie na zabytku (The Secret ma za sobą incydenty z kopaniem w parkach [W]); nasz ślad musi być naziemny i jawnie „nie kopać”, co zgadza się z listem Berbecia („niech pan nie kopie”).
5. Pionierskość: polskie geocachingowe serie literackie istnieją [W], ale thriller z jednym fizycznym śladem w mieście akcji: nowość.

### A9. „Wreck This Journal” (Keri Smith, 2007) i „Ghost Box” [W]
1. „Wreck This Journal” to książka z poleceniami niszczenia stron (miliony egzemplarzy) [W]. „Ghost Box” nie udało się jednoznacznie zidentyfikować w tej sesji (termin oznacza też urządzenie łowców duchów); wzorzec „opowieść w pudełku z przedmiotami” reprezentuje „Building Stories” Chrisa Ware'a (2012, 14 druków w pudle) [W].
2. Mechanizm: **książka wymaga działania ręką** (zniszczenie jako dowód udziału); pudełko: **przedmioty bez narzuconej kolejności**.
3. Dla nas: niszczenia książki nie robić (patrz czerwony zespół). Zamiast tego mamy już zawieszkę z siedmioma nacięciami, które gracz pogłębia. Jedyne dopuszczalne „działanie na książce”: strona do trzymania pod światło (prześwit z `KATALOG_MECHANIK` pkt 8) i strona do ogrzania palcem (sekcja E).
4. Koszt: zero. Ryzyko: wysokie dla czytelnika bez gry i dla bibliotek; drugi obieg książki ginie.
5. Pionierskość: „Zniszcz ten dziennik” ma polskie wydanie [W]; nic do zdobycia.

## B. Gry stołowe, pudełkowe i korespondencyjne

### B1. „Sherlock Holmes Consulting Detective” (Sleuth Publications, 1981)
1. Gra kooperacyjna: książka sprawy, mapa Londynu, spis adresowy, gazety z dnia; gracze wybierają tropy, każdy odwiedzony adres to akapit; na końcu porównanie z rozwiązaniem Holmesa, który zawsze użył mniej tropów. Nagroda Charles S. Roberts 1983. Źródła: https://www.meeplelikeus.co.uk/sherlock-holmes-consulting-detective-1981/ , https://eriktwice.com/en/2021/02/19/sherlock-holmes-consulting-detective-thames-murders-review/ , https://bumblingthroughdungeons.com/sherlock-holmes-consulting-detective-review/
2. Mechanizm: **informacja ukryta w szumie** (gazeta pełna rzeczy nieistotnych, w tym tropów do innych spraw) i **koszt tropu** (każdy odwiedzony adres obniża wynik).
3. Dla nas: mikro-akta dnia mogłyby być „gazetą”: jedna strona „Tygodnika Sandomierskiego” z ogłoszeniami, w której jedno ogłoszenie jest tropem do sprawy 4 (np. ogłoszenie Memoria Nieruchomości o kupnie kamienic z piwnicami). Gracz, który je zapamięta, w sprawie 4 ma dodatkowe słowo w banku. Pytanie SHCD „ile tropów zużyłeś” odrzucamy: porównanie z komisarzem upokarza.
4. Koszt: treść, 1 dzień na typ dokumentu `press` z wieloma kolumnami. Ryzyko dla nie-gracza: zero. Ryzyko: gazeta musi być krótka na telefonie.
5. Pionierskość: SHCD ma polskie wydanie (Portal Games) [W]. Gazeta z szumem w powieści: nowe.

### B2. „Escape Room: The Game” (Identity Games, 2016) i książki escape
1. Gra z elektronicznym Chrono Decoderem: zegar, dekoder szyfrów (dyski liter i cyfr, Morse, szachownica Polibiusza) i sprawdzacz czteroelementowego klucza; każdy scenariusz ma trzy części po cztery klucze. Recenzje mieszane („gadżet, który zastąpiłaby aplikacja”). Źródła: https://boardgamequest.com/escape-room-the-game-review , https://www.meeplemountain.com/reviews/escape-room-the-game-escape-rooms-ii/ , https://tabletopgaming.co.uk/Reviews/escape-room-the-game-2-review
2. Mechanizm: **fizyczny weryfikator offline** (klucz wkładany do urządzenia) i **presja czasu z kartami podpowiedzi**.
3. Dla nas: zawieszka z tagiem NFC jest naszym Chrono Decoderem: przyłożenie do telefonu po rozwiązaniu sprawy to „włożenie klucza”. Czego nie brać: zegara. Nasz kontrakt frustracji wyklucza presję czasu. Uwaga do Stuarta Turtona: autor „Siedmiu śmierci Evelyn Hardcastle” (2018) pisze powieści o strukturze zagadki (osiem ciał, jeden dzień), nie książki escape; porównanie z escape roomem jest interpretacją krytyków. Źródło: https://www.littleponderings.co.uk/post/the-seven-deaths-of-evelyn-hardcastle-and-the-philosophy-of-the-escape-room
4. Koszt: tag NTAG213 ok. 2 zł, w planie. Ryzyko: urządzenie na baterie starzeje się (recenzje); tag NFC nie.
5. Pionierskość: polski rynek escape roomów jest jednym z najgęstszych w Europie [W]; książki escape są w Polsce, powieść literacka z weryfikatorem fizycznym nie.

### B3. „Keep Talking and Nobody Explodes” (Steel Crate Games, 2015)
1. Jedna osoba widzi bombę i nie ma instrukcji, druga ma instrukcję (darmowo na bombmanual.com) i nie widzi bomby; moduły mają reguły celowo arbitralne, żeby liczyła się komunikacja. Źródła: https://pixelpoppers.com/review/keep-talking-and-nobody-explodes/ , https://destructoid.com/?p=185268 , https://arxiv.org/pdf/2606.28514
2. Mechanizm: **informacja rozdzielona między dwa źródła**, których nie da się złożyć w jednej głowie bez rozmowy.
3. Dla nas: to brakujące ogniwo finału „we dwoje”. Dziś druga osoba daje token (siedem znaków hex), czyli nic do rozmowy. KTANE mówi: niech druga osoba ma **książkę**, a pierwsza **telefon**. Sprawa 7: telefon pokazuje siedem znaków (pieczęcie wrót spod Wzgórza Miejskiego ze sprawy 2), a tabela do ich odczytania jest wydrukowana w powieści (np. na wyklejce albo jako „tablica Berbecia” w rozdziale o inwentarzu). Dla czytelnika bez gry to ornament. Dla modelu językowego: tabela nie istnieje w JSON, więc nie da się jej wyciągnąć z bundla (odpowiedź na pęknięcie „koniec gry leży w JavaScripcie”).
4. Koszt: jedna strona składu, dzień kodu na `kind: "table"`. Ryzyko: wersja e-book ma tę samą stronę, więc działa; audiobook wymaga lektora czytającego tabelę, czego nie zrobimy. Dla gracza samotnego: książka i telefon w jednych rękach też działa, bez przymusu drugiej osoby. Przymus pary zostaje w pięciu palcach.
5. Pionierskość: wzorzec znany w Polsce z gier, nieznany w książkach.

### B4. Infocom „feelies”: „Deadline” (1982)
1. Pierwsza gra Infocomu z fizycznymi przedmiotami: teczka „Documentary Evidence” z raportem policyjnym, przesłuchaniami, zdjęciem miejsca zbrodni, raportem koronera, trzema tabletkami w torebce i listem adwokata; informacje z teczki były niezbędne do ukończenia gry i działały jako zabezpieczenie przed kopiowaniem. Źródła: https://www.filfre.net/2012/07/deadline/ , https://www.historyofinformation.com/detail.php?id=5641 , https://giantbomb.com/wiki/Games/Deadline_1982
2. Mechanizm: **dokument fizyczny jest treścią i kluczem jednocześnie**.
3. Dla nas: edycja Strażnika z jedną luźną kartą (kopia umowy o dzieło ze sprawy 4 z ręczną adnotacją „S.”), której treść nie jest w grze. Gra pyta o szczegół z karty („Numer zlecenia na kopii: ___”); edycja standardowa dostaje ten szczegół w liście od Zielińskiego po 72 godzinach (ten sam mechanizm „partnera awaryjnego” ze `STRATEGIA`). Dwie klasy czytelników, jedna fabuła.
4. Koszt: wkładka 1-2 zł na egzemplarz, 1500-2000 szt. to 2-4 tys. zł. Ryzyko: wkładka wypada i ginie (patrz „S.”); list awaryjny to ratuje.
5. Pionierskość: polskie gry z „feelies” były (np. „Detektyw” Portal Games z fizycznymi kartami i bazą Antares, 2018 [W]); powieść z dokumentem-kluczem: nowość.

### B5. Rodzina „dowody w pudełku”: Hunt A Killer (2016), Hidden Games (2019), Dear Holmes, Chronicles of Crime (2018), „Detektyw” (Portal Games, 2018) [W]
1. Wszystkie [W], do sprawdzenia: https://en.wikipedia.org/wiki/Hunt_a_Killer , https://hiddengames.de/en/ , https://www.dearholmes.com/ , https://portalgames.pl/pl/detektyw/ . Wspólny trzon: fizyczne dowody plus strona internetowa, na której wpisuje się rozwiązanie albo czyta bazę danych. Dear Holmes wysyła listy pocztą, jeden tygodniowo, a rozwiązanie przychodzi po czterech. „Detektyw” Trzewiczka łączy karty z bazą Antares online i zachęca do szukania w prawdziwej Wikipedii.
2. Mechanizm: Dear Holmes: **oczekiwanie z datą** (nasza zasada 9 z MASTERPLAN). Detektyw: **prawdziwy świat jako źródło** (Wikipedia jako dokument gry).
3. Dla nas: jeden list fizyczny (pocztówka za 3 zł z planu) powinien przyjść **po** rozwiązaniu sprawy 4, kiedy gracz wie, że Fundacja ma jego adres z zamówienia; sama koperta z nadrukiem programu jest wtedy twistem (dokument IV sprawy 4 mówi o kopertach). Z Detektywa: w sprawie 2 jedno pytanie, którego odpowiedź jest w prawdziwym źródle (np. rzeczywista waga dzwonu albo rok odlania), żeby gracz raz wyszedł do świata; motto „świat jako słownik”.
4. Koszt: pocztówki 450 zł; prawdziwe dane: zero, ale wymagają weryfikacji faktograficznej i ryzykują spór z lokalnym kanonem (MASTERPLAN pkt 11.3 o nazewnictwie wzgórz).
5. Pionierskość: Polska ma w tej rodzinie światowy produkt („Detektyw”), więc „baza online do gry dedukcyjnej” nie jest u nas pionierska. Pionierska jest powieść jako nośnik.

## C. Gry cyfrowe: mechanizmy dedukcji

### C1. „Return of the Obra Dinn” (Lucas Pope, 2018)
1. Sześćdziesiąt losów załogi do ustalenia z zatrzymanych scen śmierci; gra wprost mówi, że część wymaga eliminacji; losy potwierdzają się dopiero w trójkach. Źródła: https://filmstories.co.uk/?p=83249 , https://techraptor.net/content/return-of-the-obra-dinn-review , https://gamedeveloper.com/design/opinion-i-return-of-the-obra-dinn-i-is-a-work-of-art
2. Mechanizm: **potwierdzanie trójkami** (brak sprzężenia na pojedynczą odpowiedź, więc zgadywanie nie działa) oraz **manifest załogi jako dokument-rama** (lista nazwisk, które trzeba przypisać do twarzy). Krytyka: wybory wielokrotne są eksploatowalne.
3. Dla nas: nasz „inwentarz 1288” („było 134, jest 131”) to manifest Obra Dinn. Zmiana sprzężenia: zamiast ciepła 0-4 od liczby trafień, luki „zastygają” dopiero, gdy trzy sąsiednie są poprawne; przy siedmiu lukach to dwa zastygnięcia i jedna luka końcowa. Zawieszka grzeje przy pierwszym zastygnięciu, nie przy każdym trafieniu. Zgadywanie przy 60-sekundowej blokadzie staje się nieopłacalne, a gracz dostaje czytelną informację „ta część ustalenia jest pewna”.
4. Koszt: jeden dzień w `cases.ts` (`fillGaps` już zwraca liczbę trafień; trzeba zwracać maskę). Ryzyko: siedem luk to mało na trójki; dla spraw z sześcioma lukami grupy 3+3.
5. Pionierskość: wzorzec znany graczom, nieznany czytelnikom; w polskich grach słownych brak.

### C2. „The Case of the Golden Idol” (Color Gray, 2022) i „The Rise of the Golden Idol” (2024)
1. Zdania z lukami uzupełniane słowami z banku (imiona, rzeczowniki, czasowniki, sortowane automatycznie); gra mówi, gdy błędów jest dwa lub mniej. W sequelu z listopada 2024 słowa dodają się same przy oglądaniu, co recenzenci uznali za stratę („usuwa warstwę zaangażowania”). Źródła: https://thinkygames.com/features/how-the-case-of-the-golden-idol-developers-made-one-of-the-decades-best-detective-games-twice/ , https://www.rpgfan.com/review/the-rise-of-the-golden-idol/ , https://adventuregamehotspot.com/2022/11/21/the-case-of-the-golden-idol
2. Mechanizm: **wniosek jako zdanie do złożenia**; bank z fałszywymi słowami; sprzężenie progowe.
3. Dla nas: mamy rdzeń. Trzy rzeczy do dołożenia: (a) bank podzielony na kategorie (osoby, miejsca, działania), bo 27 słów w jednym worze na telefonie to przewijanie; (b) słowa do banku zbiera gracz **sam**, zaznaczając je w dokumentach (jak w pierwszej części, nie w sequelu), co zamienia czytanie w działanie i rozwiązuje pęknięcie „luki stoją na danych”; (c) jedno pytanie w każdej sprawie, którego odpowiedź **nie** jest słowem z dokumentu, tylko wnioskiem („zamknęła ich pod sobą” w sprawie 1 jest dobrym wzorem).
4. Koszt: (a) pół dnia; (b) 2-3 dni i redakcja: każde słowo z `answerWords` musi stać w jakimś dokumencie dosłownie, hipoteza konkurencyjna też. Ryzyko: zbieranie słów bywa monotonne; ograniczyć do słów podświetlonych, jak Golden Idol.
5. Pionierskość: brak polskiej gry tego typu; przeniesienie do powieści jest nasze.

### C3. „Her Story” (2015) i „Immortality” (2022, Sam Barlow)
1. Her Story: baza nagrań przesłuchań przeszukiwana słowem, widoczne tylko pierwsze pięć wyników. Immortality: zamiast słowa, obraz: kliknięcie przedmiotu w kadrze przenosi do innego klipu z podobnym przedmiotem (match cut), świadomie nie zgamifikowane. Źródła: https://blog.unity.com/en/games/how-half-mermaid-designed-immortalitys-match-cut-mechanic , https://blog.zarfhome.com/2022/10/immortality , https://wbs.cdn.uib.no/wiki/Texts,_Interfaces,_and_the_Puzzle_Element_in_Her_Story
2. Mechanizm: **wyszukiwanie jako interfejs** (gracz musi wymyślić słowo, którego jeszcze nie zna) i **przedmiot jako łącznik między dokumentami**.
3. Dla nas: (a) archiwum Fundacji na własnej domenie (plan ze `STRATEGIA`) z polem wyszukiwania: wpisane słowo daje najwyżej trzy odpisy; „Sudomir” z listu Zielińskiego otwiera dokument, którego nie ma w aktach żadnej sprawy; (b) „słowa-kotwice”: kożuch, słoik, spinka siedmioboczna, biały gołąb występują w kilku sprawach; dotknięcie słowa w dokumencie pokazuje listę innych dokumentów, w których stoi. Czytelnik widzi, że słoik Heleny ze sprawy 4 jest tym samym słoikiem z rozmowy z Wandą i mikro-aktu „Kompot”.
4. Koszt: (a) 2-3 dni, indeks JSON, bez backendu; (b) 1 dzień, słownik kotwic w `config.json`. Ryzyko: wyszukiwarka zdradza istnienie dokumentów przez autouzupełnianie; wyłączyć je.
5. Pionierskość: wzorzec znany; w polskiej powieści z grą: pierwszy.

### C4. „Outer Wilds” (Mobius Digital, 2019)
1. Gra bez przedmiotów i kluczy: postęp to wyłącznie wiedza; dziennik statku zapamiętuje ustalenia między pętlami i oznacza „jest tu coś więcej do odkrycia”; wykłady GDC 2020-2021 o projektowaniu ciekawości. Źródła: https://rigdern.github.io/a/learning-about-learning/learning-design-insights-from-outer-wilds/ , https://gdconf.com/article/attend-gdc-and-learn-how-outer-wilds-nailed-curiosity-driven-game-design/ , https://gamedeveloper.com/design/outer-wilds-critical-analysis
2. Mechanizm: **bramkowanie wiedzą** (zamek, który otwiera się słowem, nie przedmiotem) i **dziennik jako mapa niewiedzy**.
3. Dla nas: dziś bramkujemy kodem, czasem, miejscem i gestem. Brakuje bramki wiedzą: jedno pole w sprawie 3 („Co stoi na dopisku wodowskazu?”) nie sprawdza odpowiedzi, tylko otwiera dokument, jeśli wpisane słowo jest słowem z innej sprawy (np. „Gromniczna” ze „Zapisu gołębnika”). Zeszyt biegłego: automatyczny spis ustaleń z każdej sprawy z jednym znacznikiem „niedopowiedziane” tam, gdzie jest nieotwarty dokument (świt, południe, miejsce). To zastępuje podpowiedź po pięciu próbach czymś, co nie zdradza odpowiedzi.
4. Koszt: zeszyt 2-3 dni; bramka wiedzą pół dnia. Ryzyko: znacznik „jest tu więcej” przy dokumentach „tylko na miejscu” frustruje 99% graczy; oznaczać tylko dokumenty osiągalne w domu.
5. Pionierskość: wzorzec znany; w książce z grą nowy.

### C5. Inkle: „Heaven's Vault” (2019) i „Overboard!” (2021)
1. Heaven's Vault: odczytywanie starożytnego pisma, gra nigdy nie potwierdza przekładu, błędny przekład wraca później jako sprzeczność. Overboard!: odwrócony kryminał, gracz jest morderczynią i ma w osiem godzin uniknąć kary; system dedukcji przeniesiony z Heaven's Vault; zrobione w trzy miesiące. Wykład GDC „The Burden of Proof”. Źródła: https://www.thesixthaxis.com/2018/04/27/interview-talking-with-inkles-about-deciphering-ancient-language-in-heavens-vault/ , https://gamedeveloper.com/design/how-get-away-murder-overboard , https://www.pcgamer.com/how-the-studio-behind-80-days-made-one-of-the-best-games-of-2021-in-just-3-months , https://gdcvault.com/play/1027723/The-Burden-of-Proof-Narrative
2. Mechanizm: **przekład niepotwierdzany** (świat jako słownik, który sprawdza się dopiero w użyciu) i **gracz po stronie sprawcy** (dedukcja, co inni mogą wiedzieć).
3. Dla nas: (a) siedem słów bramy (`rite.word`) jako słownik, którego gra nie potwierdza: gracz nadaje im znaczenie w zeszycie, a w finale dokument Fundacji używa ich w zdaniu, które albo się składa, albo nie; (b) sprawa 4 już odwraca rolę („biegły w tym rejestrze to ___: ty”); Overboard! podpowiada następny krok: w sprawie 6 po pociągnięciu cegły gracz widzi **listę zarządu**: co jego dotychczasowe wnioski umożliwiły Fundacji, wzgórze po wzgórzu. Dedukcja z własnej winy.
4. Koszt: treść; lista zarządu to jeden dokument generowany ze stanu (`solvedCases`), pół dnia. Ryzyko: moralizowanie; lista musi być sucha jak rejestr („Punkt 3: status zmieniony na podstawie wniosku biegłego z dnia...”).
5. Pionierskość: odwrócony kryminał jest w literaturze stary (Freeman, 1912 [W]); w grze do powieści u nas pierwszy.

### C6. „Device 6” (Simogo, 2013)
1. Tekst układa się w plan miejsca; czytanie to przesuwanie palcem po korytarzach ze zdań; dźwięk buduje miejsce, tekst buduje przestrzeń. Krytyka: nawigacja po długich pasażach męczy (Emily Short). Źródła: https://www.popmatters.com/180908-place-and-space-in-device-6-2495667615.html , https://www.pocketgamer.biz/textual-orientation-the-making-of-device-6/ , https://emshort.blog/2014/12/20/device-6-the-sailors-dream-simogo/
2. Mechanizm: **tekst jako przestrzeń** (układ zdań jest mapą).
3. Dla nas: jeden dokument na grę, nie więcej. Protokół Saramy (sprawa 1) złożony pionowo jak profil wykopu: warstwa II u góry, III, IV niżej, a akapit „poniżej 6,1 m” wymaga przewinięcia poza krawędź, w ciemniejsze tło; „dalej nie eksplorowano” jest ostatnią linią, pod którą jest jeszcze pusty ekran. Gracz czuje głębokość, zanim przeczyta liczbę. To samo dla sprawy 6: korytarz, który kończy się murem z tekstu.
4. Koszt: CSS, pół dnia na dokument. Ryzyko dla nie-gracza: zero (to w grze, nie w książce). Ryzyko dla gracza: dostępność; czytnik ekranu dostaje tekst liniowo, co trzeba zachować.
5. Pionierskość: brak polskich przykładów w literaturze; w grach na telefon wzorzec znany.

### C7. „Blue Prince” (Dogubomb, 10 kwietnia 2025)
1. Rezydencja z 45 pokojami losowanymi każdego dnia; cel „pokój 46” to początek, nie koniec; recenzenci po 25 godzinach mieli dziesiątki nierozwiązanych wątków; „żadna pojedyncza osoba nie zrozumie wszystkiego, potrzebna jest społeczność”. Oceny 90-95/100. Źródła: https://thinkygames.com/reviews/blue-prince-review/ , https://www.pcgamer.com/games/puzzle/it-took-me-25-hours-to-finish-puzzle-strategy-game-blue-prince-and-15-hours-after-that-im-still-uncovering-new-mysteries , https://adventuregamehotspot.com/review/4117/blue-prince
2. Mechanizm: **koniec jako próg** (po napisach gra zaczyna się naprawdę) i **tajemnice bez potwierdzenia autora**.
3. Dla nas: `STRATEGIA` ma już 21 linii dokumentu rozdzielonych między graczy. Blue Prince dodaje: po finale (siódma pozycja pusta) rejestr Fundacji **nadal się zmienia** przez kilka miesięcy (backend już to umie), a autor nie potwierdza, czy ostatnia zmiana jest ostatnią. Jedno zdanie w siódmej pozycji, które pojawia się tylko, gdy w jednej minucie nuci N osób (południe premiery) i nigdy więcej.
4. Koszt: zero złotych, ręczna zmiana pliku w `live/`. Ryzyko: Blue Prince ma miliony graczy, my 50-150 kończących; nierozwiązane wątki przy tej liczbie to cisza, nie legenda. Jedna tajemnica po finale, nie dziesięć.
5. Pionierskość: brak polskich precedensów w książkach.

### C8. „Lorelei and the Laser Eyes” (Simogo, maj 2024)
1. Hotel pełen zagadek bez systemu podpowiedzi, „notatnik obowiązkowy”; projekt „zawsze naprzód, nigdy wstecz”; reguła: żaden rok w zagadkach nie ma powtarzających się cyfr; zagadka ma być zbudowana jak dobry dowcip (dokładnie tyle informacji, żeby gracz zaczął mieć pomysły). Źródła: https://www.nintendolife.com/features/a-puzzle-should-be-structured-like-a-good-joke-the-influences-and-craft-behind-lorelei-and-the-laser-eyes , https://thinkygames.com/features/how-lorelei-and-the-laser-eyes-made-its-reality-bending-story-into-one-giant-puzzle/ , https://mssv.net/2024/07/16/lorelei-and-the-laser-eyes/
2. Mechanizm: **instrukcje w świecie** (książki w hotelu uczą zasad zagadek) i **higiena liczb** (daty nie mylą się ze sobą).
3. Dla nas: higiena liczb natychmiast: w sprawach mamy 1260, 1287, 1288, 1354, 1677, 1959, 6,1 m, 330, 49, 41, 134, 131, 212, 211, 40, 12, 777. Sprawdzić, czy żadne dwie liczby, które gracz ma odróżnić w jednej sprawie, nie różnią się jedną cyfrą (134/131 i 212/211 są celowe, ale w banku nie mogą stać obok siebie jako alternatywy). „Instrukcja w świecie”: przewodnik po Sandomierzu jako dokument `plain` w sprawie 2, który tłumaczy, jak czytać wydruk rejestratora drgań, zamiast tłumaczyć to głosem gry.
4. Koszt: redakcja. Ryzyko: brak podpowiedzi w Lorelei był krytykowany; my mamy jedno zdanie o metodzie po pięciu próbach, to wystarczy.
5. Pionierskość: nie dotyczy.

### C9. „Chants of Sennaar” (Rundisc, wrzesień 2023)
1. Pięć języków glifów do rozszyfrowania z kontekstu; hipotezy zapisuje się w zeszycie, a gra potwierdza je dopiero partiami, gdy kilka glifów naraz jest poprawnie przypisanych do obrazków; każda warstwa wieży ma glify o innej budowie (budowlane są pudełkowate, celowo najłatwiejsze). Źródła: https://medium.com/@jonlangcommissions/show-not-tell-an-analysis-of-chants-of-sennaar-4e283252558d , https://tech.caltech.edu/2025/12/02/should-you-play-chants-of-sennaar-/ , https://www.axios.com/2023/09/08/chants-of-sennaar-rundisc-interview , https://roomescapeartist.com/2023/11/18/focus-entertainment-chants-sennaar-review/
2. Mechanizm: **hipoteza robocza z opóźnionym potwierdzeniem w partiach** i **kształt znaku koduje jego klasę**.
3. Dla nas: siedem pieczęci wrót spod Wzgórza Miejskiego (sprawa 2: „wrót, wszystkie z otworem na pieczęć”) jako siedem znaków, które gracz spotyka po jednym w kolejnych sprawach (na kożuchu, na spince, na słoiku, na belce). Przypisuje im wzgórza w zeszycie; gra potwierdza dopiero trzy naraz (łączy się z C1). Znaki mają wspólną budowę zależną od żywiołu (woda faliste, ziemia kątowe), jak w Sennaar. W finale (sprawa 7) siedem znaków to klucz do tabeli w książce (B3).
4. Koszt: grafika siedmiu znaków (w planie są już znacznik AR i siedmiobok), 1-2 dni kodu zeszytu. Ryzyko: jedna więcej warstwa „do zbierania”; `STRATEGIA` ostrzega przed katalogiem. Robić tylko, jeśli zastępuje coś (np. odczyty wzgórz jako hex).
5. Pionierskość: brak polskich przykładów w książkach z grą.

### C10. „The Roottrees are Dead” (Jeremy Johnston, Robin Ward; jam 2023, wydanie Steam styczeń 2025)
1. Zapełnianie drzewa genealogicznego 50 osób z lat 90. za pomocą fikcyjnej wyszukiwarki „SpiderSearch” i biblioteki książek; każde pole to imię, zdjęcie i zawód; gra potwierdza poprawne gałęzie partiami. Źródła: https://thinkygames.com/reviews/the-roottrees-are-dead-review/ , https://www.pcgamer.com/games/puzzle/the-roottrees-are-dead-review , https://www.vice.com/en/article/the-roottrees-are-dead-is-a-puzzling-narrative-that-made-me-an-armchair-detective-review
2. Mechanizm: **struktura do wypełnienia zamiast pytań** (drzewo, nie quiz) i **fikcyjny internet jako archiwum**.
3. Dla nas: ród Berbeciów: kasztelan Berbeć 1287, „potomek w archiwum” (dokument VI sprawy 1), Berbeć senior (rozmowa), Marek Berbeć (list po sprawie 6: „pierwszy raz od siedmiuset lat”). Zamiast pytania w sprawie 6: drzewo z siedmioma polami (po jednym na stulecie), zapełniane z dokumentów wszystkich spraw, potwierdzane partiami. To jest nasze „meta” w sensie puzzle huntu, zrobione z istniejącej treści.
4. Koszt: nowy `kind: "tree"`, 2-3 dni; treść: siedem nazwisk i dat rozsianych po dokumentach spraw 1-6 (część już jest). Ryzyko: zdradza, że rodzina jest osią aktu III (`STRATEGIA` wskazuje przecieki o pokrewieństwie); drzewo otwierać dopiero w sprawie 6.
5. Pionierskość: brak polskich przykładów.

## D. Puzzle hunty

### D1. MIT Mystery Hunt (od 1981; edycja 16-19 stycznia 2026)
1. W 2026 roku ponad 5000 uczestników w około 280 drużynach; struktura: zagadki składowe (feeders) dają słowa do metazagadek rund, metazagadki składają się w meta-meta; zagadki odblokowują się za rozwiązania; zwycięska drużyna pisze następną edycję. Źródła: https://thetech.com/2026/01/22/mystery-hunt-2026 , https://betaveros.bearblog.dev/mit-mystery-hunt-2025-the-unsolicited-reviews/ , https://willflame.mataroa.blog/blog/mitmh-2026/
2. Mechanizm: **metazagadka** (odpowiedzi są danymi następnego poziomu) i **„zwycięzca pisze następny”**.
3. Dla nas: siedem ustaleń biegłego to feeders, finał to meta (łączy A4, B3, C9, C10). Drugi wzorzec jest ciekawszy dla sezonu 2: pierwsze dziesięć osób, które zostawią siódmą pozycję pustą, dostaje zaproszenie do napisania jednego mikro-aktu do kanonu (z redakcją autora). Społeczność pisze, autor podpisuje.
4. Koszt: redakcyjny. Ryzyko: prawa autorskie i jakość; regulamin konkursu już istnieje (`REGULAMIN_KONKURSU.md`), dopisać punkt.
5. Pionierskość: puzzle hunty w Polsce są niszowe; brak znanych nam literackich.

### D2. DASH, Galactic Puzzle Hunt, Puzzled Pint
1. Puzzled Pint: drugi wtorek miesiąca, te same zagadki w ponad 50 miastach świata, w barach; jedyna polska lokalizacja to Trójmiasto (następne spotkanie 8 grudnia 2026). DASH („Different Area Same Hunt”: ten sam hunt tego samego dnia w wielu miastach) i Galactic Puzzle Hunt (online, zespół ✈✈✈ Galactic Trendsetters ✈✈✈) [W]: nie zweryfikowane w tej sesji. Źródła: https://puzzledpint.org/ , https://www.puzzles.wiki/wiki/Puzzled_Pint , https://www.puzzles.wiki/wiki/List_of_Puzzle_Hunts
2. Mechanizm: **ten sam rytuał tej samej nocy w wielu miejscach** (DASH, Puzzled Pint) z lokalnym gospodarzem, bez centralnej obsługi.
3. Dla nas: Noc Siedmiu Bram (MASTERPLAN 6) jest dziś wydarzeniem w jednym mieście dla 10-25 osób. Model DASH: ta sama noc, te same siedem obrzędów w 5-7 księgarniach w Polsce (Kraków, Warszawa, Lublin, Kielce, Trójmiasto) z jednym gospodarzem na miasto i jedną kartką skryptu; Sandomierz jest „bramą główną” z pieczęcią czarną, pozostałe miasta mają pieczęć srebrną. Puzzled Pint Trójmiasto to gotowy partner pilotażu i społeczność, która umie prowadzić wieczór z zagadkami.
4. Koszt: druk skryptów i pieczęci, 500-1000 zł; czas organizacyjny. Ryzyko: `MASTERPLAN` przewiduje realną frekwencję 10-25 osób w jednym mieście; siedem miast po trzy osoby to porażka wizerunkowa. Próg: miasto wchodzi, gdy zgłosi się 8 osób.
5. Pionierskość: wielomiastowa noc literacka z obrzędem to w Polsce nowość; „Noc Księgarń” istnieje jako rama [W], można się pod nią podłączyć zamiast budować własną.

## E. Fizyczne obiekty i farby reagujące

### E1. Druk termochromowy w książkach: zweryfikowane przykłady
1. „Keep Our Secrets” Jordana Crane'a (McSweeney's, 2011-2012): książka dla dzieci, warstwa farby staje się przezroczysta od ciepła palców i odsłania ukryte rysunki. „Frozen Book” (Penguin Random House China z Hunan Juvenile and Children's Publishing): 24 strony czytelne tylko po zamrożeniu, tekst znika w cieple po około 15 minutach. „To You” Yioty Demetriou: książka-harmonijka pokryta czarną farbą termochromową, wiersze widoczne od ciepła ciała. W przemyśle: Celloglas (UK) oferuje wykończenie termochromowe jako standardową usługę; farby „rub and reveal” używa się do ukrywania odpowiedzi w quizach i zeszytach ćwiczeń. Źródła: https://www.themarginalian.org/2011/08/05/mcsweeneys-keep-our-secrets/ , https://www.publishersweekly.com/pw/by-topic/industry-news/manufacturing/article/77833-unique-thermochromic-ink-application-in-penguin-frozen-book.html , https://www.celloglas.co.uk/print-finishing/special-effect-finishes/thermochromic/ , https://www.printweek.com/content/news/heat-and-touch-sensitive-book-launched , https://www.sfxc.co.uk/products/heat-sensitive-ink , https://www.holoteam.com/post/a053-thermochromic-ink-1
2. Mechanizm: **ciało jako klucz do papieru** (ciepło dłoni, ok. 31 st. C dla czarnej farby) albo odwrotnie **zimno jako klucz** (Frozen Book).
3. Dla nas dwa zastosowania, oba spięte z partyturą obrzędów: (a) **brama 1, dotyk**: kod rozdziału pod szarą „pieczęcią” z farby termochromowej; kciuk trzymany 7 sekund odsłania słowo. Książka wykonuje gest bramy, zanim gracz dotknie telefonu; obrzęd w aplikacji jest powtórzeniem. Czytelnik bez gry widzi pieczęć i zwykłą ciekawość; może ją ogrzać i nic nie traci. (b) **brama 4, zimno** (sprawa 4, Zamkowe): jedna karta w edycji Strażnika w farbie odwrotnej (tekst czytelny tylko w zimnie): „Włóż do zamrażarki na dziesięć minut”. To jest dokument „tylko w zimnie”, siostra naszego „tylko o świcie”. Dla nie-gracza: szara kartka z jednym zdaniem instrukcji.
4. Koszt: farba termochromowa jako dodatkowy kolor na jednym arkuszu w nakładzie 1500-2000 egz.: szacunek panelu 1-3 zł na egzemplarz, czyli 2-6 tys. zł; **do potwierdzenia w drukarni**, bo zależy od techniki (sito vs offset) i tego, czy arkusz z kodem da się odseparować. Farba odwrotna (Frozen Book) jest specjalistyczna i może nie być dostępna w Polsce; zapytać Celloglas lub polskiego dostawcę farb specjalnych. Ryzyka: farba reaguje w upale (paczka w nagrzanym samochodzie odsłania kod na stałe? nie, wraca po ostygnięciu, ale czytelnik może zobaczyć kod bez gestu), degraduje się od UV, słabo działa przy zimnych rękach (zimą), nie działa w e-booku i audiobooku (tam kod drukowany normalnie, jak w edycji standardowej). Zasada: termochromia tylko w edycji Strażnika, nigdy jako jedyna droga.
5. Pionierskość: w Polsce nie znaleźliśmy książki z farbą termochromową w treści (wyszukiwanie polskie nie zostało wykonane z powodu limitu, więc to zastrzeżenie, nie ustalenie). W świecie to kilkanaście tytułów, głównie dla dzieci i artystycznych. Thriller z kodem pod termochromową pieczęcią: nie znamy precedensu.

### E2. Termochromia i ciepło w escape roomach
1. Przegląd chemicznych escape roomów (MDPI, 2024) opisuje kod zapisany czarnym tuszem na czarnym arkuszu ciekłokrystalicznym, który odsłania się po ogrzaniu powyżej 27 st. C, oraz drut z nitinolu zmieniający kształt w cieple; Royal Society of Chemistry stosuje folię termochromową ogrzewaną dłonią; poradniki DIY używają długopisów Frixion (tusz znika od ciepła). Źródła: https://www.mdpi.com/2227-7102/14/12/1273 , https://edu.rsc.org/ideas/escape-the-classroom-and-try-microscale-chemistry/4015390.article , https://lockpaperescape.com/13-easy-escape-room-ideas-you-can-use/ , https://crackandreveal.com/en/blog/secret-messages-hidden-codes-ultimate-escape-room-guide
2. Mechanizm: **narzędzie musi być znajdowalne i podpowiadalne** (zasada z poradnika: ciepło wymaga źródła, więc źródło musi być w zasięgu).
3. Dla nas: źródłem jest dłoń, więc zasada jest spełniona bez rekwizytu. Dla strażników w Sandomierzu (MASTERPLAN 6): karta NFC strażnika może mieć pole termochromowe z jednym słowem miejsca („To miejsce pamięta...”), odsłaniane dłonią gracza przy kasie; skrypt trzech zdań dostaje gest bez słów.
4. Koszt: karty 7 szt., kilkaset złotych. Ryzyko: brak.
5. Pionierskość: nie dotyczy.

### E3. Farba UV i tusz niewidzialny
1. Standard w escape roomach i dziecięcych książkach „szpiegowskich” [W]; wymaga lampy UV. Telefon nie ma źródła UV (lampa błyskowa to białe LED), więc odczyt wymaga rekwizytu.
2. Mechanizm: ukrycie wymagające narzędzia.
3. Dla nas: **nie**. Jedyny dopuszczalny rekwizyt w projekcie to zawieszka. UV przegrywa z termochromią, bo nasz klucz to ciało.
4. Koszt i ryzyko: nieistotne, odrzucamy.
5. Pionierskość: nie dotyczy.

### E4. „The Book That Can't Wait” (Eterna Cadencia, 2012) [W]
1. Antologia argentyńska drukowana tuszem znikającym po około dwóch miesiącach od otwarcia folii [W].
2. Mechanizm: **termin ważności tekstu**.
3. Dla nas: tylko jako metafora dla okna „Pierwszy tydzień” z regulaminu; fizycznie nie, bo niszczy książkę dla czytelnika, który czyta później.
4. Ryzyko: wysokie, odrzucamy.

## F. Dziesięć propozycji „poziom wyżej” (według stosunku efektu do kosztu)

1. **Książka jako instrukcja (KTANE, Lorelei).** Jedna strona w powieści (tablica siedmiu znaków wrót) jest kluczem do finału i do jednej wcześniejszej bramy; gra pokazuje znaki, książka je tłumaczy, a treść tabeli nie istnieje w żadnym pliku strony. Odpowiada na pęknięcie „koniec gry leży w JavaScripcie” i na obawę o modele językowe, bo klucz jest na papierze. Koszt: jedna strona składu i dzień kodu; dla czytelnika bez gry ornament.
2. **Łańcuch kluczy i meta (Journal 29, MIT Mystery Hunt).** Siedem słów bramy z obrzędów staje się bankiem finału, a słowo bramy n jest słowem w banku sprawy n+2. Siedem spraw przestaje być listą i staje się strukturą, w której obrzędy mają skutek dedukcyjny, nie tylko rytualny. Koszt: treść i jedno pole w JSON.
3. **Potwierdzanie trójkami (Obra Dinn, Chants of Sennaar).** Luki zastygają grupami po trzy, zawieszka grzeje przy zastygnięciu; zgadywanie przy blokadzie 60 s przestaje się opłacać, a gracz wie, która część ustalenia jest pewna. Koszt: jeden dzień w `cases.ts`. Zastępuje ciepło 0-4, więc nie dokłada mechaniki.
4. **Sprawa 5 jako porządek i nieobecność (Cain's Jawbone, Obra Dinn).** Cztery kartki do ułożenia w kolejności, potem kalendarz pokazuje, że jednej daty nie mogło być; fałsz rozpoznaje się po tym, czego brakuje, nie po tym, co napisano. To jedyna sprawa, gdzie dedukcja ma inny kształt niż zdanie z lukami, i jest w zapieczętowanej części, więc nic nie zdradza. Koszt: treść i nowy `kind` pytania.
5. **Dokument tylko w zimnie i pieczęć pod kciukiem (Keep Our Secrets, Frozen Book).** W edycji Strażnika kod bramy 1 pod termochromową pieczęcią, a jedna karta sprawy 4 czytelna po dziesięciu minutach w zamrażarce. Książka wykonuje dwa gesty z partytury, zanim telefon o nie poprosi; to pierwsza taka rzecz w polskim thrillerze, o ile wiemy. Koszt: 2-6 tys. zł do potwierdzenia w drukarni; edycja standardowa ma zwykły druk.
6. **Archiwum przeszukiwane słowem (Her Story, Roottrees).** Na domenie Fundacji pole wyszukiwania, najwyżej trzy wyniki na słowo, bez autouzupełniania; „Sudomir” z listu Zielińskiego otwiera dokument, którego nie ma w żadnej sprawie. Gracz musi wymyślić słowo, którego jeszcze nie zna, co jest najczystszą formą bramkowania wiedzą. Koszt: 2-3 dni, statyczny indeks.
7. **Noc Siedmiu Bram w siedmiu miastach (DASH, Puzzled Pint).** Ta sama noc, ten sam skrypt, gospodarz w księgarni; Sandomierz jako brama główna z czarną pieczęcią, miasta ze srebrną; Puzzled Pint Trójmiasto jako partner pilotażu. Zamienia 1% obecnych w Sandomierzu na 5-10% obecnych gdziekolwiek, bez utraty rangi Sandomierza. Koszt: druk i czas; próg 8 osób na miasto.
8. **Zeszyt biegłego (Outer Wilds).** Automatyczny spis ustaleń z każdej sprawy z jednym znacznikiem „niedopowiedziane” tylko przy dokumentach osiągalnych w domu (świt, południe), nigdy przy „tylko na miejscu”. Zastępuje podpowiedź po pięciu próbach i jest mapą niewiedzy, nie odpowiedzi. Koszt: 2-3 dni.
9. **Słowa-kotwice między dokumentami (Immortality).** Kożuch, słoik, spinka, gołąb: dotknięcie słowa w dokumencie pokazuje, gdzie jeszcze stoi; czytelnik odkrywa, że słoik Heleny z rozmowy z Wandą to słoik z aktu notarialnego. Wiąże sprawy, interludia i mikro-akta w jedną tkankę bez nowej treści. Koszt: dzień, słownik w `config.json`.
10. **Marginalia geolożki i jeden kod bez telefonu (S., Twyford Code).** Dwie linie jej ręką na stronach z kodami i jeden akrostych z siedmiu zdań zamykających części, który daje słowo-klucz zapasowy do zapieczętowanego odcinka. Czytelnik bez gry ma własną zagadkę i drugi głos; gracz ma drugą drogę, gdy zgubi kod. Koszt: redakcja, zero złotych, pod warunkiem, że redaktor ma prawo weta.

## G. Czerwony zespół: trzy rzeczy, których nie robić

1. **Nie robić aplikacji ani dekodera poza przeglądarką.** „Night Film” (2013) miał darmowy dekoder na iOS i Android; dziś treść jest nieosiągalna, bo aplikacja nie przeszła zmian systemów. „Device 6” i „Journal 29” żyją tylko tam, gdzie ich serwery i sklepy. Nasza strona statyczna z JSON, QR w adresie i znacznikiem AR w przeglądarce przeżyje dekadę bez dotykania; każda aplikacja wymaga opieki, której autor nie będzie miał, bo pisze akt III.
2. **Nie niszczyć książki w edycji standardowej i nie chować treści fabularnej wyłącznie w fizycznym gadżecie.** „Wreck This Journal” i gry Exit działają, bo są przedmiotami jednorazowymi; powieść idzie do bibliotek, antykwariatów i na półkę czytelnika, który gry nie dotknie. Każdy element fizyczny (termochromia, wkładka, zawieszka) musi mieć drogę zapasową w edycji standardowej (list po 72 h, zwykły druk kodu), inaczej pierwsze recenzje napiszą ludzie z e-bookiem, a MASTERPLAN mówi, że jedna gwiazdka szkodzi bardziej niż pięć pomaga.
3. **Nie projektować nierozwiązywalnej metazagadki ani tajemnic „bez potwierdzenia” w liczbie większej niż jedna.** „Cain's Jawbone” rozwiązały cztery osoby w 90 lat i zarabia na tym, bo ma dziesiątki tysięcy czytelników i mem; „Blue Prince” pozwala sobie na nierozwiązane wątki, bo ma miliony graczy. Nasz sezon to 50-150 osób kończących; zagadka, której nikt nie rozwiąże, to cisza w grupie, a nie legenda. Jedna tajemnica po finale (siódma pozycja w południe premiery), reszta domknięta dokumentem. Z tego samego powodu nie wprowadzać punktacji „ile tropów zużyłeś” z Consulting Detective: porównanie z komisarzem upokarza samotnego gracza, a my chcemy, żeby o grze opowiedział drugiej osobie.

## H. Co trzeba jeszcze sprawdzić (lista dla kolejnej sesji z dostępem do sieci)

- Polskie wydania i precedensy: „Detektyw” Portal Games (baza Antares), polska edycja Hidden Games, seria Escape Quest, polskie wydanie Journal 29, „Dom z liści” (MAG), „Nocny film” (W.A.B.).
- Czy jakakolwiek polska książka użyła farby termochromowej w treści (zapytać drukarnie: Celloglas UK ma usługę, polski odpowiednik do znalezienia) i realny koszt arkusza w nakładzie 1500-2000.
- Status DASH i Galactic Puzzle Hunt w 2025-2026 oraz kontakt do Puzzled Pint Trójmiasto.
- Cain's Jawbone: czy ukazał się zapowiadany „handbook” Unbound (2024-2025) i wynik konkursu z AI.
- Dear Holmes i Hunt A Killer: aktualne modele wysyłki i ceny, jako wzór dla pocztówki po sprawie 4.
- Wykład GDC „The Burden of Proof” (Overboard!) dla szczegółów sprzężenia zwrotnego w dedukcji odwróconej.
