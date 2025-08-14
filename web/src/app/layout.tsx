import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AccessibilityToggle from "@/components/AccessibilityToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Кинокомпания",
    template: "%s — Кинокомпания",
  },
  description: "Организация киномероприятий, партнёрские показы, социальные проекты.",
  metadataBase: new URL("http://localhost:3000"),
  applicationName: "Кинокомпания",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AccessibilityToggle />
      </body>
    </html>
  );
}
