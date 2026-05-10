import { v2 as cloudinary } from 'cloudinary'
import { cache } from 'react'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryResource {
  public_id: string
  secure_url: string
  width: number
  height: number
}

export interface SiteImages {
  hero: CloudinaryResource | null
  about: CloudinaryResource | null
  gallery: CloudinaryResource[]
}

export const getSiteImages = cache(async (): Promise<SiteImages> => {
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'clienti/nuova-immagine-coiffeur',
    max_results: 100,
  })

  const resources: CloudinaryResource[] = (result.resources as Array<{
    public_id: string
    secure_url: string
    width: number
    height: number
  }>).map((r) => ({
    public_id: r.public_id,
    secure_url: r.secure_url,
    width: r.width,
    height: r.height,
  }))

  const hero =
    resources.find((r) => r.public_id.includes('Gemini_Generated_Image')) ??
    resources[0] ??
    null

  const about =
    resources.find((r) => r.public_id.includes('2022-09-29')) ?? null

  const excludedIds = new Set(
    [hero?.public_id, about?.public_id].filter((id): id is string => Boolean(id))
  )
  const gallery = resources.filter((r) => !excludedIds.has(r.public_id))

  return { hero, about, gallery }
})
