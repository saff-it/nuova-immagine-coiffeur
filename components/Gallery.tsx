import { CldImage } from 'next-cloudinary'
import type { CloudinaryResource } from '@/lib/cloudinary'

export default function Gallery({ images }: { images: CloudinaryResource[] }) {
  const items = images.slice(0, 5)

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="gallery__head">
          <span className="label">Gallery</span>
          <h2 className="title title--white">Il nostro <em>lavoro</em></h2>
          <div className="divider divider--center" />
        </div>
      </div>
      <div className="gallery__grid" role="list" aria-label="Foto del salone e dei lavori">
        {items.map((img, i) => (
          <div key={img.public_id} className="gallery__item" role="listitem">
            <CldImage
              src={img.public_id}
              width={i === 0 ? 1200 : 800}
              height={i === 0 ? 540 : 270}
              alt={`Lavoro del salone ${i + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              format="auto"
              quality="auto"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
