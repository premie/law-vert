import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LawVert - Convert with LawVert, Go Vertical",
  description: "Transform your legal practice with cutting-edge conversion optimization. Elevate your firm's digital presence and watch your client base soar.",
  keywords: "legal marketing, law firm conversion, legal lead generation, law practice growth, attorney marketing",
  openGraph: {
    title: "LawVert - Convert with LawVert, Go Vertical",
    description: "Transform your legal practice with cutting-edge conversion optimization.",
    url: "https://lawvert.com",
    siteName: "LawVert",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
