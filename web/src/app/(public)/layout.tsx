import Link from "next/link";

// layout.tsx
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { title: "Новости", href: "/news" },
    { title: "Локации", href: "/locations" },
    { title: "Услуги", href: "/services" },
    { title: "Документы", href: "/documents" },
    { title: "О нас", href: "/about" },
  ];
  return (
    <div className="min-h-svh flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 transition backdrop-blur bg-white/70 dark:bg-black/40 shadow-sm">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-[#6E0A6B]">Кинокомиссия</Link>
          <nav className="hidden md:flex gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="main-nav-item"
              >
                {item.title}
              </Link>
            ))}
          </nav>
          <Link
            href="/contacts"
            className="hidden md:inline-block px-5 py-2 rounded-lg bg-[#6E0A6B] text-white font-medium hover:scale-105 transition"
          >
            Связаться
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#6E0A6B] to-purple-800 text-white mt-20">
        <div className="container mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">Кинокомиссия</h3>
            <p className="text-sm text-gray-200">
              Помощь в организации съёмок и продвижении региона.
            </p>
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
            <p className="text-sm">Чита, Забайкальский край</p>
            <p className="text-sm">info@kino.ru</p>
          </div>
        </div>
        <div className="text-center text-sm py-4 bg-black/20">
          © {new Date().getFullYear()} Забайкальская кинокомиссия
        </div>
      </footer>
    </div>
  );
}
