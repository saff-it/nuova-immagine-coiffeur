import { getSiteImages } from '@/lib/cloudinary'
import ScrollAnimations from '@/components/ScrollAnimations'
import HeroLoader from '@/components/HeroLoader'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsStrip from '@/components/StatsStrip'
import Servizi from '@/components/Servizi'
import About from '@/components/About'
import Gallery from '@/components/Gallery'
import Testimonianze from '@/components/Testimonianze'
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
        <StatsStrip />
        <Servizi />
        <About image={images.about} />
        <Gallery images={images.gallery} />
        <Testimonianze />
        <CtaBand />
        <InfoOrari />
      </main>
      <Footer />
    </>
  )
}
