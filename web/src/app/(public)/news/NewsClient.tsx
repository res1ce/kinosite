'use client';

import Link from "next/link";
import { CalendarDays, Clock, ArrowRight, Search} from "lucide-react";
import { useState, useEffect } from "react";

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl: string | null;
  galleryUrls: JSON;
  date: string;
  location: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function NewsClient({ events }: { events: Event[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const visibleItems = useScrollAnimation();

  const categories = ['Все', 'Фестивали', 'Локации', 'Партнерство', 'Премьеры', 'Конкурсы'];

  const filteredNews = events.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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

        .dark .glass-effect,
        html[data-theme="dark"] .glass-effect {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
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

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 dark:from-blue-500/30 dark:via-transparent dark:to-purple-500/30"></div>
          
          {/* Floating background elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 dark:bg-purple-400/30 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-500/20 dark:bg-pink-400/30 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-500/15 dark:bg-blue-400/25 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-slideInDown border border-white/10">
                <div className="w-2 h-2 bg-green-400 dark:bg-green-300 rounded-full mr-2 animate-pulse"></div>
                Новости кинокомиссии
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp">
                События и 
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent">
                  новости
                </span>
              </h1>

              <p className="text-xl text-white/80 dark:text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Следите за актуальными событиями, анонсами и отчётами кинокомиссии Забайкальского края
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 dark:text-white/50" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск новостей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl text-white placeholder-white/60 dark:placeholder-white/50 focus:outline-none focus:border-purple-400 dark:focus:border-purple-300 transition-all duration-300"
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
                          className={`block w-full text-left px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            selectedCategory === category ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold' : ''
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
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl dark:shadow-purple-500/10 dark:hover:shadow-purple-500/20 border border-gray-100 dark:border-gray-700 transition-all duration-500">
                      {/* Image */}
                      <div className="relative h-64 overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {item.coverImageUrl ? (
                          <>
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                              style={{ backgroundImage: `url(${item.coverImageUrl})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <CalendarDays className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                          </div>
                        )}

                        {/* Date Badge */}
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-black/30 dark:bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                            <CalendarDays size={12} />
                            {new Date(item.date).toLocaleDateString("ru-RU")}
                          </span>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 dark:from-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-floating shadow-lg dark:shadow-purple-500/20">
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
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg dark:hover:shadow-purple-500/30 transform hover:scale-105 transition-all duration-300"
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