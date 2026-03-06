# Dateien, die beim Export entfernt werden sollten (Figma-spezifisch)

## Zu entfernende Dateien:
- /utils/supabase/info.tsx
- /supabase/functions/server/index.tsx
- /supabase/functions/server/kv_store.tsx
- /src/app/components/figma/ImageWithFallback.tsx

## Hinweis:
Diese Dateien sind Figma Make-spezifisch und werden für das Cloudflare-Deployment nicht benötigt.
Das neue Backend befindet sich in /workers/api.ts
