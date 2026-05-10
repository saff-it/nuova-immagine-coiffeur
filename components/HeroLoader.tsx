'use client'

import { useEffect } from 'react'

export default function HeroLoader() {
  useEffect(() => {
    if (history.scrollRestoration) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById('hero')?.classList.add('hero--loaded')
      })
    )
  }, [])

  return null
}
