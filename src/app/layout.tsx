import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://63letters.com'),
  title: "63letters",
  description: "a daily poem puzzle",
  openGraph: {
    title: "63letters",
    description: "a daily poem puzzle",
    url: "https://63letters.com",
    siteName: "63letters",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "63letters - a daily poem puzzle",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "63letters",
    description: "a daily poem puzzle",
    images: ["/og-image.png"],
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
        className={`${ebGaramond.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
