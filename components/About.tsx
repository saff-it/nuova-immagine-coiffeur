import { CldImage } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function About({ image, gallery }: { image: CloudinaryResource | null; gallery: CloudinaryResource[] }) {
  const imgs = [image, ...gallery.slice(0, 2)].filter(Boolean) as CloudinaryResource[]

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="about__grid">
          <div className="about__img-grid">
            {imgs.slice(0, 3).map((img, i) => (
              <CldImage
                key={img.public_id}
                src={img.public_id}
                width={i === 0 ? 600 : 400}
                height={i === 0 ? 440 : 200}
                alt={`Salone Nuova Immagine Coiffeur ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                format="auto" quality="auto" loading="lazy"
              />
            ))}
            {imgs.length < 2 && <div className="about__img-placeholder" />}
          </div>
          <div>
            <span className="section__label">Chi siamo</span>
            <h2 className="section__h2">Passione e competenza<br />nel cuore di Milano</h2>
            <p className="section__desc">
              Nuova Immagine Coiffeur nasce dalla dedizione di Carmelo, che dal 1984 cura ogni
              cliente con attenzione artigianale e calore umano. Una storia di fiducia costruita
              nel tempo, dove la bellezza nasce dall&apos;ascolto e dall&apos;esperienza.
            </p>
            <div className="about__sub">
              <div className="about__sub-icon">🏛️</div>
              <div>
                <span className="about__sub-title">Il Salone</span>
                <span className="about__sub-text">Quattro Decenni nel quartiere Brenta</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
