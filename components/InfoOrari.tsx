export default function InfoOrari() {
  return (
    <section className="info" id="orari">
      <div className="info__grid">

        <div className="info__hours">
          <div className="info__hours-inner">
            <span className="label">Quando trovarci</span>
            <h2 className="title">Orari di<br /><em>apertura</em></h2>
            <div className="divider" />
            <table className="info__table" aria-label="Orari di apertura">
              <tbody>
                <tr><td>Lunedì</td>    <td className="closed">Chiuso</td></tr>
                <tr><td>Martedì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Mercoledì</td> <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Giovedì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Venerdì</td>   <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Sabato</td>    <td className="open">9:00 – 19:00</td></tr>
                <tr><td>Domenica</td>  <td className="closed">Chiuso</td></tr>
              </tbody>
            </table>
            <div className="info__address">
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Piazza Bonomelli 4, 20136 Milano
              </p>
              <p>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)" aria-hidden="true">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <a href="tel:02537982">02 537982</a>
              </p>
            </div>
          </div>
        </div>

        <div className="info__map">
          <iframe
            title="Mappa Nuova Immagine Coiffeur — Piazza Bonomelli 4, Milano"
            src="https://maps.google.com/maps?q=Piazza+Bonomelli+4+Milano&t=&z=16&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

      </div>
    </section>
  )
}
