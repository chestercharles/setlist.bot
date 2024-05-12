import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LoginGUI } from "./login";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Setlists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginGUI />
        {children}
      </body>
    </html>
  );
}
