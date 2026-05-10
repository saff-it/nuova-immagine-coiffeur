export default function InfoOrari() {
  return (
    <section className="section section--alt" id="orari">
      <div className="container">
        <div className="info__grid">
          <div>
            <span className="section__label">Dove siamo</span>
            <h2 className="section__h2">Vieni a trovarci in Piazza Bonomelli 4</h2>
            <p className="section__desc">
              Contattaci per prenotare il tuo appuntamento o ricevere una consulenza
              personalizzata sui nostri servizi.
            </p>
            <div className="contact-btns">
              <a href="tel:+3902537982" className="btn-green">Chiama il salone</a>
              <a
                href="https://maps.google.com/?q=Piazza+Bonomelli+4+Milano"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Vieni a Trovarci
              </a>
            </div>
            <div className="map-wrap">
              <iframe
                title="Mappa Nuova Immagine Coiffeur"
                src="https://maps.google.com/maps?q=Piazza+Bonomelli+4+Milano&t=&z=16&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <div>
            <span className="section__label">Quando trovarci</span>
            <h2 className="section__h2">I nostri orari</h2>
            <table className="orari__table" aria-label="Orari di apertura">
              <tbody>
                <tr><td>Lunedì</td>   <td className="closed">Chiuso</td></tr>
                <tr><td>Martedì</td>  <td className="open">09 – 19</td></tr>
                <tr><td>Mercoledì</td><td className="open">09 – 19</td></tr>
                <tr><td>Giovedì</td>  <td className="open">09 – 19</td></tr>
                <tr><td>Venerdì</td>  <td className="open">09 – 19</td></tr>
                <tr><td>Sabato</td>   <td className="open">09 – 19</td></tr>
                <tr><td>Domenica</td> <td className="closed">Chiuso</td></tr>
              </tbody>
            </table>
            <div style={{ marginTop: '32px' }}>
              <a href="tel:+3902537982" className="btn-green">Chiama ora</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
