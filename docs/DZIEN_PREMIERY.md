# Dzień premiery i pierwsze tygodnie: procedura

## Przed dniem D (tydzień wcześniej)
1. Próba generalna na osobnym wdrożeniu z przestawionym zegarem (docs/LISTA_ZADAN.md, B38). Dopiero po niej: usunięcie `testCodeHash` i `doneCodeHash` z `config.json`, opróżnienie `public/live/klucze.json`, prawdziwe kody w `codes.local.json`, ponowne zapieczętowanie spraw 5–7 (`node scripts/seal-cases.mjs codes.local.json`).
2. Harmonogram rejestru na dzień D: `content-prywatne/rejestr-dnia.json` (6–12 wierszy w MVP, 24 w wersji pełnej; każda godzina coś koduje). Format w nagłówku `scripts/rejestr-dnia.mjs`.
3. Sprawdzenie serwera: `curl https://akta-lessu-wspolny.dvan08585.workers.dev/stats` zwraca JSON; `PUT /rejestr` z hasłem działa (`node scripts/rejestr-dnia.mjs … --hour 12` i odświeżenie mapy).
4. Telefon dyżurny z zainstalowaną grą w trybie biegłego, drugi telefon do pokoju dwóch telefonów, ładowarka.

## Dzień D (dyżur autora)
- **Co godzinę:** `ADMIN_TOKEN=… node scripts/rejestr-dnia.mjs content-prywatne/rejestr-dnia.json`. Skrypt wysyła wiersze bieżącej godziny do Workera i zapisuje zapas do `public/live/rejestr.json`.
- **Południe:** próg nucących ustawiany ręcznie, jeśli automatyczny nie zadziała (patrz KATALOG_MECHANIK, nucenie w południe; w razie braku backendu gra liczy lokalnie).
- **Grupa wymiany odczytów:** miejsce, gdzie gracze z milczącym wzgórzem znajdują parę (do ustalenia: grupa na Facebooku autora albo wątek w grupie „Sandomierzanie i Sympatycy Sandomierza” za zgodą administratorki). Pierwszy odczyt każdy dostaje z archiwum od razu, więc grupa jest dla drugiego.

## Gdy Worker padnie
1. `node scripts/rejestr-dnia.mjs … ` i tak zapisze `public/live/rejestr.json`; `git commit -am "rejestr" && git push`. GitHub Pages wdraża w około minutę, a plik idzie zawsze z sieci (service worker go nie trzyma).
2. Statystyki i pokój dwóch telefonów znikają po cichu: gra działa jak bez serwera (sekcja „Dwa telefony” nie pojawia się, protokół pokazuje „bez połączenia”). Nic nie trzeba robić.
3. Odczyty milczących wzgórz nie zależą od serwera (archiwum po 72 h działa lokalnie).

## Gdy wycieknie treść (szkice spraw 5–7 albo zakończenie)
Jedno zdanie do wysłania, bez dyskusji: „To, co krąży, to szkice robocze sprzed roku; ostateczne akta różnią się od nich i tylko one liczą się w Rejestrze.” Nie potwierdzać, nie zaprzeczać szczegółom. Kody spraw 5–7 w `klucze.json` publikuje się dopiero w dniu danego odcinka.

## Tygodnie 2, 6, 12 (kill-switche z masterplanu)
| Tydzień | Działa | Jeśli nie |
|---|---|---|
| 2 | co najmniej 150 skanów, sprawa 1 u 60 procent, obrzęd u 70 procent | poniżej 80 skanów lub obrzęd poniżej 35: „na słowo” domyślne, komunikat w odcinku 3 |
| 6 | 350 skanów, sprawa 2 u 45 procent, odczyt u 40 procent, 15 finałów | odczyt poniżej 20: tablica par online; poniżej 5 finałów: finał solo z listem z archiwum |
| 12 | 500 skanów, 50 finałów, 20 kompletów pieczęci | poniżej 20 finałów i 300 skanów: sezon II odwołany, tryb muzeum |

Liczby bierze się z `/stats` (gracze, bramy, obrzędy z czasem i „na słowo”, instalacje jako aplikacja, odczyty odwzajemnione, siódma pozycja) i z księgi w bibliotece.
