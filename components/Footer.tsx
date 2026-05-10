export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <span className="footer__logo">Nuova Immagine Coiffeur</span>
          <span className="footer__copy">
            © {new Date().getFullYear()} Nuova Immagine Coiffeur. Tutti i diritti riservati.
          </span>
          <span className="footer__addr">Piazza Bonomelli 4, 20135 Milano</span>
        </div>
      </div>
    </footer>
  )
}
