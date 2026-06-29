# reel-remotion — render de reels propio (reemplaza Creatomate)

Microservicio que renderiza **reels verticales 1080x1920** con [Remotion](https://www.remotion.dev).
Sin créditos: vos renderizás en tu VPS. **4 plantillas que rotan** + **música rotativa**.

```
n8n (texto de Claude + imagen Unsplash)
  --> POST /render { texto, imagen, hashtags }
        - elige variante (0-3) y musica al azar
        - renderiza el MP4
        - lo sube a Supabase Storage
        - responde { url }
  --> n8n sigue: YouTube -> Make publica el reel
```

## Endpoint

`POST /render`
```json
{
  "texto": "Tus precios se actualizan solos",
  "hashtags": "#automatizacion #pymes #IA #varka",
  "imagen": "https://images.unsplash.com/...",
  "variant": 2,        // opcional: 0-3. Si no lo mandás, elige al azar.
  "music": "calm.mp3"  // opcional: forzar una pista. Si no, elige al azar.
}
```
Respuesta: `{ "url": "https://...supabase.../reel-123.mp4", "variant": 2, "music": "calm.mp3" }`

`GET /` -> health check.

## Las 4 plantillas (variantes)
- **0** — Centro oscuro: overlay oscuro, texto grande centrado.
- **1** — Banda inferior: imagen arriba, banda verde marca abajo con el texto.
- **2** — Minimal abajo: degradé fuerte, texto abajo a la izquierda.
- **3** — Tinte verde: imagen con tinte de marca, texto arriba.

Todas con: logo Varka, zoom lento del fondo (Ken Burns), animación de entrada del texto, hashtags abajo y música.

## Local (probar / diseñar)
```bash
npm install
npm run studio     # abre Remotion Studio para ver/editar las variantes
npm run render     # renderiza un reel de prueba a out/reel.mp4
```

## Deploy en EasyPanel (VPS)
1. **Supabase:** creá un bucket **público** llamado `reels` (Storage -> New bucket -> Public).
2. Subí esta carpeta a un repo (ej. GitHub privado).
3. En EasyPanel: **App nueva** -> Source = GitHub -> Build = **Dockerfile**.
4. **Environment:** pegá las vars del `.env.example` (SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET, PORT).
5. **Domains:** Container Port = **8080**.
6. Deploy. El log debe decir "Bundle Remotion listo." y "Render server escuchando en :8080".

> El primer build tarda (descarga el navegador headless). Render de un reel de 15s: ~1-3 min según el VPS.

## Música
Poné pistas royalty-free en `public/music/` (ver el README de esa carpeta). Vacía = reel sin música.

## RAM
El render usa Chromium headless (pesado). Está configurado a **concurrencia 1** y los renders se **serializan** (1 a la vez) para no reventar el VPS. Para 1-3 reels/semana va sobrado. Si el VPS queda corto de RAM, conviene Remotion Lambda (AWS).

## Licencia Remotion
Gratis para individuos y equipos chicos (≤3 personas). Si Varka crece, revisar la licencia de empresa de Remotion.