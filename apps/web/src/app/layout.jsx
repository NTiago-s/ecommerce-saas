import "./globals.css";
import Header from "../components/header";

export const metadata = {
  title: "Codeluxe Store - Plataforma Ecommerce SaaS",
  description:
    "Crea tu tienda online fácilmente con Codeluxe Store. Plataforma ecommerce SaaS con todo lo que necesitas para vender online: catálogo de productos, pagos seguros, gestión de inventario y más.",
  keywords:
    "ecommerce, tienda online, SaaS, plataforma ecommerce, vender online, catálogo productos, gestión inventario",
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
    title: "Codeluxe Store - Plataforma Ecommerce SaaS",
    description:
      "Crea tu tienda online fácilmente con Codeluxe Store. Plataforma ecommerce SaaS con todo lo que necesitas para vender online.",
    type: "website",
    locale: "es_ES",
    siteName: "Codeluxe Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codeluxe Store - Plataforma Ecommerce SaaS",
    description:
      "Crea tu tienda online fácilmente con Codeluxe Store. Plataforma ecommerce SaaS con todo lo que necesitas para vender online.",
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
        <meta name="theme-color" content="#2563eb" />
        <link
          rel="canonical"
          href={
            process.env.NEXT_PUBLIC_SITE_URL || "https://codeluxe-store.com"
          }
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
