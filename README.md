# Osterfest Buffet Liste

Eine einfache Web-Anwendung zur Verwaltung einer Buffet-Liste für Veranstaltungen.

## Technologie-Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Cloudflare Workers
- **Datenbank**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages

## Features

- ✅ Gäste können sich mit Namen und mitgebrachtem Gericht eintragen
- ✅ Einträge können bearbeitet und gelöscht werden
- ✅ Responsive Design für Desktop und Mobile
- ✅ Übersichtliche Tabellen-Ansicht
- ✅ Echtzeit-Synchronisation über die Cloud
- ✅ Kostenlos hostbar auf Cloudflare

## Lokale Entwicklung

### Voraussetzungen

- Node.js 18+ installiert
- Wrangler CLI installiert (`npm install -g wrangler`)

### Installation

```bash
# Dependencies installieren
npm install

# Wrangler CLI global installieren (falls noch nicht geschehen)
npm install -g wrangler

# Bei Cloudflare anmelden
wrangler login

# D1 Datenbank erstellen
wrangler d1 create osterfest-buffet

# Datenbank-Schema erstellen (lokal für Tests)
wrangler d1 execute osterfest-buffet --local --file=./schema.sql
```

### Development Server starten

```bash
# Terminal 1: Workers API starten
wrangler dev

# Terminal 2: Frontend Dev Server starten (in neuem Terminal)
npm run dev
```

Erstellen Sie eine `.env.development` Datei:
```
VITE_API_URL=http://localhost:8787/api
```

Die App läuft dann auf `http://localhost:5173`

## Deployment

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Anweisungen.

**Kurz-Zusammenfassung:**

```bash
# 1. Workers API deployen
wrangler deploy

# 2. Frontend bauen
npm run build

# 3. Auf Cloudflare Pages deployen
wrangler pages deploy dist --project-name=osterfest-buffet
```

## Projektstruktur

```
.
├── src/
│   ├── app/
│   │   └── App.tsx              # Haupt-React-Komponente
│   └── styles/                   # CSS-Dateien
├── workers/
│   └── api.ts                    # Cloudflare Workers API
├── schema.sql                    # D1 Datenbank Schema
├── wrangler.toml                 # Cloudflare Workers Konfiguration
├── DEPLOYMENT.md                 # Deployment-Anleitung
└── package.json
```

## API Endpunkte

- `GET /api/entries` - Alle Einträge abrufen
- `POST /api/entries` - Neuen Eintrag erstellen
- `PUT /api/entries/:id` - Eintrag aktualisieren
- `DELETE /api/entries/:id` - Eintrag löschen

## Lizenz

MIT

## Event-Details

- **Veranstaltung**: Osterfest Buffet
- **Datum**: Gründonnerstag, 2. April 2026
- **Uhrzeit**: ab 18 Uhr
- **Ort**: Lauenburger Straße 2, 21379 Echem
