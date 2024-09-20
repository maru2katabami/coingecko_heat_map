"use client"

import React, { useEffect } from "react"
import { Treemap } from "@/cmp/treemap"
import { Header } from "@/cmp/header"

export default function Page() {
  return (
    <main>
      <Treemap/>
      <Header/>
    </main>
  )
}
