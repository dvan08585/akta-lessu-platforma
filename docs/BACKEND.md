# Wspólny stan (backend na Cloudflare Workers)

Jeden mały serwis liczy to, czego strona statyczna nie policzy: ilu graczy przebyło którą bramę, ile osób zostawiło siódmą pozycję pustą, jak rozkładają się odpowiedzi w rozmowach i listach, ilu ludzi nuci naraz w południe premiery, oraz rejestr na żywo bez pushowania plików. Zero danych osobowych: gracz to skrót ziarna, nie adres ani IP.

## Wdrożenie (jednorazowo, 10 minut, konto Cloudflare darmowe)
```bash
cd backend
npm install
npx wrangler login
npx wrangler deploy
npx wrangler secret put ADMIN_TOKEN     # hasło do rejestru na żywo
```
Po `deploy` wrangler wypisze adres w stylu `https://akta-lessu-wspolny.<konto>.workers.dev`. Wpisz go do `src/content/config.json` jako `backendUrl`, commit, push. Bez adresu strona działa jak dotąd, tylko bez sekcji „Społeczność”.

## Rejestr na żywo w dniu premiery
```bash
curl -X PUT "$URL/rejestr" -H "Authorization: Bearer $ADMIN_TOKEN" -H "content-type: application/json" \
  -d '{"active":true,"header":"Rejestr statusów — Fundacja Sandomierska Memoria","lines":["1. Żmigród — nieznany","7. Świętopawłowskie — [puste]"]}'
```
Co godzinę inne `lines`. Strona pobiera co minutę. Plik `public/live/rejestr.json` zostaje jako zapas, gdy backend nie odpowiada.

## Co strona wysyła
`solved` i `gesture` z numerem bramy (raz na gracza), `seventh_empty` / `seventh_filled`, `reply` i `choice` z identyfikatorem i opcją, `hum` co 30 s podczas sceny nucenia. Nic więcej.

## Limity planu darmowego
100 000 żądań dziennie na Workers, Durable Objects w planie darmowym od 2025. Przy 10 000 graczy dziennie to kilkanaście tysięcy żądań. Wystarczy.
