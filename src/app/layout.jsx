import "./globals.css"
import { Source_Sans_3 } from "next/font/google"

const ss3 = Source_Sans_3({ subsets: ["latin"]})

export const metadata = {
  title: "HEATMAP by CoinGecko",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest/manifest.json"/>
        <link rel="apple-touch-icon" href="/manifest/icon.png"></link>
        <meta name="theme-color" content="#fff"/>
      </head>
      <body className={ ss3.className }>
        { children }
      </body>
    </html>
  )
}
