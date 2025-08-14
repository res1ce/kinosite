export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="backdrop-blur-md bg-gradient-to-b from-white via-white/80 to-white/30 sticky top-0 z-40 border-b border-gray-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <a className="font-semibold text-lg tracking-tight" href="/">Забайкальская кинокомиссия</a>
          <nav className="hidden md:flex gap-1 text-sm">
            <a href="/news" className="px-3 py-2 rounded-lg hover:bg-black/5 hover:text-black transition-all duration-200 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              Новости
            </a>
            <a href="/services" className="px-3 py-2 rounded-lg hover:bg-black/5 hover:text-black transition-all duration-200 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="M6.8 15.7 4 22l6.3-2.1"/><circle cx="12" cy="11" r="4"/></svg>
              Услуги
            </a>
            <a href="/locations" className="px-3 py-2 rounded-lg hover:bg-black/5 hover:text-black transition-all duration-200 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Локации
            </a>
            <a href="/documents" className="px-3 py-2 rounded-lg hover:bg-black/5 hover:text-black transition-all duration-200 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M9 3v6h6"/><path d="M9 21v-6h6"/></svg>
              Документы
            </a>
            <a href="/about" className="px-3 py-2 rounded-lg hover:bg-black/5 hover:text-black transition-all duration-200 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
              О нас
            </a>
          </nav>
          
        </div>
      </header>
      {children}
      <footer className="mt-16 border-t bg-gradient-to-b from-white via-gray-50/80 to-gray-100/60">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* О нас */}
            <div>
              <h3 className="font-semibold mb-4">О Кинокомиссии</h3>
              <p className="text-sm text-gray-600 mb-4">
                Мы помогаем кинематографистам находить идеальные локации и получать всю необходимую поддержку для съемок.
              </p>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +7 (999) 123-45-67
                </p>
                <p className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  info@kinocommission.ru
                </p>
                <p className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  г. Москва, ул. Примерная, 123
                </p>
              </div>
            </div>

            {/* Быстрые ссылки */}
            <div>
              <h3 className="font-semibold mb-4">Навигация</h3>
              <nav className="flex flex-col space-y-2 text-sm text-gray-600">
                <a href="/news" className="hover:text-gray-900">Новости</a>
                <a href="/services" className="hover:text-gray-900">Услуги</a>
                <a href="/locations" className="hover:text-gray-900">Локации</a>
                <a href="/documents" className="hover:text-gray-900">Документы</a>
                <a href="/about" className="hover:text-gray-900">О нас</a>
              </nav>
            </div>

            {/* Соц. сети */}
            <div>
              <h3 className="font-semibold mb-4">Мы в соцсетях</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zM12 15.88c-2.14 0-3.88-1.74-3.88-3.88 0-2.14 1.74-3.88 3.88-3.88 2.14 0 3.88 1.74 3.88 3.88 0 2.14-1.74 3.88-3.88 3.88zM16.5 7.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.47 2H3.53a1.45 1.45 0 0 0-1.47 1.43v17.14A1.45 1.45 0 0 0 3.53 22h16.94a1.45 1.45 0 0 0 1.47-1.43V3.43A1.45 1.45 0 0 0 20.47 2zM8.09 18.74h-3v-9h3v9zm-1.5-10.4a1.64 1.64 0 1 1 1.64-1.64 1.64 1.64 0 0 1-1.64 1.64zm12.32 10.4h-3v-4.39c0-1.12 0-2.57-1.56-2.57s-1.8 1.22-1.8 2.48v4.48h-3v-9h2.88v1.32h.04a3.16 3.16 0 0 1 2.84-1.56c3.04 0 3.6 2 3.6 4.59z"/></svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.236 8.236 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Нижняя часть футера */}
          <div className="pt-8 border-t border-gray-200 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Кинокомиссия - все права защищены</div>
            <nav className="flex gap-6">
              <a href="/privacy" className="hover:text-gray-900">Политика конфиденциальности</a>
              <a href="/terms" className="hover:text-gray-900">Условия использования</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}


