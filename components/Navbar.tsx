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
