export default function CtaBand() {
  return (
    <section className="cta-band" id="contatti">
      <div className="container">
        <span className="section__label" style={{ color: '#5AE8B3' }}>Prenota il tuo appuntamento</span>
        <h2 className="cta-band__h2">Pronti a prenderci cura di te</h2>
        <p className="cta-band__sub">
          Chiamaci per fissare il tuo appuntamento. Siamo a tua disposizione dal martedì al sabato.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:+3902537982" className="btn-green">Prenota ora</a>
          <a href="tel:+3902537982" className="btn-green-outline">02 537982</a>
        </div>
      </div>
    </section>
  )
}
