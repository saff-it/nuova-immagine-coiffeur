const reviews = [
  { text: 'Carmelo mi conosce da anni e sa esattamente cosa mi sta bene. Ogni volta che esco dal salone, mi sento rinata. È più di un parrucchiere, è una persona di fiducia.', name: 'Francesca M.' },
  { text: 'Professionista eccellente, mi ha messa subito a mio agio. Risultato impeccabile e prezzi più che onesti!', name: 'Alessandra N.' },
  { text: 'Quando Carmelo mi ha consigliato un cambio di colore, mi è venuto il dubbio. Ma aveva ragione: il risultato è perfetto e naturale. Si vede che conosce il mestiere.', name: 'Giulia R.' },
  { text: 'Non solo mi tratta i capelli bene, ma Carmelo ricorda i dettagli di quello che preferisco. È raro trovare questa attenzione nei saloni moderni!', name: 'Alessandra V.' },
  { text: "Frequento questo salone da tantissimo tempo e non lo cambierei per nessun motivo. Carmelo è tutto: parrucchiere eccezionale e un po' psicologo. Ci si sente davvero a casa.", name: 'Enrica R.' },
]

export default function Testimonianze() {
  return (
    <section className="section section--alt" id="testi">
      <div className="container">
        <div className="testi__intro">
          <div>
            <span className="section__label">Quello che dicono le nostre clienti</span>
            <h2 className="section__h2">La fiducia delle donne che si affidano a noi</h2>
            <a href="tel:+3902537982" className="btn-green">Prenota il tuo appuntamento</a>
          </div>
          <div>
            <p className="testi__quote-text">
              &ldquo;Da quarant&apos;anni Nuova Immagine Coiffeur costruisce relazioni durature
              con le clienti, trasformando la cura dei capelli in un&apos;esperienza di benessere personale.&rdquo;
            </p>
          </div>
        </div>
        <div className="testi__grid">
          {reviews.map((r) => (
            <div key={r.name} className="testi-card">
              <p className="testi-card__text">&ldquo;{r.text}&rdquo;</p>
              <div className="testi-card__footer">
                <div className="testi-card__avatar">{r.name[0]}</div>
                <span className="testi-card__name">{r.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
