import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tradie Directory",
  description: "A directory for tradespeople to connect with customers",
  generator: "Tradie Directory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
