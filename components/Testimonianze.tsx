const reviews = [
  {
    body: 'Vado da Carmelo da più di 30 anni. Non potrei immaginare di andare altrove. Ogni volta esco dal salone sentendomi una persona nuova, con una cura che si vede nei dettagli.',
    name: 'Maria R.',
    since: 'Cliente dal 2003',
  },
  {
    body: 'Ho fatto una colorazione e il risultato è straordinario. Colori naturali, luminosi, esattamente quello che avevo chiesto. Staff gentilissimo e davvero professionale.',
    name: 'Francesca T.',
    since: 'Cliente dal 2018',
  },
  {
    body: "L'acconciatura da sposa era semplicemente perfetta. Carmelo ha capito subito lo stile che cercavo e ha superato ogni mia aspettativa. Lo consiglio a tutte le future spose.",
    name: 'Giulia M.',
    since: 'Sposa 2023',
  },
]

export default function Testimonianze() {
  return (
    <section className="testi" id="testi">
      <div className="container">
        <div className="testi__head">
          <span className="label">Recensioni</span>
          <h2 className="title">Cosa dicono<br />i <em>nostri clienti</em></h2>
          <div className="divider divider--center" />
        </div>
        <div className="testi__grid">
          {reviews.map((r) => (
            <article key={r.name} className="testi-card reveal">
              <span className="testi-card__quote" aria-hidden="true">&ldquo;</span>
              <p className="testi-card__body">{r.body}</p>
              <div className="testi-card__stars">500+ clienti soddisfatti</div>
              <p className="testi-card__name">{r.name}</p>
              <p className="testi-card__since">{r.since}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
