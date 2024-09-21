import "./globals.css"
import { Source_Sans_3 } from "next/font/google"

const ss3 = Source_Sans_3({ subsets: ["latin"]})

export const metadata = {
  title: "Heatmap ~ Powered By CoinGecko ~",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
          data-ad-client={ process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID }/>
      </head>
      <body className={ ss3.className }>
        { children }
      </body>
    </html>
  )
}
