'use client';

import { useEffect, useState, useCallback } from "react";
import { CalendarDays, MapPin, Clock, Share, ArrowLeft, Heart, ArrowRight, X, ChevronLeft, ChevronRight, Maximize2, Grid3x3 } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl: string | null;
  galleryUrls: string[] | null;
  date: Date;
  location: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function Lightbox({ 
  images, 
  initialIndex, 
  onClose 
}: { 
  images: string[]; 
  initialIndex: number; 
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goNext, goPrev]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
      >
        <X size={20} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="max-h-[90vh] max-w-[90vw] object-contain"
      />

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[90vw] overflow-x-auto">
          <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg">
            {images.slice(
              Math.max(0, currentIndex - 5),
              Math.min(images.length, currentIndex + 6)
            ).map((img, idx) => {
              const realIdx = Math.max(0, currentIndex - 5) + idx;
              return (
                <button
                  key={realIdx}
                  onClick={() => setCurrentIndex(realIdx)}
                  className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                    realIdx === currentIndex
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${realIdx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [slug, setSlug] = useState<string>('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    // Получаем slug из params
    params.then(({ slug }) => {
      setSlug(slug);
    });
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Событие не найдено');
          }
          throw new Error('Ошибка загрузки события');
        }
        
        const data = await response.json();
        
        // Преобразуем данные для совместимости
        const eventData: Event = {
          ...data,
          date: new Date(data.date),
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          // Парсим galleryUrls если это JSON строка
          galleryUrls: Array.isArray(data.galleryUrls) 
            ? data.galleryUrls 
            : (data.galleryUrls ? JSON.parse(data.galleryUrls) : null)
        };
        
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const handleShare = () => {
    if (!event) return;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <CalendarDays className="text-white" size={24} />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Загрузка события...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Событие не найдено</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error || 'Запрашиваемое событие не существует'}</p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <ArrowLeft size={16} />
              Вернуться к новостям
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        .prose {
          max-width: none;
          color: rgb(55, 65, 81);
        }
        
        .dark .prose,
        html[data-theme="dark"] .prose {
          color: rgb(209, 213, 219);
        }
        
        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
          color: rgb(55, 65, 81);
        }
        
        .dark .prose h3,
        html[data-theme="dark"] .prose h3 {
          color: rgb(229, 231, 235);
        }
        
        .prose p {
          margin: 1rem 0;
          line-height: 1.75;
          color: rgb(75, 85, 99);
        }
        
        .dark .prose p,
        html[data-theme="dark"] .prose p {
          color: rgb(156, 163, 175);
        }
        
        .prose ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin: 0.5rem 0;
          color: rgb(75, 85, 99);
        }
        
        .dark .prose li,
        html[data-theme="dark"] .prose li {
          color: rgb(156, 163, 175);
        }

        .parallax-hero {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }

        @media (max-width: 768px) {
          .parallax-hero {
            background-attachment: scroll;
          }
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-floating {
          animation: floating 6s ease-in-out infinite;
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }
      `}</style>

      <main>
        {/* Enhanced Hero Section */}
        <section 
          className="relative h-[70vh] min-h-[500px] parallax-hero overflow-hidden"
          style={{ 
            backgroundImage: event.coverImageUrl 
              ? `url(${event.coverImageUrl})` 
              : 'linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-floating"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>

          {/* Back Button */}
          <div className="absolute top-8 left-8 z-20 animate-slideInDown">
            <Link 
              href="/news" 
              className="group flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-black/50 transition-all duration-300"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Назад к новостям</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-8 right-8 z-20 flex gap-3 animate-slideInDown" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`group flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500/20 border-red-400/50 text-red-300' 
                  : 'bg-black/30 border-white/20 text-white hover:bg-black/50'
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              <span>{isLiked ? 'Нравится' : 'Лайк'}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="group flex items-center gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm text-white rounded-full border border-white/20 hover:bg-black/50 transition-all duration-300"
            >
              <Share size={16} />
              <span>Поделиться</span>
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-16">
            <div className="max-w-4xl">
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 animate-fadeUp">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                  Событие
                </span>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {Math.ceil(event.content.length / 1000)} мин чтения
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-white/90 mb-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <span className="font-medium">
                    {event.date.toLocaleDateString("ru-RU", { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="font-medium">{event.location}</span>
                  </div>
                )}
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                {event.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-6 py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <article 
              className="prose prose-lg animate-fadeUp"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />

            {/* Gallery */}
            {event.galleryUrls && event.galleryUrls.length > 0 && (() => {
              const images = event.galleryUrls;
              const displayImages = showAllImages ? images : images.slice(0, 12);

              const openLightbox = (index: number) => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              };

              return (
                <div className="mt-16 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Галерея событий
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                        <Grid3x3 className="inline w-4 h-4 mr-2" />
                        {images.length} фото
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {displayImages.map((url, index) => (
                      <div 
                        key={index}
                        className="group relative aspect-square overflow-hidden cursor-pointer bg-cover bg-center rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                        style={{ backgroundImage: `url(${url})` }}
                        onClick={() => openLightbox(index)}
                      >
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300">
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Maximize2 className="text-white" size={20} />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {images.length > 12 && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setShowAllImages(!showAllImages)}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        {showAllImages ? (
                          <>
                            <ChevronLeft size={20} />
                            Показать меньше
                          </>
                        ) : (
                          <>
                            Показать все {images.length} фото
                            <ChevronRight size={20} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Event Info */}
            <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl border border-purple-100 dark:border-purple-800/30 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-6">
                Детали события
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-purple-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Дата проведения</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.date.toLocaleDateString("ru-RU", { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {event.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="text-purple-600" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Место проведения</p>
                        <p className="text-gray-600 dark:text-gray-300">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="text-purple-600" size={20} />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Опубликовано</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {event.createdAt.toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-gradient-to-r from-gray-50 to-purple-50/20 dark:from-gray-900 dark:to-purple-900/10 py-20 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent animate-fadeUp">
              Другие события
            </h2>
            
            <div className="text-center animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span>Посмотреть все события</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxOpen && event?.galleryUrls && event.galleryUrls.length > 0 && (
        <Lightbox
          images={event.galleryUrls}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}