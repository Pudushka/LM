import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoNexo - AI Search Optimization Platform",
  description:
    "Optimize your brand visibility across AI-powered search engines. Monitor, analyze, and improve how AI discovers and recommends your content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
