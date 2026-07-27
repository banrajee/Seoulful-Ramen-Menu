import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seoulful Ramen Live Menu",
  description: "A live QR digital menu for a self-cook Korean ramen shop."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
