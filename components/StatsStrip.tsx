import { Fragment } from 'react'

const stats = [
  { num: '40+',    lbl: 'Anni di esperienza',  delay: '0s' },
  { num: '1984',   lbl: 'Anno di fondazione',   delay: '0.15s' },
  { num: 'Milano', lbl: 'Piazza Bonomelli 4',   delay: '0.3s' },
  { num: '5 ★',   lbl: 'Clienti soddisfatti',  delay: '0.45s' },
]

export default function StatsStrip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="container">
        <div className="strip__row">
          {stats.map((s, i) => (
            <Fragment key={s.num}>
              {i > 0 && <div className="strip__sep" />}
              <div className="strip__item reveal" style={{ transitionDelay: s.delay }}>
                <strong className="strip__num">{s.num}</strong>
                <span className="strip__lbl">{s.lbl}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
