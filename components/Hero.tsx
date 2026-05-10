import { getCldImageUrl } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function Hero({ image }: { image: CloudinaryResource | null }) {
  const bgUrl = image
    ? getCldImageUrl({ src: image.public_id, width: 1920, quality: 'auto', format: 'auto' })
    : null

  const bgStyle: React.CSSProperties = bgUrl
    ? {
        backgroundImage: `linear-gradient(120deg,rgba(30,28,26,.88) 0%,rgba(30,28,26,.62) 65%,rgba(30,28,26,.35) 100%),url('${bgUrl}')`,
      }
    : { background: 'var(--anthr)' }

  return (
    <section className="hero" id="hero">
      <div
        className="hero__bg"
        role="img"
        aria-label="Interno del salone Nuova Immagine Coiffeur"
        style={bgStyle}
      />
      <div className="container">
        <div className="hero__content">
          <span className="hero__eyebrow">Milano · Piazza Bonomelli · Dal 1984</span>
          <h1 className="hero__title">
            L&apos;arte della<br /><em>bellezza</em><br />che dura nel tempo.
          </h1>
          <p className="hero__sub">
            Da quarant&apos;anni, Carmelo e il suo team accolgono ogni cliente con cura individuale
            e trasformano ogni visita in un&apos;esperienza di stile raffinato.
          </p>
          <div className="hero__btns">
            <a href="tel:02537982" className="btn btn--solid">Prenota Appuntamento</a>
            <a href="#servizi"     className="btn btn--ghost">Scopri i Servizi</a>
          </div>
        </div>
      </div>
      <div className="hero__scroll" aria-hidden="true">Scorri</div>
    </section>
  )
}
