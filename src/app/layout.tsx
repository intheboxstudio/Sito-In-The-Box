import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://intheboxstudio.it";
const SITE_TITLE = "IN THE BOX STUDIO | Agenti AI & Automazione Aziendale";
const SITE_DESCRIPTION =
  "Agenti AI, automazione aziendale e chatbot su misura. Con sede a Reggio Emilia, lavoro con aziende in tutta Italia: cloni virtuali, siti con blog scritti dall'AI, social media management e copywriting.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: "IN THE BOX STUDIO",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "IN THE BOX STUDIO",
  image: `${BASE_URL}/logo-nero.png`,
  logo: `${BASE_URL}/logo-nero.png`,
  url: BASE_URL,
  email: "intheboxstudio.smm@gmail.com",
  description: SITE_DESCRIPTION,
  founder: {
    "@type": "Person",
    name: "Marco Losso",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Reggio Emilia",
    addressRegion: "Emilia-Romagna",
    addressCountry: "IT",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Reggio Emilia",
    },
    {
      "@type": "Country",
      name: "Italia",
    },
  ],
  sameAs: ["https://www.linkedin.com/in/intheboxstudio/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <AnimatedBackground />
        <Nav />
        {children}
        <Footer />
        <ChatWidget />
        {process.env.NODE_ENV === "production" && GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
