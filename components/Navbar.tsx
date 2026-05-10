'use client'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => { setOpen(false); document.body.style.overflow = '' }
  const openMenu = () => { setOpen(true); document.body.style.overflow = 'hidden' }

  return (
    <>
      <header className="nav">
        <div className="container">
          <div className="nav__inner">
            <a href="#" className="nav__logo">Nuova Immagine Coiffeur</a>
            <div className="nav__divider" />
            <div className="nav__right">
              <a href="tel:+3902537982" className="nav__phone">02 537982</a>
              <a href="tel:+3902537982" className="btn-green">Prenota ora</a>
              <button className="nav__burger" aria-label="Apri menu" onClick={openMenu}>
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className={`mob-menu${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="mob-menu__close" onClick={close}>✕</button>
        <a href="#servizi" onClick={close}>Servizi</a>
        <a href="#about" onClick={close}>Chi Siamo</a>
        <a href="#testi" onClick={close}>Recensioni</a>
        <a href="#orari" onClick={close}>Orari</a>
        <a href="tel:+3902537982" className="btn-green" onClick={close}>Prenota ora</a>
      </div>
    </>
  )
}
