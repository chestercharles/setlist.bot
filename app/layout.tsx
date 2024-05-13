import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "./AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Setlist.Bot",
  openGraph: {
    title: "Setlist.Bot",
    description: "Generate setlists for your band",
    url: "https://setlist.bot",
    siteName: "Setlist.Bot",
    images: [
      {
        url: "https://setlist.bot/favicon.ico",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
