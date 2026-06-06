import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getMarketData } from "@/lib/data";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Sri Lanka stock market",
    "Colombo Stock Exchange",
    "CSE",
    "Sri Lanka business news",
    "Sri Lanka economy",
    "Sri Lanka financial news",
    "stock market Sri Lanka",
    "dividend news Sri Lanka",
    "exchange rates Sri Lanka",
    "IMF Sri Lanka",
  ],
  authors: [{ name: "Lanka Market Pulse" }],
  creator: "Lanka Market Pulse",
  publisher: "Lanka Market Pulse",
  metadataBase: new URL("https://lankamarketpulse.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "https://lankamarketpulse.com",
    images: [
      {
        url: "/og/default-og.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: "@LankaMarketPulse",
    creator: "@LankaMarketPulse",
    images: ["/og/default-og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const marketData = getMarketData();

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header marketData={marketData} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
