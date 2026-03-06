# Deployment-Anleitung für Cloudflare Pages + D1 Datenbank

## Voraussetzungen

- Ein [Cloudflare](https://cloudflare.com) Account (kostenlos)
- [Node.js](https://nodejs.org/) installiert
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installiert

## Schritt 1: Wrangler CLI installieren

```bash
npm install -g wrangler
```

## Schritt 2: Bei Cloudflare anmelden

```bash
wrangler login
```

## Schritt 3: D1 Datenbank erstellen

```bash
# Datenbank erstellen
wrangler d1 create osterfest-buffet
```

Sie erhalten eine `database_id`. Kopieren Sie diese und fügen Sie sie in `wrangler.toml` ein.

## Schritt 4: Datenbank-Schema erstellen

```bash
# Schema in lokaler Datenbank erstellen (für Tests)
wrangler d1 execute osterfest-buffet --local --file=./schema.sql

# Schema in Production-Datenbank erstellen
wrangler d1 execute osterfest-buffet --file=./schema.sql
```

## Schritt 5: Workers API deployen

```bash
# Lokal testen
wrangler dev

# In Production deployen
wrangler deploy
```

Nach dem Deployment erhalten Sie eine URL wie:
`https://osterfest-buffet-api.IHRE_SUBDOMAIN.workers.dev`

## Schritt 6: Frontend-App bauen

Erstellen Sie eine `.env.production` Datei:

```
VITE_API_URL=https://osterfest-buffet-api.IHRE_SUBDOMAIN.workers.dev/api
```

Dann bauen Sie die App:

```bash
npm install
npm run build
```

## Schritt 7: Frontend auf Cloudflare Pages deployen

### Option A: Über das Dashboard (einfachste Methode)

1. Gehen Sie zu [Cloudflare Pages Dashboard](https://dash.cloudflare.com/pages)
2. Klicken Sie auf "Create a project" → "Upload assets"
3. Wählen Sie den `dist` Ordner aus
4. Geben Sie einen Projektnamen ein (z.B. "osterfest-buffet")
5. Klicken Sie auf "Deploy"

### Option B: Mit Wrangler CLI

```bash
# Zuerst ein Pages-Projekt erstellen (einmalig)
wrangler pages project create osterfest-buffet

# Dann deployen
wrangler pages deploy dist --project-name=osterfest-buffet
```

## Schritt 8: Umgebungsvariable setzen (Optional)

Falls Sie die API-URL als Umgebungsvariable setzen möchten:

```bash
wrangler pages deployment tail --project-name=osterfest-buffet
```

Im Cloudflare Pages Dashboard:
1. Gehen Sie zu Ihrem Projekt
2. Settings → Environment Variables
3. Fügen Sie hinzu: `VITE_API_URL` = Ihre Workers URL

## Fertig!

Ihre App ist jetzt live unter:
`https://osterfest-buffet.pages.dev`

## Lokale Entwicklung

```bash
# Terminal 1: Workers API starten
wrangler dev

# Terminal 2: Frontend Dev Server starten
npm run dev
```

Erstellen Sie eine `.env.development` Datei:
```
VITE_API_URL=http://localhost:8787/api
```

## Kosten

- **Cloudflare Pages**: Kostenlos (500 Builds/Monat)
- **Cloudflare Workers**: Kostenlos (100.000 Requests/Tag)
- **D1 Datenbank**: Kostenlos (5GB Speicher, 5 Millionen Rows gelesen/Tag)

## Support

Bei Problemen:
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
