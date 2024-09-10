"use client"

import React from "react"
import { Treemap } from "@/cmp/treemap"
import { Header } from "@/cmp/header"

export default function Page() {
  useEffect(() => {

    const disableZoom = (e) => e.preventDefault()
    const parentElement = document.getElementById('home-container')
    parentElement.addEventListener('touchmove', disableZoom, { passive: false })
    parentElement.addEventListener('gesturestart', disableZoom )
    return () => {
      parentElement.removeEventListener('touchmove', disableZoom )
      parentElement.removeEventListener('gesturestart', disableZoom )
    }
  }, [])

  return (
    <main id="home-container">
      <Treemap/>
      <Header/>
    </main>
  )
}
