export default function CtaBand() {
  return (
    <section className="cta-band" id="contatti">
      <div className="container">
        <span className="label">Prenota il tuo appuntamento</span>
        <h2 className="cta-band__title">
          Pronti a prenderci<br />cura di <em>te</em>
        </h2>
        <p className="cta-band__sub">
          Chiamaci per fissare il tuo appuntamento. Siamo a tua disposizione dal martedì al sabato,
          dalle 9:00 alle 19:00.
        </p>
        <a href="tel:02537982" className="cta-band__tel">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          02 537982
        </a>
        <p className="cta-band__note">Piazza Bonomelli 4 · Milano · Mar – Sab 9:00 – 19:00</p>
      </div>
    </section>
  )
}
