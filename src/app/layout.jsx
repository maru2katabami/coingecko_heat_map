import "./globals.css"
import { Source_Sans_3 } from "next/font/google"

const ss3 = Source_Sans_3({ subsets: ["latin"]})

export const metadata = {
  title: "Coin Gecko Heat Map",
  description: "",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ ss3.className }>
        { children }
      </body>
    </html>
  )
}
