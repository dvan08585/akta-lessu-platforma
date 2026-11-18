# Panel 03: Technologie (gaussian splatting, dźwięk miejsca, audio AR, NFC, czujniki, wdrożenia w Polsce)

Stan na 18 listopada 2026. Panel: inżynier grafiki 3D i fotogrametrii, badacz audio AR i rozpoznawania dźwięku, specjalista od dziedzictwa cyfrowego. Odbiorca: autor „Siedmiu Bram Lessu” i gry „Akta Lessu” (Vite + TypeScript, GitHub Pages, bez aplikacji natywnej, jedna osoba, budżet do ok. 20 tys. zł, premiera jesień 2027).

## 0. Metoda, źródła i zastrzeżenia

- Przeczytaliśmy stan repo: `docs/ARCHITEKTURA.md`, `docs/KATALOG_MECHANIK.md`, `public/skan/index.html` (gsplat.js, wczytywanie `.splat`/`.ply` z pliku, symulacja komnaty 55 tys. splatów, 32 bajty na splat), `public/komnata/index.html` (ręczna komnata w three.js, tekstury proceduralne, żyroskop, chodzenie), `public/miasto/index.html` (MapLibre + OpenFreeMap + teren Terrarium, siedem bram, GPS i kompas, zawieszka grzeje), `src/ui/interludes.ts` (mikrofon: RMS i detekcja wysokości, spektrogram z `AnalyserNode`, `devicemotion`/`deviceorientation` z `requestPermission` na iOS, `navigator.vibrate` wszędzie w try/catch, kompas z `webkitCompassHeading`, siedem palców, kwinta). Wnioski poniżej odnoszą się do tych plików.
- Sprawdzaliśmy fakty w sieci (wyszukiwarka + bezpośrednie pobranie stron). Ograniczenie tej sesji: część hostów była niedostępna do bezpośredniego pobrania (sparkjs.dev, scaniverse.com, developer.playcanvas.com, developer.mozilla.org, caniuse.com, 0110.be, developer.chrome.com, radiokrakow.pl, dzieje.pl i inne); dla nich opieramy się na streszczeniach z wyszukiwarki i na kopiach w GitHubie. Takie miejsca oznaczamy „[wg wyszukiwarki]”. Budżet wyszukiwań wyczerpał się przed częścią (c) i (f); braki wskazujemy wprost, zamiast je zgadywać.
- Każde znalezisko ma pięć punktów: (1) co to jest, (2) co działa w przeglądarce na średnim Androidzie i na iPhonie, z liczbami, (3) jak to wpiąć w naszą grę, (4) koszt i ryzyko, (5) pionierskość.
- Zasady gry, które trzymamy przez cały raport: zero backendu, zero zbierania danych (wszystko liczy się w telefonie), siedem gestów na całą grę, sensor zawsze diegetyczny, zawsze z wejściem zapasowym.

---

## A. Gaussian splatting w dziedzictwie i turystyce

### A.0 Liczby, które porządkują całą sekcję

| Format | Bajty na splat (orientacyjnie) | 1 mln splatów | Źródło |
|---|---|---|---|
| PLY (INRIA, z harmonikami sferycznymi st. 3) | ok. 248 B | ok. 250 MB | Niantic: „25 MB vs 250 MB” dla bogatej sceny, https://scaniverse.com/spz [wg wyszukiwarki] |
| `.splat` (antimatter15, bez SH; to format naszego `skan/`) | 32 B | 32 MB | nasz kod `public/skan/index.html` (pozycja 3×f32, skala 3×f32, RGBA 4×u8, kwaternion 4×u8) |
| `.ksplat` (GaussianSplats3D, poziom 2) | ok. 31% PLY | ok. 72 MB | https://github.com/mkkellogg/GaussianSplats3D (projekt ogłoszony jako nierozwijany, odsyła do Spark) |
| `.spz` (Niantic, MIT) | ok. 10× mniej niż PLY, czyli ok. 25 B | ok. 25 MB | https://github.com/nianticlabs/spz (pozycje 24-bit, skale 8-bit log, rotacje 3×10 bit, SH 8-bit; wersja 4 nagłówka, 32 B) |
| SOG / Streamed SOG (PlayCanvas, MIT) | 15-20× mniej niż PLY, czyli ok. 12-16 B | ok. 12-16 MB | https://blog.playcanvas.com/playcanvas-open-sources-sog-format-for-gaussian-splatting/ ; narzędzie https://github.com/playcanvas/splat-transform (wejście: PLY, SPZ, KSPLAT, SPLAT, SOG; wyjście: SOG, Streamed SOG z LOD, SPZ, GLB) |

Budżety renderowania w telefonie wg dokumentacji Spark (`docs/performance.md` w https://github.com/sparkjsdev/spark, odczyt 18 XI 2026): **Android: 1-2 mln splatów, iPhone: 1-3 mln, Quest 3: do 1 mln, komputer: 1-5 mln**. Dodatkowo: wyłączyć `antialias`, nie podnosić `pixelRatio` bez potrzeby, unikać skupienia wielu splatów na małym obszarze ekranu (wąskie gardło to blending, nie liczba). Spark 2.x ma stały budżet splatów i strumieniowanie z poziomami szczegółowości; w opisach prasowych pojawia się „ok. 500 tys. na mobile” jako budżet strumienia [wg wyszukiwarki: https://www.besthub.dev/articles/how-spark-2-0-brings-billion-point-3d-worlds-to-mobile-browsers-3b8fc248a275].

Wniosek praktyczny dla nas: **scena 300-600 tys. splatów, zapisana jako SPZ (8-15 MB) albo SOG (4-10 MB), to bezpieczny cel na średni Android przez sieć komórkową.** Nasz README w `public/sceny/` zakłada „10-40 MB”; górna granica jest za wysoka na komórkę w Sandomierzu, dolna w porządku.

### A.1 Scaniverse (Niantic Spatial) i format SPZ

1. **Co to.** Darmowa aplikacja skanująca (iOS i Android) z treningiem splatów na urządzeniu, eksportem do PLY/SPLAT/SPZ i opcjonalnym (nie obowiązkowym) wysłaniem na globalną mapę splatów, która zasila VPS Niantica. Mapa liczy ponad 50 tys. lokalizacji i jest przeglądalna w WebXR na Quest („Into the Scaniverse”). Źródła: https://scaniverse.com/news/spz-gaussian-splat-open-source-file-format ; https://nianticlabs.com/news/the-scaniverse-expands ; https://radiancefields.com/niantic-releases-major-scaniverse-update ; https://voicesofvr.com/?p=14813 [wg wyszukiwarki]. SPZ: MIT, biblioteka C++, Python i TypeScript/WASM, konwerter w przeglądarce: https://github.com/nianticlabs/spz.
2. **Przeglądarka.** Plik SPZ czyta Spark (three.js) i splat-transform; nasz `skan/` na gsplat.js czyta `.splat` i `.ply`, SPZ trzeba by skonwertować (splat-transform) albo przejść na Spark, który ARCHITEKTURA.md już przewiduje dla `sceny/`. Android średni: 1-2 mln splatów płynnie; iPhone: do 3 mln. Pobranie 1 mln splatów w SPZ to ok. 25 MB; w SOG 12-16 MB.
3. **Wpięcie.** Dokument sprawy typu „skan miejsca” (`docs[].requiresPlace` w trybie na miejscu albo dostępny w domu): gracz wczytuje `sceny/rynek.spz` i szuka w skanie detalu, którego nie ma na zdjęciu w aktach (np. siedmiobok w bruku przy studni). Rejestracja: nagrania 45-90 s z README spraw do zrobienia w Scaniverse na miejscu; eksport SPZ; konwersja do SOG w `splat-transform` z LOD, jeśli scena przekroczy 600 tys.
4. **Koszt i ryzyko.** Koszt zerowy (aplikacja darmowa, SPZ i narzędzia MIT). Ryzyko: wysyłanie na mapę Niantica jest opcją, dla gry **nie wysyłać** (prywatność i prawa do wizerunku przechodniów). Prawa: skan przestrzeni publicznej Sandomierza jest legalny; unikać ludzi w kadrze (README już to ma). Zasięg w piwnicach: skan robi się offline, odtwarza offline po pierwszym pobraniu (nasz `sw.js` buforuje zasoby z hashem; dla scen trzeba dodać regułę „cache-first po pierwszym wczytaniu”). Bateria: trening na telefonie to 5-15 min na skan, robić z pełną baterią.
5. **Pionierskość.** Splaty w muzeach to 2025-2026 (poniżej A.9); splaty jako **dokumenty w grze dedukcyjnej**, czytane offline w zwykłej przeglądarce, bez aplikacji, nie znaleźliśmy. To jest nasz margines.

### A.2 Polycam

1. **Co to.** Skaner iOS/Android/web, splaty w chmurze. Plan darmowy nie obejmuje splatów; splaty od planu Basic; 300 zdjęć na skan w Basic, 1000 w Business [wg wyszukiwarki: https://developer.playcanvas.com/user-manual/gaussian-splatting/creating/recommended-tools/]. Eksport „Splat PLY” (zwykły PLY to chmura punktów, nie splat). Źródła: https://radiancefields.com/polycam-adds-gaussian-splatting ; https://learn.poly.cam/new-gaussian-splatting.
2. **Przeglądarka.** Jak A.1 (to tylko źródło pliku PLY; dalej splat-transform do SPZ/SOG).
3. **Wpięcie.** Alternatywa, gdy Scaniverse zawodzi na danym telefonie; przewaga: lepsza jakość z trybu zdjęć i tryb LiDAR na iPhonie Pro do pomiarów (np. szerokość Ucha Igielnego jako dana w sprawie).
4. **Koszt i ryzyko.** Subskrypcja (rząd 100-200 zł/mies. w planach płatnych; sprawdzić aktualny cennik). Ryzyko: przetwarzanie w chmurze = nagranie opuszcza telefon (dla autora to w porządku, dla graczy nie proponujemy skanowania).
5. **Pionierskość.** Brak; narzędzie.

### A.3 Luma AI

1. **Co to.** Pionier NeRF/splatów w telefonie; firma przeszła na generatywne wideo. Aplikacja Android zniknęła ze sklepu, iOS bez rozwoju; „Flythroughs” wyłączane 1 I 2026, „Interactive Scenes” wg komunikatu pozostają dostępne [wg wyszukiwarki: https://radiancefields.com/luma-ai-to-sunset-flythroughs-on-january-1-2026 ; https://scaniverse.com/news/creating-splats-which-app-to-choose].
2. **Przeglądarka.** Osadzenie sceny z Luma w iframe to zależność od serwera firmy, która zmieniła profil.
3. **Wpięcie.** Nie wpinać. Jeśli autor ma stare skany Luma, wyeksportować PLY i trzymać u siebie.
4. **Ryzyko.** Wysokie ryzyko zniknięcia usługi. Lekcja ogólna: **żaden dokument gry nie może zależeć od hostingu firmy trzeciej** (dotyczy też Sketchfab, Niantic, Polycam). Pliki w `public/sceny/` na GitHub Pages.
5. **Pionierskość.** Nie dotyczy.

### A.4 KIRI Engine

1. **Co to.** Skaner iOS/Android (Android 7+, iOS 15+), splaty liczone w chmurze; wersja 3.13 zmniejszyła pliki 3DGS o ok. 50%, 4.0 (wrzesień 2025) zniosła limity skanu; 3DGS i eksport w planie Pro (ok. 18 USD/mies. lub 80 USD/rok) [wg wyszukiwarki]. Eksport PLY i siatka OBJ z 3DGS. Źródła: https://www.cgchannel.com/2025/01/new-version-of-ios-and-android-scanning-app-kiri-engine ; https://digitalproduction.com/2025/09/13/faster-wider-cleaner-kiri-engine-4-0-drops-mobile-scan-limits/ ; https://www.kiriengine.app/blog/how-to-capture-3d-gaussian-splats-kiri-engine.
2. **Przeglądarka.** Jak A.1; dodatkowo siatka OBJ z 3DGS to droga do lekkiego modelu (glTF) dla `komnata/` zamiast tekstur proceduralnych.
3. **Wpięcie.** „3DGS do siatki” pozwala zrobić z prawdziwego skanu bramy niskopoligonową bryłę do `komnata/` i `miasto/` (MapLibre nie renderuje splatów, renderuje bryły). Jeden skan, dwa użycia.
4. **Koszt.** ok. 320 zł/rok Pro. Ryzyko: chmura, jak A.2.
5. **Pionierskość.** Brak; narzędzie.

### A.5 Postshot (Jawset)

1. **Co to.** Trening splatów na własnym komputerze: tylko Windows, NVIDIA RTX 2060 lub nowsza; wersja 1.0 z darmowym poziomem [wg wyszukiwarki: https://radiancefields.com/postshot-launches-v1-0-out-of-beta ; https://www.thefuture3d.com/software/postshot/ ; cennik sprzeczny w źródłach, sprawdzić na jawset.com].
2. **Przeglądarka.** Nie dotyczy (narzędzie offline); daje PLY najwyższej jakości z wideo 4K, lepsze niż telefon.
3. **Wpięcie.** Jeśli autor ma albo pożyczy laptop z RTX: jedna „scena wizytówkowa” (Brama Opatowska od strony miasta) w jakości, której telefon nie da; reszta scen z Scaniverse.
4. **Koszt.** 0 zł przy sprzęcie dostępnym; inaczej nie kupować sprzętu (poza budżetem).
5. **Pionierskość.** Brak.

### A.6 Niantic Spatial: VPS i 8th Wall

1. **Co to.** Visual Positioning System (lokalizacja telefonu względem skanu miejsca z dokładnością centymetrów) i WebAR 8th Wall. **W 2026 Niantic Spatial zamknął hostowany 8th Wall (28 II 2026) i otworzył kod silnika; VPS, Lightship Maps i Geospatial Browser NIE są w wersji open source; projekty VPS w sieci wspierane do 28 II 2027.** Źródła: https://www.roadtovr.com/niantic-webar-platform-8th-wall-open-source/ ; https://info.nianticspatial.com/blog/8th-wall-update-engine-distribution-and-open-source-plans ; https://www.8thwall.com/docs/migration/faq/ [wg wyszukiwarki].
2. **Przeglądarka.** VPS w przeglądarce: koniec. Silnik 8th Wall (SLAM bez znacznika, open source) działa w Safari i Chrome, ale bez usług Niantica.
3. **Wpięcie.** Nie opierać ani jednej bramy na VPS. Jeśli kiedyś zechcemy AR bez znacznika na iPhonie (gdzie nie ma WebXR), otwarty silnik 8th Wall jest kandydatem do zbadania; na dziś nasz AR.js ze znacznikiem (jest w `public/ar/`) wystarcza.
4. **Ryzyko.** Modelowy przykład „platforma znika”. Zero kosztu, zero zależności.
5. **Pionierskość.** Nie dotyczy.

### A.7 Google Geospatial Creator, ARCore Geospatial API, Adobe Aero

1. **Co to.** Geospatial Creator (Unity + ARCore Extensions, Photorealistic 3D Tiles) pozwala kotwiczyć treść AR do współrzędnych świata z dokładnością Street View; działa w aplikacjach natywnych Android/iOS, **nie w przeglądarce**. Dokumentacja: https://developers.google.com/ar/geospatialcreator (aktualizowana jeszcze 2026) ; https://developers.googleblog.com/en/google-ar-at-io-2024-new-geospatial-ar-features-and-more/. Drugą ścieżką był Adobe Aero: **wyłączony 6 XI 2025, dane usunięte 16 XII 2025** (https://helpx.adobe.com/aero/faq.html ; https://en.wikipedia.org/wiki/Adobe_Aero).
2. **Przeglądarka.** Brak. Jedyne, co z tego świata mamy w przeglądarce, to własne GPS + kompas (`miasto/`, `renderCompass`).
3. **Wpięcie.** Nie dotyczy. Zapis na przyszłość: gdyby powstała aplikacja natywna (nie planujemy), Geospatial API dałoby „bramę, która świeci nad prawdziwą ulicą” z dokładnością 1 m.
4. **Ryzyko.** Aero pokazuje tempo wyłączeń.
5. **Pionierskość.** Nie dotyczy.

### A.8 Apple: RealityKit ze splatami, Object Capture, AR Quick Look

1. **Co to.** Apple dodało natywne renderowanie splatów do RealityKit (`GaussianSplatComponent`, iOS/visionOS 27, WWDC 2026; ładuje USD i PLY): https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent ; https://developer.apple.com/videos/play/wwdc2026/279. Object Capture (iOS 17+) to fotogrametria do siatki USDZ, nie splat: https://developer.apple.com/documentation/realitykit/realitykit-object-capture. Safari na iOS nadal nie ma WebXR; AR na iPhonie z sieci to AR Quick Look (USDZ przez `<a rel="ar">`).
2. **Przeglądarka.** Na iPhonie: splaty tylko przez WebGL (Spark/gsplat.js), nie przez RealityKit; 1-3 mln splatów w Safari wg Spark. USDZ z Object Capture otwiera się w AR Quick Look z Safari (bez aplikacji) i staje na stole.
3. **Wpięcie.** Fizyczna zawieszka z krzemienia (plan) jako USDZ w AR Quick Look na iPhonie i jako `<model-viewer>`/three.js na Androidzie: „karta przedmiotu” przy dokumencie, zanim gracz dostanie prawdziwą. Skan przedmiotu: Object Capture na iPhonie (darmowe, w aplikacji Reality Composer) albo KIRI.
4. **Koszt.** 0 zł. Ryzyko: Quick Look wymaga poprawnego USDZ (konwersja z glTF w Reality Converter na Macu; bez Maca użyć KIRI/Polycam eksport USDZ).
5. **Pionierskość.** Niska; dobre wykończenie.

### A.9 Renderery i narzędzia w przeglądarce: Spark, GaussianSplats3D, SuperSplat, Kompakkt

1. **Co to.** Spark (MIT, three.js 0.179+, czyta PLY/SPZ/SPLAT/KSPLAT/SOG, „98%+ urządzeń z WebGL2”): https://github.com/sparkjsdev/spark. GaussianSplats3D (MIT) oficjalnie nierozwijany, zaleca Spark: https://github.com/mkkellogg/GaussianSplats3D. SuperSplat (MIT) to edytor w przeglądarce do czyszczenia, przycinania i publikowania splatów; przy ≥1 mln generuje LOD i strumieniowany SOG: https://github.com/playcanvas/supersplat ; https://developer.playcanvas.com/user-manual/supersplat/streaming/ [wg wyszukiwarki]. Kompakkt (MIT, Kolonia/TIB): otwarty przeglądarkowy viewer dziedzictwa z adnotacjami w 3D, od 2025 ze wsparciem splatów [wg wyszukiwarki: https://radiancefields.com/platforms/kompakkt ; https://github.com/Kompakkt/Kompakkt].
2. **Przeglądarka.** Nasz `skan/` używa gsplat.js (prosty, bez SPZ/SOG, bez LOD). ARCHITEKTURA.md deklaruje Spark dla `sceny/`. Rekomendacja: **jedna biblioteka, Spark**, trzymana lokalnie w `public/vendor/` (jak dziś gsplat i three), nie z CDN (sprawdzone w tej sesji: CDN bywa zablokowany).
3. **Wpięcie.** SuperSplat do przycięcia skanu do samego miejsca (usunąć niebo, przechodniów, samochody) przed publikacją: to 10 min pracy na skan i najskuteczniejsza redukcja rozmiaru. Adnotacje à la Kompakkt robić własnym kodem: punkt w 3D + karteczka `.cap` jak w `komnata/`.
4. **Koszt.** 0 zł. Ryzyko: starsze Androidy z WebGL1 (ok. 2% wg Spark) dostają zapas: zdjęcie 360 albo sam dokument tekstowy.
5. **Pionierskość.** Niska; infrastruktura.

### A.10 Przykłady wdrożeń: muzea i zabytki jako splaty (2025-2026)

- **Montreal Museum of Fine Arts (prototyp DPT Labs):** jedna sala jako splat w PlayCanvas, format SOGS v2, wersje web, VR i instalacja w galerii; „praktyczne rozmiary plików dla przeglądarek desktop i mobile”. https://labs.dpt.co/article-3dgs.html [wg wyszukiwarki, data 2025].
- **Project ETERNAL (CyArk + Antigravity, Insta360):** Pompeje (Forum) i Civita di Bagnoregio jako splaty z drona 360°, dostępne „na każdym telefonie i w sieci” w platformie Tapestry; ogłoszone 23 IV 2026. https://cyark.org/projects/pompeii-antigravity ; https://tapestry.cyark.org/content/pompeii-forum/about ; https://amerisurv.com/2026/04/23/cyark-and-antigravity-launch-immersive-3d-heritage-experiences-as-part-of-global-project-eternal-initiative/ ; https://www.insta360.com/blog/enterprise/project-eternal-3dgs-wrap-up.html.
- **Into the Scaniverse (Niantic, WebXR na Quest):** ponad 50 tys. splatów użytkowników z całego świata; jakość tła niższa niż na telefonie. https://radiancefields.com/into-the-scaniverse-scaniverse-in-vr.
- **Badania:** CIPA 2025 o wirtualnym muzeum 3DGS z panoramami 360 (https://isprs-annals.copernicus.org/articles/X-M-2-2025/185/2025/isprs-annals-X-M-2-2025-185-2025.pdf); Frontiers in Computer Science 2025 o 3DGS w dziedzictwie (https://www.frontiersin.org/articles/10.3389/fcomp.2025.1515609/full); „Gaussian Heritage” z segmentacją obiektów (https://www.themoonlight.io/review/gaussian-heritage-3d-digitization-of-cultural-heritage-with-integrated-object-segmentation).
- **Wniosek dla nas (pionierskość):** wszystkie powyższe to „oglądaj”. Nikt z nich nie robi „szukaj w skanie dowodu i wpisz wniosek w lukę”. Sprawa, w której dokumentem jest splat, a pytanie `fill` wymaga znalezienia w nim detalu, jest nowością w skali, którą sprawdziliśmy.

---

## B. Rozpoznawanie dźwięku miejsca w przeglądarce (dzwon Piotra w południe)

### B.0 Co już mamy

`renderSpectro` liczy FFT 2048 z `AnalyserNode` i rysuje spektrogram do 8 kHz; `renderWhistle`/`renderPlate`/`renderDuet` mają detekcję wysokości (`detectPitch`, `PitchSmoother`) i FFT 8192 (rozdzielczość ok. 5,4 Hz przy 44,1 kHz). To jest 70% potrzebnego kodu. Brakuje: wzorca dzwonu (zestaw częstotliwości), logiki decyzji i testów terenowych.

### B.1 Odciski akustyczne „jak Shazam” w JS: Olaf, Chromaprint, Panako

1. **Co to.** Olaf (Joren Six, Uniwersytet w Gandawie): odcisk oparty na punktach charakterystycznych spektrogramu, ANSI C/Zig, kompilowany do WebAssembly (ok. 75 KB), działa w `AudioWorklet` z resamplingiem do 16 kHz; domyślnie wymaga ≥20 zgodnych odcisków, okna 15-30 s; **licencja AGPL-3.0 i ostrzeżenie o patentach US7627477 i US6990453** (https://github.com/JorenSix/Olaf ; opis przeglądarkowy https://0110.be/posts/Acoustic_fingerprinting_in_the_browser_with_Olaf [wg wyszukiwarki]; ISMIR 2020 https://program.ismir2020.net/lbd_418.html). Chromaprint (AcoustID): porty JS i WASM (https://www.npmjs.com/package/chromaprint.js ; https://cdn.jsdelivr.net/npm/rusty-chromaprint-wasm@0.1.5/README.md), ale autorzy piszą wprost: „nie jest ogólnym rozwiązaniem do odcisków, zamienia precyzję i odporność na szybkość wyszukiwania”, przeznaczony do identyfikacji **niemal identycznych nagrań** (https://github.com/acoustid/chromaprint). Panako: platforma badawcza w Javie, bez wersji przeglądarkowej.
2. **Przeglądarka.** Olaf WASM działa w Chrome i Safari (AudioWorklet jest w Safari od 14.1). Android średni: ok. 1 s/s audio albo szybciej [bez pomiaru w tej sesji]. iPhone: jak wyżej; uwaga znana z KATALOG B.3: włączenie mikrofonu na iOS przestawia tor audio, nie łączyć z odsłuchem binauralnym.
3. **Wpięcie.** **Nie tą drogą.** Odcisk „Shazam” rozpoznaje konkretne nagranie (ta sama sekwencja uderzeń w czasie), a dzwon za każdym razem bije inaczej (inny rytm, inny wiatr, inna odległość). To, co w dzwonie jest stałe, to **częstotliwości jego tonów składowych**, nie przebieg w czasie. Patrz B.3.
4. **Koszt i ryzyko.** AGPL Olafa jest do przyjęcia tylko, jeśli publikujemy cały kod gry na AGPL (repo jest publiczne, ale to decyzja autora); patenty: jurysdykcja USA, dla gry w Polsce ryzyko małe, ale niezerowe. Chromaprint LGPL.
5. **Pionierskość.** Odcisk akustyczny w przeglądarce istnieje od 2020; nic nowego.

### B.2 Klasyfikatory dźwięku w przeglądarce: YAMNet, MediaPipe Audio Classifier, Essentia.js

1. **Co to.** YAMNet (Google, AudioSet): 521 klas, wejście 16 kHz mono, log-mel 64 pasm 125-7500 Hz, ramki 0,96 s, ok. 3,7 mln wag (https://github.com/tensorflow/models/tree/master/research/audioset/yamnet). Ontologia AudioSet ma klasę **„Church bell”** (pod „Bell”, ok. 1200 klipów, trafność ocenioną na 90%): https://research.google.com/audioset/ontology/church_bell.html ; w pliku etykiet YAMNet indeksy: 195 Bell, 196 Church bell, 200 Chime [wg wyszukiwarki: https://huggingface.co/thelou1s/yamnet/blob/main/labels_yamnet.txt]. MediaPipe Audio Classifier ma oficjalny przykład **web/JS z modelem YAMNet**, wymagania: Chrome, Firefox lub Safari, iOS 16+ (https://github.com/google-ai-edge/mediapipe-samples/tree/main/examples/audio_classifier/js ; przewodnik https://developers.google.com/edge/mediapipe/solutions/audio/audio_classifier). Opóźnienie natywne YAMNet na Pixel 6 CPU: 12,3 ms na ramkę (tabela MediaPipe); w przeglądarce (WASM) spodziewać się 30-100 ms na ramkę na średnim Androidzie [szacunek, do zmierzenia]. Essentia.js: analiza MIR w WASM, AGPL (https://github.com/MTG/essentia.js).
2. **Przeglądarka.** Android Chrome: tak (WASM + Web Audio). iPhone Safari: tak od iOS 16 wg Google. Model ok. 4 MB do pobrania raz (cache przez `sw.js`).
3. **Wpięcie.** YAMNet jako **pierwsza bramka**: „czy w ogóle słyszę dzwon kościelny?” (klasa 196 z prawdopodobieństwem > 0,5 przez ≥3 kolejne ramki). To odsiewa rozmowę, wiatr, ruch uliczny. Druga bramka to B.3. Zapas bez mikrofonu zostaje zasadą gry (przyjęcie bramy „na słowo” po trzykrotności czasu, jak dziś).
4. **Koszt i ryzyko.** 0 zł, licencja Apache 2.0 (YAMNet, MediaPipe). Ryzyko: YAMNet rozpozna też **nagranie dzwonu z głośnika** (klasyfikator nie odróżnia źródła); stąd B.4. Prywatność: wszystko w telefonie, nic nie wysyłane; napisać to w scenie jednym zdaniem (zasada z KATALOG B.4.8).
5. **Pionierskość.** Klasyfikacja audio w przeglądarce: znane (2023+). Użycie jako „klucza miejsca i czasu” w grze: nie znaleźliśmy precedensu.

### B.3 Fizyka dzwonu jako odcisk: tony składowe

1. **Co to.** Każdy dzwon ma stały zestaw tonów składowych (partiali): hum, prime, tierce (tercja mała nad prime), quint, nominal (oktawa nad prime), zawsze w tej samej kolejności częstotliwości; w dobrze strojonym dzwonie ton uderzeniowy pokrywa się z prime; hum wybrzmiewa najdłużej. Źródła: https://www.hibberts.co.uk/identifying-bell-partials/ ; https://www.bells.org/node/254 ; Terhardt i Seewann 1984 omówienie: https://www.hibberts.co.uk/terhardt-and-seewan-1984/ ; Fleischer, DAGA 2009: https://www.pub.dega-akustik.de/NAG_DAGA_2009/data/articles/000092.pdf ; metoda pomiaru z nagrania i kalibracją kamertonem: https://www.keltektrust.org.uk/sob21.html. Częstotliwości partiali zależą od geometrii i stopu, czyli są **unikalne dla egzemplarza** i niezależne od tego, kto i jak dzwoni.
2. **Przeglądarka.** FFT 8192 przy 44,1 kHz daje ok. 5,4 Hz na prążek; z interpolacją paraboliczną szczytu ok. 1 Hz. Partiale dzwonu stoją nieruchomo kilkanaście sekund, więc uśrednienie 20-40 ramek daje stabilny pomiar. Android i iPhone: identycznie (to czysty Web Audio, który już używamy w `renderDuet` z fftSize 8192). Mikrofony telefonów są filtrowane poniżej ok. 100 Hz i powyżej 8 kHz, ale 5 głównych partiali dzwonu średniej wielkości mieści się w paśmie 150-2000 Hz.
3. **Wpięcie.** Obrzęd bramy 3 (dźwięk) w trybie na miejscu: w południe gracz staje na Rynku, włącza mikrofon; gra szuka 5 szczytów w zadanych oknach (±1,5% od wzorca danego dzwonu) i wymaga ≥4 z 5 przez ≥8 s. Wzorzec robi autor jednym nagraniem telefonem z odległości 50-100 m, analizowanym tym samym kodem (bez chmury). Wynik gestu staje się dokumentem w aktach (zapis spektrogramu z zaznaczonymi partialami, „ręką geolożki”), zgodnie z zasadą KATALOG B.4.4.
4. **Koszt i ryzyko.** 0 zł; 2-3 dni kodu + 1 dzień w Sandomierzu w południe. Ryzyko kluczowe: **nie potwierdziliśmy w źródłach, że w katedrze sandomierskiej jest dzwon o imieniu Piotr ani kto i o której dzwoni**; wyszukiwanie dało tylko dzwony dominikańskie od św. Jakuba (zdjęte w 2016 z powodu stanu dzwonnicy, https://radiokielce.pl/411528/niezwykle-dzwony-sandomierskich-dominikanow-jeden-z-nich-zmieni-111114). Ustalić u proboszcza katedry: harmonogram (Anioł Pański 12:00?), czy bicie jest automatyczne (napęd elektryczny bije regularniej, co ułatwia), zgoda na użycie w grze (grzecznościowa; dźwięk w przestrzeni publicznej nie wymaga licencji). Pogoda: wiatr > 8 m/s psuje pomiar (szum), deszcz tłumi; dać komunikat „dziś dzwon nie doniósł” bez kary (kontrakt frustracji już to przewiduje).
5. **Pionierskość.** Analiza partiali to klasyka kampanologii; jej użycie jako **klucza miejsca w grze w przeglądarce** jest, o ile wiemy, pierwsze. To jest również rzecz do pokazania w mediach: „telefon rozpoznaje konkretny dzwon po jego tonach, jak odcisk palca”.

### B.4 Jak odróżnić prawdziwy dzwon od nagrania z głośnika

1. **Co to.** Literatura o atakach odtworzeniowych (ASVspoof) wskazuje cechy nagrania z głośnika: **tłumienie niskich częstotliwości i zniekształcenia harmoniczne** w małych głośnikach (Villalba i Lleida; Interspeech 2019 „replay attack detection based on distortion by loudspeaker”, https://researchconnect.buffalo.edu/en/publications/replay-attack-detection-based-on-distortion-by-loudspeaker-for-vo/ ; przegląd cech: https://www.nowpublishers.com/article/OpenAccessDownload/SIP-164 ; nowsze cechy GFLC 2024: https://arxiv.org/pdf/2404.17280). Zastrzeżenie: w ASVspoof 2019 wykryto skrót w danych (cisza na końcu), więc liczby z publikacji są zawyżone (https://arxiv.org/pdf/2404.17280 omawia).
2. **Przeglądarka.** Wszystko poniżej to proste pomiary na tych samych FFT: energia hum względem nominal; stabilność częstotliwości partiali w czasie (głośnik telefonu dodaje własne rezonanse i kompresję); czas wybrzmiewania.
3. **Wpięcie: cztery niezależne dowody, wymagamy trzech.** (a) Tony: 4 z 5 partiali wzorca (B.3). (b) **Hum**: najniższy partial dzwonu ma być obecny i wybrzmiewać dłużej niż nominal; mały głośnik telefonu go gubi albo zniekształca (klasyczny efekt tłumienia basu z literatury). (c) **Czas**: zegar telefonu 11:58-12:06 czasu lokalnego; zegar da się przestawić, więc to tylko jedno z czterech. (d) **Miejsce**: GPS w promieniu ok. 400 m od katedry (dokładność w zabudowie starego miasta 5-20 m, wystarczy). Dodatkowo (e) **czas trwania**: prawdziwe bicie na Anioł Pański trwa minuty, więc wymagać ≥60 s ciągłego sygnału; nagranie z YouTube też może, ale musi być odtwarzane głośno, na Rynku, w południe, czyli gracz i tak tam jest. Wielokanałowość: większość telefonów ma 2-3 mikrofony, ale Web Audio daje zwykle jeden kanał mono po przetworzeniu systemowym (brak gwarancji stereo w `getUserMedia`), więc **kierunkowości nie liczyć**. Pogłos: miasto w południe dodaje odbicia od kamienic; to nie szkodzi partialom (częstotliwości te same), szkodzi odciskom czasowym (kolejny argument przeciw B.1).
4. **Koszt i ryzyko.** 0 zł. Ryzyko: ktoś z głośnikiem Bluetooth i basem oszuka (b). Przyjąć filozofię z `pair.ts`: „zamek na pamiętnik, nie kryptografia”; cel to uczciwy gracz ma poczuć, że miasto odpowiedziało, nie udowodnienie czegokolwiek. Nic nie nagrywamy i nie wysyłamy: liczby FFT giną po scenie.
5. **Pionierskość.** Składanie czterech słabych dowodów w jeden klucz miejsca-czasu to podejście znane z bezpieczeństwa, nieznane w grach przeglądarkowych.

### B.5 Dźwięk w spektrogramie, dudnienie, 12 uderzeń (co już jest w KATALOG III)

Potwierdzamy wykonalność z kodu: spektrogram jest (`renderSpectro`), zegar lokalny jest. Dodatek z badań: wzorzec partiali dzwonu z B.3 może być **wydrukowany w książce jako „karta dźwięku”** (pięć kresek na skali); gracz porównuje to, co widzi na spektrogramie, z kartą: papier i telefon w jednym geście (nazotoki).

---

## C. Audio AR i spacery dźwiękowe

Uwaga: w tej części budżet wyszukiwań wyczerpał się przed weryfikacją Janet Cardiff, Soundwalk, Wake Lock w Safari i Omnitone w działaniu; oznaczamy, co jest z pamięci panelu.

### C.1 Echoes.xyz

1. **Co to.** Platforma spacerów dźwiękowych z geofencingiem: Creator w przeglądarce, Explorer jako aplikacja mobilna; darmowa pełna funkcjonalność, bez reklam. https://echoes.xyz ; https://docs.echoes.xyz/docs/creator/intro ; https://explore.echoes.xyz. Sami autorzy piszą, dlaczego słuchanie w sieci jest trudne: w przeglądarce audio nie gra w tle, nie ma beaconów, GPS nie działa przy zablokowanym ekranie, więc spacer webowy wymaga włączonego ekranu (https://echoes.xyz/?p=261 [wg wyszukiwarki]).
2. **Przeglądarka.** To samo dotyczy nas: Android Chrome i iPhone Safari dają `geolocation.watchPosition` tylko przy widocznej karcie; Screen Wake Lock trzyma ekran (Chrome 84 wg https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md ; Safari od 16.4 [z pamięci, niezweryfikowane w tej sesji]). Bateria: ekran + GPS + audio to ok. 15-25% na godzinę spaceru [szacunek].
3. **Wpięcie.** Nie używać Echoes (zależność, aplikacja). Własny „spacer siedmiu bram” w `miasto/`: już mamy GPS, kompas i zawieszkę, dodać odtwarzanie krótkich nagrań (30-60 s) przy wejściu w promień 25 m od bramy, z Wake Lock i przyciskiem „odtwórz tu” jako zapasem, gdy GPS gubi (wąwozy, piwnice).
4. **Koszt.** 0 zł kodu; nagrania: autor czyta, lektorka czyta geolożkę (500-1500 zł za 7 nagrań u lektora freelance; szacunek rynkowy).
5. **Pionierskość.** Spacer dźwiękowy w przeglądarce bez aplikacji z geofencingiem: rzadkie, nie nowe.

### C.2 Detour, Bose AR: lekcja o platformach

Detour (Andrew Mason) kupiony przez Bose w 2018, aplikacja zamknięta; Bose AR zamknięty w czerwcu 2020 („nie stał się tym, co sobie wyobrażaliśmy”), Frames wycofane. https://techcrunch.com/2018/04/24/bose-acquires-andrew-masons-walking-tour-startup-detour ; https://www.techradar.com/news/no-frames-2-coming-as-bose-shuts-augmented-reality-division ; https://gizmodo.com/rip-bose-ar-we-hardly-knew-ye-1844057062. Wniosek: treść audio miejsca trzymać jako zwykłe pliki (Opus/AAC) w repo; żadnego SDK.

### C.3 Janet Cardiff i George Bures Miller (z pamięci panelu, do zweryfikowania)

„The Missing Voice (Case Study B)” (Artangel, Londyn, 1999) i „Alter Bahnhof Video Walk” (dOCUMENTA 13, Kassel, 2012) to kanon spaceru audio: nagranie binauralne w tym samym miejscu, głos w drugiej osobie, instrukcje ruchu wplecione w fikcję, nagrane kroki i drzwi, które zlewają się z prawdziwymi. Strona artystów: https://cardiffmiller.com (nie otwarta w tej sesji). Dla nas to wzór formy: geolożka mówi w słuchawce „stań przy studni, odwróć się do ratusza”, a w tle nagrane w tym miejscu dzwony, gołębie, kroki na bruku; po 40 sekundach gracz nie wie, co jest nagrane. To jest ten sam gest, co Ferrante: ciało pierwsze.

### C.4 Dźwięk binauralny i przestrzenny w przeglądarce

1. **Co to.** `PannerNode` z `panningModel: "HRTF"` jest w Web Audio od lat (https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics); Omnitone (Google, Apache 2.0, wersja 2.0, utrzymywany) dekoduje ambisonię do binauralu i obraca pole dźwięku od czujników: https://github.com/GoogleChrome/omnitone; Resonance Audio Web SDK **zarchiwizowany 19 IV 2026**: https://github.com/resonance-audio/resonance-audio-web-sdk. Śledzenie głowy AirPods nie jest dostępne dla stron (to funkcja systemowa per aplikacja; brak API w Safari).
2. **Przeglądarka.** Android: HRTF działa. iPhone: działa, ale było zgłoszenie braku efektu dla strumieni WebRTC w Safari 15 (https://developer.apple.com/forums/thread/696034); dla plików lokalnych w porządku. Słuchawki ma w danej chwili 50-70% graczy (KATALOG B.3), więc każdy efekt binauralny ma wersję „bez słuchawek: zobaczysz, nie usłyszysz”.
3. **Wpięcie.** Najprostsza i najmocniejsza rzecz: **prawdziwe nagranie binauralne** z Rynku w południe (mikrofony douszne, 2 min, dzwon, gołębie, rozmowy po polsku), odtwarzane w domu w sprawie 3 ze spektrogramem; na miejscu zaś dźwięk z `PannerNode` sterowany kompasem (Omnitone + `deviceorientation`): „dzwon jest zawsze tam, gdzie katedra, choćbyś się odwrócił”. Kompas już mamy (`renderCompass`).
4. **Koszt.** Mikrofony binauralne douszne klasy hobby: ok. 300-1500 zł (szacunek; np. Roland CS-10EM, bez weryfikacji ceny w tej sesji), rejestrator: telefon. Ryzyko: nagrywanie na Rynku jest legalne (przestrzeń publiczna, dźwięk otoczenia, bez utrwalania rozpoznawalnych wypowiedzi).
5. **Pionierskość.** Binaural w grach jest (KATALOG B.2 cytuje badania o immersji); nagranie z tego samego miejsca, które gracz potem odwiedza, to Cardiff; połączenie z kompasem w przeglądarce bez aplikacji: rzadkie.

---

## D. Fizyczne obiekty, NFC i Web NFC

### D.1 Web NFC (Android) i brak go na iOS

1. **Co to.** `NDEFReader` czyta i pisze NDEF w Chrome na Androidzie (od Chrome 89, wg web-features od 100 [wg wyszukiwarki: https://caniuse.com/webnfc ; https://web-platform-dx.github.io/web-features-explorer/features/web-nfc]); wymaga HTTPS, gestu użytkownika, ramki najwyższego poziomu; zdarzenie `reading` daje `serialNumber` (UID tagu) i rekordy. Specyfikacja Community Group: https://github.com/w3c/web-nfc. **Safari/WebKit: stanowisko „opposed”, brak na iOS i w każdej przeglądarce na iOS (wszystkie używają WebKit)** [wg wyszukiwarki: web-features-explorer; https://bugzilla.mozilla.org/show_bug.cgi?id=1308614 dla Firefoksa: brak].
2. **Przeglądarka.** Android: tak (ok. 70% polskiego rynku telefonów to Android; udział orientacyjny). iPhone: nie.
3. **Wpięcie.** Patrz D.2: nie potrzebujemy Web NFC do podstawowej mechaniki. Web NFC jako **bonus na Androidzie**: odczyt UID tagu i porównanie z listą zahaszowanych UID w repo (SHA-256, jak kody rozdziałów w `KODY.md`) daje „to jest prawdziwa zawieszka, nie skopiowany adres”.
4. **Ryzyko.** Fragmentacja: część Androidów ma NFC wyłączone domyślnie; komunikat w scenie „włącz NFC” to instrukcja, której zasada nazotoki zabrania; lepiej: „przyłóż kamień do telefonu” i reszta dzieje się sama (D.2).
5. **Pionierskość.** Niska.

### D.2 Tag NFC z adresem URL działa na iPhonie BEZ aplikacji i bez Web NFC

1. **Co to.** iPhone XS i nowsze czytają tagi NDEF w tle: tag z rekordem URL wywołuje powiadomienie, tapnięcie otwiera adres w Safari (jeśli żadna aplikacja nie ma zarejestrowanego Universal Link). Warunki: telefon odblokowany co najmniej raz po uruchomieniu, ekran włączony, brak aktywnej sesji aparatu i trybu samolotowego, przetwarzany jest tylko **pierwszy** rekord URL. Źródła: https://developer.apple.com/documentation/corenfc/adding-support-for-background-tag-reading ; https://gototags.com/help/ios/nfc/reading/background ; https://developer.apple.com/videos/play/tech-talks/702. Android: system również otwiera URL z tagu NDEF w domyślnej przeglądarce (zachowanie systemowe od lat; bez weryfikacji źródłem w tej sesji).
2. **Przeglądarka.** Android średni: przyłożenie tagu otwiera `https://.../?qr=brama3` w Chrome; iPhone: powiadomienie, tapnięcie, Safari. **Nasz mechanizm `?qr=<id>` z `engine/unlock.ts` działa więc z NFC od razu, bez jednej linii kodu.** Zasięg: 1-4 cm, antena iPhone'a jest na górnej krawędzi, w Androidach najczęściej na środku pleców.
3. **Wpięcie.** Zawieszka z krzemienia: tag NTAG213 (144 B, URL ok. 50 znaków mieści się z zapasem) w kieszonce wyfrezowanej w kamieniu, zalany żywicą epoksydową, grubość kamienia nad anteną ≤ 4 mm; krzemień nie jest przewodnikiem, więc nie tłumi pola; **nie montować przy metalowej zawieszce lub oczku** (metal wymaga tagów z ferrytem, które mają mniejszy zasięg; https://www.shopnfc.com/en/content/11-nfc-guide ; https://prog.world/nfc-tags-on-a-metal-surface/ : zwykły tag przy metalu 0% odczytów do 4 mm odstępu, 80% przy 10 mm). URL w tagu: `?qr=zawieszka&k=<2 znaki sumy>` jak w `pair.ts`, żeby losowy adres nie przechodził. W mieście: tagi **nie w zabytkowej substancji** (Stare Miasto Sandomierza jest zespołem zabytkowym; każda ingerencja wymaga zgody konserwatora), lecz u partnerów (księgarnia, hotel, CIT): naklejka 25-30 mm pod blatem lub w ramce.
4. **Koszt i ryzyko.** Tagi NTAG213: rząd 1-3 zł/szt. w setkach (szacunek rynkowy); krzemień i obróbka: do wyceny u kamieniarza (szacunkowo 20-60 zł/szt. przy serii 100). Ryzyko: tag da się sklonować (URL jest jawny), więc nagroda z tagu musi być „miejscem”, nie „kluczem” (zgodnie z filozofią kluczy między ludźmi). Zasięg w piwnicach: NFC nie potrzebuje sieci; strona musi być zbuforowana przez `sw.js`, inaczej w piwnicy otworzy się pusta karta: dodać do `sw.js` wstępne buforowanie trasy `?qr=`.
5. **Pionierskość.** NFC w przedmiocie z książką: EXIT i gry Kosmos robią kody, nie NFC; zawieszka z kamienia, która „budzi” grę na obu systemach bez aplikacji, jest prosta i rzadka. Hasło do mediów: „kamień, który otwiera akta”.

### D.3 App Clip przez NFC na iOS (z pamięci panelu, niezweryfikowane w tej sesji)

Apple pozwala uruchomić App Clip (lekki fragment aplikacji natywnej, bez instalacji) z tagu NFC albo z App Clip Code. To jedyna ścieżka do WebXR-podobnego AR i do pełnego Core NFC na iPhonie, ale wymaga konta deweloperskiego Apple (99 USD/rok), Xcode i Maca, czyli łamie zasadę „bez aplikacji natywnej”. **Nie robić**; wpisujemy dla kompletności.

---

## E. Czujniki telefonu, których jeszcze nie używamy

| Czujnik / API | Android (Chrome) | iPhone (Safari) | Werdykt dla gry |
|---|---|---|---|
| **Barometr** | Brak API. W liście typów Generic Sensor jest „Barometer/Altimeter” tylko jako mapowanie, bez specyfikacji i bez implementacji (https://github.com/w3c/sensors/blob/main/sensor-types.md ; spec: https://www.w3.org/TR/generic-sensor/). | Brak. | **Nie ma.** Szkoda: „wysokość wzgórza” byłaby pięknym kluczem. Zastępnik: GPS z wysokością (`coords.altitude`, błąd 10-30 m) albo teren Terrarium w `miasto/` z pozycji poziomej. |
| **Magnetometr (Generic Sensor `Magnetometer`)** | Za flagą (`SensorExtraClasses`), permissions policy od Chrome 66 (https://github.com/w3c/webappsec-permissions-policy/blob/main/features.md). | Brak. | Używać dalej `deviceorientation` (absolutne na Androidzie, `webkitCompassHeading` na iOS), co już robimy. Surowe pole magnetyczne (wykrywanie żelaza w ścianie) nieosiągalne. |
| **Światło otoczenia (`AmbientLightSensor`)** | Za flagą. | Brak. | Kamera jako luksomierz (już robimy w `renderDark`). |
| **Haptyka** | `navigator.vibrate` wzory (mamy). | Brak Vibration API. Sztuczka `<input type="checkbox" switch>` z Safari 17.4 daje jedno systemowe „kliknięcie” (https://github.com/tijnjh/ios-haptics); w jednym README twierdzenie, że iOS 26.5 to załatał [wg wyszukiwarki, niepotwierdzone]. | Traktować iOS jako „bez wibracji”; nasz kod już ma try/catch. Alfabet wibracyjny (KATALOG III.7) tylko Android, z wersją wizualną. |
| **WebXR `immersive-ar` + hit-test** | Tak (ARCore). | Brak; Apple kieruje do AR Quick Look (USDZ). visionOS ma WebXR VR. | AR bez znacznika tylko Android; na iOS Quick Look z modelem; marker AR.js (mamy) działa na obu. |
| **Ultra Wideband** | Brak API webowego. | Brak (Nearby Interaction tylko natywnie). | Nie ma. |
| **Latarka (`torch` w `applyConstraints`)** | Tak w Chrome Android (z pamięci, niezweryfikowane). | Brak. | Bonus na Androidzie: „zapal światło w komnacie”; nieistotne. |
| **Bateria (Battery Status)** | Tak. | Brak. | Nie używać (prywatność, fingerprinting). |
| **Krokomierz** | Brak API; liczymy z akcelerometru (`renderSteps`). | Jak Android, po `requestPermission`. | Zostaje. |
| **Geolokalizacja** | Tak, przy widocznej karcie; w piwnicach brak sygnału. | Tak, jw. | W piwnicach (Podziemna Trasa) klucz miejsca tylko przez `?qr=`/NFC, nigdy przez GPS. |
| **Mowa (Web Speech)** | Tak (rozpoznawanie przez serwery Google: **dźwięk opuszcza telefon**). | Częściowo (Siri, również chmura). | Sprzeczne z zasadą „nic nie wysyłamy”; jeśli zostaje (KATALOG III.6), napisać to graczowi. Alternatywa lokalna: wykrycie samego faktu mowy (energia + zmienność tonu), bez treści. |
| **Zegar, kalendarz, wschód słońca** | Tak. | Tak. | Już używane (klucz czasu, świt). |

Wnioski: (1) nic nowego poza tym, co mamy, nie przychodzi do przeglądarki w 2026 (barometr, UWB, magnetometr: zamknięte); (2) nasza decyzja „siedem gestów” jest też decyzją techniczną: wszystkie siedem działa na obu systemach; (3) jedyne różnice Android/iPhone to haptyka i WebXR, więc każda scena z wibracją ma odpowiednik wizualny (jest).

---

## F. Wdrożenia w Polsce

Zastrzeżenie: budżet wyszukiwań skończył się w połowie tej części; nie zdołaliśmy zweryfikować listy polskich firm XR ani programu „Wirtualne Muzea Małopolski”. Poniżej tylko to, co ma źródło.

### F.1 Podziemia Rynku (Muzeum Krakowa)

1. **Co to.** Wystawa „Śladem europejskiej tożsamości Krakowa” otwarta we wrześniu 2010, ok. 4 m pod płytą Rynku, ponad 6000 m², multimedia (projekcje, hologramy, ekrany dotykowe) na autentycznych reliktach; ponad 3,4 mln zwiedzających w 10 lat [wg wyszukiwarki: https://www.radiokrakow.pl/aktualnosci/ponad-34-mln-osob-widzialo-w-ciagu-10-lat-podziemia-krakowskiego-rynku-glownego/ ; https://dzieje.pl/node/159596]. Nie znaleźliśmy doniesień o modernizacji 2024-2025. Pokrewne: Wawel Podziemny (lapidarium w piwnicach zamku) i wystawa Muzeum Archeologicznego pod kościołem św. Wojciecha z hologramem 3D [wg wyszukiwarki: https://www.radiokrakow.pl/aktualnosci/kultura/hologram-z-animacja-3d-na-wystawie-tuz-obok-bilo-serce-miasta-historia-kosciola-sw-wojciecha].
2. **Przeglądarka.** Nie dotyczy (instalacje stacjonarne, budżety rzędu dziesiątek milionów zł).
3. **Wpięcie.** Lekcja formy: siła Podziemi to **autentyczny relikt plus mgła i projekcja**, nie ekran. Nasza wersja za 0 zł: splat prawdziwej piwnicy (Podziemna Trasa Turystyczna w Sandomierzu, 500 m, 4-12 m głębokości, ok. 200 tys. osób rocznie [wg wyszukiwarki: https://radiokielce.pl/993900/przez-rok-do-zabytkowych-piwnic-wchodzi-200-tysiecy-osob]) z nałożoną warstwą fikcji (`.cap` jak w `komnata/`). Wymaga zgody zarządcy trasy na skanowanie wnętrza (prywatny operator; zapytać).
4. **Pionierskość.** Model „multimedialne podziemia” jest w Polsce dojrzały (Kraków 2010, Bochnia, Rzeszów); wersja przeglądarkowa i domowa z gry: nowa.

### F.2 Muzeum Powstania Warszawskiego

„Miasto Ruin” (2010, Platige Image, 5 min, 63 tys. modeli ruin, lot nad Warszawą 1945, 2D/3D) jest nadal w ekspozycji; aplikacja „Pamięć Miasta” (300 miejsc, 30 z audiodeskrypcją); rozbudowa muzeum planowana na trzy lata [wg wyszukiwarki: https://www.polishfilms.org/festival/films_2016/city-of-ruins ; https://www.whitemad.pl/en/the-expansion-of-the-warsaw-rising-museum-is-getting-closer-it-will-take-three-years/ ; https://dzieje.pl/node/32122]. Nie znaleźliśmy aplikacji AR/VR muzeum z 2025; „Kartka z Powstania” (VR Heroes) to osobna produkcja. Lekcja: jedna krótka, perfekcyjna rekonstrukcja (5 minut) żyje 15 lat; nasz odpowiednik to jedna komnata zrobiona do końca, nie siedem na pół.

### F.3 Kopalnia Soli „Wieliczka”

Nowe elementy: kino 5D, ekrany z grami, mapping na ociosie z rycin, nowa iluminacja komory Modena (Muzeum Żup Krakowskich); od kwietnia 2025 chatboty krakowskiej firmy ChatLab obsługują 17% zapytań turystów [wg wyszukiwarki: https://www.radiokrakow.pl/aktualnosci/krakow/kino-5d-w-kopalni-wieliczka-nowe-atrakcje-dla-turystow/ ; https://www.radiokrakow.pl/aktualnosci/krakow/mapping-na-ociosie-na-podstawie-rycin-wielicka-kopalnia-z-kolejna-atrakcja/ ; https://dzieje.pl/node/167688]. Brak VR dla zwiedzających w źródłach. Lekcja: duże obiekty wdrażają obsługę (chatbot), nie immersję; mapping „z rycin” to nasz `PROMPTY_RYCIN.md` w skali ściany.

### F.4 Digitalizacja 3D zabytków w Polsce

- Uniwersytet Papieski Jana Pawła II w Krakowie tworzy „cyfrowe bliźniaki zabytków” (kierownik Sławomir Dryja) [wg wyszukiwarki: https://dzieje.pl/node/167816 ; data nieustalona].
- Sketchfab: „Digitizing art and history from 40 Małopolska museums” (Wirtualne Muzea Małopolski): https://sketchfab.com/blogs/community/digitizing-art-and-history-from-40-malopolska-museums/ ; Krzyżtopór jako skan RAWscan3D: https://sketchfab.com/3d-models/krzyztopor-castle-rawscan-2ff9f0b15e5242b9acea7033cd07a972. Uwaga: Sketchfab przechodzi pod Epic/Fab; nie wiązać z nim treści gry.
- Serwis polskiedziedzictwo3d.pl (KUL, szaty liturgiczne): https://cs.pollub.pl/skanowanie-3d-historycznych-szat-liturgicznych/?lang=en ; Smarttech3D (Łomianki) jako wykonawca skanów dla Muzeum Pierwszych Piastów na Lednicy: https://eksponaty.lednicamuzeum.pl/source/materialy/Prezentacja%20digitalizacja%20MPP%20na%20Lednicy%201.pdf.
- Sandomierz: publikacja „Electronic Visualization of Underground Tourist Routes on the Example of the Route in Sandomierz” (Geoinformatica Polonica): https://ejournals.eu/en/journal/geoinformatica-polonica/article/electronic-visualization-of-underground-tourist-routes-on-the-example-of-the-route-in-sandomierz ; model nie jest, o ile wiemy, publiczny. Warto napisać do autorów: istniejący pomiar piwnic to gotowa geometria dla `komnata/`.
- **Nie znaleźliśmy w Polsce żadnego publicznego wdrożenia gaussian splatting w muzeum lub mieście** (stan źródeł: listopad 2026). Jeśli to prawda, siedem splatów Sandomierza w grze będzie pierwszym takim zbiorem w kraju; to jest teza do sprawdzenia jednym pytaniem do NIMOZ lub na forum Muzealnicy.

### F.5 Polskie firmy spatial (źródła niewystarczające)

Z wyszukiwania: VR Heroes („Kartka z Powstania”, pierwszy polski fabularny film VR), ChatLab (Kraków, chatboty dla Wieliczki), Platige Image („Miasto Ruin”), Made In Holo (AR na HoloLens, 2017). Lista firm od VR/AR dla muzeów (Nomtek, Immersion i inne) wymaga osobnej weryfikacji; w budżecie 20 tys. zł i tak nie mieści się zlecenie, więc znaczenie praktyczne jest małe. Realny partner to raczej uczelnia (UPJPII, Politechnika Świętokrzyska w Kielcach, która ma materiały o dziedzictwie Sandomierza: https://www.pk.kielce.pl/wp-content/uploads/2023/03/6.-i-7-charakterystyka-dziedzictwa-cd.pdf) z pracą dyplomową „skan Sandomierza dla gry”.

---

## G. Dziesięć propozycji „poziom wyżej” (kolejność wg efekt/koszt)

1. **Dzwon jako odcisk tonów (B.3 + B.4), brama 3 na miejscu.** Pięć partiali, trzy z czterech dowodów, nic nie wysyłane; wynik jako dokument ze spektrogramem w aktach. Koszt: 3 dni kodu, jedno południe w Sandomierzu, rozmowa z proboszczem. To jedna rzecz z całego raportu, o której napiszą media.
2. **Zawieszka z krzemienia z tagiem URL (D.2), bez Web NFC.** Działa na iPhonie i Androidzie przez istniejące `?qr=`, zero kodu poza sumą kontrolną w adresie i buforowaniem trasy w `sw.js`. Koszt: tagi plus kamieniarz, rząd 2-6 tys. zł na 100 sztuk; ryzyko klonowania przyjęte świadomie.
3. **Siedem splatów w SPZ/SOG z Scaniverse, jedna biblioteka (Spark), offline (A.1, A.9).** Cel 300-600 tys. splatów na scenę, przycięcie w SuperSplat, pliki w repo, cache-first w `sw.js`. Koszt: 0 zł i dwa weekendy w Sandomierzu; przejście `skan/` z gsplat na Spark to jeden dzień.
4. **Splat jako dokument z pytaniem `fill` (A.10).** W skanie studni na Rynku jest detal, którego nie ma na zdjęciu; luka w „Ustaleniu biegłego” wymaga go znaleźć. Koszt: treść i jeden punkt-adnotacja w 3D; to czyni ze „skanu” dowód, nie widok.
5. **Nagranie binauralne z Rynku w południe (C.4) do sprawy 3 w domu.** Dwa minuty prawdziwego dźwięku, ten sam dzwon, który gracz potem rozpozna na miejscu; w słuchawkach, z wersją „bez słuchawek: zobaczysz spektrogram”. Koszt: mikrofony douszne 300-1500 zł, jeden wyjazd.
6. **Spacer siedmiu bram w `miasto/` z audio w promieniu 25 m (C.1).** GPS, kompas i zawieszka już są; dodać Wake Lock, odtwarzanie i przycisk zapasowy. Koszt: 2 dni kodu i nagrania lektorskie 500-1500 zł; nie używać żadnej platformy.
7. **Dźwięk, który stoi w miejscu katedry (C.4): `PannerNode`/Omnitone sterowany kompasem.** Gracz obraca się na Rynku, dzwon w słuchawkach zostaje po stronie katedry. Koszt: 1 dzień; zależność Omnitone (Apache) albo sam `PannerNode` bez biblioteki.
8. **Karta dźwięku w książce (B.5).** Pięć kresek partiali dzwonu wydrukowanych na skali; gracz porównuje z własnym spektrogramem w telefonie. Koszt: zero (druk i tak jest); papier i telefon w jednym geście, czysta nazotoki.
9. **USDZ zawieszki w AR Quick Look na iPhonie, `<model-viewer>` na Androidzie (A.8).** Przedmiot staje na stole gracza, zanim przyjdzie pocztą. Koszt: skan Object Capture/KIRI, pół dnia.
10. **Komnata z prawdziwej piwnicy (F.1 + A.4).** Skan Podziemnej Trasy (za zgodą operatora) zamieniony przez „3DGS do siatki” na bryłę do `komnata/`, z fikcyjną warstwą `.cap`. Koszt: KIRI Pro ok. 320 zł/rok i dwa dni; ryzyko: zgoda i oświetlenie w piwnicy (skan wymaga równego światła, zabrać lampę LED).

## H. Czerwony zespół: trzech rzeczy NIE robić

1. **Nie budować na platformie, która może zniknąć do premiery.** W ciągu 24 miesięcy przed tą datą wyłączono: hostowany 8th Wall (28 II 2026) i VPS dla sieci (do 28 II 2027), Adobe Aero (6 XI 2025), Luma Flythroughs (1 I 2026), Resonance Audio Web SDK (archiwum 19 IV 2026), wcześniej Bose AR i Detour. Każdy plik gry (splat, dźwięk, model) leży w repo na GitHub Pages; żadnego iframe, SDK ani klucza API.
2. **Nie obiecywać „niepodrabialnego” dzwonu ani „niepodrabialnej” zawieszki.** URL w tagu da się skopiować, nagranie z głośnika z basem przejdzie przez większość testów, zegar da się przestawić. Pisać w regulaminie i w grze to, co jest prawdą: to zamek na pamiętnik; nagrodą jest przeżycie miejsca, nie dowód. Konkurs (REGULAMIN_KONKURSU.md) nie może zależeć od tych kluczy.
3. **Nie dodawać czujników, których nie ma, ani ósmego gestu.** Barometr, UWB, magnetometr surowy, haptyka na iOS, WebXR na iOS: zamknięte w 2026. Każda godzina na obejścia to godzina mniej na dokumenty, a proporcja dokumentów do gestów już jest za niska (KATALOG B.4.5). Siedem gestów, wszystkie działają na obu systemach; splaty i dzwon wchodzą w istniejące bramy (3 i dokumenty), nie jako nowe.

## I. Lista do sprawdzenia przez autora (rzeczy, których panel nie zdołał zweryfikować)

- Dzwony katedry sandomierskiej: imiona, harmonogram bicia (12:00?), napęd, zgoda proboszcza.
- Zgoda operatora Podziemnej Trasy Turystycznej na skan wnętrza.
- Aktualny cennik Polycam i Postshot; czy Scaniverse na Androidzie liczy splaty na urządzeniu na telefonie autora (zależy od modelu).
- Screen Wake Lock w Safari (16.4?) i zachowanie `watchPosition` po zgaśnięciu ekranu na iPhonie autora.
- Czy sztuczka haptyczna `switch` działa na bieżącym iOS (doniesienie o łatce w 26.5 jest niepotwierdzone).
- Program „Wirtualne Muzea Małopolski” i polskie firmy XR dla muzeów (niezweryfikowane z powodu limitu wyszukiwań; można dosłać w kolejnej sesji).
