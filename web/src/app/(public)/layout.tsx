export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a className="font-semibold text-lg tracking-tight" href="/">Кинокомиссия</a>
          <nav className="hidden md:flex gap-1 text-sm">
            <a href="/news" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors card-hover flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Новости
            </a>
            <a href="/services" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors card-hover flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M6.8 15.7 4 22l6.3-2.1"/><circle cx="12" cy="11" r="4"/></svg>
              Услуги
            </a>
            <a href="/locations" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors card-hover flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Локации
            </a>
            <a href="/documents" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors card-hover flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M9 3v6h6"/><path d="M9 21v-6h6"/></svg>
              Документы
            </a>
            <a href="/about" className="px-3 py-2 rounded hover:bg-gray-100 transition-colors card-hover flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
              О нас
            </a>
          </nav>
          
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t bg-gradient-to-b from-transparent to-gray-50/60">
        <div className="container mx-auto px-6 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Кинокомиссия - все права защищены</div>
          <nav className="flex gap-3">
            <a href="/documents" className="hover:underline">Документы</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}


