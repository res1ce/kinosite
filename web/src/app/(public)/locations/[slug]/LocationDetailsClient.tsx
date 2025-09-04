// LocationDetailsClient.tsx "Детальная страница локации"
'use client';

import { MapPin, Star, Camera, Clock, Share, ArrowLeft, Heart, Eye, Navigation, Phone, Mail, Calendar } from "lucide-react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { useState, useEffect } from "react";
import Link from "next/link";

// Mock location data for demo
const mockLocationDetail = {
  id: '1',
  name: 'Забайкальские горы',
  description: 'Живописные горные пейзажи идеально подходят для съемок драматических сцен и документальных фильмов о природе. Уникальные природные формации создают неповторимую атмосферу для любого жанра кино.',
  fullDescription: `
    <h2>Уникальное место для кинематографа</h2>
    <p>Забайкальские горы представляют собой одну из самых живописных горных систем России. Разнообразие ландшафтов - от крутых скалистых утесов до пологих холмов, покрытых тайгой, делает эту локацию универсальной для съемок различных жанров.</p>
    
    <h3>Преимущества локации</h3>
    <p>Горная система отличается особой красотой в любое время года:</p>
    <ul>
      <li>Весной - буйство красок цветущей природы</li>
      <li>Летом - изумрудная зелень лесов и альпийские луга</li>
      <li>Осенью - золотая палитра листвы</li>
      <li>Зимой - заснеженные вершины и кристальная чистота воздуха</li>
    </ul>
    
    <h3>Техническая информация</h3>
    <p>Локация обеспечена всей необходимой инфраструктурой для проведения съемок. Доступ к площадкам возможен на внедорожном транспорте. Имеются места для размещения съемочной группы и техники.</p>
  `,
  address: 'Забайкальский край, горная система',
  latitude: 52.5,
  longitude: 114.2,
  category: 'Природа',
  rating: 4.9,
  reviewsCount: 127,
  popularity: 95,
  viewsCount: 2840,
  lastUpdated: '2024-09-01',
  coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
  features: [
    'Панорамные виды', 'Дикая природа', 'Горные тропы', 'Водопады', 
    'Скалистые утесы', 'Лесные массивы', 'Альпийские луга', 'Чистый воздух'
  ],
  facilities: [
    'Парковка для техники', 'Места для размещения', 'Доступ на внедорожниках', 'Мобильная связь'
  ],
  bestFor: [
    'Драматические сцены', 'Документальные фильмы', 'Приключенческое кино', 
    'Романтические сцены', 'Экшн-сцены', 'Реклама автомобилей'
  ],
  seasonality: {
    spring: { available: true, conditions: 'Отличные', note: 'Цветение природы' },
    summer: { available: true, conditions: 'Идеальные', note: 'Лучший период' },
    autumn: { available: true, conditions: 'Хорошие', note: 'Золотая осень' },
    winter: { available: true, conditions: 'Особые', note: 'Снежные пейзажи' }
  },
  contact: {
    phone: '+7 (999) 123-45-67',
    email: 'locations@kino.ru',
    manager: 'Александр Петров'
  },
  galleryUrls: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
    'https://images.unsplash.com/photo-1418489098061-ce87b5dc3aee?w=600&q=80'
  ]
};

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

export default function LocationDetailsClient({ params }: { params: Promise<{ slug: string }> }) {
  const [location, setLocation] = useState(mockLocationDetail);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('summer');
  const visibleItems = useScrollAnimation();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: location.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const seasons = [
    { key: 'spring', name: 'Весна', emoji: '🌸' },
    { key: 'summer', name: 'Лето', emoji: '☀️' },
    { key: 'autumn', name: 'Осень', emoji: '🍂' },
    { key: 'winter', name: 'Зима', emoji: '❄️' }
  ];

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

        .prose {
          max-width: none;
          color: rgb(55, 65, 81);
        }
        
        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
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
        
        .prose p {
          margin: 1rem 0;
          line-height: 1.75;
          color: rgb(75, 85, 99);
        }
        
        .prose ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .prose li {
          margin: 0.5rem 0;
          color: rgb(75, 85, 99);
        }

        .image-gallery {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 1rem;
          height: 500px;
        }

        .image-gallery > div:first-child {
          grid-row: span 2;
        }

        .animate-on-scroll {
          opacity: 1;
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
      `}</style>

      <main>
        {/* Enhanced Hero Section */}
        <section 
          className="relative h-[80vh] min-h-[600px] parallax-hero overflow-hidden"
          style={{ backgroundImage: `url(${location.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>

          {/* Navigation */}
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
                onClick={() => setIsLiked(!isLiked)}
                className={`group flex items-center gap-2 px-4 py-3 glass-card rounded-2xl border transition-all duration-300 ${
                  isLiked 
                    ? 'text-red-300 border-red-400/50' 
                    : 'text-white border-white/20 hover:bg-white/20'
                }`}
              >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                <span className="font-medium">{isLiked ? 'В избранном' : 'В избранное'}</span>
              </button>
              
              <button 
                onClick={handleShare}
                className="group flex items-center gap-2 px-4 py-3 glass-card text-white rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Share size={16} />
                <span className="font-medium">Поделиться</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-16">
            <div className="max-w-5xl w-full">
              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8 animate-fadeUp">
                <div className="glass-card px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Eye size={14} />
                    <span className="font-medium">{location.viewsCount.toLocaleString()} просмотров</span>
                  </div>
                </div>
                <div className="glass-card px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="font-medium">{location.rating} ({location.reviewsCount} отзывов)</span>
                  </div>
                </div>
                <div className="glass-card px-4 py-2 rounded-xl">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Camera size={14} />
                    <span className="font-medium">{location.category}</span>
                  </div>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                {location.name}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-white/90 mb-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="font-medium">{location.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span className="font-medium">Обновлено {new Date(location.lastUpdated).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                {location.description}
              </p>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-4 animate-fadeUp" style={{ animationDelay: '0.8s' }}>
                <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden shimmer-effect">
                  <span className="flex items-center gap-2">
                    <Phone size={18} />
                    Забронировать
                  </span>
                </button>
                
                <button className="group px-8 py-4 glass-card text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-2">
                    <Navigation size={18} />
                    Маршрут
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="container mx-auto px-6 py-16">
          <div 
            className="animate-on-scroll"
            id="gallery-section"
            data-animate
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12 text-center">
              Галерея локации
            </h2>
            
            {location.galleryUrls && location.galleryUrls.length > 0 && (
              <div className="image-gallery rounded-3xl overflow-hidden shadow-2xl">
                {location.galleryUrls.slice(0, 5).map((url, index) => (
                  <div 
                    key={index}
                    className="group relative overflow-hidden cursor-pointer bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{ backgroundImage: `url(${url})` }}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Eye className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Details Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div 
                className="animate-on-scroll"
                id="description-section"
                data-animate
              >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Описание локации
                </h2>
                <article 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: location.fullDescription }}
                />
              </div>

              {/* Features */}
              <div 
                className="animate-on-scroll"
                id="features-section"
                data-animate
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Особенности локации
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {location.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl animate-fadeUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonality */}
              <div 
                className="animate-on-scroll"
                id="seasonality-section"
                data-animate
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Сезонность съемок
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {seasons.map((season) => (
                    <button
                      key={season.key}
                      onClick={() => setSelectedSeason(season.key)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        selectedSeason === season.key
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {season.emoji} {season.name}
                    </button>
                  ))}
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Доступность</div>
                      <div className={`font-semibold ${location.seasonality[selectedSeason as keyof typeof location.seasonality].available ? 'text-green-600' : 'text-red-600'}`}>
                        {location.seasonality[selectedSeason as keyof typeof location.seasonality].available ? 'Доступна' : 'Недоступна'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Условия</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {location.seasonality[selectedSeason as keyof typeof location.seasonality].conditions}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Особенности</div>
                      <div className="font-semibold text-gray-700 dark:text-gray-300">
                        {location.seasonality[selectedSeason as keyof typeof location.seasonality].note}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div 
                className="animate-on-scroll"
                id="contact-card"
                data-animate
              >
                <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl text-white shadow-2xl">
                  <h3 className="text-xl font-bold mb-6">Связаться с нами</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone size={18} />
                      <span className="font-medium">{location.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} />
                      <span className="font-medium">{location.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star size={18} />
                      <span className="font-medium">{location.contact.manager}</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 px-6 py-3 bg-white text-blue-600 font-bold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                    Заказать съемку
                  </button>
                </div>
              </div>

              {/* Facilities */}
              <div 
                className="animate-on-scroll"
                id="facilities-card"
                data-animate
              >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Удобства</h3>
                  <div className="space-y-3">
                    {location.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Best For */}
              <div 
                className="animate-on-scroll"
                id="bestfor-card"
                data-animate
              >
                <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Подходит для</h3>
                  <div className="flex flex-wrap gap-2">
                    {location.bestFor.map((genre, index) => (
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

        {/* Map Section */}
        <section 
          className="container mx-auto px-6 py-16 animate-on-scroll"
          id="map-section"
          data-animate
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Расположение на карте
          </h2>
          
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
            <div className="absolute top-4 left-4 z-10">
              <div className="glass-card px-4 py-2 rounded-xl text-gray-900 dark:text-white">
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
                        <img src="${location.coverImage}" class="w-full h-32 object-cover rounded-lg mb-3" alt="${location.name}" />
                        <div class="text-sm text-gray-600 mb-2">${location.description}</div>
                        <div class="text-xs text-gray-500 mb-3">${location.address}</div>
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-1">
                            <span class="text-yellow-500">★</span>
                            <span class="text-sm font-semibold">${location.rating}</span>
                            <span class="text-xs text-gray-500">(${location.reviewsCount} отзывов)</span>
                          </div>
                          <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">${location.category}</span>
                        </div>
                        <div class="mt-3 pt-3 border-t border-gray-200">
                          <div class="text-xs text-gray-500 mb-1">Контакт для бронирования:</div>
                          <div class="text-sm font-medium text-blue-600">${location.contact.phone}</div>
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
            <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
              <Navigation size={16} className="group-hover:rotate-12 transition-transform duration-300" />
              Построить маршрут
            </button>
            
            <button className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <MapPin size={16} />
              Координаты: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </button>
          </div>
        </section>

        {/* Related Locations */}
        <section className="bg-gradient-to-r from-gray-50 to-blue-50/20 dark:from-gray-900 dark:to-blue-900/10 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Похожие локации
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Байкальские степи',
                  image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
                  category: 'Природа',
                  rating: 4.8,
                  description: 'Бескрайние степные просторы для съемок вестернов'
                },
                {
                  name: 'Исторический центр Читы',
                  image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
                  category: 'Архитектура',
                  rating: 4.7,
                  description: 'Архитектурный комплекс с богатой историей'
                },
                {
                  name: 'Озеро Арахлей',
                  image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80',
                  category: 'Природа',
                  rating: 4.6,
                  description: 'Кристально чистое озеро в окружении лесов'
                }
              ].map((related, i) => (
                <div 
                  key={related.name}
                  className={`group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-on-scroll ${visibleItems.has(`related-${i}`) ? 'visible' : ''}`}
                  id={`related-${i}`}
                  data-animate
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div 
                    className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${related.image})` }}
                  >
                    <div className="h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-white font-semibold text-sm">{related.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {related.name}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                        {related.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {related.description}
                    </p>
                    
                    <Link 
                      href={`/locations/${related.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:gap-3 transition-all duration-300"
                    >
                      <span>Подробнее</span>
                      <ArrowLeft size={14} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 via-transparent to-blue-600/20"></div>
          
          {/* Floating elements */}
          <div className="absolute top-10 left-10 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '3s' }}></div>
          
          <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-slideInDown">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                Готовы начать съемку?
              </div>
              
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight animate-fadeUp">
                Забронируйте
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  эту локацию
                </span>
              </h2>
              
              <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Свяжитесь с нами для обсуждения деталей съемки и бронирования этой уникальной локации
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <button className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-500 overflow-hidden shimmer-effect">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative flex items-center gap-3">
                    <Phone size={20} />
                    <span>Связаться сейчас</span>
                    <div className="transform group-hover:rotate-12 transition-transform duration-300">
                      📞
                    </div>
                  </span>
                </button>
                
                <button className="group px-12 py-5 glass-card text-white font-bold text-lg rounded-3xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                  <span className="flex items-center gap-3">
                    <Calendar size={20} />
                    <span>Календарь доступности</span>
                  </span>
                </button>
              </div>
              
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/70 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Быстрый ответ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <span className="text-sm">Профессиональная поддержка</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <span className="text-sm">Индивидуальный подход</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
            