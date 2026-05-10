import { CldImage } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function About({ image }: { image: CloudinaryResource | null }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__grid">

          <div className="about__img-wrap reveal">
            {image ? (
              <CldImage
                src={image.public_id}
                width={900}
                height={540}
                alt="Salone Nuova Immagine Coiffeur"
                style={{ width: '100%', height: '540px', objectFit: 'cover', position: 'relative', zIndex: 1 }}
                format="auto"
                quality="auto"
                loading="lazy"
              />
            ) : (
              <div style={{ width: '100%', height: '540px', background: 'var(--anthr)', position: 'relative', zIndex: 1 }} />
            )}
            <div className="about__badge" aria-hidden="true">
              <strong>40</strong>
              <span>anni</span>
            </div>
          </div>

          <div className="about__text reveal">
            <span className="label">La nostra storia</span>
            <h2 className="title">Una tradizione<br />di <em>eccellenza</em></h2>
            <div className="divider" />
            <p>Era il 1984 quando Carmelo aprì le porte di Nuova Immagine Coiffeur in Piazza Bonomelli 4, portando a Milano una visione della cura del capello come forma d&apos;arte.</p>
            <p>Quarant&apos;anni dopo, quella visione è rimasta intatta: ogni cliente viene accolto con attenzione individuale, ogni servizio viene eseguito con la precisione di chi ha affinato la propria tecnica in decenni di lavoro.</p>
            <p>Non si tratta solo di tagliare o colorare i capelli. Si tratta di capire chi sei, come vuoi presentarti al mondo, e aiutarti a realizzarlo — con maestria, passione e rispetto.</p>
            <div className="about__firma">
              <p className="about__firma-name">Carmelo</p>
              <p className="about__firma-role">Fondatore &amp; Master Stylist · dal 1984</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
