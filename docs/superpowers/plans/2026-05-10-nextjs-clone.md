# Nuova Immagine Coiffeur — Next.js Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing static HTML site to a Next.js 15 App Router project in-place, preserving the git repo and Vercel link, with Cloudinary images fetched at build-time.

**Architecture:** Single `app/page.tsx` Server Component (async) composes all section components. Cloudinary SDK called once at build-time via a `cache()`-wrapped helper. CSS design system ported verbatim from `index.html` into `globals.css`. Two client components: `Navbar` (scroll + mobile menu) and `ScrollAnimations` (global IntersectionObserver for `.reveal`/`.divider` elements). One null-rendering client component `HeroLoader` for the entrance animation.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, next-cloudinary 6, cloudinary SDK v2, Next.js Font Optimization (Google Fonts: Cormorant Garamond + Jost)

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | Next.js 15 project dependencies |
| `tsconfig.json` | TypeScript config for Next.js App Router |
| `next.config.ts` | Cloudinary `remotePatterns` |
| `.env.local` | `CLOUDINARY_CLOUD_NAME` + `API_KEY` + `API_SECRET` |
| `.gitignore` | Updated to include `.next/`, `out/`, `.env.local` |
| `app/globals.css` | Full design system: CSS variables, reset, all section styles, responsive |
| `app/layout.tsx` | Root layout: font variables, metadata, globals.css import |
| `app/page.tsx` | Async Server Component: calls `getSiteImages()`, composes all sections |
| `lib/cloudinary.ts` | `getSiteImages()` — lists folder, maps resources to hero/about/gallery |
| `components/ScrollAnimations.tsx` | Client: global `IntersectionObserver` for `.reveal` + `.divider` |
| `components/HeroLoader.tsx` | Client: adds `hero--loaded` class after mount (entrance animation) |
| `components/Navbar.tsx` | Client: scroll state + mobile menu open/close |
| `components/Hero.tsx` | Server: full-height section with Cloudinary bg via `getCldImageUrl` |
| `components/StatsStrip.tsx` | Server: 4-stat dark strip |
| `components/Servizi.tsx` | Server: 3 service cards grid |
| `components/About.tsx` | Server: 2-col layout with `CldImage` |
| `components/Gallery.tsx` | Server: photo grid with `CldImage` (first item spans 2×2) |
| `components/Testimonianze.tsx` | Server: 3 review cards |
| `components/CtaBand.tsx` | Server: dark CTA band with phone |
| `components/InfoOrari.tsx` | Server: hours table + Google Maps iframe |
| `components/Footer.tsx` | Server: 3-col footer |

---

### Task 1: Clean up old files and scaffold Next.js package.json

**Files:**
- Remove: `index.html`, `deploy.js`, `update-gallery.js`, `package-lock.json`, `node_modules/`
- Create: `package.json`, `tsconfig.json`, `.env.local`, `.gitignore`

- [ ] **Step 1: Remove old static site files**

```bash
cd /Users/simone/progetti-siti/nuova-immagine-coiffeur
rm -f index.html deploy.js update-gallery.js package-lock.json
rm -rf node_modules
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "nuova-immagine-coiffeur",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.3.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-cloudinary": "^6.16.0",
    "cloudinary": "^2.6.1"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/node": "^22.0.0"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create `.env.local`**

Copy credentials from the existing `.env` file (values already present there):

```
CLOUDINARY_CLOUD_NAME=dge5tnnsy
CLOUDINARY_API_KEY=282869782982146
CLOUDINARY_API_SECRET=mG1CttDzfeRgbfgUxKQavBoqBw8
```

- [ ] **Step 5: Update `.gitignore`**

```
# dependencies
/node_modules

# next.js
/.next/
/out/

# env files
.env
.env.local
.env.*.local

# vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 6: Run `npm install`**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Commit**

```bash
git add package.json tsconfig.json .gitignore
git commit -m "chore: scaffold Next.js 15 project (replace static setup)"
```

---

### Task 2: `next.config.ts`

**Files:**
- Create: `next.config.ts`

- [ ] **Step 1: Create `next.config.ts`**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: add next.config.ts with Cloudinary remotePatterns"
```

---

### Task 3: `lib/cloudinary.ts`

**Files:**
- Create: `lib/cloudinary.ts`

- [ ] **Step 1: Create `lib/cloudinary.ts`**

```ts
import { v2 as cloudinary } from 'cloudinary'
import { cache } from 'react'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryResource {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export interface SiteImages {
  hero: CloudinaryResource | null
  about: CloudinaryResource | null
  gallery: CloudinaryResource[]
}

export const getSiteImages = cache(async (): Promise<SiteImages> => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'clienti/nuova-immagine-coiffeur',
    max_results: 100,
  })

  const resources: CloudinaryResource[] = (result.resources as Array<{
    public_id: string
    secure_url: string
    width: number
    height: number
  }>).map((r) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
    width: r.width,
    height: r.height,
  }))

  const hero =
    resources.find((r) => r.public_id.includes('Gemini_Generated_Image')) ??
    resources[0] ??
    null

  const about =
    resources.find((r) => r.public_id.includes('2022-09-29')) ?? null

  const excludedIds = new Set(
    [hero?.public_id, about?.public_id].filter((id): id is string => Boolean(id))
  )
  const gallery = resources.filter((r) => !excludedIds.has(r.public_id))

  return { hero, about, gallery }
})
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run type-check
```

Expected: no errors (may note missing `next-env.d.ts` until first build — ignore).

- [ ] **Step 3: Commit**

```bash
git add lib/cloudinary.ts
git commit -m "feat: add Cloudinary SDK helper with semantic image mapping"
```

---

### Task 4: `app/globals.css` — design system

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Create `app/` directory and `globals.css`**

This is a verbatim port of the `<style>` block from `index.html`, with the font families updated to use Next.js CSS variables (`--font-cormorant`, `--font-jost`) that will be injected by `layout.tsx`:

```css
/* ─── Variables ───────────────────────────────────────────── */
:root {
  --cream:      #F2F2F2;
  --cream-alt:  #E8E8E8;
  --gold:       #B8975A;
  --gold-light: #D4B483;
  --gold-pale:  rgba(184,151,90,.15);
  --anthr:      #2A2A2A;
  --anthr-mid:  #555555;
  --white:      #FFFFFF;
  --f-title:    var(--font-cormorant), serif;
  --f-body:     var(--font-jost), sans-serif;
  --ease:       cubic-bezier(.4,0,.2,1);
}

/* ─── Reset ───────────────────────────────────────────────── */
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; font-size:16px; }
body { font-family:var(--f-body); font-weight:300; color:var(--anthr); background:var(--cream); line-height:1.7; -webkit-font-smoothing:antialiased; }
img  { display:block; max-width:100%; }
a    { color:inherit; text-decoration:none; }

/* ─── Utilities ───────────────────────────────────────────── */
.container { max-width:1200px; margin:0 auto; padding:0 48px; }

.label {
  font-family:var(--f-body);
  font-size:11px; font-weight:500;
  letter-spacing:3.5px; text-transform:uppercase;
  color:var(--gold); display:block; margin-bottom:18px;
}

.title {
  font-family:var(--f-title);
  font-size:clamp(2.2rem,3.8vw,3.4rem);
  font-weight:400; line-height:1.12;
  color:var(--anthr); margin-bottom:28px;
}
.title em { font-style:italic; color:var(--gold); }
.title--white { color:var(--white); }

.divider {
  width:56px; height:1px; background:var(--gold);
  margin-bottom:40px;
  transform:scaleX(0); transform-origin:left;
  transition:transform 0.9s var(--ease);
}
.divider--center { margin-left:auto; margin-right:auto; transform-origin:center; }
.divider.visible { transform:scaleX(1); }

.btn {
  display:inline-block;
  font-family:var(--f-body); font-size:11px; font-weight:500;
  letter-spacing:3px; text-transform:uppercase;
  padding:16px 40px; border:1px solid var(--gold);
  transition:background .3s var(--ease), color .3s var(--ease), border-color .3s var(--ease);
}
.btn--solid  { background:var(--gold); color:var(--white); }
.btn--solid:hover { background:transparent; color:var(--gold-light); border-color:var(--gold-light); }
.btn--ghost  { background:transparent; color:rgba(255,255,255,.8); border-color:rgba(255,255,255,.4); }
.btn--ghost:hover { border-color:var(--gold-light); color:var(--gold-light); }
.btn--dark   { background:transparent; color:var(--anthr); border-color:var(--anthr); }
.btn--dark:hover { background:var(--anthr); color:var(--white); }

.reveal { opacity:0; transition:opacity 1.0s var(--ease); }
.reveal.visible { opacity:1; }

/* ─── Navbar ──────────────────────────────────────────────── */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:900;
  padding:26px 0;
  transition:padding .35s var(--ease), background .35s var(--ease), box-shadow .35s var(--ease);
}
.nav.scrolled {
  padding:14px 0;
  background:rgba(30,28,26,.96);
  backdrop-filter:blur(12px);
  box-shadow:0 2px 40px rgba(0,0,0,.25);
}
.nav__inner { display:flex; align-items:center; justify-content:space-between; }
.nav__logo  { font-family:var(--f-title); font-size:1.3rem; color:var(--white); letter-spacing:.5px; white-space:nowrap; }
.nav__logo em { font-style:normal; color:var(--gold-light); }
.nav__links { display:flex; gap:36px; list-style:none; }
.nav__links a { font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.72); font-weight:400; transition:color .3s; }
.nav__links a:hover { color:var(--gold-light); }
.nav__cta { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--white); font-weight:500; padding:9px 22px; border:1px solid var(--gold); transition:background .3s, color .3s; }
.nav__cta:hover { background:var(--gold); }
.nav__burger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:4px; }
.nav__burger span { display:block; width:24px; height:1px; background:var(--white); transition:all .3s; }

.mob-menu { display:none; position:fixed; inset:0; z-index:950; background:var(--anthr); flex-direction:column; align-items:center; justify-content:center; gap:28px; }
.mob-menu.open { display:flex; }
.mob-menu__close { position:absolute; top:24px; right:36px; background:none; border:none; color:rgba(255,255,255,.6); font-size:1.8rem; cursor:pointer; line-height:1; }
.mob-menu a { font-family:var(--f-title); font-size:2.6rem; color:var(--white); transition:color .3s; }
.mob-menu a:hover { color:var(--gold-light); }
.mob-menu__tel { font-family:var(--f-title); font-size:1.4rem !important; color:var(--gold-light) !important; letter-spacing:2px; }

/* ─── Hero ────────────────────────────────────────────────── */
.hero { position:relative; height:100vh; min-height:680px; display:flex; align-items:center; padding-top:80px; padding-bottom:100px; }
.hero__bg { position:absolute; inset:0; background-size:cover; background-position:center; background-repeat:no-repeat; }
.hero__content { position:relative; z-index:2; max-width:660px; }
.hero__eyebrow { font-size:11px; letter-spacing:4px; text-transform:uppercase; color:var(--gold-light); font-weight:500; display:block; margin-bottom:22px; }
.hero__title { font-family:var(--f-title); font-weight:300; font-size:clamp(3rem,6.5vw,5.8rem); color:var(--white); line-height:1.04; margin-bottom:28px; }
.hero__title em { font-style:italic; color:var(--gold-light); }
.hero__sub { font-size:15px; color:rgba(255,255,255,.72); max-width:460px; line-height:1.85; margin-bottom:48px; }
.hero__btns { display:flex; gap:16px; flex-wrap:wrap; }

.hero__scroll { position:absolute; bottom:44px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:10px; font-size:9px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,.4); }
.hero__scroll::after { content:''; display:block; width:1px; height:40px; background:rgba(255,255,255,.25); animation:scrollbar 2.2s ease-in-out infinite; }
@keyframes scrollbar {
  0%   { transform:scaleY(0); transform-origin:top; }
  49%  { transform:scaleY(1); transform-origin:top; }
  50%  { transform:scaleY(1); transform-origin:bottom; }
  100% { transform:scaleY(0); transform-origin:bottom; }
}

.hero__eyebrow, .hero__title, .hero__sub, .hero__btns { opacity:0; transition:opacity 1.2s var(--ease); }
.hero--loaded .hero__eyebrow { opacity:1; transition-delay:0.3s; }
.hero--loaded .hero__title   { opacity:1; transition-delay:0.6s; }
.hero--loaded .hero__sub     { opacity:1; transition-delay:0.9s; }
.hero--loaded .hero__btns    { opacity:1; transition-delay:1.15s; }

/* ─── Strip ───────────────────────────────────────────────── */
.strip { background:var(--anthr); padding:34px 0; }
.strip__row { display:flex; align-items:center; justify-content:space-around; gap:24px; flex-wrap:wrap; }
.strip__sep { width:1px; height:52px; background:rgba(255,255,255,.12); }
.strip__item { text-align:center; }
.strip__num { display:block; font-family:var(--f-title); font-size:2.6rem; color:var(--gold-light); line-height:1; margin-bottom:4px; }
.strip__lbl { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.5); }

/* ─── Servizi ─────────────────────────────────────────────── */
.servizi { background:var(--cream); padding:100px 0; }
.servizi__head { text-align:center; margin-bottom:68px; }
.servizi__grid { display:grid; grid-template-columns:repeat(3,1fr); gap:3px; }
.serv-card { background:var(--white); padding:52px 40px; position:relative; overflow:hidden; transition:transform .32s var(--ease), box-shadow .32s var(--ease); }
.serv-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .35s var(--ease); }
.serv-card:hover::after { transform:scaleX(1); }
.serv-card:hover { transform:translateY(-5px); box-shadow:0 24px 60px rgba(0,0,0,.07); }
.serv-card__ico  { font-size:1.9rem; color:var(--gold); margin-bottom:22px; display:block; line-height:1; }
.serv-card__name { font-family:var(--f-title); font-size:1.55rem; margin-bottom:14px; }
.serv-card__text { font-size:14px; color:var(--anthr-mid); line-height:1.85; }

/* ─── About ───────────────────────────────────────────────── */
.about { background:var(--cream-alt); padding:100px 0; }
.about__grid { display:grid; grid-template-columns:1fr 1fr; gap:96px; align-items:center; }
.about__img-wrap { position:relative; min-height:540px; background:var(--anthr); }
.about__img-wrap::before { content:''; position:absolute; top:-22px; left:-22px; right:22px; bottom:22px; border:1px solid var(--gold); z-index:0; }
.about__img-wrap img { position:relative; z-index:1; width:100%; height:540px; object-fit:cover; }
.about__badge { position:absolute; bottom:-18px; right:-18px; z-index:2; width:114px; height:114px; background:var(--anthr); display:flex; flex-direction:column; align-items:center; justify-content:center; }
.about__badge strong { font-family:var(--f-title); font-size:2.6rem; color:var(--gold-light); font-weight:400; line-height:1; }
.about__badge span { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,.5); }
.about__text p { font-size:15px; color:var(--anthr-mid); line-height:1.95; margin-bottom:18px; }
.about__firma { margin-top:40px; padding-top:32px; border-top:1px solid rgba(184,151,90,.3); }
.about__firma-name { font-family:var(--f-title); font-size:3rem; font-style:italic; font-weight:700; color:#C9A96E; }
.about__firma-role { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:500; margin-top:4px; }

/* ─── Gallery ─────────────────────────────────────────────── */
.gallery { background:var(--anthr); padding-top:90px; }
.gallery__head { text-align:center; margin-bottom:56px; }
.gallery__head .label  { color:var(--gold-light); }
.gallery__head .title  { color:var(--white); }
.gallery__head .divider { background:var(--gold); }
.gallery__grid { display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:270px 270px; gap:4px; }
.gallery__item { overflow:hidden; position:relative; }
.gallery__item::after { content:''; position:absolute; inset:0; background:var(--gold); opacity:0; transition:opacity 0.5s var(--ease); pointer-events:none; }
.gallery__item:hover::after { opacity:0.14; }
.gallery__item:first-child { grid-column:span 2; grid-row:span 2; }
.gallery__item img { width:100%; height:100%; object-fit:cover; filter:brightness(.88) saturate(.9); transition:filter 0.5s var(--ease); }
.gallery__item:hover img { filter:brightness(1) saturate(1); }

/* ─── Testimonianze ───────────────────────────────────────── */
.testi { background:var(--cream); padding:100px 0; }
.testi__head { text-align:center; margin-bottom:60px; }
.testi__grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
.testi-card { background:var(--white); padding:40px 36px; }
.testi-card__quote { font-family:var(--f-title); font-size:4.5rem; color:var(--gold); line-height:.5; display:block; margin-bottom:20px; }
.testi-card__body  { font-family:var(--f-title); font-size:1.12rem; font-style:italic; color:var(--anthr-mid); line-height:1.85; margin-bottom:26px; }
.testi-card__stars { color:var(--gold); font-size:10px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:16px; }
.testi-card__name  { font-size:12px; font-weight:500; letter-spacing:1.5px; text-transform:uppercase; }
.testi-card__since { font-size:12px; color:var(--anthr-mid); }

/* ─── CTA Band ────────────────────────────────────────────── */
.cta-band { background:rgba(28,26,24,.98); padding:110px 0; text-align:center; }
.cta-band .label { color:var(--gold-light); }
.cta-band__title { font-family:var(--f-title); font-weight:300; font-size:clamp(2.6rem,5vw,4.2rem); color:var(--white); line-height:1.1; margin-bottom:20px; }
.cta-band__title em { font-style:italic; color:var(--gold-light); }
.cta-band__sub { font-size:15px; color:rgba(255,255,255,.65); max-width:520px; margin:0 auto 48px; }
.cta-band__tel { display:inline-flex; align-items:center; gap:14px; font-family:var(--f-title); font-size:clamp(2rem,4vw,3rem); color:var(--white); margin-bottom:14px; }
.cta-band__tel svg { width:28px; height:28px; fill:var(--gold-light); flex-shrink:0; }
.cta-band__tel:hover { color:var(--gold-light); }
.cta-band__note { font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:rgba(255,255,255,.35); }

/* ─── Info / Orari ────────────────────────────────────────── */
.info { background:var(--cream-alt); padding:0; }
.info__grid { display:grid; grid-template-columns:1fr 1fr; min-height:560px; }
.info__hours { padding:80px 60px 80px 0; }
.info__hours-inner { max-width:480px; margin-left:auto; }
.info__table { width:100%; border-collapse:collapse; margin-top:36px; }
.info__table tr { border-bottom:1px solid rgba(184,151,90,.18); }
.info__table tr:last-child { border-bottom:none; }
.info__table td { padding:15px 0; font-size:14px; }
.info__table td:first-child { font-weight:500; letter-spacing:1.5px; text-transform:uppercase; font-size:11px; color:var(--anthr); }
.info__table td:last-child { text-align:right; }
.open   { color:var(--gold); font-weight:500; }
.closed { color:rgba(100,90,80,.55); font-style:italic; }
.info__address { margin-top:40px; padding-top:32px; border-top:1px solid rgba(184,151,90,.2); display:flex; flex-direction:column; gap:8px; }
.info__address p { font-size:13px; color:var(--anthr-mid); display:flex; align-items:center; gap:10px; }
.info__address a { color:var(--gold); transition:color .3s; }
.info__address a:hover { color:var(--gold-light); }
.info__map { position:relative; }
.info__map iframe { width:100%; height:100%; min-height:560px; border:none; display:block; filter:grayscale(20%); }

/* ─── Footer ──────────────────────────────────────────────── */
.footer { background:#181614; padding:64px 0 32px; }
.footer__grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:64px; margin-bottom:52px; }
.footer__logo { font-family:var(--f-title); font-size:1.55rem; color:var(--white); margin-bottom:14px; }
.footer__logo em { font-style:normal; color:var(--gold-light); }
.footer__desc { font-size:13px; color:rgba(255,255,255,.42); line-height:1.85; margin-bottom:24px; }
.footer__contacts { display:flex; flex-direction:column; gap:8px; }
.footer__contacts a { font-size:13px; color:rgba(255,255,255,.45); display:flex; align-items:center; gap:8px; transition:color .3s; }
.footer__contacts a:hover { color:var(--gold-light); }
.footer__col-ttl { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--gold-light); font-weight:500; margin-bottom:22px; }
.footer__nav { list-style:none; display:flex; flex-direction:column; gap:12px; }
.footer__nav a { font-size:13px; color:rgba(255,255,255,.42); transition:color .3s; }
.footer__nav a:hover { color:var(--gold-light); }
.footer__sched p { font-size:13px; color:rgba(255,255,255,.42); line-height:2.1; }
.footer__sched .open   { color:var(--gold-light); }
.footer__sched .closed { color:rgba(255,255,255,.22); }
.footer__bottom { border-top:1px solid rgba(255,255,255,.07); padding-top:26px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:11px; color:rgba(255,255,255,.3); }
.footer__bottom span.gold { color:var(--gold); }

/* ─── Responsive ──────────────────────────────────────────── */
@media (max-width:1024px) {
  .container { padding:0 32px; }
  .servizi__grid { grid-template-columns:repeat(2,1fr); }
  .about__grid { gap:60px; }
  .gallery__grid { grid-template-columns:repeat(2,1fr); grid-template-rows:260px 260px; }
  .gallery__item:first-child { grid-column:span 2; grid-row:span 1; }
  .footer__grid { grid-template-columns:1fr 1fr; }
}
@media (max-width:768px) {
  .container { padding:0 22px; }
  .nav__links, .nav__cta { display:none; }
  .hero__scroll { display:none; }
  .nav__burger { display:flex; }
  section { padding:72px 0 !important; }
  .servizi__grid  { grid-template-columns:1fr; }
  .about__grid    { grid-template-columns:1fr; gap:40px; }
  .about__img-wrap::before { display:none; }
  .about__img-wrap img { height:360px; }
  .about__badge { right:12px; bottom:12px; }
  .gallery__grid  { grid-template-columns:1fr 1fr; grid-template-rows:220px 220px; }
  .gallery__item:first-child { grid-column:span 2; }
  .testi__grid    { grid-template-columns:1fr; }
  .info__grid     { grid-template-columns:1fr; }
  .info__hours    { padding:60px 22px; }
  .info__hours-inner { max-width:none; }
  .info__map iframe { min-height:300px; }
  .footer__grid   { grid-template-columns:1fr; gap:40px; }
  .footer__bottom { flex-direction:column; text-align:center; }
}
@media (max-width:480px) {
  .hero__btns { flex-direction:column; }
  .gallery__grid { grid-template-columns:1fr; grid-template-rows:auto; }
  .gallery__item, .gallery__item:first-child { grid-column:span 1; grid-row:span 1; }
  .gallery__item img { height:260px; width:100%; }
  .strip__sep { display:none; }
}
@media (prefers-reduced-motion: reduce) {
  .reveal, .divider, .hero__eyebrow, .hero__title, .hero__sub, .hero__btns,
  .gallery__item::after, .gallery__item img, .hero__scroll::after {
    transition: none !important;
    animation:  none !important;
  }
  .reveal       { opacity:1 !important; }
  .divider      { transform:scaleX(1) !important; }
  .hero__eyebrow, .hero__title, .hero__sub, .hero__btns { opacity:1 !important; }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add design system globals.css (ported verbatim from static HTML)"
```

---

### Task 5: `app/layout.tsx`

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1: Create `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nuova Immagine Coiffeur — Milano dal 1984',
  description:
    'Nuova Immagine Coiffeur — Salone di parrucchieri a Milano dal 1984. Taglio, colore, trattamenti e acconciature in Piazza Bonomelli 4.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${cormorant.variable} ${jost.variable}`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with Next.js font optimization"
```

---

### Task 6: `components/ScrollAnimations.tsx` and `components/HeroLoader.tsx`

**Files:**
- Create: `components/ScrollAnimations.tsx`
- Create: `components/HeroLoader.tsx`

- [ ] **Step 1: Create `components/ScrollAnimations.tsx`**

This single global client component replaces per-element wrappers. It queries all `.reveal` and `.divider` elements after mount and attaches one `IntersectionObserver`:

```tsx
'use client'

import { useEffect } from 'react'

export default function ScrollAnimations() {
  useEffect(() => {
    const elements = document.querySelectorAll<Element>('.reveal, .divider')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
```

- [ ] **Step 2: Create `components/HeroLoader.tsx`**

```tsx
'use client'

import { useEffect } from 'react'

export default function HeroLoader() {
  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById('hero')?.classList.add('hero--loaded')
      })
    )
  }, [])

  return null
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/ScrollAnimations.tsx components/HeroLoader.tsx
git commit -m "feat: add ScrollAnimations and HeroLoader client components"
```

---

### Task 7: `components/Navbar.tsx`

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create `components/Navbar.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = () => {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }
  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav__inner">
            <a href="#" className="nav__logo">
              Nuova Immagine <em>Coiffeur</em>
            </a>
            <nav aria-label="Navigazione principale">
              <ul className="nav__links">
                <li><a href="#servizi">Servizi</a></li>
                <li><a href="#about">Chi Siamo</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#testi">Recensioni</a></li>
                <li><a href="#orari">Orari</a></li>
              </ul>
            </nav>
            <a href="tel:02537982" className="nav__cta">02 537982</a>
            <button
              className="nav__burger"
              aria-label="Apri menu"
              aria-expanded={menuOpen}
              onClick={openMenu}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mob-menu${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <button className="mob-menu__close" aria-label="Chiudi menu" onClick={closeMenu}>
          ✕
        </button>
        <a href="#servizi" onClick={closeMenu}>Servizi</a>
        <a href="#about"   onClick={closeMenu}>Chi Siamo</a>
        <a href="#gallery" onClick={closeMenu}>Gallery</a>
        <a href="#testi"   onClick={closeMenu}>Recensioni</a>
        <a href="#orari"   onClick={closeMenu}>Orari</a>
        <a href="tel:02537982" className="mob-menu__tel">02 537982</a>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat: add Navbar client component with scroll state and mobile menu"
```

---

### Task 8: `components/Hero.tsx`

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Create `components/Hero.tsx`**

`getCldImageUrl` is a utility (not a component) and can be called in Server Components:

```tsx
import { getCldImageUrl } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function Hero({ image }: { image: CloudinaryResource | null }) {
  const bgUrl = image
    ? getCldImageUrl({ src: image.public_id, width: 1920, quality: 'auto', format: 'auto' })
    : null

  const bgStyle: React.CSSProperties = bgUrl
    ? {
        backgroundImage: `linear-gradient(120deg,rgba(30,28,26,.88) 0%,rgba(30,28,26,.62) 65%,rgba(30,28,26,.35) 100%),url('${bgUrl}')`,
      }
    : { background: 'var(--anthr)' }

  return (
    <section className="hero" id="hero">
      <div
        className="hero__bg"
        role="img"
        aria-label="Interno del salone Nuova Immagine Coiffeur"
        style={bgStyle}
      />
      <div className="container">
        <div className="hero__content">
          <span className="hero__eyebrow">Milano · Piazza Bonomelli · Dal 1984</span>
          <h1 className="hero__title">
            L&apos;arte della<br /><em>bellezza</em><br />che dura nel tempo.
          </h1>
          <p className="hero__sub">
            Da quarant&apos;anni, Carmelo e il suo team accolgono ogni cliente con cura individuale
            e trasformano ogni visita in un&apos;esperienza di stile raffinato.
          </p>
          <div className="hero__btns">
            <a href="tel:02537982" className="btn btn--solid">Prenota Appuntamento</a>
            <a href="#servizi"     className="btn btn--ghost">Scopri i Servizi</a>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">Scorri</div>
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero server component with Cloudinary background"
```

---

### Task 9: `components/StatsStrip.tsx`

**Files:**
- Create: `components/StatsStrip.tsx`

- [ ] **Step 1: Create `components/StatsStrip.tsx`**

```tsx
import { Fragment } from 'react'

const stats = [
  { num: '40+',    lbl: 'Anni di esperienza',  delay: '0s' },
  { num: '1984',   lbl: 'Anno di fondazione',   delay: '0.15s' },
  { num: 'Milano', lbl: 'Piazza Bonomelli 4',   delay: '0.3s' },
  { num: '5 ★',   lbl: 'Clienti soddisfatti',  delay: '0.45s' },
]

export default function StatsStrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="container">
        <div className="strip__row">
          {stats.map((s, i) => (
            <Fragment key={s.num}>
              {i > 0 && <div className="strip__sep" />}
              <div className="strip__item reveal" style={{ transitionDelay: s.delay }}>
                <strong className="strip__num">{s.num}</strong>
                <span className="strip__lbl">{s.lbl}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/StatsStrip.tsx
git commit -m "feat: add StatsStrip server component"
```

---

### Task 10: `components/Servizi.tsx`

**Files:**
- Create: `components/Servizi.tsx`

- [ ] **Step 1: Create `components/Servizi.tsx`**

```tsx
const services = [
  {
    icon: '✂',
    name: 'Taglio Sartoriale',
    text: "Dal taglio classico all'interpretazione più contemporanea. Ascoltiamo la tua personalità per creare una forma su misura che valorizzi i tuoi tratti unici.",
  },
  {
    icon: '◈',
    name: 'Colorazione Professionale',
    text: 'Tinta piena e tecniche di colore selezionate. Colori vivi e luminosi realizzati con prodotti di alta qualità, rispettosi della struttura del capello.',
  },
  {
    icon: '❧',
    name: 'Piega e Styling',
    text: 'Asciugatura professionale, piega liscia o ondulata. Un finish impeccabile per la quotidianità o per gli eventi che contano.',
  },
]

export default function Servizi() {
  return (
    <section className="servizi" id="servizi">
      <div className="container">
        <div className="servizi__head">
          <span className="label">I Nostri Servizi</span>
          <h2 className="title">Ogni dettaglio,<br /><em>curato per te</em></h2>
          <div className="divider divider--center" />
        </div>
        <div className="servizi__grid">
          {services.map((s) => (
            <article key={s.name} className="serv-card reveal">
              <span className="serv-card__ico" aria-hidden="true">{s.icon}</span>
              <h3 className="serv-card__name">{s.name}</h3>
              <p className="serv-card__text">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Servizi.tsx
git commit -m "feat: add Servizi server component"
```

---

### Task 11: `components/About.tsx`

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Create `components/About.tsx`**

```tsx
import { CldImage } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function About({ image }: { image: CloudinaryResource | null }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">

          <div className="about__img-wrap reveal">
            {image ? (
              <CldImage
                src={image.public_id}
                width={900}
                height={540}
                alt="Salone Nuova Immagine Coiffeur"
                style={{ width: '100%', height: '540px', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                format="auto"
                quality="auto"
                loading="lazy"
              />
            ) : (
              <div style={{ width: '100%', height: '540px', background: 'var(--anthr)', position: 'relative', zIndex: 1 }} />
            )}
            <div className="about__badge" aria-hidden="true">
              <strong>40</strong>
              <span>anni</span>
            </div>
          </div>

          <div className="about__text reveal">
            <span className="label">La nostra storia</span>
            <h2 className="title">Una tradizione<br />di <em>eccellenza</em></h2>
            <div className="divider" />
            <p>Era il 1984 quando Carmelo aprì le porte di Nuova Immagine Coiffeur in Piazza Bonomelli 4, portando a Milano una visione della cura del capello come forma d&apos;arte.</p>
            <p>Quarant&apos;anni dopo, quella visione è rimasta intatta: ogni cliente viene accolto con attenzione individuale, ogni servizio viene eseguito con la precisione di chi ha affinato la propria tecnica in decenni di lavoro.</p>
            <p>Non si tratta solo di tagliare o colorare i capelli. Si tratta di capire chi sei, come vuoi presentarti al mondo, e aiutarti a realizzarlo — con maestria, passione e rispetto.</p>
            <div className="about__firma">
              <p className="about__firma-name">Carmelo</p>
              <p className="about__firma-role">Fondatore &amp; Master Stylist · dal 1984</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat: add About server component with CldImage"
```

---

### Task 12: `components/Gallery.tsx`

**Files:**
- Create: `components/Gallery.tsx`

- [ ] **Step 1: Create `components/Gallery.tsx`**

```tsx
import { CldImage } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function Gallery({ images }: { images: CloudinaryResource[] }) {
  const items = images.slice(0, 5)

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="gallery__head">
          <span className="label">Gallery</span>
          <h2 className="title title--white">Il nostro <em>lavoro</em></h2>
          <div className="divider divider--center" />
        </div>
      </div>
      <div className="gallery__grid" role="list" aria-label="Foto del salone e dei lavori">
        {items.map((img, i) => (
          <div key={img.public_id} className="gallery__item" role="listitem">
            <CldImage
              src={img.public_id}
              width={i === 0 ? 1200 : 800}
              height={i === 0 ? 540 : 270}
              alt={`Lavoro del salone ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              format="auto"
              quality="auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Gallery.tsx
git commit -m "feat: add Gallery server component with CldImage grid"
```

---

### Task 13: `components/Testimonianze.tsx`

**Files:**
- Create: `components/Testimonianze.tsx`

- [ ] **Step 1: Create `components/Testimonianze.tsx`**

```tsx
const reviews = [
  {
    body: 'Vado da Carmelo da più di 30 anni. Non potrei immaginare di andare altrove. Ogni volta esco dal salone sentendomi una persona nuova, con una cura che si vede nei dettagli.',
    name: 'Maria R.',
    since: 'Cliente dal 2003',
  },
  {
    body: 'Ho fatto una colorazione e il risultato è straordinario. Colori naturali, luminosi, esattamente quello che avevo chiesto. Staff gentilissimo e davvero professionale.',
    name: 'Francesca T.',
    since: 'Cliente dal 2018',
  },
  {
    body: "L'acconciatura da sposa era semplicemente perfetta. Carmelo ha capito subito lo stile che cercavo e ha superato ogni mia aspettativa. Lo consiglio a tutte le future spose.",
    name: 'Giulia M.',
    since: 'Sposa 2023',
  },
]

export default function Testimonianze() {
  return (
    <section className="testi" id="testi">
      <div className="container">
        <div className="testi__head">
          <span className="label">Recensioni</span>
          <h2 className="title">Cosa dicono<br />i <em>nostri clienti</em></h2>
          <div className="divider divider--center" />
        </div>
        <div className="testi__grid">
          {reviews.map((r) => (
            <article key={r.name} className="testi-card reveal">
              <span className="testi-card__quote" aria-hidden="true">&ldquo;</span>
              <p className="testi-card__body">{r.body}</p>
              <div className="testi-card__stars">500+ clienti soddisfatti</div>
              <p className="testi-card__name">{r.name}</p>
              <p className="testi-card__since">{r.since}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Testimonianze.tsx
git commit -m "feat: add Testimonianze server component"
```

---

### Task 14: `components/CtaBand.tsx`

**Files:**
- Create: `components/CtaBand.tsx`

- [ ] **Step 1: Create `components/CtaBand.tsx`**

```tsx
export default function CtaBand() {
  return (
    <section className="cta-band" id="contatti">
      <div className="container">
        <span className="label">Prenota il tuo appuntamento</span>
        <h2 className="cta-band__title">
          Pronti a prenderci<br />cura di <em>te</em>
        </h2>
        <p className="cta-band__sub">
          Chiamaci per fissare il tuo appuntamento. Siamo a tua disposizione dal martedì al sabato,
          dalle 9:00 alle 19:00.
        </p>
        <a href="tel:02537982" className="cta-band__tel">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          02 537982
        </a>
        <p className="cta-band__note">Piazza Bonomelli 4 · Milano · Mar – Sab 9:00 – 19:00</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CtaBand.tsx
git commit -m "feat: add CtaBand server component"
```

---

### Task 15: `components/InfoOrari.tsx`

**Files:**
- Create: `components/InfoOrari.tsx`

- [ ] **Step 1: Create `components/InfoOrari.tsx`**

```tsx
export default function InfoOrari() {
  return (
    <section className="info" id="orari">
      <div className="info__grid">

        <div className="info__hours">
          <div className="info__hours-inner">
            <span className="label">Quando trovarci</span>
            <h2 className="title">Orari di<br /><em>apertura</em></h2>
            <div className="divider" />
            <table className="info__table" aria-label="Orari di apertura">
              <tbody>
                <tr><td>Lunedì</td>    <td className="closed">Chiuso</td></tr>
                <tr><td>Martedì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Mercoledì</td> <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Giovedì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Venerdì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Sabato</td>    <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Domenica</td>  <td className="closed">Chiuso</td></tr>
              </tbody>
            </table>
            <div className="info__address">
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Piazza Bonomelli 4, 20136 Milano
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href="tel:02537982">02 537982</a>
              </p>
            </div>
          </div>
        </div>

        <div className="info__map">
          <iframe
            title="Mappa Nuova Immagine Coiffeur — Piazza Bonomelli 4, Milano"
            src="https://maps.google.com/maps?q=Piazza+Bonomelli+4+Milano&t=&z=16&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/InfoOrari.tsx
git commit -m "feat: add InfoOrari server component with hours table and map"
```

---

### Task 16: `components/Footer.tsx`

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">

          <div>
            <p className="footer__logo">Nuova Immagine <em>Coiffeur</em></p>
            <p className="footer__desc">
              Un salone di parrucchieri a Milano, nel cuore di Piazza Bonomelli, che dal 1984 porta
              avanti una tradizione di cura, stile e raffinata eleganza. Fondato da Carmelo.
            </p>
            <div className="footer__contacts">
              <a href="tel:02537982"><PhoneIcon /> 02 537982</a>
              <a href="https://maps.google.com/?q=Piazza+Bonomelli+4+Milano" target="_blank" rel="noopener noreferrer">
                <PinIcon /> Piazza Bonomelli 4, 20136 Milano
              </a>
            </div>
          </div>

          <div>
            <p className="footer__col-ttl">Navigazione</p>
            <ul className="footer__nav">
              <li><a href="#servizi">Servizi</a></li>
              <li><a href="#about">Chi Siamo</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#testi">Recensioni</a></li>
              <li><a href="#orari">Orari &amp; Mappa</a></li>
              <li><a href="#contatti">Contatti</a></li>
            </ul>
          </div>

          <div>
            <p className="footer__col-ttl">Orari</p>
            <div className="footer__sched">
              <p><span className="closed">Lunedì</span> — Chiuso</p>
              <p><span className="open">Martedì – Sabato</span> — 9:00–19:00</p>
              <p><span className="closed">Domenica</span> — Chiuso</p>
            </div>
          </div>

        </div>

        <div className="footer__bottom">
          <span>© 2024 Nuova Immagine Coiffeur · Piazza Bonomelli 4, Milano</span>
          <span className="gold">Dal 1984 · Milano</span>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer server component"
```

---

### Task 17: `app/page.tsx` — compose all sections

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create `app/page.tsx`**

```tsx
import { getSiteImages } from '@/lib/cloudinary'
import ScrollAnimations from '@/components/ScrollAnimations'
import HeroLoader from '@/components/HeroLoader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsStrip from '@/components/StatsStrip'
import Servizi from '@/components/Servizi'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import Testimonianze from '@/components/Testimonianze'
import CtaBand from '@/components/CtaBand'
import InfoOrari from '@/components/InfoOrari'
import Footer from '@/components/Footer'

export default async function Home() {
  const images = await getSiteImages()

  return (
    <>
      <ScrollAnimations />
      <HeroLoader />
      <Navbar />
      <main>
        <Hero image={images.hero} />
        <StatsStrip />
        <Servizi />
        <About image={images.about} />
        <Gallery images={images.gallery} />
        <Testimonianze />
        <CtaBand />
        <InfoOrari />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run type-check
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add page.tsx composing all sections with Cloudinary images"
```

---

### Task 18: Build verification and visual check

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
Route (app)    Size
┌ ○ /          ...
```
No TypeScript errors, no missing module errors. If Cloudinary API call fails at build time, check that `.env.local` has all three variables and the folder `clienti/nuova-immagine-coiffeur` exists in Cloudinary.

- [ ] **Step 2: Start dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify in this order:

1. **Navbar** — logo "Nuova Immagine Coiffeur" with gold-light `em`, nav links, tel CTA visible on desktop
2. **Hero** — full-height dark section with background image, gold eyebrow text, large serif H1, two buttons
3. **Stats strip** — dark band with 40+ / 1984 / Milano / 5★
4. **Servizi** — 3 cards appear in grid (✂ taglio, ◈ colorazione, ❧ piega); hover shows gold bottom border
5. **About** — salon image with gold border frame + "40 anni" badge, Carmelo signature italic
6. **Gallery** — dark section, photo grid (first image spans double width/height)
7. **Testimonianze** — 3 white cards with large italic quote mark
8. **CTA Band** — dark, phone number large
9. **Info/Orari** — hours table (Lun/Dom chiuso in muted color, rest gold), map iframe on right
10. **Footer** — 3-col layout on desktop

- [ ] **Step 3: Test scroll animations**

Scroll down slowly. Verify that `.reveal` elements fade in and `.divider` lines scale in when they enter the viewport.

- [ ] **Step 4: Test mobile menu**

Resize browser to < 768px. Verify hamburger appears, tapping it opens fullscreen menu, closing works.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: Next.js clone complete — ready for Vercel deploy"
```
