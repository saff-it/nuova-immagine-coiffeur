# Animazioni Eleganti — Design Spec

**Data:** 2026-05-08
**Progetto:** Nuova Immagine Coiffeur — `index.html`

---

## Obiettivo

Aggiungere animazioni raffinate al sito del salone, coerenti con l'identità luxury del brand. Stile scelto: **Dissolvenza Pura** — solo opacity, nessun movimento di posizione, easing morbido. Il sito deve sembrare che "respiri" piuttosto che muoversi.

---

## Principi

- Solo `opacity` (no `translateY`, no `translateX`, no `scale` sugli elementi di testo)
- Easing: `ease` o `cubic-bezier(.4,0,.2,1)` — mai bounce o spring
- Durate lente: 1.0–1.4s per entrate principali, 0.6–0.8s per elementi secondari
- Nessuna animazione se `prefers-reduced-motion: reduce` è attivo
- Tutto con `IntersectionObserver` esistente o CSS puro dove possibile

---

## Animazioni da implementare

### 1. Hero entrance (caricamento pagina)
- Elementi: eyebrow span → h1 → p.hero__sub → div.hero__btns
- Tipo: fade-in scalato, delay incrementale di 0.25s per elemento
- Durata: 1.2s ciascuno
- Trigger: al caricamento pagina (non scroll), classe `.hero--loaded` aggiunta via JS dopo DOMContentLoaded

### 2. Reveal migliorato
- Situazione attuale: `.reveal` usa `opacity + translateY(28px)` → stile A
- Modifica: rimuovere `translateY`, tenere solo `opacity: 0 → 1`
- Durata: 1.0s (da 0.65s attuale)
- Tutti gli elementi con `.reveal` nel DOM beneficiano automaticamente

### 3. Divider animato
- Elementi: `.divider` (linee dorate orizzontali)
- Tipo: `scaleX(0 → 1)` con `transform-origin: left` quando entra in viewport
- Durata: 0.9s
- Trigger: `IntersectionObserver` (aggiungere `.divider` agli elementi osservati)
- Nota: è l'unico elemento che usa `scale`, non è testo/contenuto

### 4. Strip stats
- Elementi: `.strip__item` (40+, 1984, Milano, 5★)
- Tipo: fade-in scalato con delay (0.1s tra ogni item)
- Trigger: `IntersectionObserver` sulla `.strip`
- Durata: 1.0s

### 5. Gallery overlay hover
- Elemento: `.gallery__item`
- Tipo: pseudo-elemento `::after` con overlay dorato semi-trasparente, `opacity: 0 → 0.18` on hover
- Transizione: 0.5s ease
- Nessun zoom sull'immagine (coerente con stile C)

---

## Cosa NON cambia

- Transizioni navbar (già esistenti, già coerenti)
- Transizioni bottoni hover (già esistenti)
- Indicatore scroll nel hero (già esistente)
- Animazioni mobile menu (già esistenti)

---

## Accessibility

Aggiungere `@media (prefers-reduced-motion: reduce)` per disabilitare tutte le animazioni/transizioni aggiunte.

---

## File modificati

- `index.html` — unico file (CSS inline + JS inline)
