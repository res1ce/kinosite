import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Админка" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { href: "/admin", title: "Главная" },
    { href: "/admin/events", title: "Новости" },
    { href: "/admin/locations", title: "Локации" },
    { href: "/admin/prices", title: "Услуги" },
    { href: "/admin/documents", title: "Документы" },
    { href: "/admin/pages/about", title: "О нас" },
  ];

  return (
    <section className="min-h-svh">
      {/* Topbar */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-black/40 border-b">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-semibold text-[#6E0A6B] tracking-tight">Администрирование</Link>
          <nav className="hidden md:flex items-center gap-5 text-sm">
            {nav.map(i => (
              <Link
                key={i.href}
                href={i.href}
                className="relative py-1 text-gray-700 dark:text-gray-200 hover:text-[#6E0A6B] transition group"
              >
                {i.title}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-[#6E0A6B] to-purple-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6">
        <div className="grid gap-6">{children}</div>
      </div>
    </section>
  );
}
