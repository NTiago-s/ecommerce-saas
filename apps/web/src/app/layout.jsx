import "./globals.css";
import Header from "../components/header";

export const metadata = {
  title: {
    default: "Codeluxe Store",
    template: "%s | Codeluxe Store",
  },
  description:
    "Crea tu ecommerce con planes mensuales, una experiencia minimalista y una base preparada para vender.",
  keywords: [
    "crear ecommerce",
    "planes ecommerce",
    "tienda online",
    "suscripcion ecommerce",
    "marca propia online",
  ],
  authors: [{ name: "Codeluxe Store" }],
  creator: "Codeluxe Store",
  publisher: "Codeluxe Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://codeluxe-store.com",
  ),
  openGraph: {
    title: "Codeluxe Store",
    description:
      "Crea tu ecommerce con planes simples, una experiencia clara y una base preparada para crecer.",
    type: "website",
    locale: "es_ES",
    siteName: "Codeluxe Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codeluxe Store",
    description:
      "Crea tu ecommerce con planes simples y una base preparada para escalar.",
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1d4ed8" />
        <link
          rel="canonical"
          href={
            process.env.NEXT_PUBLIC_SITE_URL || "https://codeluxe-store.com"
          }
        />
      </head>
      <body className="min-h-screen antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
