'use client';

import Link from "next/link";
import { CalendarDays, Clock, ArrowRight, Search, Filter } from "lucide-react";
import { useState, useEffect } from "react";

function useScrollAnimation() {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleItems;
}

export default function NewsClient({ events }: { events: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const visibleItems = useScrollAnimation();

  const categories = ['Все', 'Фестивали', 'Локации', 'Партнерство', 'Премьеры', 'Конкурсы'];

  const filteredNews = events.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style jsx global>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .news-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .category-badge {
          background: linear-gradient(135deg, rgba(139, 69, 19, 0.8), rgba(255, 140, 0, 0.8));
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20"></div>
          
          {/* Floating background elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-slideInDown">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Новости кинокомиссии
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp">
                События и 
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  новости
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Следите за актуальными событиями, анонсами и отчётами кинокомиссии Забайкальского края
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск новостей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-purple-400 transition-all duration-300"
                  />
                </div>
                
                <div className="relative">
                  {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-scaleIn z-20">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`block w-full text-left px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            selectedCategory === category ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : ''
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="container mx-auto px-6 py-20">
          {filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, i) => (
                <article
                  key={item.id}
                  id={`news-${i}`}
                  data-animate
                  className={`news-card group animate-on-scroll ${visibleItems.has(`news-${i}`) ? 'visible' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <Link href={`/news/${item.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${item.coverImageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Date Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black/30 backdrop-blur-sm rounded-full">
                            <CalendarDays size={12} />
                            {new Date(item.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 leading-tight">
                          {item.title}
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                          {item.shortDescription}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={14} />
                            <span>5 мин чтения</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all duration-300">
                            <span>Читать</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fadeUp">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-floating">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Новости не найдены
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Все');
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
