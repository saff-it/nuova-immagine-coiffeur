export default function CtaBand() {
  return (
    <section className="prenota" id="contatti">
      <div className="container">
        <h2 className="prenota__h2">Vieni a trovarci in Piazza Bonomelli 4</h2>
        <p className="prenota__desc">
          Contattaci per prenotare il tuo appuntamento o ricevere una consulenza
          personalizzata sui nostri servizi.
        </p>
        <div className="prenota__btns">
          <a href="tel:+3902537982" className="btn-grey">Chiama il salone</a>
          <a
            href="https://maps.google.com/?q=Piazza+Bonomelli+4+Milano"
            target="_blank" rel="noopener noreferrer"
            className="btn-ghost-dark"
          >
            Vieni a Trovarci
          </a>
        </div>
      </div>
    </section>
  )
}
