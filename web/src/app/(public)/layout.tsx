export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a className="font-semibold" href="/">Кинокомпания</a>
          <nav className="flex gap-4 text-sm">
            <a href="/events">Мероприятия</a>
            <a href="/cinemas">Кинотеатры</a>
            <a href="/prices">Цены</a>
            <a href="/about">О нас</a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t">
        <div className="container mx-auto px-6 py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Кинокомпания
        </div>
      </footer>
    </div>
  );
}


