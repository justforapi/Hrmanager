import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import { DevErrorOverlayHost } from "@/components/dev/dev-error-overlay-host";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helix HR",
  description: "AI-powered recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[15px] leading-relaxed">
        {children}
        <DevErrorOverlayHost />
      </body>
    </html>
  );
}
