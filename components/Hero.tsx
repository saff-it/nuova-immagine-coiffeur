import { getCldImageUrl } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function Hero({ image }: { image: CloudinaryResource | null }) {
  const bgUrl = image
    ? getCldImageUrl({ src: image.public_id, width: 1920, quality: 'auto', format: 'auto' })
    : null

  return (
    <section className="hero" id="hero">
      {bgUrl && (
        <div className="hero__bg" style={{ backgroundImage: `url('${bgUrl}')` }} />
      )}
      <div className="hero__overlay" />
      <div className="container">
        <div className="hero__content">
          <span className="hero__label">Salone da Parrucchiere</span>
          <h1 className="hero__h1">
            Bellezza sartoriale da quarant&apos;anni a Milano
          </h1>
          <p className="hero__sub">
            Nuova Immagine Coiffeur ti accoglie in Piazza Bonomelli con tagli personalizzati,
            colore e trattamenti curati da mani esperte.
          </p>
          <div className="hero__btns">
            <a href="tel:+3902537982" className="btn-green">Prenota un appuntamento</a>
          </div>
        </div>
      </div>
    </section>
  )
}
