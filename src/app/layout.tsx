import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-sans",
  adjustFontFallback: false,
  fallback: ["Arial", "sans-serif"],
  axes: ["opsz", "slnt", "wdth", "ROND"],
});

export const metadata: Metadata = {
  title: "SonicSpace — See what you hear",
  description: "A two-minute interactive guide to surround sound, spatial audio and the ideas behind Dolby Atmos.",
  applicationName: "SonicSpace",
  keywords: ["spatial audio", "surround sound", "Dolby Atmos", "interactive learning", "hackathon demo"],
  icons: { icon: "/icon.svg", shortcut: "/icon.svg" },
  openGraph: {
    title: "SonicSpace — See what you hear",
    description: "Explore how sound can surround you, move behind you and rise above you.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={googleSansFlex.variable}>
      <body>{children}</body>
    </html>
  );
}
