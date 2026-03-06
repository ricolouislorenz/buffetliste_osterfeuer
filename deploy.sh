#!/bin/bash

# Schnellstart-Skript für Cloudflare Deployment

echo "🚀 Osterfest Buffet - Cloudflare Deployment"
echo "==========================================="
echo ""

# Schritt 1: Dependencies installieren
echo "📦 Schritt 1: Dependencies installieren..."
npm install

# Schritt 2: Wrangler installieren (falls nicht vorhanden)
echo ""
echo "🔧 Schritt 2: Wrangler CLI prüfen..."
if ! command -v wrangler &> /dev/null
then
    echo "Wrangler nicht gefunden. Installiere global..."
    npm install -g wrangler
else
    echo "Wrangler ist bereits installiert ✓"
fi

# Schritt 3: Login
echo ""
echo "🔑 Schritt 3: Bei Cloudflare anmelden..."
echo "Ein Browser-Fenster wird sich öffnen. Bitte melden Sie sich an."
wrangler login

# Schritt 4: D1 Datenbank erstellen
echo ""
echo "💾 Schritt 4: D1 Datenbank erstellen..."
echo "Führen Sie diesen Befehl aus und kopieren Sie die database_id:"
echo ""
echo "    wrangler d1 create osterfest-buffet"
echo ""
read -p "Haben Sie die database_id in wrangler.toml eingetragen? (j/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Jj]$ ]]
then
    echo "⚠️  Bitte tragen Sie die database_id in wrangler.toml ein und führen Sie das Skript erneut aus."
    exit 1
fi

# Schritt 5: Schema erstellen
echo ""
echo "🗄️  Schritt 5: Datenbank-Schema erstellen..."
echo "Lokal:"
wrangler d1 execute osterfest-buffet --local --file=./schema.sql
echo "Production:"
wrangler d1 execute osterfest-buffet --file=./schema.sql

# Schritt 6: Workers deployen
echo ""
echo "☁️  Schritt 6: Workers API deployen..."
wrangler deploy

echo ""
echo "📝 Bitte notieren Sie die Workers URL und tragen Sie sie in .env.production ein:"
echo "    VITE_API_URL=https://osterfest-buffet-api.IHRE_SUBDOMAIN.workers.dev/api"
echo ""
read -p "Haben Sie die URL in .env.production eingetragen? (j/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Jj]$ ]]
then
    echo "⚠️  Bitte tragen Sie die URL ein und bauen Sie dann die App mit 'npm run build'"
    exit 1
fi

# Schritt 7: Frontend bauen
echo ""
echo "🏗️  Schritt 7: Frontend bauen..."
npm run build

# Schritt 8: Pages deployen
echo ""
echo "🌐 Schritt 8: Auf Cloudflare Pages deployen..."
echo ""
echo "Option 1 - Über das Dashboard (empfohlen für Erstnutzer):"
echo "  1. Gehen Sie zu https://dash.cloudflare.com/pages"
echo "  2. Klicken Sie auf 'Create a project' → 'Upload assets'"
echo "  3. Wählen Sie den 'dist' Ordner"
echo "  4. Fertig!"
echo ""
echo "Option 2 - Mit CLI:"
echo "  wrangler pages deploy dist --project-name=osterfest-buffet"
echo ""
read -p "Möchten Sie mit CLI deployen? (j/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Jj]$ ]]
then
    wrangler pages project create osterfest-buffet
    wrangler pages deploy dist --project-name=osterfest-buffet
fi

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "Ihre App ist jetzt live! 🎉"
echo ""
echo "Nächste Schritte:"
echo "  - Öffnen Sie Ihre App-URL im Browser"
echo "  - Teilen Sie den Link mit Ihren Gästen"
echo "  - Überprüfen Sie die DEPLOYMENT.md für weitere Details"
echo ""
