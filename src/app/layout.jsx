import "./globals.css"
import { Source_Sans_3 } from "next/font/google"
import { Adsense } from "@/cmp/adsense"

const ss3 = Source_Sans_3({ subsets: ["latin"]})

export const metadata = {
  title: "HEATMAP powered by CoinGecko",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest/manifest.json"/>
        <link rel="apple-touch-icon" href="/manifest/icon512_maskable.png"></link>
        <meta name="theme-color" content="#fff"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <Adsense pId="ca-pub-7513541440780811"/>
      </head>
      <body className={ ss3.className }>
        { children }
      </body>
    </html>
  )
}
