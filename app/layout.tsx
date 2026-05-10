import type { Metadata } from 'next'
import { Playfair_Display, Mulish } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
})

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nuova Immagine Coiffeur - Parrucchiere a Milano',
  description: 'Benvenuti nel nostro salone di bellezza a Milano. Offriamo servizi di parrucchiere per donna, tra cui tagli sartoriali, colorazioni, pieghe e trattamenti personalizzati.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={`${playfair.variable} ${mulish.variable}`}>{children}</body>
    </html>
  )
}
