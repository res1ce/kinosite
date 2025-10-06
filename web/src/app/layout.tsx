import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import RevealOnScroll from "@/components/RevealOnScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Accessibility mode
                  const accessibilityMode = localStorage.getItem('accessibilityMode') === 'true';
                  if (accessibilityMode) {
                    document.documentElement.classList.add('accessibility-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        <ThemeProvider>
          <AccessibilityProvider>
            {children}
            <RevealOnScroll />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
