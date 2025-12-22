import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OnchainProviders from "@/providers/OnchainProviders";
import "@coinbase/onchainkit/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BaseStride Move to Earn",
  description: "Earn rewards for every step on Base",
  openGraph: {
    title: "BaseStride Move to Earn",
    description: "Earn rewards for every step on Base",
    images: ["https://basestride.vercel.app/og-image.png"],
  },
  other: {
    'base:app_id': '69479cedd19763ca26ddc7e7',
    'fc:miniapp': JSON.stringify({
      version: "next",
      imageUrl: "https://basestride.vercel.app/og-image.png",
      button: {
        title: "Open BaseStride",
        action: {
          type: "launch_frame",
          url: "https://basestride.vercel.app",
          name: "BaseStride",
          splashImageUrl: "https://basestride.vercel.app/splash.png",
          splashBackgroundColor: "#0052FF"
        }
      }
    })
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
        <OnchainProviders>
          {children}
        </OnchainProviders>
      </body>
    </html>
  );
}
