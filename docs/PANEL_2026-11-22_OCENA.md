# Panel 22 XI 2026: ocena dwóch paczek „po panelach” i co dalej

Skład: redaktor prowadzący kryminałów, projektant gier dedukcyjnych, projektant rytuałów, ekspert UI/UX mobilnego, inżynier web (PWA, Workers), kognitywista pamięci, producent location-based jako czerwony zespół. Przeczytane: LISTA_ZADAN (v2) i jej recenzja, ARCHITEKTURA (sekcje końcowe), PANEL_2026-11_SYNTEZA (2, 3), DZIEN_PREMIERY, 25 ostatnich commitów, oraz kod: `src/ui/interludes.ts`, `src/ui/views.ts`, `src/ui/protokol.ts`, `src/ui/paszport.ts`, `src/engine/messages.ts`, `src/engine/unlock.ts`, `src/engine/pair.ts`, `src/engine/wspolny.ts`, `src/app.ts`, `src/main.ts`, `src/content/wiadomosci.json`, `src/content/interludia.json`, `src/content/cases/01–04`, `backend/src/index.ts`, `public/sw.js`, `scripts/rejestr-dnia.mjs`, `scripts/build-regulamin.mjs`, `docs/BACKEND.md`, `docs/REGULAMIN_KONKURSU.md`. Każda uwaga ma plik i linię. Nie zmieniono nic poza tym raportem.

Werdykt w jednym zdaniu: w jeden dzień weszło to, co lista v2 miała jako B30–B35, B39 i B40, i weszło porządnie; są jednak dwa złamania własnych zasad (kontrakt frustracji mówi „nic nie jest wysyłane”, a kod wysyła; obrzęd ziemi obiecuje drugi klucz, którego nie ma), jeden przeciek (kotwice czytają dokumenty zamknięte do świtu i południa) i kilkanaście drobiazgów, które da się sprzątnąć w jednej sesji.

---

## 1. Ocena pozycja po pozycji

### 1.1 Jeden gest wejścia (`enterGate`, interludes.ts 91–108)

Dobrze: siedem razy ten sam początek, próg z kontraktem (72–86), wibracja jedna, drugi klucz tej samej rangi („Bez odwracania: przytrzymaj”, 94), formuła otwarcia z `rite.opening`. Czas obrzędu liczony od „Wchodzę”, nie od czytania kontraktu (`riteStart` w 92), więc lejek mierzy obrzęd, nie lekturę.

Ryzyko techniczne (błąd): „trzy sekundy ekranem w dół” nie są trzema sekundami. Licznik `down` rośnie o 1 na każde zdarzenie `deviceorientation` (97: `down = ... ? down + 1 : 0`), a te przychodzą kilkadziesiąt razy na sekundę; warunek `down >= 6` (106) spełnia się po ułamku sekundy, a potem czeka tylko na najbliższy tik 500 ms. Trzy sekundy trzyma wyłącznie ścieżka przycisku (`held >= 7` po 500 ms). Rytuał na czujniku jest więc o rząd krótszy, niż mówi kontrakt.

Ryzyko UX: formuła otwarcia pokazuje się przez 1,4 s (103–104) w chwili, gdy telefon leży ekranem w dół. Nikt jej nie zobaczy; zobaczy już ciało obrzędu. Na iPhonie `deviceorientation` wymaga `requestPermission()` z gestu, który inne obrzędy wołają (504–505), a wejście nie, więc na iOS działa tylko przycisk; „Wchodzę” jest tym gestem i mogłoby zapytać.

Ryzyko zasad (najważniejsze): kontrakt mówi „Nic nie jest nagrywane ani wysyłane. Liczby liczą się w telefonie i znikają.” (83). Tymczasem po obrzędzie idzie do Workera zdarzenie `rite` z sekundami, godziną i flagą „na słowo” (157) i zdarzenie `gesture` (176); w bramie 3 co 30 s idzie `hum` (860); w bramie 7 lecą pozycje palców do pokoju (667). Nic z tego nie jest nagraniem i nic nie identyfikuje osoby, ale zdanie „ani wysyłane” jest nieprawdziwe, a kontrakt frustracji żyje z prawdy. Masterplan obiecuje tylko „nic nie jest nagrywane” (MASTERPLAN 16).

Poprawka jednym zdaniem: liczyć czas ekranem w dół z `performance.now()`, pokazać formułę dopiero po powrocie ekranu do góry (beta poniżej 30 stopni) i zmienić punkt kontraktu na „Nic nie jest nagrywane: dźwięk i obraz zostają w telefonie; serwer dowiaduje się tylko, że brama została przebyta, bez treści i bez osoby.”

### 1.2 Zero komunikatów porażki i drugi klucz w obrzędach

Dobrze: w zimnie drgnięcie łagodzi próg i daje fakturę („Drżysz. 33°C.”, 310), nie karę; w ciemności i ogniu jest przycisk zapasowy; „Brama drgnęła” po trzykrotności czasu (110–119) brzmi uczciwie.

Złamana obietnica: kontrakt ziemi mówi „bez żyroskopu: trzymany przycisk” (interludia.json, `ziemia.rite.body`), a `renderSteps` (748–766) ma tylko „Idę” i czujnik; bez czujnika gracz dostaje toast „Bez czujnika ruchu kroków nie policzę. Wróć na telefonie.” (761). To jest jedyny komunikat porażki w siedmiu obrzędach i stoi w najdłuższym z nich. Drugi klucz nie istnieje, choć kontrakt go ogłasza, a ARCHITEKTURA 96 pisze „Zero komunikatów porażki w obrzędach”.

W bramie 7 komunikat „Nie udało się połączyć z pokojem. Spróbuj jeszcze raz…” (643) jest komunikatem porażki w środku obrzędu; pokój pełny (409 z Workera, backend 114) wygląda dla gracza identycznie jak brak sieci.

Poprawka: dodać w `renderSteps` drugi klucz tej samej rangi (np. „777 dotknięć ekranu w marszu”, czas zbliżony do 777 kroków, bez czujnika) i zamienić toast na zdanie o drugiej drodze; w pokoju jedno zdanie bez „nie udało się”: „Pokój zajęty albo bez sieci. Zostańcie przy jednym telefonie.”

### 1.3 Słowo bramy palcem (`writeWord`, 135–147)

Dobrze: nic nie jest oceniane (liczy się długość kreski, 145), wibracja jedna, „Bez pisania” jako wyjście bez kary, `touch-action: none` w CSS (base.css 122), `setPointerCapture`. `finish()` jest wołane przed pisaniem (170), więc przerwanie w połowie nie odbiera bramy.

Ryzyko kognitywne: słowo stoi na ekranie wielką czcionką w trakcie pisania (137: `big-word`). Efekt wykonania, na który powołał się panel (06), dotyczy wytworzenia, nie przepisania; przepisanie z wzoru daje ułamek efektu. Gracz widział słowo na progu (76), więc ma skąd je wziąć.

Poprawka: w `writeWord` ukryć słowo, zostawić „Napisz słowo tej bramy” i cichy przycisk „pokaż” dla tych, którzy nie pamiętają; słowo wraca po zapisie geolożki (163).

### 1.4 Formularz przed aktami i wypełnione ustalenie (views.ts 308–313, 439–453)

Dobrze: pretesting zrobiony dosłownie (luki jako puste kreski przed dokumentami), `gapNotes` jako haczyk na „luka 3: z książki”, wypełnione ustalenie jako dokument z pieczęcią „Przyjęte do rejestru programu” (447), co list komisarza potem cytuje. Sprawdzono: w sprawach 1–4 liczba luk równa się liczbie `answerWords` (7/6/7/7), więc `answerWords![i]` nie trafi w `undefined`.

Błąd: po rozpoznaniu w tej samej sesji formularz nie znika. `lockAnswers()` chowa `grid` i usuwa nagłówek „Ustal” (452), ale `.doc.formularz` dodany w 310 zostaje; znika dopiero po ponownym wejściu, bo wtedy działa warunek `!solvedAlready` (308). Komentarz w 451 opisuje zachowanie, którego nie ma.

Treść: `gapNotes` nie ma w żadnej z czterech spraw (sprawdzono), więc mechanizm czeka na autora (B36). Redakcja: wypełnione ustalenie sprawy 4 kończy się „Biegły w tym rejestrze to ty.” w dokumencie, który sam o sobie mówi „Formularz programu”; to jedyne „ty” w głosie Fundacji i albo jest celowym pęknięciem (wtedy dobrze), albo wymaga „Biegły w tym rejestrze: {Pani|Pan}.”

Poprawka: w `lockAnswers()` dodać `sec.querySelector(".doc.formularz")?.remove()`.

### 1.5 Karta odpowiedzi w rozmowie z wykreślaniem (interludes.ts 216–244)

Dobrze: odrzucona opcja wykreślona i nieklikalna (221–222, CSS 280–281), karta mówi, co wskazano i ile zostało, stan trwa w `talkTries.x` (types.ts 102), `role="status"` dla czytników.

Ryzyko statystyczne: `choice` idzie do Workera przy każdym wskazaniu, także błędnym (223), a zdanie po trafieniu mówi „X% biegłych wskazało to samo zdanie” (228). To procent wskazań, nie biegłych; po dwóch błędach i trafieniu jeden gracz liczy się trzy razy.

Ton: blokada „Trzy razy wskazane na ślepo to nie rozmowa” (214) ocenia intencję; masterplan chce porażki czytelnej i przypisanej sobie, ale bez przymiotnika. 

Poprawka: wysyłać `choice` tylko przy wskazaniu kończącym (trafienie albo trzecia próba) i zmienić blokadę na „Trzy wskazania. Rozmowa wraca za N godzin; przeczytaj ją jeszcze raz.”

### 1.6 List komisarza z jednym zmienionym słowem i trzy odpowiedzi (wiadomosci.json 21–53, messages.ts 9–17)

Dobrze: zweryfikowano, że cytat w `w-ziel-cyt` (wiadomosci.json 26) to dokładnie wypełnione ustalenie sprawy 1 (cases/01 91, 121–123) z jedną zamianą „od spodu” na „od góry”, a oba słowa są w banku (99–100), więc fałsz jest wiarygodny. Trzy odpowiedzi i trzy ciągi dalsze są spójne tonem; `reply:ID:N` jako zdarzenie (messages.ts 16) jest czyste i przetestowane (tests/engine.test.ts 99). Formy `{ustaliła|ustalił}`, `{panią|pana}` poprawne.

Ryzyko fabularne 1: `w-ziel-cyt-c` mówi „Niech pani sprawdzi w zeszycie” (wiadomosci.json 52), a ustalenia w zeszycie nie ma: notatka po rozpoznaniu brzmi „Brama 4 rozpoznana: tytuł” (views.ts 589). Ustalenie leży w Aktach pod bramą.

Ryzyko fabularne 2: komisarz „przeczytał w rejestrze programu” (wiadomosci.json 26) już po sprawie 2, czyli ma dostęp do rejestru, który sprawa 4 odsłania jako „rejestr statusów zarządu” Fundacji (cases/04). To cicho rozstrzyga otwartą decyzję A1.13 „komisarz współwinny (7/G)” na „wie”. Dobre przedszkole do zwrotu w sprawie 4, ale autor musi to potwierdzić, zanim pójdzie dalej.

Ryzyko techniczne: cytat jest tekstem statycznym; każda późniejsza zmiana `answerWords` sprawy 1 (A1, redakcja marca) rozjedzie list bez ostrzeżenia.

Poprawka: test w vitest „cytat w w-ziel-cyt równa się wypełnionemu ustaleniu sprawy 1 z dokładnie jednym słowem z banku zamienionym” oraz zapis wypełnionego ustalenia do zeszytu przy `markSolved` (albo „sprawdzi w aktach”).

### 1.7 Pierwszy odczyt z archiwum natychmiast (app.ts 54–63)

Dobrze: łańcuch daru zaczyna się od daru; `reading_back` idzie tylko za odczyt od człowieka (views.ts 262), więc miara „odczyt społeczny” z kill-switcha tygodnia 6 nie jest zawyżona przez archiwum.

Błąd: „natychmiast” znaczy „po następnym pełnym załadowaniu strony”. `archiveFallback()` jest wołane tylko w konstruktorze (49) i nigdzie po rozwiązaniu sprawy. Gracz rozpoznaje sprawę na milczącym wzgórzu, wraca na mapę i nic; odczyt pojawi się, gdy zamknie i otworzy aplikację. Ramka „Zawieszka milczy” (views.ts 208) nadal obiecuje „w trzy doby”, co dla pierwszego odczytu jest nieprawdą.

Poprawka: wywołać `app.archiveFallback()` w `renderSolution` po `markSolved`/`solved` i uzależnić zdanie w ramce od `Object.keys(readings).length`.

### 1.8 Kotwice słów (views.ts 833–863)

Dobrze: wiążą dokumenty bez dopisywania treści, tylko bramy odblokowane, najwyżej 5 trafień, link prowadzi do bramy; pomysł z dobrego rocznika (Obra Dinn: te same przedmioty w wielu scenach).

Przeciek: `anchored()` przeszukuje `visibleDocs()` (850), które filtruje tylko `requiresPlace` (293–295), a `docEl` chowa treść `requiresNoon` i `requiresDawn` dopiero przy renderze (272–280). Dotknięcie „gołąb” o 15:00 pokaże fragment dokumentu o świcie (do 100 znaków, 854). Zasada „dokument o świcie czyta się o świcie” pada.

Precyzja: `stem()` bierze pięć znaków (839). „siedem punktów” daje „siede” i trafia „siedemset siedemdziesiąt siedem”; „nie tędy” daje „nie t” i trafia „nie tylko”, „nie trzeba”; „koperta” daje „koper”. „zawieszka” jako kotwica trafi niemal każdy dokument. Lista kotwic jest w kodzie, nie w treści (837), więc autor jej nie zmieni bez sesji.

Poprawka: pomijać dokumenty z `requiresDawn`/`requiresNoon`, gdy nie są teraz czytelne, zastąpić `stem()` jawną mapą „słowo → rdzeń” w JSON (`config.json` albo `map.json`) i wyrzucić „zawieszka”.

### 1.9 Protokół biegłego (protokol.ts)

Dobrze: głos archiwisty, bez ocen i porównań, milczące wzgórza, korespondencja, pora pracy, jedna linia o liczbie biegłych (42) zgodnie z decyzją autora; „Protokół sporządza urządzenie. Program nie przechowuje jego kopii.” (43) to dobre zdanie.

Sprzeczność: „Dane nie opuściły urządzenia.” (18) stoi obok faktu, że `start`, `solved`, `gesture`, `rite`, `choice`, `reply`, `reading_back`, `pwa` idą do Workera. Prawda jest węższa: ten dokument nie opuścił urządzenia.

Gramatyka: `tries < 5 ? "próby" : "prób"` (27) da „22 prób”; `notes.length < 5 ? "zapiski" : "zapisków"` (39) da „22 zapisków”; w views.ts jest `plural()` (161), który to robi dobrze. „Pora pracy” liczy też notatki automatyczne (dziennik miasta, archiwum), które powstają przy otwarciu mapy, nie przy pracy.

Błąd stanu: `expertCode(s.seed, s.finaleAt ?? Date.now())` (40; tak samo views.ts 676 i paszport.ts 28). Dla zapisu, w którym `leftSeventhEmpty` jest, a `finaleAt` nie (stare zapisy, kod KONIEC), kod biegłego zmienia się co dobę; „Jedno zgłoszenie na kod biegłego” z regulaminu § 5.2 przestaje działać.

Poprawka: raz dopisać `finaleAt ??= Date.now()` z `save()` przy odczycie, użyć `plural()` i zmienić zdanie 18 na „Ten dokument nie opuścił urządzenia.”

### 1.10 Pieczęć biegłego i paszport do druku (paszport.ts)

Dobrze: siedem pól z datą i miejscem na pieczęć, `@media print` (base.css 149), zasada „zdjęcie paszportu liczy się jak pieczęć” napisana na arkuszu (paszport.ts 16), czego wymaga regulamin § 3.2 („w paszporcie jest to napisane wprost”), bez danych osobowych (paszport.ts 29).

Ryzyko prawne i relacyjne: arkusz drukuje „Pieczęć zastępcza: Miejska Biblioteka Publiczna w Sandomierzu.” (paszport.ts 16). Regulamin trzyma tę nazwę w nawiasach kwadratowych (REGULAMIN 15), paszport nie; rozmowa z biblioteką ma być do 30 XI (LISTA D77) i jeszcze jej nie było. Publiczna strona nazywa realną instytucję stroną umowy, której nie ma.

Ryzyko prawne 2: kohorta „Pierwszy tydzień” (REGULAMIN § 4.1) jest liczona z daty w kodzie biegłego, a tę datę daje zegar telefonu (pair.ts 31–34). ARCHITEKTURA nazywa to uczciwie „zamkiem na pamiętnik”, ale regulamin powinien mówić, że o kohorcie decyduje data okazania albo wpływu zgłoszenia, nie data w kodzie, dopóki Worker nie podpisuje (B37).

Poprawka: w paszporcie „[pieczęć zastępcza: patrz regulamin]” do czasu zgody biblioteki i jedno zdanie w § 4.1 o dacie wpływu.

### 1.11 Dziennik miasta (views.ts 98–104, 827–830)

Dobrze: jedno zdanie na tydzień, numer tygodnia ISO policzony poprawnie, dane prawdziwe, zapis lokalny; zdanie zamykające („Zapisano, bo miasto było, zanim ktokolwiek je przeczytał”) jest w głosie gry.

Wyścig: `cityWeeks.push(wk)` następuje po rozwiązaniu `Promise.all` (101), więc dwa szybkie wejścia na mapę przed odpowiedzią IMGW dają dwa wpisy w tym samym tygodniu.

Głos: zeszyt nazywa się zeszytem geolożki (interludes 163), a wpisy miasta i archiwum pisze archiwista programu; redakcja powinna ustalić, czyją ręką jest zeszyt, zanim przybędzie wpisów automatycznych.

Prawo (drobne): pogoda i Wisła to zapytania do obcych serwisów z adresem IP gracza; zdanie dla książki „gra nie zbiera danych” powinno brzmieć „gra nie zbiera danych osobowych; pogodę i stan Wisły pobiera z publicznych serwisów”.

Poprawka: wpisać `wk` do `cityWeeks` przed `fetch`, a cofnąć, gdy obie odpowiedzi są puste.

### 1.12 Pokój dwóch telefonów (interludes.ts 630–671, backend 110–129)

Dobrze: Durable Object z hibernacją (nic nie kosztuje czekanie), dwa gniazda, trzecie odrzucone, 2 KB na wiadomość, nic nie zapisywane, pozycje palców w ułamkach ekranu bez identyfikatorów (667), sekcja widoczna tylko z adresem serwera (633), kod pokoju spójny po obu stronach (klient 4–6, Worker 4–8). To jest dobrze zrobiony minimalny kanał.

Forma: „wpisz kod, który dostałeś” (635) to rodzaj męski w drugiej osobie, wbrew zasadzie z ARCHITEKTURA 73.

Technika: `held += 1/60` (670) zakłada 60 klatek; na telefonie 120 Hz trzy sekundy trwają półtorej, na przeciążonym 30 Hz sześć. Komunikat błędu w obrzędzie (643) omówiony w 1.2. Pokój otwiera każdy, kto zgadnie pięć znaków; dostaje tylko kropki, więc szkody nie ma, ale warto o tym wiedzieć.

Nieprzetestowane na dwóch fizycznych telefonach (LISTA 0, wiersz 11), i lista mówi to uczciwie.

Poprawka: liczyć trzy sekundy z `performance.now()`, przepisać 635 na „kod od drugiej osoby”, a kontrakt bramy 7 uzupełnić o zdanie „do drugiego telefonu idą tylko położenia palców”.

### 1.13 Zdarzenia lejka (wspolny.ts, main.ts 30–32, interludes 157, views 262, backend 58–80)

Dobrze: agregaty bez identyfikatorów w `rites` (histogram godzin, suma sekund, „na słowo”), `seen` zapobiega podwójnemu liczeniu, `pwa` raz na urządzenie, `reading_back` tylko za odczyt od człowieka. To są dokładnie miary z MASTERPLAN 193 poza jedną.

Brak: „czy gracz czytał część przed sprawą” (MASTERPLAN 193, LISTA B32) nie jest mierzone; `solved` nie mówi, czy sprawę otworzył kod z książki, kalendarz czy QR. ARCHITEKTURA 99 raportuje B32 jako zrobione bez tej miary.

Dokumentacja: BACKEND.md 26 mówi „`solved` i `gesture` … `hum`. Nic więcej.”, a strona wysyła także `start`, `pwa`, `rite`, `reading_back`. Dokument, który obiecuje „nic więcej”, nie może być nieaktualny.

Skala: `seen` to jeden obiekt JSON czytany i zapisywany przy każdym zdarzeniu (49, 78). Aktywny gracz zostawia około 40 kluczy po około 35 bajtów; przy klasie na SQLite (wrangler.toml, `new_sqlite_classes`) limit jednej wartości to 2 MiB, czyli około 1400 graczy, ale już przy 400–700 z lejka każde zdarzenie przepisuje pół megabajta. Nie pali się dziś, spali się w tygodniu 6.

Prawo: `counts.players[who] = now` (61) trzyma na stałe znacznik czasu per pseudonim urządzenia. Skrót losowego ziarna nie jest danymi osobowymi, ale zdania „gra nie zbiera danych” (klauzula D88), „Dane nie opuściły urządzenia” (protokół) i „ani wysyłane” (kontrakt) trzeba sprowadzić do jednej, prawdziwej formuły we wszystkich czterech miejscach.

Poprawka: `seen` jako osobne klucze `storage.put(key, 1)` zamiast jednej mapy, `solved` z polem `via: code|time|qr`, i jeden akapit „Co strona wysyła” wspólny dla BACKEND.md, kontraktu i protokołu.

### 1.14 Kalendarz względny (unlock.ts 23–32, config.json)

Dobrze: jedna data, offsety w dniach, godzina z `releaseHours`, pełna data w `releases` nadpisuje offset, klucz `note` odfiltrowany regexem (unlock.ts 28). Sprawa 7 w dniu 36 o 12:00 wypada w sobotę 20 XI 2027, czyli w Noc, zgodnie z masterplanem.

Niespójność: `premiereDate` to 15 X 2027 (config 3), a MASTERPLAN 167 mówi „8–10 października, Targi 21–24”. Jedna z tych dat jest nieaktualna; dziś jeden parametr robi dobrze swoją robotę, ale wskazuje na inny dzień niż plan.

Dwa kalendarze zostały: `timeline.chapterOffsets` (ujemne, dla rozdziałów) i `releaseOffsets` (dla spraw). „Przesunięcie premiery to jedna data” jest prawdą dla obu, bo oba liczą od `premiereDate`; warto to zapisać w ARCHITEKTURA 98 wprost.

Poprawka: uzgodnić datę w config z masterplanem (albo odwrotnie) i dopisać w ARCHITEKTURA, że rozdziały też liczą od tej samej daty.

### 1.15 Regulamin w grze (build-regulamin.mjs, views.ts 684, public/regulamin)

Dobrze: zero zależności, `noindex`, tryb ciemny, link powrotny `../#/akta` działa na ścieżce GitHub Pages, stopka „Wersja robocza” z nawiasami.

Ryzyko procesowe: skrypt jest ręczny (ARCHITEKTURA 101), nie ma go w `npm run build` (package.json, scripts), więc `public/regulamin/index.html` i `docs/REGULAMIN_KONKURSU.md` będą się rozjeżdżać.

Ryzyko prawne: link „Regulamin konkursu (wersja robocza)” widzi każdy gracz publicznej strony, zanim prawnik go przeczytał (REGULAMIN 69) i zanim biblioteka zgodziła się być punktem zgłoszeń; zależność 4 z listy mówi „prawnik → regulamin w grze”. Do playtestów wystarczy, do publiki nie.

Konwerter nie zna linków, kursywy i list zagnieżdżonych (build-regulamin.mjs 7–20); dziś regulamin ich nie używa, ale pierwszy użyty zostanie wypisany na surowo.

Poprawka: `"prebuild": "node scripts/build-regulamin.mjs"` w package.json i pokazanie linku tylko w `testMode` do czasu opinii prawnika.

### 1.16 Procedura dnia premiery (DZIEN_PREMIERY.md, rejestr-dnia.mjs)

Dobrze: ścieżka awaryjna przez `public/live/rejestr.json` i `git push`, service worker nie trzyma `live/` (sw.js 15), zdanie na wyciek, tabela kill-switchy zgodna z masterplanem, „Odczyty milczących wzgórz nie zależą od serwera” prawdziwe (app.ts 54–63).

Błąd (przeciek): `hours.filter(h => h <= hourArg).pop() ?? hours[0]` (rejestr-dnia.mjs 17). Uruchomiony o 9:00, gdy pierwszy wiersz harmonogramu jest na 12:00, skrypt opublikuje wiersze południa trzy godziny przed południem, i do Workera, i do pliku zapasowego.

Niespójności: Worker przyjmuje najwyżej 12 wierszy (backend 96), a LISTA C57 przewiduje 24 w wersji komfortowej; Worker ignoruje `notices` (94–96), więc komunikaty zarządu dla strony Fundacji (fundacja/index.html 69) idą wyłącznie przez plik zapasowy i `git push`, czego procedura nie mówi.

Poprawka: gdy żadna godzina harmonogramu nie jest mniejsza lub równa bieżącej, wysłać `active: false`; podnieść limit do 24 i przyjmować `notices` w PUT; dopisać w procedurze, że komunikaty Fundacji idą przez plik.

### 1.17 Drobne, zbiorczo

- `addressPrompt` (views.ts 35): „Nic poza tym nie zapisujemy” jest prawdą o pytaniu, nie o zapisie; lepiej „O nic więcej nie pytamy”.
- `sw.js` 8: wszystko spoza własnej domeny z sieci, więc MapLibre i Three z CDN nie działają offline; to laboratoria, więc dobrze, ale README powinno to mówić przy „offline”.
- `reveal()` 150: ukrywa `p.faint` w całym ekranie; ramka pokoju (`roomBox`) ma `p.muted`, więc zostaje; dobrze, ale lista selektorów rośnie i w końcu coś ukryje przez przypadek. Lepszy jeden atrybut `data-hide-on-reveal`.
- PLAYTEST.md (32 wiersze) nie zna formularza przed aktami, gestu wejścia, karty odpowiedzi ani pokoju; Playtest 1 w styczniu będzie testował mechaniki, których protokół nie wymienia.

---

## 2. Co dalej

### 2.1 Dziesięć następnych kroków dla AI, w kolejności wpływu

1. **Prawda kontraktu i drugi klucz ziemi.** Przepisać punkt „nic nie jest wysyłane” w kontrakcie na zdanie prawdziwe, dopisać do bramy 7 zdanie o położeniach palców i dać `renderSteps` drugi klucz tej samej rangi bez toastu. To usuwa jedyny komunikat porażki i jedyne nieprawdziwe zdanie w siedmiu obrzędach. AI 3 h, autor 1 h (ziemia bez czujnika na jednym telefonie, kontrakt na trzech).
2. **Gest wejścia zgodny z własnym opisem.** Trzy sekundy ekranem w dół liczone czasem, formuła otwarcia po odwróceniu telefonu, `requestPermission` z „Wchodzę” na iOS, czas trzymania pokoju z zegara zamiast klatek. Bez tego rytuał na czujniku trwa ułamek sekundy, a formuły nikt nie czyta. AI 2 h, autor 1 h (Redmi, Huawei, iPhone, po dwie bramy).
3. **Kotwice bez przecieku.** Pominąć dokumenty o świcie i w południe, gdy nie są teraz czytelne, zastąpić pięcioznakowy rdzeń mapą słów w JSON, usunąć „zawieszka”. Przeciek jest dziś realny w sprawie 1 (Dokument VI). AI 2 h, autor 0,5 h (dotknąć dziesięciu kotwic w sprawach 1–4).
4. **Sprzątanie stanu i formularza.** `archiveFallback()` po rozwiązaniu sprawy i prawdziwe zdanie w ramce milczenia; usunięcie formularza w `lockAnswers`; `cityWeeks` przed `fetch`; `finaleAt` dopisany raz; `plural()` w protokole; „Ten dokument nie opuścił urządzenia”. Sześć drobiazgów, każdy widoczny dla gracza. AI 3 h, autor 1 h (jedna sprawa od zera na milczącym wzgórzu w trybie biegłego).
5. **Test spójności listu komisarza.** Vitest sprawdzający, że cytat w `w-ziel-cyt` to wypełnione ustalenie sprawy 1 z dokładnie jednym słowem z banku zamienionym; zapis wypełnionego ustalenia do zeszytu przy rozpoznaniu, żeby „sprawdź w zeszycie” było prawdą. Redakcja marca zmieni słowa, test to złapie. AI 1,5 h, autor 0,5 h (przeczytać trzy ciągi dalsze z decyzją A1.13 w głowie).
6. **Worker na sezon.** `seen` jako osobne klucze, `notices` i 24 wiersze w PUT, `solved` z `via`, skrypt rejestru bez publikacji przed pierwszą godziną, BACKEND.md z pełną listą zdarzeń. Jedno `wrangler deploy` po stronie autora. AI 3 h, autor 0,5 h (`wrangler deploy`, jeden `PUT` z harmonogramem próbnym, `curl /stats`).
7. **Paszport i regulamin po stronie prawa.** Nawias zamiast nazwy biblioteki na arkuszu, zdanie o dacie wpływu w § 4.1, `prebuild` dla regulaminu, link do regulaminu tylko w trybie biegłego do opinii prawnika. Nic z nazwami instytucji nie wychodzi publicznie przed zgodą. AI 2 h, autor 1 h (wydruk A4 z Androida i z iPhone’a, zdjęcie zamiast pieczęci na próbę).
8. **Strona liczb dla autora.** Jedna statyczna strona (`public/liczby/` albo w Ustawieniach za kodem) czytająca `/stats`: gracze, bramy, obrzędy z czasem i „na słowo”, instalacje, odczyty odwzajemnione, siódma pozycja, w układzie tabeli kill-switchy z tygodni 2, 6 i 12. Bez wykresów, same liczby i progi. AI 4 h, autor 1 h (porównać z liczbami z `curl`).
9. **Słowo bramy z pamięci.** Ukryć słowo podczas pisania, dać cichy „pokaż”, zwrócić słowo w zapisie geolożki. Efekt wykonania bierze się z wytworzenia, nie z przepisania. AI 1 h, autor 1 h (siedem słów na jednym telefonie, zapisać, które pamiętał po dniu).
10. **PLAYTEST.md na stan dzisiejszy.** Punkty kontrolne dla formularza przed aktami, gestu wejścia, karty odpowiedzi, pokoju dwóch telefonów i paszportu; TS-SF i CORGIS z B44; lista pytań po sesji w kolejności ekranów. Styczniowy Playtest 1 nie może testować listopadowej listy. AI 2 h, autor 0,5 h (czytanie).

Razem: AI około 24 h sesji, autor około 8 h testów. To jedna, najwyżej dwie paczki, i dopiero po nich następne pomysły.

### 2.2 Pięć rzeczy dla autora w najbliższym tygodniu

1. **Telefon do Miejskiej Biblioteki Publicznej do 30 XI** (kill-switch z listy): wniosek do programów Ministra na 2027, a przy okazji dwa pytania „czy biblioteka zgodzi się być pieczęcią zastępczą i punktem zgłoszeń”; od odpowiedzi zależy, czy nawias w paszporcie i regulaminie znika.
2. **Dwie godziny z telefonami na dzisiejszym buildzie**: gest wejścia obiema drogami, słowo palcem, jedna rozmowa z błędnym wskazaniem, paszport do druku, pokój dwóch telefonów na dwóch fizycznych aparatach (Android z Androidem wystarczy). Dziesięć linijek notatek, nie więcej.
3. **Dwie decyzje kanoniczne, które kod już podjął za Ciebie**: A1.13 „komisarz zna rejestr programu” (list `w-ziel-cyt` to zakłada) i A1.11 słowa bram „dwa stopnie”, „punkt szósty”, „pięć”, „nie tędy” (od dziś gracz pisze je palcem, więc trudno je później zmienić bez wrażenia błędu).
4. **`npx wrangler deploy` po kroku 6 i jeden test `PUT /rejestr`** z harmonogramem próbnym (`--hour 12`), żeby D72 przestało być założeniem; zajmuje kwadrans.
5. **Kopia `content-prywatne/` poza gitem (A26) i dziesięć nazwisk do Playtestu 1 (A28)** zapisane w jednym pliku: trzy spoza Sandomierza, dwie osoby powyżej 60 lat, dwie 16–22, trzy iPhone’y. Grudzień decyduje o styczniu.

---

## 3. Czerwony zespół: trzy rzeczy, których nie robić w następnej kolejce

1. **Nie zaczynać napisów biegłych ani magazynu per brama w Workerze (B46).** To dwa dni kodu, nowa powierzchnia społeczna i pierwszy licznik przy bramie, a masterplan mówi, że przy 30–150 graczach każdy licznik staje się rankingiem. Lejek nie ma jeszcze ani jednego prawdziwego gracza; najpierw Playtest 1 pokaże, czy ludzie w ogóle dochodzą do bramy, potem można myśleć, co przy niej zostawić.

2. **Nie dodawać kolejnych wariantów obrzędu** (szept słowa do mikrofonu, oddech z Wisły, echo bram, ósmy gest wejścia „dla iPhone’a”). Siedem gestów ma teraz jeden początek i jedno zakończenie; każdy wariant to nowy czujnik, nowy komunikat i nowy punkt, w którym „nic nie jest nagrywane” przestaje być prawdą. Do Playtestu 1 szkielet obrzędu ma być zamrożony, żeby styczeń testował rytuał, nie jego dwunastą wersję.

3. **Nie ruszać tekstów spraw 1–4 ani nie pieczętować ponownie 5–7 przed decyzjami A1, i nie drukować ani nie publikować niczego z nazwą instytucji lub adresem** (paszport z biblioteką, naklejki, QR, regulamin poza trybem biegłego). Zależności 3, 4 i 7 z listy mówią to wprost: tekst zmieniony przed decyzjami będzie zmieniany dwa razy, a druk przed domeną i zgodą lokali to druk do kosza. Dzisiejszy paszport już nazywa bibliotekę stroną umowy, której nie ma; to pierwsze, co trzeba cofnąć, a nie pogłębiać.
