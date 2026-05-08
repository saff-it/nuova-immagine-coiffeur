# Animazioni Eleganti — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere animazioni a dissolvenza pura al sito Nuova Immagine Coiffeur senza muovere elementi nello spazio — solo opacity.

**Architecture:** Tutto in `index.html` (CSS inline + JS inline). Nessun file esterno aggiunto. Si estende il sistema `.reveal` + `IntersectionObserver` già presente e si aggiunge un pattern hero-entrance via classe CSS.

**Tech Stack:** HTML/CSS vanilla, JS vanilla, IntersectionObserver API (già usata).

---

## File modificati

- Modify: `index.html:87-92` — CSS `.reveal` (rimozione translateY)
- Modify: `index.html:169-216` — CSS sezione Hero (aggiunta hero entrance)
- Modify: `index.html:61-66` — CSS `.divider` (animazione draw)
- Modify: `index.html:300-307` — CSS `.gallery__item` (hover overlay)
- Modify: `index.html:400+` — CSS fine style block (prefers-reduced-motion)
- Modify: `index.html:499-520` — HTML strip items (aggiunta classe reveal)
- Modify: `index.html:785-798` — JS scroll reveal + nuovo hero entrance

---

## Task 1: Aggiorna `.reveal` a dissolvenza pura

**Files:**
- Modify: `index.html:87-92`

- [ ] **Step 1: Modifica il blocco CSS `.reveal`**

  Sostituisci le righe 87-92:
  ```css
  /* reveal animation */
  .reveal {
    opacity:0;
    transform:translateY(28px);
    transition:opacity .65s var(--ease), transform .65s var(--ease);
  }
  .reveal.visible { opacity:1; transform:none; }
  ```
  con:
  ```css
  /* reveal animation */
  .reveal {
    opacity:0;
    transition:opacity 1.0s var(--ease);
  }
  .reveal.visible { opacity:1; }
  ```

- [ ] **Step 2: Verifica visiva nel browser**

  Apri `index.html` nel browser. Scrolla fino alla sezione Servizi e verifica che le card compaiano in dissolvenza senza salire dal basso. Nessun movimento verticale.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "style: convert reveal animation to pure opacity fade"
  ```

---

## Task 2: Animazione di entrata Hero

**Files:**
- Modify: `index.html:169-216` (CSS sezione Hero)
- Modify: `index.html:758-799` (JS block)

- [ ] **Step 1: Aggiungi CSS hero entrance**

  Dopo il blocco `@keyframes scrollbar` (riga ~216), aggiungi:
  ```css
  /* Hero entrance */
  .hero__eyebrow,
  .hero__title,
  .hero__sub,
  .hero__btns {
    opacity:0;
    transition:opacity 1.2s var(--ease);
  }
  .hero--loaded .hero__eyebrow { opacity:1; transition-delay:0.3s; }
  .hero--loaded .hero__title   { opacity:1; transition-delay:0.6s; }
  .hero--loaded .hero__sub     { opacity:1; transition-delay:0.9s; }
  .hero--loaded .hero__btns    { opacity:1; transition-delay:1.15s; }
  ```

- [ ] **Step 2: Aggiungi trigger JS**

  Nel blocco `<script>` (riga ~759), aggiungi come prima riga dopo `<script>`:
  ```js
  // Hero entrance
  window.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() =>
      document.getElementById('hero').classList.add('hero--loaded')
    );
  });
  ```

- [ ] **Step 3: Verifica visiva nel browser**

  Ricarica la pagina. Controlla che al caricamento: prima appaia l'eyebrow ("Milano · Piazza Bonomelli · Dal 1984"), poi il titolo, poi il sottotitolo, poi i bottoni. Ogni elemento in dissolvenza, nessun movimento. Usa DevTools → throttling CPU "4x slowdown" per vedere la sequenza più chiaramente.

- [ ] **Step 4: Commit**
  ```bash
  git add index.html
  git commit -m "feat: add staggered fade-in entrance for hero section"
  ```

---

## Task 3: Animazione draw del Divider

**Files:**
- Modify: `index.html:61-66` (CSS `.divider`)
- Modify: `index.html:785-798` (JS IntersectionObserver)

- [ ] **Step 1: Modifica CSS `.divider`**

  Sostituisci il blocco `.divider` (righe 61-66):
  ```css
  .divider {
    width:56px; height:1px;
    background:var(--gold);
    margin-bottom:40px;
  }
  .divider--center { margin-left:auto; margin-right:auto; }
  ```
  con:
  ```css
  .divider {
    width:56px; height:1px;
    background:var(--gold);
    margin-bottom:40px;
    transform:scaleX(0);
    transform-origin:left;
    transition:transform 0.9s var(--ease);
  }
  .divider--center {
    margin-left:auto; margin-right:auto;
    transform-origin:center;
  }
  .divider.visible { transform:scaleX(1); }
  ```

- [ ] **Step 2: Aggiungi i divider all'IntersectionObserver esistente**

  Nel JS, trova il blocco (righe ~795-797):
  ```js
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.1 + 's';
    revealObs.observe(el);
  });
  ```
  Sostituiscilo con:
  ```js
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.style.transitionDelay) {
      el.style.transitionDelay = (i % 3) * 0.1 + 's';
    }
    revealObs.observe(el);
  });
  document.querySelectorAll('.divider').forEach(el => revealObs.observe(el));
  ```
  
  Il guard `if (!el.style.transitionDelay)` preserva i delay espliciti degli strip items (impostati in Task 4) senza sovrascriverli.

- [ ] **Step 3: Verifica visiva nel browser**

  Scrolla lentamente fino alle sezioni Servizi, Chi Siamo, Gallery e CTA. Controlla che le linee dorate si "disegnino" da sinistra (o dal centro per `.divider--center`) quando entrano nel viewport. Nessun salto di posizione.

- [ ] **Step 4: Commit**
  ```bash
  git add index.html
  git commit -m "feat: add scaleX draw animation to gold dividers on scroll"
  ```

---

## Task 4: Strip stats fade-in scalato

**Files:**
- Modify: `index.html:499-520` (HTML strip items)

- [ ] **Step 1: Aggiungi classe `reveal` e delay espliciti agli strip items**

  Trova i 4 `.strip__item` (righe ~502-519) e aggiungici classe `reveal` e `data-delay`:
  ```html
  <div class="strip__item reveal" style="transition-delay:0s">
    <strong class="strip__num">40+</strong>
    <span class="strip__lbl">Anni di esperienza</span>
  </div>
  <div class="strip__sep"></div>
  <div class="strip__item reveal" style="transition-delay:0.15s">
    <strong class="strip__num">1984</strong>
    <span class="strip__lbl">Anno di fondazione</span>
  </div>
  <div class="strip__sep"></div>
  <div class="strip__item reveal" style="transition-delay:0.3s">
    <strong class="strip__num">Milano</strong>
    <span class="strip__lbl">Piazza Bonomelli 4</span>
  </div>
  <div class="strip__sep"></div>
  <div class="strip__item reveal" style="transition-delay:0.45s">
    <strong class="strip__num">5 ★</strong>
    <span class="strip__lbl">Clienti soddisfatti</span>
  </div>
  ```
  
  Nota: i delay inline sovrascrivono quelli calcolati dal JS `(i % 3) * 0.1` — così la sequenza è corretta e prevedibile.

- [ ] **Step 2: Verifica visiva nel browser**

  Scrolla fino alla strip scura sotto l'hero. I 4 valori (40+, 1984, Milano, 5★) devono apparire in sequenza da sinistra a destra, con dissolvenza. Ricarica e osserva una seconda volta per confermare.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat: add staggered fade-in to stats strip items"
  ```

---

## Task 5: Gallery hover overlay dorato

**Files:**
- Modify: `index.html:300-307` (CSS `.gallery__item`)

- [ ] **Step 1: Aggiungi overlay e modifica hover**

  Sostituisci il blocco (righe ~300-307):
  ```css
  .gallery__item { overflow:hidden; }
  .gallery__item:first-child { grid-column:span 2; grid-row:span 2; }
  .gallery__item img {
    width:100%; height:100%; object-fit:cover;
    filter:brightness(.88) saturate(.9);
    transition:transform .6s var(--ease), filter .4s;
  }
  .gallery__item:hover img { transform:scale(1.06); filter:brightness(1) saturate(1); }
  ```
  con:
  ```css
  .gallery__item { overflow:hidden; position:relative; }
  .gallery__item::after {
    content:''; position:absolute; inset:0;
    background:var(--gold);
    opacity:0;
    transition:opacity 0.5s var(--ease);
    pointer-events:none;
  }
  .gallery__item:hover::after { opacity:0.14; }
  .gallery__item:first-child { grid-column:span 2; grid-row:span 2; }
  .gallery__item img {
    width:100%; height:100%; object-fit:cover;
    filter:brightness(.88) saturate(.9);
    transition:filter 0.5s var(--ease);
  }
  .gallery__item:hover img { filter:brightness(1) saturate(1); }
  ```
  
  Nota: rimosso `transform:scale(1.06)` — coerente con lo stile C (nessun movimento).

- [ ] **Step 2: Verifica visiva nel browser**

  Vai alla sezione Gallery. Passa il mouse su ogni foto. Controlla che appaia un leggero velo dorato in dissolvenza senza che l'immagine si ingrandisca. La transizione deve sembrare uno svelamento, non uno zoom.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat: replace gallery zoom hover with soft golden overlay fade"
  ```

---

## Task 6: Accessibility — prefers-reduced-motion

**Files:**
- Modify: `index.html` — fine del blocco `<style>` (prima del tag `</style>`)

- [ ] **Step 1: Aggiungi media query di accessibilità**

  Trova `</style>` (riga ~438 circa) e aggiungi appena prima:
  ```css
  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .reveal,
    .divider,
    .hero__eyebrow,
    .hero__title,
    .hero__sub,
    .hero__btns,
    .gallery__item::after,
    .gallery__item img {
      transition: none !important;
      animation: none !important;
    }
    .reveal       { opacity:1 !important; }
    .divider      { transform:scaleX(1) !important; }
    .hero__eyebrow,
    .hero__title,
    .hero__sub,
    .hero__btns   { opacity:1 !important; }
  }
  ```

- [ ] **Step 2: Verifica accessibilità**

  In macOS: Impostazioni di Sistema → Accessibilità → Display → attiva "Limita movimento". Ricarica il sito. Tutti gli elementi devono essere immediatamente visibili, senza transizioni. Disattiva l'impostazione dopo il test.

- [ ] **Step 3: Commit**
  ```bash
  git add index.html
  git commit -m "feat: disable animations when prefers-reduced-motion is set"
  ```
