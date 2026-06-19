# AwakerHz — sito (ricostruzione locale)

Ricostruzione **locale** del sito [awakerhz.com](https://awakerhz.com/) per continuare a lavorarci
mentre i file originali sono sull'altro PC/hosting. Sito **statico** (HTML + CSS + JS), senza
build tool né dipendenze: si apre in qualsiasi browser e si pubblica su qualsiasi hosting.

## Hosting: GitHub Pages (GRATIS, dal 19/06/2026)

Il sito è pubblicato **gratuitamente** su **GitHub Pages**, servito **direttamente dal branch
`main`** (root). URL: <https://giginala902.github.io/awakerhz-site/>.
- **Pubblicare una modifica = fare `git push` su `main`.** GitHub ripubblica da solo in ~1 minuto.
  Niente build, niente Netlify, niente crediti/abbonamenti.
- Il file vuoto **`.nojekyll`** disattiva Jekyll così i file vengono serviti così come sono.
- Repo **pubblico** (necessario per Pages gratis; nel repo non ci sono segreti).
- **Dominio `awakerhz.com`:** per usarlo qui servono i DNS verso GitHub Pages
  (A record 185.199.108/109/110/111.153, `www` → `giginala902.github.io`) + dominio custom
  nelle impostazioni Pages (HTTPS gratis). Vedi note in chat.

Stile, colori e font sono **identici** al sito attuale (palette viola/ciano, font *Cinzel* + *Raleway*).

## Struttura

```
AwakerHz-Site/
├─ index.html              Home (hero animato + tile delle aree + anteprima frequenze + missione + newsletter)
├─ frequencies.html        Le 9 frequenze Solfeggio (card espandibili) + video
├─ books.html              Libri
├─ store.html              Store
├─ health.html             Salute & Cibo
├─ hidden-knowledge.html   Conoscenza Nascosta
├─ about.html              Chi siamo / missione
├─ assets/
│  ├─ css/style.css        Tutto lo stile (base identica all'originale + estensioni)
│  └─ js/
│     ├─ i18n-data.js      ★ TESTI tradotti (IT/ES). L'inglese è scritto nell'HTML.
│     ├─ i18n.js           Motore di traduzione (non serve toccarlo)
│     └─ site.js           Header/footer condivisi + menu + lingua + comportamenti
└─ _reference/             Copia del sito originale (solo riferimento)
```

## Come vederlo in locale

**Modo semplice:** doppio click su `index.html` (funziona già, anche la lingua).

**Modo consigliato** (alcune funzioni si comportano meglio servite via http) — da PowerShell, nella cartella del sito:

```powershell
python -m http.server 8000
```

Poi apri <http://localhost:8000> nel browser.

## Multilingua (IT / EN / ES)

- Lo switch lingua è in alto a destra (e nel menu mobile). La scelta viene **ricordata**.
- L'**inglese** è il testo scritto direttamente nelle pagine `.html` (buono per SEO + fallback).
- **Italiano e Spagnolo** stanno in `assets/js/i18n-data.js`, nelle sezioni `it: {…}` ed `es: {…}`.
- Ogni testo traducibile nell'HTML ha un attributo `data-i18n="chiave"`; la stessa chiave si trova in `i18n-data.js`.

### Modificare un testo
- Inglese → modifica direttamente l'HTML.
- Italiano/Spagnolo → modifica il valore della chiave in `i18n-data.js`.

### Aggiungere una nuova lingua (es. francese)
1. In `i18n-data.js` aggiungi un blocco `fr: { … }` con le stesse chiavi.
2. In `assets/js/i18n.js` aggiungi `'fr'` all'array `SUPPORTED`.
3. In `assets/js/site.js` (funzione `langSwitch`) aggiungi un `<button … data-lang="fr">FR</button>`.

## Modifiche rapide frequenti

- **Menu / tab:** array `NAV_ITEMS` in `assets/js/site.js` (un solo posto per tutte le pagine).
- **Footer / email:** funzione `FOOTER` in `assets/js/site.js`.
- **Newsletter:** il form usa Formspree (`action="https://formspree.io/f/mkoewqro"`) — sostituibile.
- **Video YouTube:** in `frequencies.html`, dentro `.video-thumb` sostituisci il blocco
  `<div class="video-ph">…</div>` con
  `<iframe src="https://www.youtube.com/embed/ID_VIDEO" allowfullscreen loading="lazy"></iframe>`.
- **Link "Watch on YouTube" per frequenza:** in `frequencies.html` sostituisci l'`href`
  del link `.freq-watch` della card con l'URL del video specifico.

## Note

- Pagine Libri / Store / Salute / Conoscenza Nascosta sono **impalcature pronte** con card
  segnaposto: appena hai i contenuti reali si riempiono in pochi minuti.
- Questa versione è "in attesa" dei file originali: quando arriva l'altro PC valuteremo se
  migrare i contenuti o tenere questa base (lo stack qui è volutamente semplice e portabile).
```

🤖 Generated with [Claude Code](https://claude.com/claude-code)
