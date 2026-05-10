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
