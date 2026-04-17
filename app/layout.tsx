import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Xecuit Holdings | Cyclical Ecosystem Builders",
    template: "%s | Xecuit Holdings",
  },
  description:
    "Xecuit is a boutique investment firm building ecosystems anchored by durable platforms.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "institutional holding company",
    "private equity",
    "capital allocation",
    "operational excellence",
    "business acquisition",
    "investment management",
  ],
  authors: [{ name: "Xecuit" }],
  creator: "Xecuit",
  publisher: "Xecuit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://xecuit.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xecuit.com",
    title: "Xecuit Holdings | Cyclical Ecosystem Builders",
    description: "Xecuit is a boutique investment firm building ecosystems anchored by durable platforms.",
    siteName: "Xecuit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xecuit — Institutional Holding Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xecuit Holdings | Cyclical Ecosystem Builders",
    description: "Xecuit is a boutique investment firm building ecosystems anchored by durable platforms.",
    images: ["/og-image.png"],
    creator: "@xecuit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Xecuit",
              description:
                "Institutional holding company focused on acquiring, operating, and growing businesses.",
              url: "https://xecuit.com",
              logo: "https://xecuit.com/logo.png",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "inquiries",
                availableLanguage: "English",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
