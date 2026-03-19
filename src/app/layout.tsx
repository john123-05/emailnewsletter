import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Briefwerk Admin",
  description: "Deutsches Newsletter-Dashboard für Supabase, Make.com und SMTP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
