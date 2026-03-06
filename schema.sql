-- SQL Schema für D1 Datenbank
-- Führen Sie diesen Befehl aus, um die Tabelle zu erstellen:
-- wrangler d1 execute osterfest-buffet --local --file=./schema.sql
-- oder für Production:
-- wrangler d1 execute osterfest-buffet --file=./schema.sql

DROP TABLE IF EXISTS buffet_entries;

CREATE TABLE buffet_entries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  dish TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);

-- Index für schnellere Sortierung nach Erstellungsdatum
CREATE INDEX idx_created_at ON buffet_entries(created_at DESC);
