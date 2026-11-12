# Kody z książki

Każdy rozdział kończy się siedmiobokiem i jednym słowem. Czytelnik wpisuje słowo w zakładce „Akta”.

- Normalizacja: wielkie litery, bez polskich znaków, bez spacji (`GOŁĄB` = `golab` = `Gołąb `).
- W repo trzymamy tylko `sha256("akta-lessu:" + kod)` w `src/content/chapters.json`.
- Kody trzymasz w `codes.local.json` (gitignore). Generowanie: `node scripts/hash-codes.mjs codes.local.json`.
- Kody demonstracyjne w obecnym repo (do wymiany przed drukiem): Prolog GOŁĄB, R.1 JABŁKA, R.2 KRATA, R.3 PYŁ, R.4 KRAWĘDŹ, R.5 SZCZELINA, R.6 RTĘĆ, R.7 DZWON, R.12 SIEDMIOBOK, R.13 SPINKI, R.17 KUFER, R.18 AMOR, R.21 LESS.
- Dobra praktyka: słowo z ostatniego zdania rozdziału, ale nie najbardziej oczywiste. Nie używać nazw własnych z okładki.

- **Kod testowy:** BIEGŁY. Zdejmuje kolejność spraw, kalendarz publikacji i milczenie zawieszki na tym urządzeniu. Nie generuje cudzych połówek klucza do finału. Usunąć z `config.json` (`testCodeHash`) przed premierą.
