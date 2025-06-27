import type { Metadata } from "next";
import "./globals.css";
import { startCronJobs } from "@/lib/cron";

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

// For serverless environments (Vercel, Netlify)
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCronJobs } = await import("@/lib/cron");
    startCronJobs();
  }
}

// For traditional Node servers
if (process.env.NODE_ENV !== "test") {
  startCronJobs();
}
