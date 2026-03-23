import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W6368ZZDN7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W6368ZZDN7');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "LawVert",
              url: "https://lawvert.com",
              description:
                "LawVert provides cutting-edge conversion optimization and digital marketing solutions for law firms, helping legal practices maximize lead generation and client acquisition.",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "LawVert",
              url: "https://lawvert.com",
              description:
                "Transform your legal practice with cutting-edge conversion optimization. Elevate your firm's digital presence and watch your client base soar.",
              publisher: {
                "@type": "Organization",
                name: "LawVert",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
