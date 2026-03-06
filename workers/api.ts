// Cloudflare Workers API für Osterfest Buffet Liste
// Verwendet Cloudflare D1 Datenbank

interface Env {
  DB: D1Database;
}

interface BuffetEntry {
  id: string;
  name: string;
  dish: string;
  created_at: string;
  updated_at?: string;
}

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /api/entries - Alle Einträge abrufen
      if (path === '/api/entries' && request.method === 'GET') {
        const result = await env.DB.prepare(
          'SELECT * FROM buffet_entries ORDER BY created_at DESC'
        ).all();

        const entries = result.results.map((row: any) => ({
          id: row.id,
          name: row.name,
          dish: row.dish,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        return new Response(
          JSON.stringify({ entries }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // POST /api/entries - Neuen Eintrag erstellen
      if (path === '/api/entries' && request.method === 'POST') {
        const { name, dish } = await request.json();

        if (!name || !dish) {
          return new Response(
            JSON.stringify({ error: 'Name und Gericht sind erforderlich' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        await env.DB.prepare(
          'INSERT INTO buffet_entries (id, name, dish, created_at) VALUES (?, ?, ?, ?)'
        )
          .bind(id, name, dish, createdAt)
          .run();

        return new Response(
          JSON.stringify({
            entry: { id, name, dish, createdAt },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // PUT /api/entries/:id - Eintrag aktualisieren
      const updateMatch = path.match(/^\/api\/entries\/([^/]+)$/);
      if (updateMatch && request.method === 'PUT') {
        const id = updateMatch[1];
        const { name, dish } = await request.json();

        if (!name || !dish) {
          return new Response(
            JSON.stringify({ error: 'Name und Gericht sind erforderlich' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        const updatedAt = new Date().toISOString();

        await env.DB.prepare(
          'UPDATE buffet_entries SET name = ?, dish = ?, updated_at = ? WHERE id = ?'
        )
          .bind(name, dish, updatedAt, id)
          .run();

        return new Response(
          JSON.stringify({
            entry: { id, name, dish, updatedAt },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // DELETE /api/entries/:id - Eintrag löschen
      const deleteMatch = path.match(/^\/api\/entries\/([^/]+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        const id = deleteMatch[1];

        await env.DB.prepare('DELETE FROM buffet_entries WHERE id = ?')
          .bind(id)
          .run();

        return new Response(
          JSON.stringify({ success: true }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // 404 - Route nicht gefunden
      return new Response(JSON.stringify({ error: 'Route nicht gefunden' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('API Fehler:', error);
      return new Response(
        JSON.stringify({
          error: 'Interner Serverfehler',
          details: error instanceof Error ? error.message : String(error),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};
