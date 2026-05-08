import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const HERO_START    = '<!-- HERO:START -->';
const HERO_END      = '<!-- HERO:END -->';
const GALLERY_START = '<!-- GALLERY:START -->';
const GALLERY_END   = '<!-- GALLERY:END -->';
const GRADIENT      = 'linear-gradient(120deg, rgba(30,28,26,.88) 0%, rgba(30,28,26,.62) 65%, rgba(30,28,26,.35) 100%)';

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
      prefix:        'nuova-immagine-coiffeur/',
      max_results:   500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });
    results.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return results;
}

function cloudinaryUrl(publicId, width) {
  return cloudinary.url(publicId, { fetch_format: 'auto', quality: 'auto', width });
}

function updateHero(image, html) {
  const url    = cloudinaryUrl(image.public_id, 1920);
  const block  = `${HERO_START}<style>.hero__bg{background-image:${GRADIENT},url('${url}')}</style>${HERO_END}`;
  const start  = html.indexOf(HERO_START);
  const end    = html.indexOf(HERO_END) + HERO_END.length;
  return html.slice(0, start) + block + html.slice(end);
}

function buildGalleryItems(images) {
  return images.map((img, i) => {
    const url = cloudinaryUrl(img.public_id, i === 0 ? 1200 : 800);
    const alt = img.context?.custom?.alt
      ?? img.public_id.replace(/[_/-]/g, ' ').replace(/\s+/g, ' ').trim();
    return `    <div class="gallery__item" role="listitem">\n      <img src="${url}" alt="${alt}" loading="lazy">\n    </div>`;
  }).join('\n');
}

function updateGallery(images, html) {
  const items = buildGalleryItems(images);
  const start = html.indexOf(GALLERY_START);
  const end   = html.indexOf(GALLERY_END);
  return html.slice(0, start) + GALLERY_START + '\n' + items + '\n    ' + html.slice(end);
}

async function main() {
  // ── 1. Cloudinary ──────────────────────────────────────────────
  console.log('\n📸  Leggo le immagini da Cloudinary (nuova-immagine-coiffeur/)…');
  const images = await fetchAllResources();
  if (images.length === 0) {
    console.log('    Nessuna immagine trovata nella cartella nuova-immagine-coiffeur/.');
    console.log('    Carica almeno 1 immagine su Cloudinary nella cartella indicata.');
    return;
  }
  console.log(`    Trovate ${images.length} immagini.`);
  console.log(`    Hero → ${images[0].public_id}`);
  console.log(`    Gallery → ${images.slice(1).map(i => i.public_id).join(', ') || '(nessuna)'}`);

  // ── 2. Aggiorna index.html ─────────────────────────────────────
  console.log('\n✏️   Aggiorno index.html…');
  let html = readFileSync('index.html', 'utf8');
  html = updateHero(images[0], html);
  html = updateGallery(images.slice(1), html);
  writeFileSync('index.html', html, 'utf8');
  console.log('    index.html aggiornato.');

  // ── 3. Git commit ──────────────────────────────────────────────
  console.log('\n📦  Commit su GitHub…');
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  run('git add index.html');
  try {
    run(`git commit -m "chore: sync images from Cloudinary — ${date}"`);
  } catch {
    console.log('    Nessuna modifica da committare.');
  }

  // ── 4. Push → Vercel deploya automaticamente ───────────────────
  console.log('\n🚀  Push su GitHub (Vercel si aggiorna automaticamente)…');
  run('git push');

  console.log('\n✅  Deploy completato!');
  console.log('    https://nuova-immagine-coiffeur.vercel.app\n');
}

main().catch(err => { console.error(err); process.exit(1); });
