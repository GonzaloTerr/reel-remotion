// Microservicio de render. POST /render { texto, imagen, hashtags?, variant?, music? }
// -> elige variante + musica al azar, renderiza el reel, lo GUARDA y lo SIRVE en una
//    URL publica propia (/renders/...). Devuelve { url }. Sin storage externo ni claves.
//    Renders serializados (1 a la vez) por la RAM.
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, ensureBrowser } from '@remotion/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8080;
const RENDERS_DIR = path.join(__dirname, 'renders');
fs.mkdirSync(RENDERS_DIR, { recursive: true });

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use('/renders', express.static(RENDERS_DIR)); // sirve los MP4 publicamente

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

// Borra renders de mas de 2 horas (ya fueron publicados; evita llenar el disco)
function limpiarViejos() {
  const limite = Date.now() - 2 * 60 * 60 * 1000;
  try {
    for (const f of fs.readdirSync(RENDERS_DIR)) {
      const fp = path.join(RENDERS_DIR, f);
      if (fs.statSync(fp).mtimeMs < limite) fs.unlinkSync(fp);
    }
  } catch {}
}

app.get('/', (_req, res) => res.json({ status: 'ok', bundled: !!serveUrl }));

app.post('/render', async (req, res) => {
  const { texto, hashtags = '', imagen, variant, music } = req.body || {};
  if (!texto || !imagen) return res.status(400).json({ error: 'faltan texto o imagen' });
  if (!serveUrl) return res.status(503).json({ error: 'bundle todavia no esta listo' });

  const run = lock.then(async () => {
    limpiarViejos();
    const pistas = musicaDisponible();
    const musicFile = music || (pistas.length ? pistas[Math.floor(Math.random() * pistas.length)] : '');
    const v = Number.isInteger(variant) ? variant : Math.floor(Math.random() * 4);
    const inputProps = { texto, hashtags, imagen, musicFile, variant: v };

    const composition = await selectComposition({ serveUrl, id: 'Reel', inputProps });
    const fileName = `reel-${Date.now()}.mp4`;
    const out = path.join(RENDERS_DIR, fileName);
    await renderMedia({ composition, serveUrl, codec: 'h264', outputLocation: out, inputProps, concurrency: 1 });
    return { fileName, v, musicFile };
  });
  lock = run.catch(() => {}); // el lock sigue vivo aunque un render falle

  try {
    const { fileName, v, musicFile } = await run;
    const base = process.env.PUBLIC_URL || 'https://' + req.get('host');
    res.json({ url: `${base}/renders/${fileName}`, variant: v, music: musicFile });
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