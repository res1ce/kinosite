'use client';

import { MapPin, Camera, Clock, Share, ArrowLeft, Eye, Navigation, ChevronLeft, ChevronRight, X, Grid3x3, Maximize2 } from "lucide-react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  slug: string;
  address: string | null;
  description: string | null;
  galleryUrls: string[] | null;
  isPartner: boolean;
  category: "ARCHITECTURE" | "NATURE" | "STUDIO";
  createdAt: Date;
  updatedAt: Date;
}

interface LocationDetailsClientProps {
  location: Location;
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

export default function LocationDetailsClient({ location }: LocationDetailsClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const visibleItems = useScrollAnimation();

  const images = location.galleryUrls || [];
  const displayImages = showAllImages ? images : images.slice(0, 12);

  const generatedData = {
    rating: 4.5 + Math.random() * 0.4,
    reviewsCount: Math.floor(Math.random() * 200) + 50,
    viewsCount: Math.floor(Math.random() * 3000) + 1000,
    coverImage: images[0] || '/placeholder-location.jpg'
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ARCHITECTURE': return 'Архитектура';
      case 'NATURE': return 'Природа';
      case 'STUDIO': return 'Студия';
      default: return 'Локация';
    }
  };

  const staticData = {
    bestFor: [
      'Художественные фильмы', 'Документальное кино', 'Рекламные ролики',
      'Музыкальные клипы', 'Фотосессии', 'Телевизионные передачи'
    ],
    contact: {
      phone: '+7 (999) 123-45-67',
      email: 'locations@kino.ru',
      manager: 'Менеджер по локациям'
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: location.description || 'Уникальная локация для съемок',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <style jsx global>{`
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

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .glass-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
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

      {lightboxOpen && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <main>
        <section 
          className="relative h-[80vh] min-h-[600px] parallax-hero overflow-hidden"
          style={{ 
            backgroundImage: `url(${generatedData.coverImage})`,
            backgroundColor: '#1f2937'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"></div>
          
          <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>

          <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center">
            <Link 
              href="/locations" 
              className="group flex items-center gap-2 px-6 py-3 glass-card text-white rounded-2xl hover:bg-white/20 transition-all duration-300 animate-slideInDown"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">К локациям</span>
            </Link>

            <div className="flex gap-3 animate-slideInDown" style={{ animationDelay: '0.2s' }}>              
              <button 
                onClick={handleShare}
                className="group flex items-center gap-2 px-4 py-3 glass-card text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Share size={16} />
                <span className="font-medium">Поделиться</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-16">
            <div className="max-w-5xl w-full">
              <div className="flex flex-wrap items-center gap-6 mb-8 animate-fadeUp">
                <div className="glass-card px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Camera size={14} />
                    <span className="font-medium">{getCategoryName(location.category)}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                {location.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white/90 mb-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                {location.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="font-medium">{location.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="font-medium">Обновлено {new Date(location.updatedAt).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {images.length > 0 && (
          <section className="container mx-auto px-6 py-16">
            <div 
              className={`animate-on-scroll ${visibleItems.has('gallery-section') ? 'visible' : ''}`}
              id="gallery-section"
              data-animate
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Галерея локации
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
          </section>
        )}

        <section className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {location.description && (
                <div 
                  className={`animate-on-scroll ${visibleItems.has('description-section') ? 'visible' : ''}`}
                  id="description-section"
                  data-animate
                >
                  <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    О локации
                  </h2>
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {location.description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div 
                className={`animate-on-scroll ${visibleItems.has('bestfor-card') ? 'visible' : ''}`}
                id="bestfor-card"
                data-animate
              >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Подходит для</h3>
                  <div className="flex flex-wrap gap-2">
                    {staticData.bestFor.map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-xs bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section 
          className={`container mx-auto px-6 py-16 animate-on-scroll ${visibleItems.has('map-section') ? 'visible' : ''}`}
          id="map-section"
          data-animate
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Расположение на карте
          </h2>
          
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
            <div className="absolute top-4 left-4 z-10">
              <div className="glass-card px-4 py-2 rounded-xl text-gray-900 dark:text-white backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Navigation size={16} />
                  Точное местоположение
                </div>
              </div>
            </div>

            <YMaps query={{ lang: "ru_RU" }}>
              <Map
                state={{ center: [location.latitude, location.longitude], zoom: 12 }}
                width="100%"
                height="100%"
                options={{
                  suppressMapOpenBlock: true,
                  copyrightLogoVisible: false,
                  copyrightProvidersVisible: false
                }}
              >
                <Placemark
                  geometry={[location.latitude, location.longitude]}
                  properties={{
                    iconCaption: location.name,
                    balloonContent: `
                      <div class="p-4 max-w-sm">
                        <div class="font-bold text-lg mb-2">${location.name}</div>
                        ${generatedData.coverImage !== '/placeholder-location.jpg' ? 
                          `<img src="${generatedData.coverImage}" class="w-full h-32 object-cover rounded-lg mb-3" alt="${location.name}" />` : 
                          ''
                        }
                        <div class="text-sm text-gray-600 mb-2">${location.description || 'Уникальная локация для съемок'}</div>
                        <div class="text-xs text-gray-500 mb-3">${location.address || 'Точный адрес уточняйте у менеджера'}</div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-1">
                            <span class="text-yellow-500">★</span>
                            <span class="text-sm font-semibold">${generatedData.rating.toFixed(1)}</span>
                            <span class="text-xs text-gray-500">(${generatedData.reviewsCount} отзывов)</span>
                          </div>
                          <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">${getCategoryName(location.category)}</span>
                        </div>
                        <div class="mt-3 pt-3 border-t border-gray-200">
                          <div class="text-xs text-gray-500 mb-1">Контакт для бронирования:</div>
                          <div class="text-sm font-medium text-blue-600">${staticData.contact.phone}</div>
                        </div>
                      </div>
                    `,
                  }}
                  options={{
                    preset: "islands#redIcon",
                    iconColor: '#ec4899'
                  }}
                />
              </Map>
            </YMaps>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <MapPin size={16} />
              Координаты: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}