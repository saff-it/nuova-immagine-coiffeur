import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const GALLERY_START = '<!-- GALLERY:START -->';
const GALLERY_END   = '<!-- GALLERY:END -->';

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

async function fetchAllResources() {
  const results = [];
  let nextCursor;
  do {
    const res = await cloudinary.api.resources({
      resource_type: 'image',
      type:          'upload',
      max_results:   500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });
    results.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return results;
}

function buildGalleryItems(images) {
  return images.map((img, i) => {
    const url = cloudinary.url(img.public_id, {
      fetch_format: 'auto',
      quality:      'auto',
      width:        i === 0 ? 1200 : 800,
    });
    const alt = img.context?.custom?.alt
      ?? img.public_id.replace(/[_/-]/g, ' ').replace(/\s+/g, ' ').trim();
    return `    <div class="gallery__item" role="listitem">\n      <img src="${url}" alt="${alt}" loading="lazy">\n    </div>`;
  }).join('\n');
}

async function main() {
  // ── 1. Cloudinary ──────────────────────────────────────────────
  console.log('\n📸  Leggo le immagini da Cloudinary…');
  const images = await fetchAllResources();
  if (images.length === 0) { console.log('Nessuna immagine trovata.'); return; }
  console.log(`    Trovate ${images.length} immagini.`);

  // ── 2. Aggiorna index.html ─────────────────────────────────────
  console.log('\n✏️   Aggiorno index.html…');
  const items = buildGalleryItems(images);
  const html  = readFileSync('index.html', 'utf8');
  const start = html.indexOf(GALLERY_START);
  const end   = html.indexOf(GALLERY_END);
  if (start === -1 || end === -1) {
    console.error('Marker GALLERY:START / GALLERY:END non trovati in index.html.');
    process.exit(1);
  }
  const updated = html.slice(0, start) + GALLERY_START + '\n' + items + '\n    ' + html.slice(end);
  writeFileSync('index.html', updated, 'utf8');
  console.log('    index.html aggiornato.');

  // ── 3. Git commit ──────────────────────────────────────────────
  console.log('\n📦  Commit su GitHub…');
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  run(`git add index.html`);
  try {
    run(`git commit -m "chore: sync gallery from Cloudinary — ${date}"`);
  } catch {
    console.log('    Nessuna modifica da committare (gallery già aggiornata).');
  }

  // ── 4. Push → Vercel deploya automaticamente ───────────────────
  console.log('\n🚀  Push su GitHub (Vercel si aggiorna automaticamente)…');
  run('git push');

  console.log('\n✅  Deploy completato! Il sito sarà live in pochi secondi.');
  console.log('    https://nuova-immagine-coiffeur.vercel.app\n');
}

main().catch(err => { console.error(err); process.exit(1); });
