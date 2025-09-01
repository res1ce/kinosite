// app/layout.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ContactModal from "@/components/ContactModal";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { title: "Новости", href: "/news" },
    { title: "Локации", href: "/locations" },
    { title: "Услуги", href: "/services" },
    { title: "Документы", href: "/documents" },
    { title: "О нас", href: "/about" },
  ];

  const site = await prisma.siteContent.findUnique({ where: { slug: "main" } });

  const footerDescription =
    site?.footerDescription || "Помощь в организации съёмок и продвижении региона.";
  const footerContacts =
    site?.footerContacts || "Чита, Забайкальский край\ninfo@kino.ru";

  const contactLines = footerContacts.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <div className="min-h-svh flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 transition backdrop-blur bg-white/70 dark:bg-black/40 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          {/* Лого */}
          <Link
            href="/"
            className="font-bold text-xl text-[#6E0A6B] hover:text-[#9d2c99] transition-colors"
          >
            Кинокомиссия
          </Link>

          {/* Навигация */}
          <nav className="hidden md:flex gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-2 py-1 font-medium text-gray-700 dark:text-gray-200 transition-colors 
                          hover:text-[#6E0A6B] group"
              >
                {item.title}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#6E0A6B] to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* CTA */}
        <ContactModal
          phone={site?.contactPhone || "+7 (999) 123-45-67"}
          email={site?.contactEmail || "info@kino.ru"}
          variant="header"
        />

        </div>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#6E0A6B] to-purple-800 text-white mt-20">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Кинокомиссия</h3>
            <p className="text-sm text-gray-200">{footerDescription}</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Навигация</h3>
            <ul className="space-y-2">
              <li><Link href="/news" className="hover:underline">Новости</Link></li>
              <li><Link href="/locations" className="hover:underline">Локации</Link></li>
              <li><Link href="/services" className="hover:underline">Услуги</Link></li>
              <li><Link href="/documents" className="hover:underline">Документы</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Контакты</h3>
            {contactLines.map((line, idx) => (
              <p className="text-sm" key={idx}>{line}</p>
            ))}
          </div>
        </div>
        <div className="text-center text-sm py-4 bg-black/20">
          © {new Date().getFullYear()} Забайкальская кинокомиссия
        </div>
      </footer>
    </div>
  );
}
