# Jak dodać sprawę

1. Skopiuj `src/content/cases/01-staromiejskie.json` jako `0N-<wzgorze>.json`.
2. Pola:
   - `n` numer sprawy, `gate` numer bramy (1–7), `requires.chapter` rozdział potrzebny do otwarcia.
   - `docs[]`: `title`, `source` (skąd dokument), `style`: `chronicle` (kronika, kapitaliki) / `mono` (protokół, inwentarz) / `hand` (list) / `plain`, `paragraphs[]`.
   - `questions[]`: `text`, `options[]` (4), `answer` (indeks), opcjonalnie `hint` (pojawia się po 3. próbie).
   - `solution[]`: 2–4 zdania. Jedno z nich ma być zdaniem, które czytelnik zapamięta.
   - `reward`: tekst z `rewards.json` pokazywany po rozwiązaniu.
3. Zarejestruj plik w `src/app.ts` (tablica `cases`).
4. Zasady Krytyka: żadnych spoilerów Cz.1 (Walewski, heptagram otwiera, pogrzebanie, Kassija). Dokumenty muszą wytrzymać sprawdzenie przez lokalnego pasjonata.
5. Zasady mistrzów: Ferrante (ciało, zawieszka), Eco (prawda między dokumentami, zdanie do przeczytania dwa razy), McCarthy (zero fanfar, jedno zdanie na koniec).
