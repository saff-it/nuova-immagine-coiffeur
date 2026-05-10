export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wrap">
        <div className="footer__sep" />
        <div className="footer__logo-center">
          <a href="#" className="footer__logo-text">Nuova Immagine Coiffeur</a>
        </div>
        <div className="footer__sep" />
        <div className="footer__bottom">
          <p className="footer__text">© {new Date().getFullYear()} Nuova Immagine Coiffeur. Tutti i diritti riservati.</p>
          <p className="footer__text footer__bottom-center" />
          <p className="footer__text footer__bottom-right">Piazza Bonomelli 4, 20135 Milano</p>
        </div>
      </div>
    </footer>
  )
}
