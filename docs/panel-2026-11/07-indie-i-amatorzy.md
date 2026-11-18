# Panel 07: indie i amatorzy. Co robią ludzie bez instytucji i czego możemy się od nich nauczyć

Stan: 18 XI 2026. Panel „domorosłych geniuszy” dla „Siedmiu Bram Lessu” i „Akt Lessu”. Punkt wyjścia: docs/MASTERPLAN.md (sekcje 4 do 7 i 10), docs/KATALOG_MECHANIK.md, docs/STRAZNICY.md, public/skan, public/komnata, public/ar, public/miasto.

## 0. Jak czytać ten dokument i co się nie udało

Metoda: każde znalezisko ma pięć punktów: (1) co i kto, z datą; (2) sztuczka, czyli mechanizm; (3) jak zrobić u nas za mniej niż tysiąc złotych i w mniej niż tydzień; (4) ryzyko; (5) czy ktoś w Polsce to zrobił.

Rzetelność. W tej sesji wyszukiwarka zadziałała dla około 25 zapytań, potem budżet wyszukiwań się skończył, a bezpośrednie pobieranie stron (radiokielce.pl, wikipedia, opencaching.pl, geoportal.gov.pl, ceeol.com, overpass-api.de) było zablokowane przez ustawienia sieci sesji. Dlatego każdy wpis ma oznaczenie:

- **[W]** zweryfikowane dziś: adres pochodzi z wyniku wyszukiwania i treść pokrywa się ze streszczeniem wyszukiwarki;
- **[P]** z pamięci panelu: rzecz powszechnie znana i stabilna (np. hasło w Wikipedii), ale adres i szczegóły wymagają jednego kliknięcia przed użyciem w książce albo w grze;
- **[?]** nie znaleziono dziś i trzeba sprawdzić (lista zbiorcza na końcu sekcji 0).

Do dosprawdzenia (zbiorczo, jedna godzina pracy autora): nazwy i liczba dzwonów katedry sandomierskiej (sekcja d); liczba skrzynek geocaching w granicach miasta (sekcja c); czy quest Muzeum Zamkowego jest na questing.pl i czy ma ulotkę (c); aktualna liczba członków grupy „Sandomierzanie i Sympatycy Sandomierza” (i); czy Magnetometer w Chrome na Androida nadal jest za flagą w wersji z końca 2026 (f); trasy podziemne Jarosławia i Przemyśla (e); strona OSM wiki dla Sandomierza (g).

---

## a) Indie i jam: gry jednej osoby, które stały się hitem dzięki jednemu mechanizmowi

### a1. Baba Is You (Arvi Teikari „Hempuli”, Finlandia, jam 2017, premiera 2019) [P]
1. Jedna osoba, gra z Nordic Game Jam 2017, pełna wersja 2019. https://hempuli.com/baba/
2. Sztuczka: reguły gry są przedmiotami na planszy. Przesuwasz słowo „WALL IS STOP” i ściana przestaje zatrzymywać. Gracz nie rozwiązuje zagadki w ramach reguł, tylko zmienia reguły.
3. U nas: w sprawach 3 do 7 (luki na wnioski) dać graczowi trzy kafelki ze słowami z banku, które po ułożeniu w prawdziwe zdanie zmieniają zachowanie dokumentu (np. „PIWNICA JEST GŁĘBSZA” odsłania trzeci poziom planu). To jeden komponent w istniejącym zeszycie dedukcji; dwa wieczory. Zero złotych.
4. Ryzyko: zdanie-reguła musi być jedno na sprawę, inaczej robi się łamigłówka logiczna zamiast kryminału.
5. W Polsce: nie znamy jednoosobowej gry na tym mechanizmie; polskie jamy robią podobne rzeczy, ale nie trafiły do szerokiej publiczności [?].

### a2. Her Story (Sam Barlow, UK, 2015) [P]
1. Jedna osoba (z aktorką i operatorem), budżet rzędu kilkudziesięciu tysięcy funtów. https://www.herstorygame.com/
2. Sztuczka: baza nagrań policyjnych przeszukiwana słowem kluczowym, wyniki ograniczone do pięciu pierwszych trafień. Gracz sam wymyśla, czego szukać; słowa z jednej odpowiedzi prowadzą do następnej. Narracja z wyszukiwarki.
3. U nas: „Archiwum Fundacji” jako pole wyszukiwania po 40 do 60 krótkich dokumentach (JSON w kliencie, filtr w JS), limit pięciu wyników, bez listy wszystkiego. Słowa klucze wychodzą z powieści, więc czytelnik książki ma przewagę nad kimś, kto tylko klika. Jeden wieczór kodu, dwa dni pisania wpisów. Zero złotych.
4. Ryzyko: wyciek całości przez odczyt JSON (akceptujemy, jak w B.4 pkt 6 katalogu); dokumenty muszą być krótkie, bo to ekran telefonu.
5. W Polsce: nie znamy odpowiednika w grze; w ARG „Insilva” (Łódź) były archiwa muzealne, ale bez mechaniki wyszukiwarki [?].

### a3. Return of the Obra Dinn (Lucas Pope, 2018) i Papers, Please (Lucas Pope, 2013) [P]
1. Jedna osoba. https://obradinn.com/ oraz https://papersplea.se/
2. Sztuczka Obra Dinn: gra potwierdza poprawność dopiero, gdy trzy ustalenia naraz są poprawne, więc gracz nie może zgadywać po jednym. To jest już w MASTERPLAN jako „walidacja trójkami”: dobrze. Sztuczka Papers, Please: biurokracja jako mechanika, stempel jako gest, czas jako presja, a koszt moralny zapisany w rodzinie gracza.
3. U nas: stempel strażnika już jest. Dodać do rejestru biegłych „jedno zdanie w rubryce, które trzeba wpisać czytelnie”, czyli przeniesienie stempla do interfejsu: gracz ma sam „podstemplować” dokument gestem przytrzymania (ciężar, nie klik). Dwa dni. Zero złotych.
4. Ryzyko: żadne poza tym, że trójki wymagają trzech jednoznacznych faktów na sprawę, czyli pracy redakcyjnej po akcie III.
5. W Polsce: motyw stempla jest w paszportach turystycznych (np. Opatów, sekcja c), ale nie jako mechanika gry.

### a4. The Case of the Golden Idol (Color Gray Games, dwaj bracia, Łotwa, 2022) [P]
1. Dwie osoby, gra na jednym mechanizmie. https://www.thegoldenidol.com/
2. Sztuczka: zdania z lukami i bank słów. Gracz nie pisze, tylko wkłada słowa do luk. Gra nie sprawdza po jednym, tylko gdy wszystko jest wypełnione; przy jednym do dwóch błędów mówi „blisko”.
3. U nas: to już jest planowane (bank słów na wnioski bez walidacji trójkami w MVP). Panel radzi: zrobić dokładnie tak jak Golden Idol, czyli komunikat „blisko” tylko przy maksymalnie dwóch błędach, nigdy liczba błędów. Jeden dzień.
4. Ryzyko: bank słów nie może zawierać słów-wabików w nadmiarze (katalog B.3: red herringi to główna skarga).
5. W Polsce: nie znamy.

### a5. The Roottrees are Dead (Jeremy Johnston, USA, darmowa wersja na itch.io 2023, wersja na Steam 2025) [P]
1. Jedna osoba, pierwsza wersja darmowa i zrobiona w kilka miesięcy; hit dzięki streamerom, potem remake z zespołem. https://jjohnstongames.itch.io/the-roottrees-are-dead
2. Sztuczka: fikcyjna wyszukiwarka internetu z 1998 roku plus drzewo genealogiczne, które gra potwierdza dopiero w całości. Darmowa wersja była produktem i marketingiem naraz.
3. U nas: wersja „jedna sprawa za darmo, bez książki” już jest w zamyśle wejścia 90 s; dodać do niej jawne „to jest pierwsza z siedmiu spraw” i przycisk „pokaż streamerowi” (kopia linku z kodem polecającym bez konta). Jeden dzień.
4. Ryzyko: streamer spojleruje; w sprawie 1 nie ma nic ze spoilerów aktu III, więc dobrze.
5. W Polsce: tak, model „darmowa gra, potem społeczność” to Helltaker (a6).

### a6. Polskie jednoosobowe: Helltaker i Awaria (Łukasz Piskorz „vanripper”) [W]
1. Helltaker (2020, darmowy, hit przez fan-art) i Awaria (2025, darmowa gra survival-puzzle, 97% pozytywnych z ponad 120 tys. recenzji na Steam). https://www.notebookcheck.net/Free-to-play-survival-puzzle-game-storms-SteamDB-trends.934879.0.html oraz https://www.ppe.pl/publicystyka/388434/2025-rok-zaskoczyl-indykami-oto-najwieksze-niespodziewane-super-hity.html
2. Sztuczka: gra darmowa, bardzo krótka, z wyrazistymi postaciami, które społeczność sama rysuje i remiksuje. Twórca nie robi marketingu, robi postacie, które chce się powtarzać.
3. U nas: dać jedną postać (Anzelm, Berbeć, Pimpo Limpo) z „kartą do rysowania”: kontur i trzy cechy, licencja na fan-art zapisana wprost na stronie Fundacji. Jedno popołudnie, zero złotych.
4. Ryzyko: licencja fan-artu musi być jednoznaczna (CC BY-NC dla postaci z gry, nie dla tekstu książki, bo prawa wydawcy).
5. To jest Polska.

### a7. Inne polskie jednoosobowe i okolice [W]/[?]
- Polon (charon99, itch.io, Polska lat 90., wczesna alfa; gracze zgłaszający błędy są wymieniani w grze). https://charon99.itch.io/polon [W]. Sztuczka: „podziękowania jako nagroda” to dokładnie nasz Rejestr biegłych (wariant C).
- KryptaFM (underthesink, itch.io, polska gra grozy z fikcyjnym forum o anomaliach w środku). https://underthesink.itch.io/kryptafm [W]. Sztuczka: forum w grze jako dokument świata.
- Holstin (Sonka, horror w polskim miasteczku lat 90., wymieniany jako projekt solo, premiera nieustalona) [?].
- Bad Dream: Coma (Desert Fox, polskie studio jednoosobowe, 2017) [P].
- Jamy w Polsce do sprawdzenia: Slavic Game Jam (Warszawa), Global Game Jam (lokalizacje w PL), Ludum Dare [?]. Wniosek bez sprawdzania: polskie jamy są dobrym miejscem, żeby za darmo dać komuś do zrobienia „jedną sprawę jako grę jamową” z tematem lessu; nie jako produkt, jako rozgłos.

Wniosek z (a): nasze mechaniki (trójki, bank słów, stempel) są już „pożyczone” od właściwych ludzi. Brakuje dwóch rzeczy, które u tamtych robiły hit: pierwszego aktu za darmo i bez książki, i jednej postaci, którą ludzie chcą rysować.

---

## b) ARG i społeczności: co utrzymuje grę żywą bez budżetu

### b1. The Beast (Microsoft/„A.I.”, 2001) i grupa Cloudmakers [P]
1. Pierwsze duże ARG; społeczność Cloudmakers (lista mailingowa Yahoo, ok. 7 tys. osób) rozwiązała trzymiesięczny materiał w kilka dni. https://en.wikipedia.org/wiki/The_Beast_(game)
2. Sztuczka: trailhead, czyli jedno nienormalne nazwisko w napisach filmu („Jeanine Salla, Sentient Machine Therapist”). Jeden ślad w prawdziwym dokumencie, zero reklamy.
3. U nas: trailhead w stopce redakcyjnej książki (jedno nazwisko konsultanta Fundacji z adresem domeny). Zero złotych, jedna linijka do składu. Druga: w rejestrze Fundacji wpis nr 7 pusty. Już planowane; dopisać nazwisko w stopce.
4. Ryzyko: wydawca może nie chcieć fikcji w stopce; alternatywa: podziękowania.
5. W Polsce: ARG promocyjne „Alan Wake” (2010, agencja polska, finał Golden Drum) łączyło blogi, komunikatory i akcje offline. https://www.behance.net/gallery/23893975/Alan-Wake-ARG [W]. Tekst „Ludo ergo sum: Alicja po drugiej stronie reklamy” na gry-online o ARG w reklamie. https://www.gry-online.pl/newsroom/ludo-ergo-sum-alicja-po-drugiej-stronie-reklamy/z889eb [W]

### b2. I Love Bees (42 Entertainment dla Halo 2, 2004) [P]
1. https://en.wikipedia.org/wiki/I_Love_Bees
2. Sztuczka: współrzędne GPS i godziny; o wskazanej minucie dzwonił automat telefoniczny w realnym mieście, a ktoś z społeczności musiał tam być i odebrać. Czas i miejsce jako klucz, który wymaga ciała.
3. U nas: to jest Noc Siedmiu Bram i brama 7 „o tej samej minucie”. Taniej: „telefon dzwoni” zastąpić „dzwon bije”: o 12:00 w sobotę w Sandomierzu gracz na Rynku nagrywa dzwon (sekcja d), a aplikacja w domu u drugiego gracza o tej samej minucie odtwarza nagranie z poprzedniego tygodnia. Para przez czas. Dwa dni kodu.
4. Ryzyko: zero (dzwon bije i tak).
5. W Polsce: nie znamy.

### b3. Year Zero (Nine Inch Nails, 42 Entertainment, 2007) [P]
1. https://en.wikipedia.org/wiki/Year_Zero_(video_game)  (hasło o ARG) 
2. Sztuczka: pendrive’y zostawione w toaletach na koncertach; w utworach obrazy ukryte w spektrogramie; numery telefonów podświetlone na koszulkach. Przedmiot fizyczny jako nośnik.
3. U nas: spektrogram w nagraniu dzwonu już w katalogu (III.2). Pendrive’a nie, bo nikt nie wkłada obcych pendrive’ów. Zamiast tego: karta NFC/QR „zgubiona” w jednej książce na 100 egzemplarzy (wkładka od wydawcy). Koszt kart 100 szt.: 100 do 200 zł.
4. Ryzyko: wkładka to decyzja wydawcy; QR ma prowadzić na domenę Fundacji, nie skracacz.
5. W Polsce: nie znamy w literaturze.

### b4. Cicada 3301 (anonimowo, 2012 do 2014) [P]
1. https://en.wikipedia.org/wiki/Cicada_3301
2. Sztuczka: jeden obraz na 4chanie, steganografia, szyfry książkowe, a potem plakaty z kodami QR w kilkunastu miastach świata naraz. Społeczność sama zbudowała wiki i narzędzia (dekodery, mapy plakatów). Drugi filar: brak odpowiedzi od autorów. Milczenie jako reżyseria.
3. U nas: „szyfr książkowy” to kody w książce, mamy. Dodać jedno: dokument z 21 linii (wersja komfortowa MASTERPLAN) publikować bez komentarza, bez FAQ, i nigdy nie potwierdzać rozwiązań. Zero złotych, dyscyplina autora.
4. Ryzyko: Cicada ma problem z podszywaniem się; nasz rejestr Fundacji z podpisem (Worker) rozwiązuje to w kwietniu.
5. W Polsce: nie.

### b5. Marble Hornets (Troy Wagner, Joseph DeLage, YouTube 2009 do 2014) i Petscop (Tony Domenico, 2017 do 2019) [P]
1. https://en.wikipedia.org/wiki/Marble_Hornets oraz https://en.wikipedia.org/wiki/Petscop
2. Sztuczka Marble Hornets: dwa kanały, które „rozmawiają” ze sobą (główny i odpowiadający „totheark”), kamera z ręki, zero budżetu, nieregularny rytm. Sztuczka Petscop: fikcyjna gra, której „nie ma”, pokazana wyłącznie przez nagrania z rozgrywki; społeczność rekonstruowała grę z ujęć.
3. U nas: „gra, której nie ma” to nasz ósmy wpis rejestru i Komnata; jedno nagranie ekranu z trybu laboratorium (komnata z symulowanym skanem) wrzucone bez opisu na kanał Fundacji. Jeden wieczór. Drugi kanał odpowiadający: strona strażnika-biblioteki z własnym komunikatem.
4. Ryzyko: nie podszywać się pod prawdziwych ludzi; w Marble Hornets ludzie naśladowali to w realu, u nas nic nie dzieje się w piwnicach bez przewodnika.
5. W Polsce: polskie serie „analog horror” na YouTube istnieją, nie zweryfikowano nazw [?].

### b6. Narzędzia społeczności: Unfiction, Game Detectives [W]
1. Unfiction (forum ARG, archiwum statyczne od 2017: https://unforum-archive.netninja.com/ ) i jego lista narzędzi https://unfiction.com/resource/ ; Game Detectives (od wyprzedaży Steam 2015, wiki i „akademia”): https://gamedetectives.net oraz https://wiki.gamedetectives.net/index.php?title=ARG
2. Sztuczka: społeczność sama pisze wiki i instrukcje; autor gry nie moderuje, tylko czasem „zauważa”. Co utrzymuje ARG bez budżetu: rytm (nie częstotliwość), jedno miejsce zbiorcze, które gracze prowadzą, i brak oficjalnej odpowiedzi.
3. U nas: nie zakładać forum. Założyć jedną stronę „Rejestr biegłych” z możliwością dopisania linku do własnego wpisu (wiki, wątek, film). Jeśli powstanie fanowska wiki, dać jej link w rejestrze. Zero złotych.
4. Ryzyko: brak społeczności przy 30 graczach; wtedy rejestr i tak działa jako lista.
5. W Polsce: polskie ARG-i promocyjne (Alan Wake, Insilva https://www.behance.net/gallery/89156477/Insilva-Alternate-Reality-Game [W]) nie zostawiły trwałej społeczności; wniosek: społeczność powstaje przy czymś, co trwa dłużej niż kampania.

### b7. „Gra Szyfrów” (IPN) jako polski kontrprzykład [W]
1. https://bnt.ipn.gov.pl/en/projects/materials-for-teachers/educational-gaming-project-cyphers-game/
2. Sztuczka: instytucjonalna gra edukacyjna o wojnie 1920 z szyframi; nie ARG. Pokazuje, że w Polsce „gra z szyframi” kojarzy się z lekcją.
3. U nas: unikać słów „edukacyjny”, „quest”, „questing” w opisie dla graczy; używać „akta”, „sprawa”, „rejestr”.
4. Ryzyko: żadne.
5. To Polska.

---

## c) Geocaching, letterboxing, Munzee, questing: skrzynki i pieczęcie bez instytucji

### c1. Skrzynki geocaching w Sandomierzu [W] (liczba [?])
1. Znalezione dziś listingi w mieście i okolicy: https://www.geocaching.com/geocache/GC9CF5H , https://www.geocaching.com/geocache/GCBF6A0 , https://www.geocaching.com/geocache/GC56QBG (okolice katedry, pałacu biskupiego i dzwonnicy), https://www.geocaching.com/geocache/GCB8FFN , https://www.geocaching.com/geocache/GCBDNYJ , https://www.geocaching.com/geocache/GC51G0Z (przy Ratuszu i reformatach) oraz w serwisie niekomercyjnym https://opencaching.pl/viewcache.php?wp=OPA52P . Łączna liczba nie została ustalona; dane z 2015 mówią, że świętokrzyskie ma najmniej skrytek w Polsce. Szacunek panelu: 10 do 30 skrzynek w granicach miasta, kilka aktywnych opiekunów.
2. Sztuczka: skrzynka utrzymuje się bez instytucji, bo opiekun (owner) to jedna osoba z logbookiem, a społeczność sama zgłasza „do konserwacji”. Logbook to papier.
3. U nas: nie zakładać własnych skrzynek pod marką gry (patrz ryzyko). Zamiast tego napisać do opiekunów 2 do 3 sandomierskich skrzynek (przez profil geocaching.com) z prośbą o jedną linijkę w opisie skrzynki: „w pobliżu działa gra Akta Lessu” nie wolno (komercja), ale wolno zaprosić ich jako pierwszych testerów trasy siedmiu bram i poprosić, żeby jeden z nich został „biegłym” w rejestrze. Koszt: zero. Tydzień korespondencji.
4. Ryzyko: regulamin geocaching.com zakazuje skrzynek o charakterze komercyjnym (promocja produktu, książki, lokalu); Stare Miasto Sandomierza to strefa ochrony konserwatorskiej, więc żadnych pojemników w murach i zabytkach. Opencaching.pl jest łagodniejszy, ale zasady zabytków te same.
5. W Polsce: geocaching jest masowy (ponad 300 skarbów w jednym mieście wg TVN24: https://tvn24.pl/wroclaw/ponad-300-skarbow-czeka-na-znalazcow-ra281613-ls3509579 [W]).

### c2. Letterboxing (UK od 1854, Dartmoor; USA od 1998) [P]
1. https://en.wikipedia.org/wiki/Letterboxing_(hobby) ; w Polsce głównie jako „letterbox hybrid” na geocaching.com, np. skrzynka w Warszawie z 2017 (wynik wyszukiwania GC7C7PF https://www.geocaching.com/geocache/GC7C7PF [W]).
2. Sztuczka: w skrzynce jest ręcznie rzeźbiona pieczęć, a znalazca ma własną pieczęć osobistą; stempluje się nawzajem: on w swoim notesie, ty w logbooku skrzynki. Dwukierunkowy ślad. Wskazówki często w formie zagadki, bez GPS.
3. U nas: to jest dokładnie paszport i pieczęć strażnika, ale jednokierunkowo. Dodać drugą stronę: księga strażnika (zeszyt A5 w lokalu), w którą gracz odbija własny „znak”: nie pieczęć (koszt), ale rysunek siedmioboku z własnym nacięciem, jak na zawieszce. Koszt: 7 zeszytów po 10 zł. Zmiana w STRAZNICY.md: jedno zdanie więcej.
4. Ryzyko: RODO zero, jeśli w księdze nie ma imion (tylko znak i data). Zapisać to w instrukcji strażnika.
5. W Polsce: marginalne; w Sandomierzu nie.

### c3. Questing i questing.pl, Sandomierz [W]
1. Muzeum Zamkowe w Sandomierzu zgłosiło quest „Tajemnica Królewskiego Strażnika” do konkursu Fundacji Questingu dla instytucji kultury (zgłoszenie nr 14): https://www.swietokrzyskie.pro/tajemnica-krolewskiego-straznika-z-muzeum-zamkowego-w-kolejnym-etapie-ogolnopolskiego-konkursu/ ; wcześniej (2017) questing w Muzeum Okręgowym: https://swietokrzyskie.pro/poszukiwanie-zamkowego-skarbu-questing-w-muzeum-okregowym-w-sandomierzu/ ; questy hutnicze w Ostrowcu: https://radiokielce.pl/310724/questy-odkrywaja-ciekawa-hutnicza-historie-ostrowca-113968 . Portal: https://questing.pl
2. Sztuczka: ulotka z rymowanką prowadzi po nieoznakowanej trasie; na końcu skrzynka z pieczęcią; ulotkę drukuje gmina albo muzeum. Metoda działa 20 lat bez technologii, bo nośnikiem jest kartka.
3. U nas: nasz paszport jest „questem bez rymowanki”. Jedno działanie: zapytać Muzeum Zamkowe, czy quest „Tajemnica Królewskiego Strażnika” istnieje w terenie, i jeśli tak, zrobić z muzeum strażnika bramy 4 (Zamkowe), a jego pieczęć questu uznać za pieczęć bramy. Zero złotych, jeden mail.
4. Ryzyko: słowo „quest” kojarzy się z lekcją (b7); nie używać go w grze.
5. To Polska; Sandomierz ma precedens.

### c4. Paszport turystyczny z pieczęciami (Opatów i okolice) [W]
1. Radio Kielce o paszporcie turystycznym z upominkami i zniżkami: https://radiokielce.pl/247647/kusza-upominkami-i-znizkami-paszport-turystyczny-zacheta-do-zwie-131147
2. Sztuczka: pieczęć w miejscach zwiedzania, nagroda rzeczowa za komplet. U nas nagroda to epilog, nie gadżet (dobrze).
3. U nas: dopisać Opatów (trasa podziemna, PTTK od 1986) jako „bramę gościnną” poza miastem: pieczęć zastępcza dla kogoś, kto jedzie od Kielc. Jedna rozmowa z PTTK Opatów.
4. Ryzyko: rozmycie „siedmiu bram” o ósme miejsce; zapisać jako pieczęć zastępczą, nie bramę.
5. To Polska.

### c5. Munzee, Ingress field art [P]
1. Munzee: naklejki QR, gracze sami zapełniają miasto; Ingress: portale i „field art” z pól na mapie (społeczności rysują kształty z linków). https://www.munzee.com/ , https://ingress.com/
2. Sztuczka Ingress: rysunek na mapie powstaje z ruchu wielu ludzi w jednym czasie. To jest Noc Siedmiu Bram w formie mapy.
3. U nas: po Nocy generować z tras uczestników (zgoda, 777 kroków) jeden rysunek na mapie miasta: siedmiobok z siedmiu wzgórz, publikowany w rejestrze jako „ślad Nocy”. Jeden dzień z istniejącym public/miasto.
4. Ryzyko: ślady GPS to dane osobowe; agregować do jednego kształtu, nie publikować indywidualnych tras, nie zapisywać na serwerze.
5. W Polsce: Ingress ma społeczności w dużych miastach; w Sandomierzu portale istnieją (zabytki), nie zweryfikowano [?].

---

## d) Campanologia: dzwony Sandomierza i jak amator rozpoznaje dzwon

### d1. Co wiadomo o dzwonach w Sandomierzu [W]/[?]
1. Dzwony dominikanów (św. Jakub) zdemontowano w 2016 roku z powodu stanu dzwonnicy; planowano ich powrót: https://radiokielce.pl/411528/niezwykle-dzwony-sandomierskich-dominikanow-jeden-z-nich-zmieni-111114 oraz https://radiokielce.pl/449014/post-100556 [W]. Badania architektoniczne dzwonnicy św. Jakuba (Architectus 2018): https://architectus.pwr.edu.pl/en/articles/the-architectural-research-of-the-belfry-of-the-church-of-st-james-the-apostle-in-sandomierz [W]. Katedra: zespół kolegiaty, dziś katedry, w rejestrze zabytków https://zabytek.pl/en/obiekty/sandomierz-zespol-kosciola-kolegiackiego-pw-narodzenia-najswiet [W]; artykuł o skutkach nawałnicy dla katedry https://radiokielce.pl/953293/sandomierska-katedra-odczuwa-skutki-ostatniej-nawalnicy [W]. **Nazwy dzwonów katedry nie zostały znalezione** [?]; nagrania dzwonów katedry na YouTube nie znalezione dziś [?]. Nasz „dzwon Piotra” z katalogu to fikcja i musi być w grze jawnie fikcją albo potwierdzony u parafii.
2. Sztuczka regionalistów: fakty o dzwonach siedzą w inwentarzach parafialnych, w „Zeszytach Sandomierskich” i u przewodników, nie w sieci. Inwentaryzacja dzwonów w Polsce jest problemem naukowym (Tureczek 2021, Ochrona Zabytków: https://ochronazabytkow.nid.pl/wp-content/uploads/2022/09/OZ_2-2021_M-Tureczek.pdf [W]).
3. U nas: jeden list do parafii katedralnej i do klasztoru dominikanów: nazwy, rok odlewu, ludwisarz, godziny bicia, zgoda na nagranie z zewnątrz (nie wymaga zgody, ale buduje relację). Potem jedna sobota z telefonem na Rynku i pod katedrą o 12:00: 3 nagrania po 60 s. Koszt: bilet.
4. Ryzyko: dzwon jako „klucz” w grze oparty na prawdziwym dzwonie oznacza, że po remoncie lub wymianie dzwonu klucz przestaje działać (dominikanie 2016). Rozwiązanie: klucz z nagrania archiwalnego w grze, dzwon na miejscu tylko jako „świadek” (porównanie z tolerancją), nie jako jedyna droga.
5. W Polsce amatorskiej bazy dzwonów z nagraniami nie znaleziono dziś (wyszukiwanie dało tylko literaturę naukową) [?]. Przegląd popularny: https://www.rmf24.pl/raporty/raport-swieta/najnowsze-fakty/news-szlakiem-polskich-dzwonow-poznaj-ich-niezwykle-historie,nId,2381979 [W].

### d2. Jak amator rozpoznaje dzwon: analiza widma (Hibbert, Wavanal, Sonic Visualiser, Audacity) [P]
1. Bill Hibbert, amator-badacz dzwonów z UK, program Wavanal i strona z metodą: https://www.hibberts.co.uk/ . Narzędzia darmowe: Sonic Visualiser https://www.sonicvisualiser.org/ , Audacity (Analizuj, Wykres widma) https://www.audacityteam.org/
2. Sztuczka: dzwon nie ma jednej wysokości, ma pięć głównych składowych (hum, prime, tierce, quint, nominal); słyszana wysokość to „ton uderzeniowy” wyprowadzony z nominal; stosunki częstotliwości składowych są odciskiem konkretnego dzwonu (odlew, profil), niezależnie od mikrofonu i odległości. Amator: nagranie 20 do 30 s, widmo z oknem 4096 do 8192, odczyt pięciu szczytów, zapis stosunków. Dwa dzwony o tej samej nucie mają różne stosunki.
3. U nas: „odcisk dzwonu jako klucz” zrobić jako porównanie stosunków, nie bezwzględnych częstotliwości: Web Audio AnalyserNode (FFT 8192), wykrycie 4 do 5 szczytów w zakresie 100 do 2500 Hz po 10 s nagrywania, normalizacja do najniższego, porównanie z wzorcem z tolerancją 1,5 do 2%. Działa bez wysyłania audio. Dwa do trzech dni kodu plus jedna sobota nagrań w Sandomierzu. Zero złotych. Wariant tańszy: spektrogram na canvasie (już w katalogu) i gracz sam „widzi” pięć linii.
4. Ryzyko: kilka dzwonów bijących razem (niedziela) niszczy odczyt; hałas Rynku; dzwon z nagłośnienia (niektóre parafie puszczają dzwony z głośnika, wtedy widmo jest inne). Zawsze zapas: wpisanie godziny i kodu z paszportu.
5. W Polsce: nie znamy gry z odciskiem dzwonu; ludwisarnie (Felczyńscy, Taciszów i Przemyśl [P]) robią analizy widmowe dla klientów, co jest dowodem, że metoda jest standardem branżowym.

---

## e) Speleologia i urbex: piwnice miast lessowych

### e1. Podziemna Trasa Turystyczna w Sandomierzu i zapadliska Rynku [W]
1. Fakty z Radia Kielce i leliwa.pl: zapadliska na płycie Rynku w połowie lat 60. XX w. przez wodę z awarii sieci (less traci stabilność przy nawilgoceniu); zabezpieczenie piwnic przez górników z Bytomia wg opracowań AGH; otwarcie trasy 10 XII 1977; ok. 500 m, poziomy 4 do 12 m; ponad 200 tys. osób rocznie; wystawa „Na ratunek Sandomierzowi” (2024). https://radiokielce.pl/993900/przez-rok-do-zabytkowych-piwnic-wchodzi-200-tysiecy-osob , https://radiokielce.pl/1166552/jak-powstala-sandomierska-podziemna-trasa-turystyczna-mozna-sie-dowiedziec-na-nowej-wystawie , https://leliwa.pl/2024/03/sandomierz-nowa-szklana-wystawa-w-podziemnej-trasie-turystycznej , https://radiokielce.pl/412258/eksperci-odkryli-dlaczego-woda-zalewa-podziemna-trase-turystyczn-110938 , https://showcaves.com/english/pl/subterranea/Sandomierz.html . Nauka: Rafał Gawałkiewicz (AGH), wizualizacja elektroniczna trasy (Geoinformatica Polonica 2021) https://ejournals.eu/en/journal/geoinformatica-polonica/article/electronic-visualization-of-underground-tourist-routes-on-the-example-of-the-route-in-sandomierz oraz skaning laserowy podziemi (SGEM 2018).
2. Sztuczka: AGH już zeskanowała trasę laserowo; istnieje model 3D w instytucji. Amator (my) nie musi skanować sam.
3. U nas: list do dr. Gawałkiewicza (AGH) i do SCK z pytaniem o udostępnienie uproszczonej siatki lub chmury punktów trasy do celów artystycznych z podaniem źródła; nasz public/skan czyta .ply. Jeśli nie, własny skan jedną aplikacją (Scaniverse/Polycam) w ramach biletu i za zgodą przewodnika: 20 minut, zero złotych. Komnata (public/komnata) zostaje symulacją „pod Rynkiem 27”.
4. Ryzyko: prawa do modelu (AGH, SCK); dane o konstrukcji podziemi mogą być wrażliwe dla bezpieczeństwa (nie publikować planu jako „mapy wejść”); w grze pokazujemy fikcyjny korytarz, nie prawdziwy plan.
5. To Polska.

### e2. Rynek 27, Hotel Pod Ciżemką: co wiadomo [W]
1. Kamienica XVI-wieczna (jedno źródło: 1563), hotel 9 pokoi, „gotyckie piwnice” używane jako sala do 60 osób: https://bridebook.com/pl-pl/wedding-venues/hotel-pod-cizemka-sandomierz-swietokrzyskie-pl7nXKJM8R oraz https://www.urlop.pl/hotele/polska/swietokrzyskie/gory-swietokrzyskie/sandomierz/pod-cizemka-htl19455/ . **Żadne źródło nie mówi, że piwnice Ciżemki łączą się z Podziemną Trasą** [W, brak dowodu].
2. Sztuczka regionalisty: zdanie „pod tą podłogą jest piwnica” jest prawdziwe, zdanie „korytarz biegnie do katedry” jest legendą. Gra potrzebuje pierwszego, powieść może używać drugiego jako legendy opowiadanej przez postać.
3. U nas: jeśli hotel zostanie strażnikiem, jego „to miejsce pamięta” brzmi: „że pod tą salą są gotyckie piwnice” (prawda). Piwnica Ciżemki to realny zapas dla bramy 5 (60 s ciemności) i miejsce na Noc (sala do 60 osób). Jedna rozmowa, wynajem sali na wieczór: do wyceny, zwykle kilkaset złotych poza sezonem.
4. Ryzyko: użycie nazwy hotelu w fikcji (poczta głosowa „Hotel Pod Ciżemką” w katalogu VIII.28) wymaga zgody; bez zgody nazwa fikcyjna.
5. To Polska.

### e3. Inne miasta lessowe: Opatów [W], Jarosław i Przemyśl [?]
1. Opatów: trasa im. prof. Zbigniewa Strzeleckiego, ok. 500 m, trzy poziomy, do 15 m pod Rynkiem (inne źródło: 402 m, 46 komór w lessie), PTTK prowadzi od 1986, blisko 20 tys. odwiedzających rocznie: https://swietokrzyskie.travel/en/informator_turystyczny/zabytki/underground_tourist_route_in_opatow , https://radiokielce.pl/189121/podziemna-trasa-w-opatowie-ma-nowe-patio-154048 , https://radiokielce.pl/304717/nowa-wystawa-w-podziemiach-prezentuje-zloty-wiek-opatowa-115657 . Jarosław (Podziemne Przejście Turystyczne pod Rynkiem) i Przemyśl (trasa pod Rynkiem otwarta około 2020) z pamięci panelu, do sprawdzenia [?].
2. Sztuczka: te trasy działają dzięki PTTK i domom kultury, nie dzięki dużym instytucjom; mają własne „legendy korytarzy” (do katedry, do zamku), wszędzie te same.
3. U nas: „legenda korytarza do katedry” to motyw regionu, nie tylko Sandomierza; powieść może to nazwać wprost (Anzelm: „każde miasto na lessie ma ten korytarz”). Zero złotych.
4. Ryzyko: żadne.
5. To Polska.

### e4. Amatorskie dokumentacje podziemi i urbex [?]
1. Dziś nie znaleziono forum ani filmów urbex z Sandomierza (budżet wyszukiwań). Z pamięci panelu: polskie kluby speleo (np. sekcje PTTK, Speleoklub Dąbrowa Górnicza) zajmują się jaskiniami, nie piwnicami; piwnice miejskie to domena pasjonatów z lokalnych grup FB i YouTube [?].
2. Sztuczka urbexu: „zostaw tylko ślady stóp, zabierz tylko zdjęcia”; dokumentacja bez podawania wejść.
3. U nas: nie wchodzić nigdzie poza trasą i piwnicami lokali partnerów. Gaussian splat piwnicy partnera (Scaniverse, 10 minut) zastępuje każdą eksplorację.
4. Ryzyko: less w niezabezpieczonych piwnicach to realne ryzyko zawalenia i tlenku węgla; wejście bez zgody to naruszenie posiadania i, w zabytkach, ustawa o ochronie zabytków. Gra ma w tekście jedno zdanie: „Akta nie prowadzą pod ziemię. Pod ziemię prowadzi przewodnik.”
5. W Polsce: tak, urbex jest popularny, i tak, były wypadki.

---

## f) Hobbyści od czujników: co naprawdę działa w przeglądarce (Android Chrome 2025 do 2026, iOS)

### f1. Web NFC [W]
1. Chrome na Androida: odczyt i zapis NDEF (NDEFReader), makeReadOnly od Chrome 100 (III 2022); Opera Android, Samsung Internet też; Safari iOS: brak; Firefox: stanowisko negatywne. https://developer.chrome.com/docs/capabilities/nfc?hl=pl , https://developer.mozilla.org/docs/Web/API/NDEFReader , https://web-platform-dx.github.io/web-features-explorer/features/web-nfc , demo PWA: https://progressier.com/pwa-capabilities/nfc
2. Sztuczka: tag z rekordem URL otwiera stronę po zbliżeniu telefonu nawet bez naszej aplikacji (Android i iPhone czytają URL w tle); zapis na tag tylko z Chrome Android. Czyli: iPhone czyta, Android pisze. Dokładnie jak w MASTERPLAN.
3. U nas: jeden plik public/nfc/index.html: odczyt NDEF, zapis 7 bitów bram jako rekord tekstowy obok rekordu URL; iPhone dostaje URL z parametrem i resztę trzyma w localStorage/kodzie wznowienia. Dwa dni. Tagi do testów: 10 szt. NTAG213 za 20 do 40 zł [P].
4. Ryzyko: zapis z iPhone’a niemożliwy bez aplikacji natywnej (znane); tag w kamieniu z metalowym okuciem nie zadziała; zapis przez przypadkowego gracza na cudzym tagu (ustawić hasło NTAG213 albo makeReadOnly po inicjacji, wtedy bramy zapisywać w kodzie wznowienia, a tag tylko identyfikuje).
5. W Polsce: NFC w gadżetach jest powszechne (wizytówki), w grach nie znamy.

### f2. Magnetometr, światłomierz, barometr w przeglądarce [W]/[P]
1. Generic Sensor API: Magnetometer i AmbientLightSensor nadal za flagą chrome://flags/#enable-generic-sensor-extra-classes (częstotliwość 10 Hz), wg dokumentacji Chrome: https://developer.chrome.com/articles/generic-sensor/ i raportu amatora z 2023: https://newscrewdriver.com/2023/03/28/magnetometer-api-in-android-chrome-browser . Stan na koniec 2026 do potwierdzenia [?]. Barometr: nie ma żadnego API w przeglądarkach [P]. Kompas: działa przez DeviceOrientationEvent (Android: zdarzenie deviceorientationabsolute; iOS: webkitCompassHeading po zgodzie z gestu) [P].
2. Sztuczka hobbystów: nie czekać na API, używać tego, co jest: jasność z kamery zamiast światłomierza (jest w katalogu), kompas z orientacji zamiast magnetometru, „barometr” zastąpić wysokością z GPS (dokładność 5 do 15 m, wystarcza na „jesteś na wzgórzu czy w dolinie” przy różnicy 30 m między Rynkiem a Wisłą).
3. U nas: kompas-zawieszka (katalog V.14) na deviceorientationabsolute plus GPS; dla iOS wymóg kliknięcia przed zgodą (już praktykowane). „Wysokość” jako nowy świadek dla bramy 1 (Świętopawelskie, skarpa): telefon wie, że zszedłeś 25 m w dół. Jeden dzień.
4. Ryzyko: kompas w telefonie wymaga kalibracji „ósemką”, dokładność 10 do 20 stopni; blisko metalu (barierki) kłamie. Progi szerokie, zapas zawsze.
5. W Polsce: nie znamy gry na kompasie w przeglądarce.

### f3. Tagi NTAG213/215 w kamieniu [P]
1. NTAG213: 144 B pamięci użytkownika, 180 B łącznie; NTAG215: 504 B. Tanie tagi w setkach po 1 do 3 zł/szt. [P, cena do sprawdzenia]. Precedens: biżuteria z NFC (pierścienie, od 2013) i majsterkowicze zalewający tagi żywicą (Instructables, Hackaday) [P].
2. Sztuczka: epoksyd i kamień nie tłumią 13,56 MHz; tłumi metal i, słabo, woda; zasięg zależy od średnicy antenki (tag 25 mm czyta się z 1 do 3 cm, tag 12 mm z kilku milimetrów).
3. U nas: zanim jubiler, test: 5 krzemieni z gniazdem 14 mm wywierconym koronką diamentową, tag 12 mm w żywicy barwionej lessem, próba odczytu na 3 Androidach i 2 iPhone’ach. Koszt: tagi 20 zł, koronka 30 zł, żywica 30 zł, krzemień z Krzemionek/sklepu 20 zł/szt. Razem poniżej 200 zł, jedno popołudnie plus 24 h schnięcia.
4. Ryzyko: wiercenie krzemienia pyli (krzemica, maska i woda); krzemień pasiasty to surowiec chroniony w rezerwacie Krzemionki, kupować legalny z obróbki; 144 B wystarcza na 7 bitów, datę i hash, ale nie na „imię na tagu” dłuższe niż 100 znaków po NDEF.
5. W Polsce: wyroby z krzemienia pasiastego to rzemiosło sandomiersko-ostrowieckie, jubilerzy są na miejscu; NFC w krzemieniu nie znamy.

---

## g) Mapy i open data: OSM, Geoportal, GUGiK, psychogeografia

### g1. OpenStreetMap dla Sandomierza [W]/[?]
1. Obiekty istnieją (relacje tras, np. „Szlak Architektury Obronnej”: https://www.openstreetmap.org/relation/1757872 ), społeczność OSM Polska rozmawia na Discordzie (linki ze stron wiki miast: https://wiki.openstreetmap.org/wiki/Tarn%C3%B3w , https://wiki.openstreetmap.org/wiki/Kozienice ). Strony wiki dla Sandomierza nie znaleziono [?]. Nasz public/miasto używa kafelków OpenFreeMap (OSM) i terenu AWS Terrarium: działa bez klucza.
2. Sztuczka: strona wiki miasta z tabelą „co zmapowane w procentach” mobilizuje jedną lub dwie osoby, które robią resztę. Bramy miejskie są w OSM jako historic=city_gate, piwnic z definicji w OSM nie ma (nie mapuje się wnętrz prywatnych), ale trasa podziemna jako tourism=attraction tak.
3. U nas: nie zakładać strony wiki pod grę (OSM to nie reklama). Zrobić dwa pożytki: (a) sprawdzić i poprawić w OSM pozycję siedmiu bram i wejść na Trasę (JOSM/iD, jedno popołudnie, zgodne z zasadami, bo to prawdziwe obiekty); (b) współrzędne bram w public/miasto przepisać z OSM zamiast „przybliżonych” (komentarz w kodzie mówi, że są do poprawy). Zero złotych.
4. Ryzyko: nie wpisywać do OSM niczego fikcyjnego (Fundacji, bram z książki); to łamie zasady i społeczność to usunie z komentarzem.
5. To Polska; OSM Polska jest aktywna.

### g2. Geoportal i GUGiK: NMT, NMPT, budynki 3D [W]/[P]
1. GUGiK opublikował notkę „Sandomierz okiem danych GUGiK” (X 2024): https://geoportal.gov.pl/wp-media/2024/10/News-22-Sandomierz-okiem-dnaych-GUGiK-pdf.pdf [W, treść nie pobrana]. Z pamięci panelu: NMT 1 m (GRID), NMPT, ortofotomapa, modele 3D budynków LOD1 i LOD2 (CityGML) do pobrania bezpłatnie z geoportalu („Dane do pobrania”), licencja otwarta z ustawy Prawo geodezyjne [P].
2. Sztuczka hobbystów: z NMT 1 m robi się cieniowany relief wzgórz i wąwozów (QGIS, darmowy), z LOD2 bryły kamienic do three.js. Wąwozy lessowe (Królowej Jadwigi, Piszczele) widać dopiero na NMT, nie na mapie turystycznej.
3. U nas: public/miasto zastąpić teren AWS (30 m) własnym kafelkiem z NMT 1 m dla 4 km² Starego Miasta (QGIS, gdal2tiles, 100 MB): wąwozy i skarpy stają się widoczne jako „siedem wzgórz”. Dwa dni. Zero złotych. LOD2 kamienic z Rynku (kilkaset budynków) jako GLB do komnaty i miasta: jeden dzień.
4. Ryzyko: rozmiar danych na telefonie (ograniczyć do Starego Miasta); poprawne cytowanie źródła GUGiK w stopce.
5. To Polska; dane są najlepsze w Europie w stosunku do ceny (zero).

### g3. Mapy psychogeograficzne: od Deborda do „Wyjścia w Polskę” [W]/[P]
1. „The Naked City” Deborda i Jorna (1957) [P]; Honorata Martin „Wyjście w Polskę” (2013): dérive po polskich wsiach, nocleg u obcych ludzi: https://walkingart.interartive.org/node/65 [W]; Anna Nacher o teletechnologiach i dryfie (tekst po polsku): https://cejsh.icm.edu.pl/cejsh/element/bwmeta1.element.desklight-8b59f229-1fe3-49b2-a30a-1761004276a1/c/Sztuka_w_podrozy_Anna_Nacher_Teletechnologie_linie_i_cyfrowe_slady.pdf [W]; przegląd „Mapping Psychogeographies”: https://makingmaps.substack.com/p/mapping-psychogeographies [W].
2. Sztuczka: mapa z fragmentów i strzałek, która pokazuje, jak się miasto czuje, nie jak wygląda; powstaje z wielu spacerów bez celu. Hobbyści robią to dziś w uMap (OSM) albo na papierze.
3. U nas: „mapa lessu”: po każdej bramie gracz na miejscu dostaje jedno pytanie („gdzie było najzimniej?”) i stawia jedną kropkę na mapie bez GPS (palcem). Po sezonie z kropek powstaje mapa „zimna, ciemności, głosu” Sandomierza publikowana w rejestrze. Jeden dzień kodu, zero złotych, zero danych osobowych (kropka bez identyfikatora).
4. Ryzyko: zero, jeśli kropki są anonimowe i agregowane po 20 sztuk.
5. W Polsce: są projekty artystyczne (Martin), map miejskich zbiorczo nie znaleziono dziś [?].

---

## h) Społeczności czytelników w Polsce, które robią własne rzeczy

### h1. Lubimyczytać: grupy, forum, półki tematyczne [W]
1. Portal z forum i grupami prowadzonymi przez czytelników (np. nieoficjalna grupa wymiany książek): https://lubimyczytac.pl/grupy , https://lubimyczytac.pl/forum ; półka tematyczna „Sandomierskie”: https://lubimyczytac.pl/ksiazki/t/Sandomierskie
2. Sztuczka: czytelnicy sami tworzą półki i tagi; książka osadzona w mieście trafia na półkę miasta.
3. U nas: dopilnować, żeby „Siedem Bram Lessu” miała na lubimyczytać tag Sandomierz i opis z jednym zdaniem o grze; poprosić pierwszych dziesięciu czytelników (playtest) o recenzję z datą. Zero złotych.
4. Ryzyko: żadne.
5. To Polska.

### h2. Grupy FB o kryminałach, BookTok PL, Dyskusyjne Kluby Książki [?]/[P]
1. Dziś nie zweryfikowano nazw grup („Czytam, bo lubię” i inne) z powodu limitu wyszukiwań [?]. Z pamięci panelu: Dyskusyjne Kluby Książki (DKK) to sieć klubów w bibliotekach publicznych koordynowana przez Instytut Książki, kilkaset klubów w kraju, bardzo prawdopodobne, że biblioteka w Sandomierzu ma swój [P]. BookTok PL istnieje jako hashtag, nie jako instytucja.
2. Sztuczka DKK: spotkanie raz w miesiącu w bibliotece, moderator z biblioteki, egzemplarze z Instytutu Książki. To gotowa publiczność dla biblioteki-strażnika.
3. U nas: w rozmowie z biblioteką (pierwsza w kolejności wg STRAZNICY.md) zapytać o DKK i zaproponować spotkanie klubu jako „wieczór jubensha” (docs/WIECZOR_JUBENSHA.md) 4 do 6 tygodni po premierze. Zero złotych.
4. Ryzyko: żadne.
5. To Polska.

---

## i) Regionaliści Sandomierza online: do kogo pisać

### i1. „Sandomierzanie i Sympatycy Sandomierza” (Facebook, od 2010) [W]
1. Grupa założona w 2010 przez Elżbietę Żak, ponad 13 tys. członków po 15 latach (Radio Kielce, „Sandomierzanin roku”): https://radiokielce.pl/1275381/sandomierzanin-roku-wybrany ; analiza naukowa grupy za lata 2010 do 2022: https://www.ceeol.com/search/chapter-detail?id=1241528 . Adres grupy na FB do znalezienia po nazwie [?].
2. Sztuczka: grupa łączy mieszkańców i rozproszonych „z Sandomierza”, czyli dokładnie zdalnych graczy, którzy chcą „podtrzymać bramę” w Noc.
3. U nas: jeden post w grupie, dopiero po zgodzie administratorki, w formie pytania, nie reklamy: „szukam prawdziwych zdań o siedmiu miejscach” (zdania „to miejsce pamięta” dla strażników). Zero złotych.
4. Ryzyko: grupa lokalna reaguje źle na „marketing”; pytać, nie ogłaszać.
5. To Polska.

### i2. Towarzystwo Naukowe Sandomierskie i „Zeszyty Sandomierskie” [W]
1. Redaktor Krzysztof Burek; historyk Tomasz Giergiel (UMCS) publikuje o regionalizmie sandomierskim i Aleksandrze Patkowskim; Piotr Sławiński „Ziemia Sandomierska” (UwB): https://repozytorium.uwb.edu.pl/jspui/bitstream/11320/8556/1/P_Slawinski_Ziemia_Sandomierska.pdf ; TNS współwydało Atlas historyczny miast polskich (2014).
2. Sztuczka: fakty o dzwonach, piwnicach i bramach siedzą w „Zeszytach”, nie w sieci; jedna wizyta w bibliotece z numerami „Zeszytów” to więcej niż tydzień wyszukiwania.
3. U nas: list do redakcji z prośbą o sprawdzenie listy 20 faktów użytych w powieści (dzwony, bramy, piwnice, 1260) i o notkę o książce w „Zeszytach” po premierze. Zero złotych.
4. Ryzyko: żadne; wręcz zabezpieczenie przed błędem faktograficznym.
5. To Polska.

### i3. Media lokalne i instytucje [W]
1. Leliwa.pl (portal lokalny, relacje z Trasy): https://leliwa.pl ; Radio Kielce z tagiem „katedra w Sandomierzu”: https://radiokielce.pl/tagi/katedra-w-sandomierzu/ ; Sandomierskie Centrum Kultury (Podziemna Trasa); Muzeum Zamkowe (quest); PTTK Opatów (trasa od 1986); dominikanie św. Jakuba (dzwony).
2. Sztuczka: lokalny portal napisze o wszystkim, co ma zdjęcie i datę; Radio Kielce pisze o Sandomierzu co tydzień.
3. U nas: po pierwszej pieczęci strażnika zdjęcie i trzy zdania do leliwa.pl i Radia Kielce. Zero złotych.
4. Ryzyko: zbyt wczesne nagłośnienie przed premierą (MASTERPLAN: Noc po premierze).
5. To Polska.

---

## Dziesięć propozycji „poziom wyżej” (wg efekt/koszt, od najlepszego)

1. **Odcisk dzwonu jako stosunki składowych, nie częstotliwość.** Pięć szczytów widma znormalizowanych do najniższego daje odcisk odporny na mikrofon i odległość. Trzy dni kodu, jedna sobota nagrań, zero złotych. Działa też jako spektrogram-zdziwienie bez klucza.
2. **Pierwsza sprawa za darmo, bez książki, z przyciskiem „pokaż streamerowi”.** Roottrees i Helltaker pokazały, że darmowy pierwszy akt jest marketingiem. Jeden dzień, zero złotych. Warunek: w sprawie 1 nie ma spoilerów aktu III (jest tak).
3. **Księga strażnika jako druga strona pieczęci (letterboxing).** Gracz zostawia znak w zeszycie lokalu, lokal zostawia pieczęć w paszporcie. Siedem zeszytów, 70 zł, jedno zdanie w STRAZNICY.md. Lokal dostaje coś, co może pokazać następnym gościom.
4. **Wyszukiwarka Archiwum Fundacji z limitem pięciu wyników (Her Story).** Czytelnik książki ma słowa klucze, przypadkowy gracz nie. Jeden wieczór kodu, dwa dni treści. Zero złotych.
5. **NMT 1 m z GUGiK zamiast terenu 30 m w Mieście.** Wąwozy i skarpy stają się widoczne, „siedem wzgórz” przestaje być metaforą. Dwa dni, zero złotych, QGIS i gdal2tiles. Przy okazji poprawka współrzędnych bram z OSM.
6. **Dzwon o 12:00 jako para przez czas (I Love Bees bez automatu telefonicznego).** Gracz na Rynku nagrywa, gracz w domu o tej samej minucie słyszy nagranie z poprzedniego tygodnia. Dwa dni kodu, zero złotych. Brama 7 dla samotnych.
7. **Test krzemienia z tagiem 12 mm zanim rozmowa z jubilerem.** Pięć kamieni, koronka, żywica, pięć telefonów, 200 zł, jedno popołudnie. Daje twardą odpowiedź „czyta się czy nie” i zdjęcie do rozmowy z partnerem.
8. **Mapa lessu z anonimowych kropek („gdzie było najzimniej?”).** Psychogeografia bez GPS, bez danych, publikowana po 20 kropkach. Jeden dzień kodu. Jedyna mapa Sandomierza, której nikt nie ma.
9. **Model 3D trasy od AGH zamiast własnego skanu.** Jeden list do dr. Gawałkiewicza i SCK; nasz public/skan czyta .ply. Jeśli odmowa, własny skan Scaniverse za bilet. Zero złotych.
10. **Lista 20 faktów do Towarzystwa Naukowego Sandomierskiego i parafii katedralnej.** Dzwony, bramy, piwnice, 1260. Jeden list, zero złotych, chroni powieść przed błędem, który regionalista znajdzie w dzień premiery.

## Trzy rzeczy, których NIE robić (czerwony zespół)

1. **Nie zakładać skrzynek geocaching ani wpisów w OSM pod marką gry.** Geocaching.com zakazuje skrzynek komercyjnych, OSM usuwa fikcję, a Stare Miasto to strefa konserwatorska. Jedno zgłoszenie i społeczność, której chcemy, zaczyna nas traktować jako reklamę. Pieczęcie tylko w lokalach, obiekty w OSM tylko prawdziwe.
2. **Nie opierać żadnej bramy wyłącznie na prawdziwym dzwonie ani prawdziwej piwnicy.** Dzwony dominikanów zdjęto w 2016, Trasę zamykano na odgrzybianie, hotel może zmienić właściciela. Klucz z nagrania archiwalnego w grze, miejsce jako świadek, zawsze zapas.
3. **Nie wysyłać nikogo pod ziemię poza trasą i piwnicą partnera, i nie publikować planów podziemi jako mapy.** Less się zapada (Rynek, lata 60.), urbex w piwnicach to tlenek węgla i naruszenie posiadania. Zdanie w grze: „Akta nie prowadzą pod ziemię. Pod ziemię prowadzi przewodnik.” Komnata zostaje symulacją.

## Lista osób i społeczności (do kogo, gdzie, po co)

| # | Kto | Gdzie | Po co |
|---|---|---|---|
| 1 | Elżbieta Żak, grupa „Sandomierzanie i Sympatycy Sandomierza” (13 tys.) | Facebook, grupa od 2010; https://radiokielce.pl/1275381/sandomierzanin-roku-wybrany | zgoda na jeden post-pytanie o „zdania, które miejsce pamięta”; kanał do zdalnych graczy na Noc |
| 2 | Towarzystwo Naukowe Sandomierskie, red. Krzysztof Burek; Tomasz Giergiel (UMCS) | „Zeszyty Sandomierskie”; https://repozytorium.uwb.edu.pl/jspui/bitstream/11320/8556/1/P_Slawinski_Ziemia_Sandomierska.pdf (kontekst) | sprawdzenie 20 faktów; notka po premierze; ewentualnie „biegły” nr 1 |
| 3 | Parafia katedralna (bazylika Narodzenia NMP) | Katedralna 1; https://zabytek.pl/en/obiekty/sandomierz-zespol-kosciola-kolegiackiego-pw-narodzenia-najswiet | nazwy i historia dzwonów, godziny bicia, zgoda na użycie nazw w fikcji |
| 4 | Klasztor dominikanów św. Jakuba | https://radiokielce.pl/411528/niezwykle-dzwony-sandomierskich-dominikanow-jeden-z-nich-zmieni-111114 | dzwony zdjęte w 2016 (co z nimi dziś), teksty o 1260, brama 2 (skwer) |
| 5 | Sandomierskie Centrum Kultury, Podziemna Trasa Turystyczna | Rynek 10; https://radiokielce.pl/993900/przez-rok-do-zabytkowych-piwnic-wchodzi-200-tysiecy-osob | brama 5 (60 s ciemności), Noc po godzinach, zgoda na skan, model 3D |
| 6 | dr Rafał Gawałkiewicz, AGH Kraków | https://ejournals.eu/en/journal/geoinformatica-polonica/article/electronic-visualization-of-underground-tourist-routes-on-the-example-of-the-route-in-sandomierz | udostępnienie uproszczonego modelu trasy do celów artystycznych; fakty o lessie i osiadaniu |
| 7 | Muzeum Zamkowe w Sandomierzu | quest „Tajemnica Królewskiego Strażnika”; https://www.swietokrzyskie.pro/tajemnica-krolewskiego-straznika-z-muzeum-zamkowego-w-kolejnym-etapie-ogolnopolskiego-konkursu/ | strażnik bramy 4 (Zamkowe), połączenie pieczęci questu z pieczęcią bramy |
| 8 | Hotel Pod Ciżemką, Rynek 27 | https://bridebook.com/pl-pl/wedding-venues/hotel-pod-cizemka-sandomierz-swietokrzyskie-pl7nXKJM8R | gotyckie piwnice jako zapas bramy 5 i baza Nocy; zgoda na nazwę w fikcji |
| 9 | Opiekunowie skrzynek geocaching w Sandomierzu | profile właścicieli przy https://www.geocaching.com/geocache/GC56QBG i https://www.geocaching.com/geocache/GC51G0Z | pierwsi testerzy trasy siedmiu bram; jeden z nich jako „biegły”; wiedza o tym, co w terenie znika |
| 10 | PTTK Oddział w Opatowie (trasa podziemna od 1986) | https://swietokrzyskie.travel/en/informator_turystyczny/zabytki/underground_tourist_route_in_opatow | pieczęć gościnna poza miastem; doświadczenie prowadzenia podziemi bez instytucji |
| 11 | OSM Polska (Discord) | linki z https://wiki.openstreetmap.org/wiki/Tarn%C3%B3w | poprawa pozycji bram i wejść na Trasę; kto mapuje Sandomierz |
| 12 | Leliwa.pl i Radio Kielce (redakcja sandomierska) | https://leliwa.pl ; https://radiokielce.pl/tagi/katedra-w-sandomierzu/ | relacja po pierwszej pieczęci i po Nocy; nie wcześniej niż premiera |
| 13 | Fundacja Questingu (questing.pl) | https://questing.pl | czy quest sandomierski żyje; wzór ulotki; sieć instytucji kultury, które już robią pieczęcie |
| 14 | Game Detectives (wiki ARG, angielskojęzyczna) | https://gamedetectives.net | jeśli powstanie wersja angielska: miejsce, gdzie ARG-owcy zauważą dokument z 21 linii; nie pisać przed premierą |
| 15 | Biblioteka Miejska w Sandomierzu i jej Dyskusyjny Klub Książki (jeśli istnieje) [?] | lokalnie | księga Rejestru, pieczęć zastępcza, wieczór jubensha dla klubu |

---

## Źródła zweryfikowane dziś (zbiorczo)

- https://radiokielce.pl/411528/niezwykle-dzwony-sandomierskich-dominikanow-jeden-z-nich-zmieni-111114
- https://radiokielce.pl/449014/post-100556
- https://architectus.pwr.edu.pl/en/articles/the-architectural-research-of-the-belfry-of-the-church-of-st-james-the-apostle-in-sandomierz
- https://zabytek.pl/en/obiekty/sandomierz-zespol-kosciola-kolegiackiego-pw-narodzenia-najswiet
- https://ochronazabytkow.nid.pl/wp-content/uploads/2022/09/OZ_2-2021_M-Tureczek.pdf
- https://radiokielce.pl/993900/przez-rok-do-zabytkowych-piwnic-wchodzi-200-tysiecy-osob
- https://radiokielce.pl/1166552/jak-powstala-sandomierska-podziemna-trasa-turystyczna-mozna-sie-dowiedziec-na-nowej-wystawie
- https://leliwa.pl/2024/03/sandomierz-nowa-szklana-wystawa-w-podziemnej-trasie-turystycznej
- https://radiokielce.pl/412258/eksperci-odkryli-dlaczego-woda-zalewa-podziemna-trase-turystyczn-110938
- https://ejournals.eu/en/journal/geoinformatica-polonica/article/electronic-visualization-of-underground-tourist-routes-on-the-example-of-the-route-in-sandomierz
- https://showcaves.com/english/pl/subterranea/Sandomierz.html
- https://swietokrzyskie.travel/en/informator_turystyczny/zabytki/underground_tourist_route_in_opatow
- https://radiokielce.pl/189121/podziemna-trasa-w-opatowie-ma-nowe-patio-154048
- https://www.swietokrzyskie.pro/tajemnica-krolewskiego-straznika-z-muzeum-zamkowego-w-kolejnym-etapie-ogolnopolskiego-konkursu/
- https://swietokrzyskie.pro/poszukiwanie-zamkowego-skarbu-questing-w-muzeum-okregowym-w-sandomierzu/
- https://www.geocaching.com/geocache/GC56QBG oraz pozostałe listingi z sekcji c1
- https://opencaching.pl/viewcache.php?wp=OPA52P
- https://developer.chrome.com/docs/capabilities/nfc?hl=pl
- https://web-platform-dx.github.io/web-features-explorer/features/web-nfc
- https://developer.chrome.com/articles/generic-sensor/
- https://newscrewdriver.com/2023/03/28/magnetometer-api-in-android-chrome-browser
- https://geoportal.gov.pl/wp-media/2024/10/News-22-Sandomierz-okiem-dnaych-GUGiK-pdf.pdf
- https://www.openstreetmap.org/relation/1757872
- https://walkingart.interartive.org/node/65
- https://www.behance.net/gallery/23893975/Alan-Wake-ARG
- https://www.behance.net/gallery/89156477/Insilva-Alternate-Reality-Game
- https://www.gry-online.pl/newsroom/ludo-ergo-sum-alicja-po-drugiej-stronie-reklamy/z889eb
- https://gamedetectives.net ; https://unforum-archive.netninja.com/ ; https://unfiction.com/resource/
- https://charon99.itch.io/polon ; https://underthesink.itch.io/kryptafm
- https://www.notebookcheck.net/Free-to-play-survival-puzzle-game-storms-SteamDB-trends.934879.0.html
- https://radiokielce.pl/1275381/sandomierzanin-roku-wybrany ; https://www.ceeol.com/search/chapter-detail?id=1241528
- https://lubimyczytac.pl/grupy ; https://lubimyczytac.pl/ksiazki/t/Sandomierskie
- https://bridebook.com/pl-pl/wedding-venues/hotel-pod-cizemka-sandomierz-swietokrzyskie-pl7nXKJM8R
