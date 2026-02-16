import "./globals.css";
import Header from "../components/header";

export const metadata = {
  title: "Codeluxe Store",
  description: "Codeluxe Store - Ecommerce SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
