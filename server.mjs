// Microservicio de render. POST /render { texto, imagen, hashtags?, variant?, music? }
// -> elige variante + musica al azar, renderiza el reel, lo sube a Supabase Storage y
//    devuelve { url }. Renders serializados (1 a la vez) para cuidar la RAM del VPS.
import express from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, ensureBrowser } from '@remotion/renderer';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const BUCKET = process.env.SUPABASE_BUCKET || 'reels';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const app = express();
app.use(express.json({ limit: '2mb' }));

let serveUrl = null;
let lock = Promise.resolve(); // mutex: 1 render a la vez

function musicaDisponible() {
  try {
    return fs
      .readdirSync(path.join(__dirname, 'public', 'music'))
      .filter((f) => /\.(mp3|m4a|wav)$/i.test(f));
  } catch {
    return [];
  }
}

app.get('/', (_req, res) => res.json({ status: 'ok', bundled: !!serveUrl }));

app.post('/render', async (req, res) => {
  const { texto, hashtags = '', imagen, variant, music } = req.body || {};
  if (!texto || !imagen) return res.status(400).json({ error: 'faltan texto o imagen' });
  if (!serveUrl) return res.status(503).json({ error: 'bundle todavia no esta listo' });

  const run = lock.then(async () => {
    const pistas = musicaDisponible();
    const musicFile = music || (pistas.length ? pistas[Math.floor(Math.random() * pistas.length)] : '');
    const v = Number.isInteger(variant) ? variant : Math.floor(Math.random() * 4);
    const inputProps = { texto, hashtags, imagen, musicFile, variant: v };

    const composition = await selectComposition({ serveUrl, id: 'Reel', inputProps });
    const out = path.join(os.tmpdir(), `reel-${Date.now()}.mp4`);
    await renderMedia({ composition, serveUrl, codec: 'h264', outputLocation: out, inputProps, concurrency: 1 });

    const buf = fs.readFileSync(out);
    const fileName = `reel-${Date.now()}.mp4`;
    const up = await supabase.storage.from(BUCKET).upload(fileName, buf, {
      contentType: 'video/mp4',
      upsert: true,
    });
    fs.unlink(out, () => {});
    if (up.error) throw new Error('Supabase upload: ' + up.error.message);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return { url: data.publicUrl, variant: v, music: musicFile };
  });
  lock = run.catch(() => {}); // el lock sigue vivo aunque un render falle

  try {
    res.json(await run);
  } catch (e) {
    console.error('render error:', e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

(async () => {
  await ensureBrowser();
  serveUrl = await bundle({ entryPoint: path.join(__dirname, 'src', 'index.ts') });
  console.log('Bundle Remotion listo.');
  app.listen(PORT, () => console.log('Render server escuchando en :' + PORT));
})().catch((e) => {
  console.error('Init fallo:', e);
  process.exit(1);
});