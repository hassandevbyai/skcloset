import type { Metadata } from "next"
import { DM_Sans, Playfair_Display } from "next/font/google"
import Script from "next/script"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ToastContainer } from "@/components/ui/ToastContainer"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://skcloset.vercel.app"),
  title: {
    default: "SKCLOSET — Premium Men's Fashion",
    template: "%s | SKCLOSET",
  },
  description:
    "Premium men's fashion boutique. Curated collections of luxury streetwear, old money aesthetic, and smart casual essentials. Polo Ralph Lauren, Nike, Supreme, and more.",
  keywords: ["mens fashion", "streetwear", "old money aesthetic", "premium clothing", "Polo Ralph Lauren", "Nike", "Supreme"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SKCLOSET",
    title: "SKCLOSET — Premium Men's Fashion",
    description:
      "Premium men's fashion boutique. Curated collections of luxury streetwear, old money aesthetic, and smart casual essentials.",
    url: "https://skcloset.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKCLOSET — Premium Men's Fashion",
    description:
      "Premium men's fashion boutique. Curated collections of luxury streetwear, old money aesthetic, and smart casual essentials.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://skcloset.vercel.app",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("theme"),d=window.matchMedia("(prefers-color-scheme:dark)").matches;document.documentElement.classList.toggle("dark",t?t==="dark":d)}catch(e){}})()`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1 pt-16 md:pt-[72px]">{children}</main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  )
}
