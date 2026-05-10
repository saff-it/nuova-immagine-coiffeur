const services = [
  {
    icon: '✂',
    name: 'Taglio Sartoriale',
    text: "Dal taglio classico all'interpretazione più contemporanea. Ascoltiamo la tua personalità per creare una forma su misura che valorizzi i tuoi tratti unici.",
  },
  {
    icon: '◈',
    name: 'Colorazione Professionale',
    text: 'Tinta piena e tecniche di colore selezionate. Colori vivi e luminosi realizzati con prodotti di alta qualità, rispettosi della struttura del capello.',
  },
  {
    icon: '❧',
    name: 'Piega e Styling',
    text: 'Asciugatura professionale, piega liscia o ondulata. Un finish impeccabile per la quotidianità o per gli eventi che contano.',
  },
]

export default function Servizi() {
  return (
    <section className="servizi" id="servizi">
      <div className="container">
        <div className="servizi__head">
          <span className="label">I Nostri Servizi</span>
          <h2 className="title">Ogni dettaglio,<br /><em>curato per te</em></h2>
          <div className="divider divider--center" />
        </div>
        <div className="servizi__grid">
          {services.map((s) => (
            <article key={s.name} className="serv-card reveal">
              <span className="serv-card__ico" aria-hidden="true">{s.icon}</span>
              <h3 className="serv-card__name">{s.name}</h3>
              <p className="serv-card__text">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
