import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import { integrations, site } from "@/data/site";
import { ogImage } from "@/data/media";
import { CartProvider, ToastProvider } from "@/lib/cart";
import { menuJsonLd, restaurantJsonLd, websiteJsonLd } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileOrderBar } from "@/components/layout/MobileOrderBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Chamcha Restaurant | Authentic Pakistani Cuisine & Online Ordering";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["Chamcha Restaurant", "Pakistani restaurant", "karahi", "pulao", "BBQ", "chapli kebab", "online food ordering", "family deals", "takeaway", "delivery"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    locale: "en_US",
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: "Pakistani feast at Chamcha Restaurant" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: [ogImage.src],
  },
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#0D0B0A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = [restaurantJsonLd(), menuJsonLd(), websiteJsonLd()];
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[100] bg-copper-500 px-4 py-3 font-semibold text-ink-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Skip to content
        </a>
        <ToastProvider>
          <CartProvider>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <MobileOrderBar />
            <CartDrawer />
            <Toaster />
          </CartProvider>
        </ToastProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {integrations.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${integrations.gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${integrations.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
