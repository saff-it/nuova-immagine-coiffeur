const services = [
  { name: 'Taglio sartoriale', text: 'Tagli personalizzati che valorizzano i tuoi lineamenti e il tuo stile unico.' },
  { name: 'Colorazione professionale', text: 'Colori brillanti e duraturi con trattamenti che mantengono la salute dei capelli.' },
  { name: 'Piega e styling', text: 'Acconciature curate con tecniche professionali per un risultato duraturo e elegante.' },
]

export default function Servizi() {
  return (
    <section className="section" id="servizi">
      <div className="container">
        <div className="servizi__head">
          <div className="servizi__head-left">
            <span className="section__label">I nostri servizi</span>
            <h2 className="section__h2">Tutto quello che serve<br />per la tua bellezza</h2>
          </div>
          <div className="servizi__head-right">
            <p className="section__desc">
              Presso Nuova Immagine Coiffeur troverai una gamma completa di servizi pensati
              per valorizzare la tua immagine con cura artigianale e professionalità.
            </p>
            <div>
              <a href="tel:+3902537982" className="btn-mint">Prenota subito</a>
            </div>
          </div>
        </div>
        <div className="servizi__grid">
          {services.map((s) => (
            <div key={s.name} className="serv-card">
              <h3 className="serv-card__name">{s.name}</h3>
              <p className="serv-card__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
