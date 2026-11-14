# Treść poza gitem

Repo jest publiczne, więc od Etapu 0 obowiązuje zasada: **pełne teksty spraw 5–7, scenariusz siedmiu spraw i eksport tekstów do redakcji nie wchodzą do gita.**

Leżą w `content-prywatne/` (w `.gitignore`):
- `content-prywatne/cases/05-*.json`, `06-*.json`, `07-*.json`: jawna treść spraw zapieczętowanych. W `src/content/cases/` zostają nagłówki.
- `content-prywatne/docs/SCENARIUSZ_7_SPRAW.md`: scenariusz.
- `content-prywatne/docs/TEKSTY_DO_REDAKCJI.md`: eksport do redakcji (`node scripts/export-texts.mjs`, import `node scripts/import-texts.mjs content-prywatne/docs/TEKSTY_DO_REDAKCJI.md`).

Pieczętowanie: `node scripts/seal-cases.mjs codes.local.json` (ciphertext w `public/akta/`, klucz z kodu rozdziału). Klucz na dzień publikacji sprawy: `node scripts/seal-cases.mjs --key N codes.local.json` → wpisać do `public/live/klucze.json`. Lokalnie klucze są w `public/live/klucze.dev.json` (poza gitem).

Historia gita nadal zawiera wcześniejsze wersje tych tekstów. Pełne domknięcie to repo prywatne (patrz MASTERPLAN, sekcja o repozytorium). Kopia zapasowa `content-prywatne/` jest obowiązkiem autora: ten folder nie jest nigdzie synchronizowany.
