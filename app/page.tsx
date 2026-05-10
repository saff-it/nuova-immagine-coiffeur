import { getSiteImages } from '@/lib/cloudinary'
import ScrollAnimations from '@/components/ScrollAnimations'
import HeroLoader from '@/components/HeroLoader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Servizi from '@/components/Servizi'
import Testimonianze from '@/components/Testimonianze'
import About from '@/components/About'
import CtaBand from '@/components/CtaBand'
import InfoOrari from '@/components/InfoOrari'
import Footer from '@/components/Footer'

export default async function Home() {
  const images = await getSiteImages()
  return (
    <>
      <ScrollAnimations />
      <HeroLoader />
      <Navbar />
      <main>
        <Hero image={images.hero} />
        <Servizi />
        <Testimonianze />
        <About image={images.about} gallery={images.gallery} />
        <CtaBand />
        <InfoOrari />
      </main>
      <Footer />
    </>
  )
}
