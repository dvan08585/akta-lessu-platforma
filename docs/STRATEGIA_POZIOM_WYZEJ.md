# Akta Lessu: poziom wyżej

Synteza pięciu paneli (14 listopada 2026): audyt strukturalny kodu i treści, trendy i hity 2024–2026, możliwości telefonów w 2026, mistrzowie dedukcji / escape / ARG / UX / krytyk literacki, oraz panel polski: czytelnik, Sandomierz, konkurs i prawo. Pełne raporty paneli są streszczone tu do decyzji. Tam, gdzie panele się nie zgadzają, piszę, co rekomenduję i dlaczego.

Zasada całego dokumentu: **hity mają jedną nową rzecz zrobioną perfekcyjnie na klasycznym fundamencie.** My mamy dziś dwanaście nowych rzeczy zrobionych w połowie na fundamencie, który ma trzy pęknięcia. Praca na najbliższe miesiące to nie dokładanie, tylko wybór, uszczelnienie i pogłębienie.

---

## 1. Diagnoza bez znieczulenia

### Co jest dobre (i co panele uznały za światowy poziom)
- **Wejście (90 s):** dwa zdania, dzwon, kamień trzymany pięć sekund, ciepło rozlewające się po ekranie. Ciało przed głową. Mistrz escape: „najlepsza rzecz w projekcie”.
- **Zawieszka jako jeden język sprzężenia zwrotnego:** grzeje w sprawie, na kompasie, w mikro-aktach, „parzy zimnem” w bramie 5. To jest tożsamość produktu.
- **Dokumenty jako proza faktu:** „Kożuchy: 40. Jeden oddany wdowie po Sędziwoju, nie zwrócony.” Krytyk: „zdanie, którego Eco by nie poprawił”. Typografia mówi, czym dokument był napisany.
- **Listy od postaci z opóźnieniem i stopka Fundacji:** jedyne systemy poza sprawami, które budują twist, a nie gadżet.
- **Pionierstwo jest realne:** żaden panel nie znalazł powieści (w Polsce ani na świecie) z dedukcją narracyjną sterowaną fizjologią. Nie znaleziono też polskiej powieści literackiej z grą-dodatkiem i kodami w rozdziałach. Jubensha w Polsce nie istnieje jako kategoria.

### Trzy pęknięcia fundamentu (do naprawy przed czymkolwiek innym)
1. **Finał „we dwoje” da się przejść samemu.** Odczyt wzgórza i połowa klucza mają ten sam format (7 znaków hex) i tę samą sumę kontrolną, więc własny odczyt z karty otwiera bramę 7. Drugą połowę generuje też każde okno prywatne (nowe ziarno). Zdanie „Nie da się sam. To nie jest metafora” jest dziś fałszem technicznym i ktoś to opublikuje w dniu premiery. Zweryfikowane w `src/engine/pair.ts`.
2. **Mapa 5/7 blokuje ok. 40% graczy na pierwszej sprawie bez wyjścia.** Prawdopodobieństwo, że wzgórze 3 (sprawa 2) milczy, wynosi ok. 0,39. Taki gracz po sprawie 1 widzi „Zawieszka milczy” i pole na token od kogoś, kto rozwiązał sprawę 2 i zrobił gest. Bez kanału znalezienia partnera to ściana. Przy realnych liczbach pierwszego sezonu (panel polski: 50–150 osób kończących online, 20–60 fizycznie w Sandomierzu) partnera może nie być tygodniami.
3. **Kod wznowienia gubi gesty i listy.** Koduje tylko sprawy, rozdziały, ziarno i odczyty. Po wznowieniu na nowym telefonie gracz ma sprawy „rozpoznane”, ale `passed()=0`, więc wszystko wraca do blokady, a listy planują się od nowa. To bug ścieżki, nie kosmetyka.

### Pęknięcia drugiego rzędu
- **Dwa sprzeczne kalendarze:** `chapterOffsets` (rozdziały sierpień–październik 2027) i `releases` (sprawy 2–6 co dwa tygodnie od 26 listopada 2026). Gracz czyta dwie daty na ten sam postęp. „Wpisz kod z książki” jest martwym przyciskiem przez 11 miesięcy.
- **Osiem miesięcy pustki:** sprawa 6 wychodzi 4 lutego 2027, sprawa 7 otwiera się 15 października 2027. Między nimi tylko powtórki 61 mikro-akt. Pętla urywa się tu, nie w finale.
- **Koniec gry leży w JavaScripcie 11 miesięcy przed premierą:** cały JSON spraw 5–7 z finałem jest w bundlu. Mistrz ARG przeczytał go w 30 sekund.
- **Kody rozdziałów:** SHA-256 jednego polskiego słowa ze stałym prefiksem to atak słownikowy w sekundy. Dla gracza bez znaczenia, dla jednego posta z 13 kodami: kalendarz premier przestaje istnieć.
- **Przerywniki zdradzają akt III** (krytyk, bez szczegółów w raporcie): „Marek trzyma”, „Tysiąc dwieście kroków”, „Nie podnoś palca”, intro „Siedmiu punktów”, zdania o pokrewieństwie w „Ciemności” i „Lustrze”, ostatnia linia rozdziału 21 w `chapters.json`. Siedem spraw w rdzeniu jest czystych. Przecieka wyłącznie to, co dołożono obok.
- **Zagadki są uczciwe aż do przezroczystości.** W 24 z 26 pytań luki stoją na danych, a wniosek jest wpisany w szablon zdania. Gracz dopasowuje słowa do tezy autora. Motta spraw streszczają twisty („Przeczytaj stopkę. Każdą stopkę”), rozwiązania parafrazują to, co gracz właśnie ustalił. „Aha” jest konsumowane przez autora, zanim gracz do niego dojdzie.
- **Gest jako bramka progresji jest fikcją:** każdy gest ma zapas „trzymaj przycisk”. Działa jako rytuał (i to dobrze), nie jako weryfikacja.
- **Katalog zamiast dramaturgii:** 27 przerywników, 18 typów, na mapie lista 20 wierszy posortowana etykietami trudności jak menu minigier. Sześć gestów bram nie ma krzywej narastania. Pierwszy gest gry (brama 4) wymaga kamery i czerwonego przedmiotu, czyli najwyższego progu.
- **Zasoby nie są sprzątane:** kamera i mikrofon zostają włączone po wyjściu z przerywnika, pętle rysowania żyją dalej. Dioda kamery świeci po opuszczeniu widoku. To problem baterii i zaufania.
- **Nazwisko Łutowicz.** Cezary Łutowicz to żyjący złotnik, pierwszy, który użył krzemienia pasiastego w biżuterii, Honorowy Obywatel Sandomierza, współautor Festiwalu Krzemienia. Postać w grze nazywa się Łutowicz i jest jubilerem na Opatowskiej. Ryzyko wizerunkowe wysokie, prawne umiarkowane (art. 23 k.c.), a przy okazji to najbardziej naturalny partner i fundator nagrody. Decyzja do podjęcia natychmiast: zgoda pisemna i cameo, albo zmiana nazwiska.

---

## 2. Co może być hitem hitów

Panel trendów dał siedmiu kandydatów. Po skrzyżowaniu z audytem i panelem polskim zostają **dwie gwiazdy** (robimy perfekcyjnie) i **trzy warstwy** (robimy po gwiazdach, jako tajemnice drugiego i trzeciego planu, w duchu Animal Well).

### Gwiazda 1: ciało jako klucz, ale z dramaturgią
Dowody popytu: Pokémon Sleep (235 mln USD z samego snu), One Hand Clapping (nucenie jako mechanika), TikTok (challenge z ciałem nie wymaga języka). Nikt nie połączył tego z thrillerem literackim.

Co trzeba zmienić, żeby to była gwiazda, a nie katalog:
- **Siedem gestów w narastającym łuku, nic więcej na mapie:** dotyk (5 s, wejście) → oddech (100 s, woda) → głos (nucenie, płyta) → bezruch (30 s, zimno) → ciemność (zakryć kamerę) → krok (20 kroków, ziemia) → drugi człowiek (siedem palców na jednym telefonie). Czas i cena ciała rosną, uprawnienia dochodzą po jednym. Pierwszy gest gry nie może wymagać kamery i rekwizytu.
- **Odsłona bez fanfar:** panel mistrzów jest jednogłośny: zamiast iskier, poświaty, wibracji i toastu „Brama przebyta. Ciałem.” ma być ciemny ekran, trzy sekundy ciszy i jedno zdanie. Scenariusz zapisał to dla sprawy 2; ma dotyczyć wszystkich. Moja rekomendacja: zostawić rozlewające się ciepło (to język zawieszki), wyciąć iskry i toast, dodać trzy sekundy ciszy przed zdaniem.
- **Zdanie po geście to zapis ręką geolożki w jej zeszycie**, nie głos autora.
- **Pozostałe 20 przerywników schodzi z mapy.** Część zostaje jako apokryfy odkrywane kontekstowo (tak jak dziś działa „Świt”: dokument pojawia się tylko o wschodzie), część idzie do laboratorium poza grą, trzy zdradzające akt III znikają.
- **Zawieszka fizyczna z tagiem NFC.** Krzemień pasiasty na rzemieniu od sandomierskiego jubilera, w oprawie tag NDEF z adresem gry i podpisem. Przyłożenie do telefonu działa systemowo także na iPhonie bez żadnej aplikacji (baner z linkiem), na Androidzie dodatkowo przez Web NFC. To jedyna fizyczna rzecz, którą czytelnik nosi na szyi, i zamyka pętlę książka–miasto–strona. Koszt tagu: ok. 2 zł.

### Gwiazda 2: milczące wzgórza jako ekonomia daru, nie bloker
Wzorzec: Animal Well (mural na 50 osób), Blue Prince (twórca nie potwierdza końca). Nasza wersja jest dziś losowym blokerem bez kanału społecznego, obchodzonym przez „Zacznij od nowa”.

Co zmienić:
- **Milczące wzgórze nie blokuje sprawy.** Odbiera jej status „pełnej” i jeden dokument-bonus. Gracz idzie dalej sam, a cudzy odczyt dopełnia, nie otwiera.
- **Odczyt niesie treść.** Dziś token to 7 znaków hex, więc nie ma o czym rozmawiać poza „daj odczyt z 2”. Każdy gracz z ziarna dostaje jedną z 21 linii dokumentu, którego nie ma w aktach (np. pełny inwentarz 1288 albo protokół Saramy z sondażem S-4). Całość składa się tylko między ludźmi, w arkuszu, na forum, w grupie. Jedna osoba nie zbierze 21 ziaren. To jest to, co społeczność odkrywa wspólnie.
- **Partner awaryjny po 72 h.** Przy 30 aktywnych osobach w sezonie (realne liczby panelu polskiego) system musi działać bez tłumu. Jeśli nikt nie dał odczytu w 72 h, przychodzi list od postaci z odczytem „z archiwum”. Bez tego pierwszy tydzień po premierze zabije grę.
- **Finał naprawdę we dwoje:** połowa klucza wydawana przez backend (HMAC) tylko stanom z sześcioma przebytymi bramami, osobny format niż odczyt, odrzucanie tokenów z własnego ziarna. Obok droga fizyczna: siedem palców na jednym telefonie przez 3 s (dwoje ludzi przy jednym stole). Po „Nie” telefon ekranem w dół na 20 s („less opada”), dopiero potem ostatnie zdanie. Symetria z wejściem.

### Warstwa 2: świat poza stroną (królicza nora)
Dziś wszystko siedzi pod jednym adresem, łącznie ze „stroną Fundacji” pod ścieżką gry. Sam URL mówi „to jest gra”. Trzy rzeczy tańsze niż jeden przerywnik sensoryczny:
- Fundacja na własnej domenie (ok. 60 zł/rok), indeksowalna, z realnym mailem, który odpowiada automatycznie dwoma słowami („Dziękuję. Pięknie.”). Rejestr na tej domenie zmienia się w czasie; backend już to umie.
- Poczta głosowa „Hotel Pod Ciżemką” na numerze VoIP (ok. 20 zł/mies.), z dzwonem w tle, w której ktoś zostawia jeden numer.
- Jeden ślad fizyczny w Sandomierzu: pręt geodezyjny „S-3 · 6,1 m” przy skarpie za murem dominikanów, za zgodą klasztoru, ok. 150 zł. Niepodpisany, wygląda jak prawdziwy punkt pomiarowy. Kto przeczytał protokół Saramy, rozpozna.

### Warstwa 3: jedno nieodtwarzalne zdarzenie
Fortnite (10,5 mln ludzi w jednej godzinie), Geocaching (rekord dnia w rocznicę), Dispatch (tygodniowy rytm → 2 mln graczy). Nasza wersja: **południe premiery**. `sendHum` już liczy, ile osób nuci jednocześnie. Siódma pozycja rejestru Fundacji zmienia się tylko wtedy, gdy w jednej minucie zanuci próg N osób. Nie da się tego zrobić samemu i nie da się przewinąć. Koszt: zero złotych, próg ustawiany ręcznie w dniu.

### Czego nie robić (bo to „kolejne QR”)
Sama strona z kodami z rozdziałów (gamebooki Escape Quest już to robią), czysty przewodnik miejski (Questo, Actionbound: rynek bez brandu narracyjnego), losowa lokalizacja bez fabuły (Randonautica: z 10,8 mln użytkowników do 42 tys.), ARG z jednym finałem bez pętli dziennej (kampanie korporacyjne kończą się i znikają), AR-zwierzak bez rytuału (Peridot zamknięty).

---

## 3. Co cofnąć lub wyciąć

Panele są tu zgodne w większym stopniu niż w czymkolwiek innym.

| Co | Dlaczego | Decyzja |
|---|---|---|
| 20 przerywników poza siedmioma gestami na mapie | katalog minigier obok powieści; część bez zapasów; własna doktryna mówi „siedem” | zdjąć z mapy; 6–8 zostaje jako apokryfy odkrywane kontekstowo, reszta do laboratorium |
| „Marek trzyma”, „Tysiąc dwieście kroków”, „Nie podnoś palca”, intro „Siedmiu punktów”, pokrewieństwo w „Ciemności”/„Lustrze”, ostatnia linia R.21 w bundlu | zdradzają akt III | usunąć lub przepisać przed jakąkolwiek publicznością |
| Linki „Narzędzia” (Miasto 3D, Scena, Kamera AR, Znaczniki) w zakładce Akta | tech demo z zewnętrznych CDN w głównym produkcie; nic w fabule do nich nie prowadzi; jedna awaria = „gra nie działa” | wynieść poza grę (osobna podstrona „laboratorium”), wrócić, gdy fabuła ich potrzebuje |
| Gest jako bramka `passed()` | zapasy unieważniają uzasadnienie; trzeci wymiar blokady (czas × losowanie × gest) | gest zostaje rytuałem po sprawie; `passed()` = rozwiązane sprawy |
| Pogoda, IMGW, „X% biegłych” | dekoracje kosztujące żądania i wiarygodność (procent pustej siódmej to tautologia, bo „Tak” jest zawsze odrzucane) | Wisła i wschód zostają w datowniku (to ton), procenty znikają |
| Pieczątki „Rozpoznane”, karta ●○○, etykiety trudności, toasty | krytyk: razem zmieniają akta w aplikację z nagrodami | moja rekomendacja: pieczątka na mikro-aktach zostaje (jest diegetyczna, archiwista stempluje), karta udostępnienia niesie zdanie z dokumentu i odczyt zamiast wyniku, etykiety trudności znikają razem z listą, toasty milkną |
| Motta-streszczenia, hinty, rozwiązania-parafrazy | gra tłumaczy, zanim pokaże | motto → zdanie z dokumentu; rozwiązanie → nowy dokument (zapis gołębnika 1288, jedno zdanie Berbecia) |
| Kody testowe BIEGŁY/KONIEC w `config.json` | flagi w produkcji, `testMode` w dziesięciu miejscach | parametr czasu budowania, osobny deploy testowy |
| Seria dni | liczona, testowana, nigdzie nie wyświetlana | usunąć |
| Narracja „ty” w rodzaju męskim | gra o geolożce, list „Szanowna Pani, Szanowny Panie” | formy neutralne albo wybór rodzaju w zleceniu |

---

## 4. Plan wieloetapowy

### Etap 0: prawda i szczelność (2–3 tygodnie, przed jakimkolwiek playtestem)
1. Finał: osobny format połówek, odrzucanie własnego ziarna, wydawanie przez Worker po sześciu bramach; droga fizyczna siedmioma palcami.
2. Mapa 5/7 zdjęta z krytycznej ścieżki; odczyt dopełnia, nie otwiera; partner awaryjny po 72 h.
3. Kod wznowienia pełny (gesty, miejsca, listy, mikro-akta) z sumą kontrolną.
4. Jeden kalendarz. „Wpisz kod z książki” ukryty do dnia, gdy książka istnieje. Harmonogram publikacji spraw przeliczony pod premierę (sekcja 6).
5. Sprawy 5–7 jako ładunek szyfrowany, klucz publikowany w dniu publikacji, hash ładunku opublikowany wcześniej. Kody rozdziałów dwuwyrazowe.
6. Cykl życia widoków: każdy renderer zwraca `dispose()`, routing woła go przed podmianą; kamera, mikrofon, czujniki i pętle rysowania gasną przy wyjściu.
7. Wycięcie przerywników zdradzających akt III i linii R.21 z bundla.
8. Plausible włączony. Bez liczb playtest z `PLAYTEST.md` to anegdota.

### Etap 1: dedukcja o poziom wyżej (4–6 tygodni)
1. **Zeszyt dedukcji zamiast logu.** Dotknięcie zdania w dokumencie = fakt w zeszycie (kto / gdzie / kiedy / głębokość, ze źródłem). Ustalenie biegłego składa się z faktów, nie z banku wymyślonego przez autora. Opcjonalny w sprawie 1, obowiązkowy od 3.
2. **Luki na wnioski, nie na dane.** Jeden bank 20–24 słów na sprawę, jedno ustalenie z 5–6 lukami, walidacja trójkami jak w Obra Dinn (gra potwierdza, gdy trzy luki naraz są prawdziwe, bez mówienia które), próba raz na 60 s, bez ciepła per pytanie. Konkurencyjna hipoteza w każdej sprawie, która musi upaść na dokumentach (w sprawie 1: „zdrajczyni” Rocznika jako red herring kronikarza, obalany brakiem szczątków w zasypie i gołębiem od południa).
3. **Dowód nigdy w dokumencie warunkowym.** Każda luka ma zdanie-kotwicę w dokumencie dostępnym w domu. Świt, południe i QR dają smaczek i odczyt, nie klucz. (Dziś sprawa 1 q5 wymaga dokumentu o świcie.)
4. **Redakcja głosu:** motta, hinty, cue i rozwiązania przepisane na głosy postaci i nowe dokumenty. Instrukcja techniczna jako drobny druk, nie jako głos.
5. **Rytm kopert:** sprawa 1 otwiera się z dwoma dokumentami, kolejne „w drugiej kopercie” po pierwszej próbie. Dziś po 90 sekundach ciała następuje 15 minut czytania 1800 słów.
6. **Sprawa 6 z informacją o koszcie** i bez głównego przycisku na pułapce. Stawka bez informacji łamie własną zasadę gry.

### Etap 2: świat, który żyje między sprawami (4 tygodnie)
1. **Web Push dla listów.** Na iOS działa w zainstalowanej PWA od 16.4, a iOS 26 domyślnie otwiera dodane strony jako aplikacje. Wysyłka z Workera lub GitHub Actions (VAPID). List od Wandy o 3 w nocy jako powiadomienie to najbardziej nagrywalna rzecz w grze po płycie Chladniego.
2. **Odpowiedzi w listach zmieniają kolejny list.** Dziś trzy przyciski bez skutku. Bez tego to rozmowa z automatem.
3. **Mikro-akta spięte ze stanem:** trafienie = fakt w zeszycie; siedem trafień = dokument-bonus w bieżącej sprawie; błędna dedukcja zmienia jutrzejszy list (Murdle + Lifeline).
4. **Karta „Teraz”** na szczycie mapy: jedna następna czynność, jeden przycisk. Topbar bez kłamstwa: Sprawy / Listy / Zeszyt / Klucze. Nazwane zakładki dokumentów (Rocznik 1260 / Sarama 1959 / Inwentarz 1288) przyklejone podczas pytań. Mapa z etykietami czytelnymi na 390 px. Papier z cieniem w trybie jasnym.
5. **Królicza nora:** domena Fundacji, poczta głosowa hotelu, pręt S-3.
6. **Dzień premiery:** 24 wiersze rejestru godzinowego, każdy coś koduje; południe z progiem nucących.

### Etap 3: Sandomierz, zawieszka, konkurs (równolegle, zależy od partnerów)
Opisane w sekcjach 5 i 6.

### Etap 4: po premierze
Sezony (wiosna: Tydzień Bibliotek; lipiec: Jarmark Jagielloński; wrzesień: Festiwal Krzemienia Pasiastego jako naturalne miejsce „bramy kamienia”; listopad: Święto Młodego Wina; grudzień: 740-lecie obrony 1287). Jubensha jako sezonowy finał: pierwsze polskie jubensha IP, wersja domowa i wersja eventowa. Wersja EN po polskiej redakcji; i18n wymaga refaktoru (teksty UI są w kodzie, nie w JSON).

---

## 5. Polacy, Sandomierz, lokalsi

### Realne liczby (bez złudzeń)
- 41% Polaków 15+ czyta co najmniej jedną książkę rocznie, 7% czyta systematycznie. Kryminał i sensacja to najpopularniejszy gatunek (27%). Papier spada (2025: −4,9% egzemplarzy; pierwsze półrocze 2026: −11%). Audiobooki rosną (+14,7%), 70% przez subskrypcje.
- Wniosek: premiera jednocześnie papier, e-book, audiobook. **Gra musi mieć wejście dla słuchaczy:** kody czytane przez lektora, nie tylko drukowane, albo kody poza tekstem (zawieszka, strona, biblioteka).
- Lejek dla debiutanckiego thrillera literackiego: nakład 3–6 tys., skan z książki 8–15% czytelników, pierwsza sprawa 5–8%, ukończenie całości 1–3%, fizyczny Sandomierz poniżej 1% czytelników. **Przy 5 tys. nakładu: 400–700 skanów, 50–150 osób kończących online, 20–60 osób w bramach w pierwszym sezonie.** Wszystkie mechaniki społeczne projektować na 30 aktywnych osób, nie na 3000.
- Sandomierz: ruch turystyczny spada (Podziemna Trasa 158 tys., Brama Opatowska z 102 do 86 tys., Muzeum Zamkowe 56 tys. w 2025), miasto deklaruje chęć wydłużenia sezonu i „turystyki nie jednodniowej”. **To argument do ratusza: gra to powód, żeby zostać na noc i wrócić poza sezonem.**
- „Ojciec Mateusz” nadal się kręci (sezon 36, 1,3 mln widzów premiery). Nie konkurować, pozycjonować się jako ciemna, dorosła strona Sandomierza dla czytelników Mroza i Chmielarza (35–55).

### Co działa w polskiej promocji książki
Dyskusyjne Kluby Książki (ok. 2000 klubów, 254 spotkania autorskie w 2025), Lubimyczytać (3 mln użytkowników miesięcznie, przedpremierowe egzemplarze obowiązkowe), biblioteki (źródło książek rośnie do 19%; „Chłopki” zbudowały fenomen przez biblioteki i polecenia, nie przez TikTok), Targi Książki w Krakowie (23–26 października, 59 tys. odwiedzających: idealny termin na premierę październik 2027), Nagroda Wielkiego Kalibru jako cel dla thrillera z miejscem. Polski BookTok preferuje romans i fantasy; thriller literacki trafi raczej do bookstagramu, booktuberów kryminalnych i podcastów.

### Nieufność wobec QR i uprawnień
Quishing w Polsce rośnie (kampanie ZBP, CERT, fałszywe QR na parkomatach). Zasady: każdy QR w terenie ma pod spodem czytelny krótki adres domeny i logo wydawcy, żadnych skracaczy, gra działa bez instalacji, bez logowania, bez prośby o dane. Komunikat „gra nie zbiera danych” w książce i na stronie wejścia. Czujniki ruchu jako opcja, zawsze z alternatywą.

### Lokalsi jako sojusznicy
- **Strażnicy pamięci:** siedem realnych osób i miejsc (jubiler, winiarz, przewodnik PTTK, bibliotekarka, furtian dominikański, piekarz z Rynku, archeolog z Krzemionek) daje stempel lub odczyt. Mieszkańcy znają ten wzorzec z Paszportu Enoturysty i Sandomierskiej Odznaki Regionalnej PTTK.
- **Paszport bram (7 pieczęci)** wszyty w książkę; pieczątki stawiane wewnątrz lokali partnerów. **Nic na murach.** Stare Miasto to rejestr zabytków: tablice i napisy na zabytku wymagają pozwolenia Wojewódzkiego Konserwatora Zabytków (art. 36 u.o.z.), a miasto przygotowuje uchwałę krajobrazową. QR wyłącznie na stojakach w lokalach, w kasach Trasy Podziemnej i Bramy Opatowskiej (SCK), oraz przez GPS bez znakowania terenu.
- **Kościół:** katedra to decyzja proboszcza (najpewniej z kurią), św. Jakub to przeor dominikanów, kaplica męczenników jest miejscem kultu. Zadania poza wnętrzami sakralnymi (dziedziniec, plac, Punkt Informacyjny u dominikanów), nigdy w czasie liturgii, teksty o 1260 pokazane proboszczowi i przeorowi przed drukiem. Furtian z Punktu Informacyjnego jako jeden ze strażników.
- **Przedpremierowe spotkanie dla mieszkańców w Miejskiej Bibliotece i dla przewodników PTTK.** Oni będą pytani przez turystów i muszą wiedzieć, co to jest.
- **SCK jest właścicielem narracji o Podziemnej Trasie.** Tekst o „lessowych podziemiach” uzgodnić z nimi.
- Zero głośnych i nocnych gestów na Rynku po 22:00. Zadania tylko na szlakach (lessowe skarpy i wąwozy są realnie niebezpieczne).

### Korekta dat historycznych (ważne dla tekstów)
Rzeź dominikanów u św. Jakuba: 2 lutego 1260. Najazd 1287: Telebuga wszedł w ziemię sandomierską na początku grudnia, **Sandomierza nie zdobyto**, odwrót w Wigilię 1287. Październik 2027 to 767. rocznica 1260 (nie 753.), grudzień 2027 to okrągła **740. rocznica obrony 1287**. Święto Młodego Wina to trzeci weekend **listopada**, nie października.

---

## 6. Konkurs i gamifikacja dodatkowa

### Prawo, zanim obiecasz nagrodę
- **Losowość = loteria promocyjna** (ustawa o grach hazardowych): zezwolenie dyrektora Izby Administracji Skarbowej, wniosek dwa miesiące wcześniej, gwarancja bankowa na pulę nagród, opłata 10% puli. Dotyczy to także losowania części nagród. Pytanie „na wiedzę” przed losowaniem nic nie zmienia.
- **„Kto pierwszy” jest ryzykowne:** sądy uznawały kolejność zgłoszeń za element losowy, bo zależy od sieci i urządzenia. „Pierwszych siedem osób, które przejdą bramy” da się bronić (wynik zależy od dedukcji i obecności), ale przy dostępie przez zakup książki organ może dopatrzyć się „nabycia towaru + nieprzewidywalnej kolejności”.
- **Bezpieczne konstrukcje:** (1) nagroda dla **wszystkich**, którzy spełnią warunek w oknie czasowym; (2) nagrody główne z **oceną jury** (konkurs z dziedziny kultury i sztuki); (3) rankingi oparte na mierzalnych umiejętnościach bez nagród pieniężnych; (4) nigdy „losujemy spośród”.
- **Podatek:** nagrody w konkursach z dziedziny kultury o wartości jednorazowej **do 2000 zł** są zwolnione z PIT. Powyżej: 10% od całości, organizator jako płatnik, PESEL-e laureatów. Trzymać każdą nagrodę poniżej 2000 zł.
- **RODO zgodnie z „gra nie zbiera danych”:** gra generuje pseudonimowy token po spełnieniu warunku, uczestnik zgłasza się osobiście (biblioteka, PTTK) albo mailem tylko w celu odbioru; dane laureata zbierane dopiero przy wydaniu nagrody, usuwane po 6 miesiącach, bez PESEL. Podstawa to regulamin, nie zgoda. Licencja niewyłączna na zgłoszenia, bez przeniesienia praw.
- **Udział bez zakupu** (książka w bibliotekach, kody dostępne w Miejskiej Bibliotece w Sandomierzu) dodatkowo osłabia przesłankę loterii.
- Przy puli nagród powyżej 10 tys. zł: wniosek do Ministra Finansów o rozstrzygnięcie charakteru gry (art. 2 ust. 6 u.g.h.).

### Konstrukcja konkursu (trzy etapy, zero losowości)
1. **Etap I (online):** zamknięcie siedmiu bram generuje token.
2. **Etap II (teren):** siedem potwierdzeń strażników w paszporcie bram.
3. **Etap III (twórczy):** „Protokół biegłego”: tekst do 1500 znaków albo nagranie do 90 s. Jury: autor, redaktor, przedstawiciel biblioteki lub PTTK. Kryteria: trafność dedukcji 40%, język 30%, związek z miejscem 30%.

### Trzy warianty nagród
| Wariant | Co | Koszt | Uwagi |
|---|---|---|---|
| A „Kamień” (7 szt.) | zawieszka z krzemienia pasiastego w srebrze z sandomierskiej pracowni + egzemplarz z dedykacją | 3–11 tys. zł (400–1500 zł/szt., cennik do ustalenia) | mieści się w zwolnieniu do 2000 zł; wymaga partnera-jubilera (patrz Łutowicz) |
| B „Noc w Sandomierzu” (3 szt.) | dwie doby dla dwóch osób w weekend Święta Młodego Wina + Paszport Enoturysty + rola w jubensha na „Zamknięciu Bramy” | 700–1000 zł/pakiet + wydarzenie 3–8 tys. zł | barter z hotelem realny |
| C „Rejestr biegłych” (dla wszystkich) | nazwisko lub pseudonim w drugim wydaniu + pieczęć + e-dyplom | ok. 0 zł + 2–3 zł/osobę | bez losowości, bez limitu, skaluje się |

Rekomendacja: **C dla wszystkich + A dla siedmiu najlepszych protokołów.** B jako wydarzenie, nie nagroda losowa.

### Gamifikacja dodatkowa w dorosłym tonie
- **Kohorta premierowa „Pierwszy tydzień”:** osobny numerowany wpis w Rejestrze dla tokenów z pierwszych 7 dni. Bez losowości, bez limitu.
- **Rejestr biegłych jako fizyczna księga** w Miejskiej Bibliotece (Sokolnickiego 6) lub PTTK (Rynek 12), prowadzona ręcznie; online lustrzana lista pseudonimów.
- **Paszport bram** wszyty w książkę, pieczątki u siedmiu strażników.
- **Lekcja dla szkół:** „1260 i 1287: źródła i mit” (Długosz kontra nowsze badania) dla klas 7–8 i liceum; zgłoszenie do kuratorium i do koordynatora DKK; terminy: Narodowe Czytanie, Tydzień Bibliotek.
- **Kalendarz premiery 2027:** premiera na Targach w Krakowie (ok. 21–24 października), „Noc Siedmiu Bram” w weekend Święta Młodego Wina (ok. 19–21 listopada: spacer z PTTK, czytanie w Lapidarium, jubensha dla 8 osób w bibliotece), zamknięcie sezonu I 24 grudnia (Wigilia odwrotu Telebugi, 740 lat), sezon II od 2 lutego 2028 (uzgodnić z dominikanami: to ich uroczystość liturgiczna).

---

## 7. Telefony 2026: co wykorzystać, co odpuścić

| Wykorzystać | Dlaczego |
|---|---|
| Tag NFC w zawieszce (URL z podpisem) | działa systemowo na iPhonie bez aplikacji, na Androidzie dodatkowo przez Web NFC (zapis postępu na tag: „pamięć zawieszki”) |
| Web Push w zainstalowanej PWA | listy jako powiadomienia; iOS 26 domyślnie otwiera dodane strony jako aplikacje |
| Screen Wake Lock | oddech, bezruch, kompas, widmo bez gaśnięcia ekranu (iOS w PWA od 18.4) |
| Audio Session API (iOS) | ton dolny gra przy wyciszonym telefonie; mikrofon z dźwiękiem jednocześnie |
| Wysokość z Geolocation `altitude` | iPhone daje wysokość z fuzji GPS i barometru: „wysokość wzgórza” jako mechanika; Android przez Open-Meteo Elevation |
| View Transitions, scroll-driven animations | przejścia między bramami jako „schodzenie w dół”, bez routera |
| Tętno z kamery (palec na obiektywie) + puls haptyczny | „zawieszka bije w rytm serca”: pionierskie w literaturze, trudność średnia |
| Fingerprint akustyczny dzwonu | rozpoznanie dzwonu Piotra z nagrania 10 s w przeglądarce, offline |

| Odpuścić | Dlaczego |
|---|---|
| WebXR, Web Bluetooth, Web NFC z JS na iOS | Apple blokuje od lat |
| Magnetometr, czujnik światła, barometr, zbliżeniowy | za flagami lub bez API |
| Web Speech do słowa-klucza | wymaga sieci, nie działa w PWA na iOS; offline tylko własny model KWS (dni pracy) |
| Aplikacja sklepowa jako produkt główny | tracimy „otwórz link i graj”; zysk tylko w tle i NFC-JS na iOS. Ewentualnie Capacitor + App Clip jako wejście na miejscu, gdy fabuła naprawdę tego potrzebuje |

**Poprawki do tego, co już jest (pilne):**
- Kompas iOS: `requestPermission()` musi być wywołane synchronicznie w handlerze gestu (nie po `await`); czytać `webkitCompassAccuracy` (−1 = niekalibrowany, powyżej 15° = „zrób ósemkę”); Android: `deviceorientationabsolute` z korektą o `screen.orientation.angle`; metalowe etui i sama zawieszka zakłócają igłę (można to wpisać w fabułę).
- Oddech: Safari historycznie ignoruje wyłączanie echa, tłumienia szumu i automatycznego wzmocnienia; po `getSettings()` sprawdzić, co faktycznie działa; pasmowy RMS 200–2000 Hz po filtrze górnoprzepustowym 80 Hz zamiast surowego RMS; wyłączone echo daje na iOS stereo mimo `channelCount: 1`.
- Ton: YIN lub MPM zamiast surowej autokorelacji (mniej błędów oktawowych).
- AudioContext po powrocie z tła na iOS: nie `resume()`, tylko zamknąć i utworzyć nowy z gestu.
- Vibration na Androidzie wymaga wcześniejszego gestu; pierwsze wywołanie bez dotknięcia jest ignorowane.
- WebGPU dla splatów: wykrywać `navigator.gpu` i iOS co najmniej 26.4 (wcześniej migotanie i crashe), zawsze z zapasem WebGL.
- Kroki liczą się tylko z telefonem w ręce i włączonym ekranem; w kieszeni JavaScript stoi. Projektować uczciwie.

---

## 8. Gdzie panele się nie zgadzają i co rekomenduję

1. **Fanfary odsłony.** Mistrzowie: wyciąć wszystko, trzy sekundy ciszy i zdanie. Ty prosiłeś o efekt dzień wcześniej. Rekomendacja: ciepło zostaje (to język zawieszki), iskry i toast znikają, przed zdaniem trzy sekundy ciemności. Jeden środek, nie cztery.
2. **Pieczątki na mikro-aktach.** Krytyk: kicz. Rekomendacja: zostawić. Archiwista stempluje dokumenty, to jest diegetyczne; kiczem byłyby gwiazdki.
3. **Gest jako bramka.** Audyt: usunąć z `passed()`. Mistrz escape: gest jest sercem. Oba mają rację: gest zostaje obowiązkowym rytuałem po sprawie (bez niego nie ma karty i odczytu), ale nie blokuje kolejnej sprawy.
4. **Luki z bankiem słów.** Mistrz dedukcji chce walidacji trójkami i jednego banku na sprawę. Panel trendów ostrzega, że recenzenci sequela Golden Idol zmęczyli się samym wstawianiem słów. Rekomendacja: luki na wnioski + zeszyt faktów + jedna sprawa typu „odrzuć fałszywy dokument” + jedna decyzja. Cztery typy, nie jeden.
5. **Trzy wyspy technologiczne (AR, miasto 3D, splaty).** Audyt: wyciąć. Ja: nie wyrzucać pracy, wynieść poza grę jako „laboratorium Fundacji” i wrócić, gdy fabuła (np. akt III, komora) będzie ich potrzebować.

---

## 9. Pierwsze pięć decyzji do podjęcia (tylko Ty)

1. **Łutowicz:** zgoda i cameo, czy zmiana nazwiska. Od tego zależy też wariant nagrody A.
2. **Gest jako rytuał, nie bramka.** Zgoda na zmianę `passed()`.
3. **Mapa 5/7 dopełnia, nie blokuje.** Zgoda na zmianę zasady.
4. **Lista przerywników schodzi z mapy.** Które z 20 zostają jako apokryfy (propozycja: rozmowy, widmo, kompas, lustro, świt, nucenie w południe), które idą do laboratorium (duet, gwizd, kroki, ślad), które znikają (trzy zdradzające akt III).
5. **Harmonogram:** czy sprawy 2–6 nadal mają wychodzić co dwa tygodnie od 26 listopada 2026, 11 miesięcy przed książką? Alternatywa: sprawa 1 jako publiczny prolog od teraz, sprawy 2–6 w tygodniach po premierze (wzorzec Dispatch: tygodniowe odcinki, 100% treści gotowe przed startem), sprawa 7 na „Noc Siedmiu Bram”.

Po tych decyzjach etap 0 rusza natychmiast i nie wymaga nikogo poza nami.
