'use client'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => { setOpen(false); document.body.style.overflow = '' }
  const openMenu = () => { setOpen(true); document.body.style.overflow = 'hidden' }

  return (
    <>
      <div className="nav__spacer" />
      <header className="nav">
        <div className="nav__inner">
          <div className="nav__left">
            <button className="nav__burger" aria-label="Apri menu" onClick={openMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="24" height="24">
                <path fill="currentColor" fillRule="evenodd" d="M3 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1M3 10a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1M3 15a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1" clipRule="evenodd" />
              </svg>
            </button>
            <div className="nav__sep-v" />
            <a href="#" className="nav__logo">Nuova Immagine Coiffeur</a>
          </div>
          <a href="tel:+3902537982" className="btn-nav">Prenota ora</a>
        </div>
      </header>
      <div className={`mob-menu${open ? ' open' : ''}`} role="dialog" aria-modal="true">
        <button className="mob-menu__close" onClick={close}>✕</button>
        <a href="#servizi" onClick={close}>Servizi</a>
        <a href="#about" onClick={close}>Chi Siamo</a>
        <a href="#testi" onClick={close}>Recensioni</a>
        <a href="#orari" onClick={close}>Orari</a>
        <a href="tel:+3902537982" className="btn-nav" onClick={close}>Prenota ora</a>
      </div>
    </>
  )
}
