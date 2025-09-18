import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import RevealOnScroll from "@/components/RevealOnScroll";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "cyrillic"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Забайкалькая кинокомиссия",
    template: "%s — Кинокомиссия",
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
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        {children}
        <RevealOnScroll />
      </body>
    </html>
  );
  /*<div className="fixed bottom-4 right-4 flex gap-2 items-center translate-y-[-56px]">
          <ThemeToggle />
    </div>*/
}
