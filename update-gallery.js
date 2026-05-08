import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync, writeFileSync } from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER   = 'clienti/nuova-immagine-coiffeur/';
const GRADIENT = 'linear-gradient(120deg, rgba(30,28,26,.88) 0%, rgba(30,28,26,.62) 65%, rgba(30,28,26,.35) 100%)';

const MARKERS = {
  hero:    ['<!-- HERO:START -->',    '<!-- HERO:END -->'],
  about:   ['<!-- ABOUT:START -->',   '<!-- ABOUT:END -->'],
  gallery: ['<!-- GALLERY:START -->', '<!-- GALLERY:END -->'],
};

async function fetchImages() {
  const results = [];
  let nextCursor;
  do {
    const res = await cloudinary.api.resources({
      resource_type: 'image',
      type:          'upload',
      prefix:        FOLDER,
      max_results:   500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });
    results.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return results;
}

function cldUrl(publicId, width) {
  return cloudinary.url(publicId, { fetch_format: 'auto', quality: 'auto', width });
}

function altText(img) {
  return img.context?.custom?.alt
    ?? img.public_id.split('/').pop().replace(/[_-]/g, ' ').trim();
}

function replace(html, key, content) {
  const [start, end] = MARKERS[key];
  const s = html.indexOf(start);
  const e = html.indexOf(end) + end.length;
  return html.slice(0, s) + start + content + end + html.slice(e);
}

function heroBlock(img) {
  const url = cldUrl(img.public_id, 1920);
  return `<style>.hero__bg{background-image:${GRADIENT},url('${url}')}</style>`;
}

function aboutBlock(img) {
  return `<img src="${cldUrl(img.public_id, 900)}" alt="${altText(img)}" loading="lazy">`;
}

function galleryBlock(images) {
  return '\n' + images.map((img, i) => {
    const url = cldUrl(img.public_id, i === 0 ? 1200 : 800);
    return `    <div class="gallery__item" role="listitem">\n      <img src="${url}" alt="${altText(img)}" loading="lazy">\n    </div>`;
  }).join('\n') + '\n    ';
}

async function main() {
  console.log(`Recupero immagini da Cloudinary (${FOLDER})…`);
  const images = await fetchImages();

  if (images.length === 0) {
    console.log(`Nessuna immagine trovata in ${FOLDER}`);
    console.log('Carica le immagini su Cloudinary nella cartella indicata.');
    return;
  }

  const [hero, about, ...gallery] = images;
  console.log(`Trovate ${images.length} immagini:`);
  console.log(`  hero    → ${hero.public_id}`);
  console.log(`  about   → ${about?.public_id ?? '(nessuna — serve almeno 2 immagini)'}`);
  console.log(`  gallery → ${gallery.length} immagini`);

  let html = readFileSync('index.html', 'utf8');
  html = replace(html, 'hero', heroBlock(hero));
  if (about) html = replace(html, 'about', aboutBlock(about));
  html = replace(html, 'gallery', galleryBlock(gallery));
  writeFileSync('index.html', html, 'utf8');
  console.log('index.html aggiornato.');
}

main().catch(err => { console.error(err); process.exit(1); });
