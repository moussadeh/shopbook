import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopBook",
  description: "ShopBook est un SaaS qui remplace les carnets crédit des commerçants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
