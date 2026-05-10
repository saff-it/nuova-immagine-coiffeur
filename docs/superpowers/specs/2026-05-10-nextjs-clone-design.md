# Design Spec — Next.js Clone: Nuova Immagine Coiffeur

**Date:** 2026-05-10  
**Project:** `/Users/simone/progetti-siti/nuova-immagine-coiffeur`  
**Approach:** Next.js 15 App Router + RSC + CSS globals (Approach 1)

---

## Context

Converting an existing static HTML site (`index.html`) to Next.js App Router. The static site is already a faithful clone of `https://nuova-immagine-coiffeur-mu5dva3b.durable.site` — a Milan hair salon (Nuova Immagine Coiffeur, founded 1984 by Carmelo, Piazza Bonomelli 4).

The project is already git-initialized and linked to Vercel (`.vercel/project.json` present). The conversion replaces the static setup in-place, preserving the git repo and Vercel link.

---

## Architecture

```
nuova-immagine-coiffeur/
├── app/
│   ├── layout.tsx          # root layout: fonts meta, globals.css import
│   ├── page.tsx            # pure Server Component — composes all sections
│   └── globals.css         # full design system (CSS custom props, reset, utilities)
├── components/
│   ├── Navbar.tsx          # Client Component: scroll behavior + mobile menu
│   ├── Hero.tsx            # full-height section, CldImage background
│   ├── StatsStrip.tsx      # dark strip with 4 stats
│   ├── Servizi.tsx         # 3-card service grid
│   ├── About.tsx           # 2-col layout with CldImage + Carmelo signature
│   ├── Gallery.tsx         # photo grid with CldImage
│   ├── Testimonianze.tsx   # 3 review cards
│   ├── CtaBand.tsx         # dark CTA band with phone
│   ├── InfoOrari.tsx       # hours table + Google Maps iframe
│   └── Footer.tsx          # 3-col footer
├── lib/
│   └── cloudinary.ts       # Cloudinary SDK: list resources, semantic mapping
├── .env.local              # CLOUDINARY_CLOUD_NAME + KEY + SECRET
├── next.config.ts          # remotePatterns for res.cloudinary.com
└── package.json            # Next.js 15, next-cloudinary, cloudinary SDK
```

`page.tsx` is a pure Server Component (no `'use client'`). Next.js statically pre-renders it at build-time. Vercel deploys and serves from CDN edge with no runtime server required for page content. Only `Navbar.tsx` and a `RevealWrapper` helper are Client Components.

---

## Design System

Ported verbatim from `index.html` into `globals.css`:

- **Fonts:** Cormorant Garamond (300/400/500/600 + italic variants) + Jost (300/400/500) via Google Fonts
- **Colors:**
  - `--cream: #F2F2F2` / `--cream-alt: #E8E8E8`
  - `--gold: #B8975A` / `--gold-light: #D4B483` / `--gold-pale: rgba(184,151,90,.15)`
  - `--anthr: #2A2A2A` / `--anthr-mid: #555555`
  - `--white: #FFFFFF`
- **Utilities:** `.container`, `.label`, `.title`, `.divider`, `.btn` variants, `.reveal`
- **Animations:** hero entrance (staggered opacity), scroll-bar indicator, divider scaleX reveal, card hover lift
- **Responsive breakpoints:** 1024px, 768px, 480px (same as original)
- **Accessibility:** `prefers-reduced-motion` block preserved

No Tailwind, no CSS Modules — globals only, matching original class names.

---

## Page Sections (in order)

1. **Navbar** — fixed header, logo "Nuova Immagine Coiffeur", nav links (Servizi / Chi Siamo / Gallery / Recensioni / Orari), CTA tel `02 537982`, hamburger for mobile. Scroll → adds `.scrolled` class (dark bg + blur).
2. **Mobile Menu** — fullscreen overlay, large Cormorant Garamond links.
3. **Hero** — 100vh, Cloudinary bg image with gradient overlay. Eyebrow: "Milano · Piazza Bonomelli · Dal 1984". H1: "L'arte della *bellezza* che dura nel tempo." Two CTAs: "Prenota Appuntamento" (tel) + "Scopri i Servizi" (anchor).
4. **Stats Strip** — dark bg: 40+ anni / 1984 anno fondazione / Milano Piazza Bonomelli 4 / 5★.
5. **Servizi** — 3 cards: Taglio Sartoriale / Colorazione Professionale / Piega e Styling. Gold underline on hover.
6. **About** — 2-col: Cloudinary image with gold border frame + "40 anni" badge; text column with storia + Carmelo firma.
7. **Gallery** — dark bg, 4-col grid (first item spans 2 cols × 2 rows). All Cloudinary images. Gold tint on hover.
8. **Testimonianze** — 3 review cards: Maria R. / Francesca T. / Giulia M.
9. **CTA Band** — dark, "Pronti a prenderci cura di *te*", phone number large, orari note.
10. **Info / Orari** — 2-col: hours table (Lun/Dom chiuso, Mar–Sab 9–19) + Google Maps iframe.
11. **Footer** — 3-col: logo+contacts / navigazione / orari. Bottom bar with copyright.

---

## Cloudinary Integration

**Config:**
- Cloud name: `dge5tnnsy` (from `CLOUDINARY_CLOUD_NAME` env var)
- Folder: `clienti/nuova-immagine-coiffeur`
- Credentials: `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`

**`lib/cloudinary.ts`:**
```ts
// Called only at build-time from Server Components
export async function getCloudinaryResources(): Promise<CloudinaryResource[]>
```
Uses Cloudinary SDK `v2.api.resources()` with `type: 'upload'`, `prefix: 'clienti/nuova-immagine-coiffeur'`. Returns full list of public_ids.

**Semantic mapping (by public_id pattern):**
| Pattern | Assigned to |
|---|---|
| `Gemini_Generated_Image_*` | Hero background |
| `2022-09-29_*` | About section |
| Remaining images | Gallery grid |

If a section's expected image is missing from the API response, a fallback `<div>` with `background: var(--anthr)` is used — no broken images.

**next-cloudinary:**
- `CldImage` for all `<img>` tags (auto format, auto quality, responsive widths)
- Hero bg: inline `style` with Cloudinary URL constructed via `getCldImageUrl()` (background-image cannot use `<img>`)

---

## Interactivity (Client Components)

**`Navbar.tsx` (`'use client'`):**
- `useEffect` + scroll listener → toggles `.scrolled` on `<header>`
- Mobile menu open/close state
- `aria-expanded` on burger button

**`RevealWrapper.tsx` (`'use client'`):**
- Wraps children, attaches `IntersectionObserver`
- Adds `.visible` class when element enters viewport (triggers `.reveal` and `.divider` CSS transitions)

---

## Environment & Config

**`.env.local`:**
```
CLOUDINARY_CLOUD_NAME=dge5tnnsy
CLOUDINARY_API_KEY=<from existing .env>
CLOUDINARY_API_SECRET=<from existing .env>
```

**`next.config.ts`:**
```ts
images: {
  remotePatterns: [{ hostname: 'res.cloudinary.com' }]
}
```

**`vercel.json`:** Not needed (Next.js is Vercel's default framework; project already linked).

**Files removed:** `index.html`, `deploy.js`, `update-gallery.js`, old `package.json`, old `node_modules/`.

**`.gitignore` update:** ensure `.env.local` is excluded.

---

## Out of Scope

- No CMS, no admin panel
- No contact form (phone call is the CTA)
- No analytics integration
- No i18n
- No additional pages beyond the single landing page
