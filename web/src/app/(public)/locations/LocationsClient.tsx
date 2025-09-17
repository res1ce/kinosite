'use client';

import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { MapPin, Search, Camera, Mountain, Building } from "lucide-react";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

// Анимации (useScrollAnimation)
function useScrollAnimation() {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return visibleItems;
}

export default function LocationsClient({ locations }: { locations: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([52.034, 113.499]);

  const visibleItems = useScrollAnimation();

  // Маппинг английских категорий на русские
  const categoryMap: Record<string, { label: string; icon: JSX.Element }> = {
    ARCHITECTURE: { label: "Архитектура", icon: <Building size={16} /> },
    NATURE: { label: "Природа", icon: <Mountain size={16} /> },
    STUDIO: { label: "Студии", icon: <Camera size={16} /> },
  };

  // Функция для получения русского названия категории
  const getCategoryLabel = (englishCategory: string): string => {
    return categoryMap[englishCategory]?.label || englishCategory;
  };

  // Функция для получения английского названия по русскому
  const getEnglishCategory = (russianCategory: string): string => {
    if (russianCategory === "Все") return "Все";
    
    const entry = Object.entries(categoryMap).find(
      ([_, value]) => value.label === russianCategory
    );
    return entry ? entry[0] : russianCategory;
  };

  const categories = ["Все", "Природа", "Архитектура", "Студии"];
  const categoryIcons = {
    Природа: <Mountain size={16} />,
    Архитектура: <Building size={16} />,
    Студии: <Camera size={16} />,
    Все: <MapPin size={16} />,
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Исправленная логика фильтрации по категориям
    let matchesCategory = false;
    if (selectedCategory === "Все") {
      matchesCategory = true;
    } else {
      const englishCategory = getEnglishCategory(selectedCategory);
      matchesCategory = location.category === englishCategory;
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location);
    setMapCenter([location.latitude, location.longitude]);
  };

  return (
    <>
      <style jsx global>{`
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

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-floating {
          animation: floating 3s ease-in-out infinite;
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

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }

        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer 2s infinite;
        }

        .glass-effect {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .location-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .location-card:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(147, 51, 234) rgb(243, 244, 246);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(243, 244, 246);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, rgb(147, 51, 234), rgb(236, 72, 153));
          border-radius: 3px;
        }

        .rating-stars {
          background: linear-gradient(90deg, #fbbf24 0%, #fbbf24 var(--rating), #e5e7eb var(--rating), #e5e7eb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 via-transparent to-blue-600/20"></div>
          
          {/* Floating background elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-slideInDown">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {locations.length}+ уникальных локаций
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp">
                Локации 
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  региона
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Откройте для себя потрясающие места для съемок в Забайкальском крае
              </p>

              {/* Search and Controls */}
              <div className="flex flex-col lg:flex-row gap-4 max-w-3xl mx-auto animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type="text"
                    placeholder="Поиск локаций..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Interactive Map */}
            <div 
              className="lg:col-span-2 animate-fadeUp"
              id="map-container"
              data-animate
            >
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50">
                <div className="absolute top-4 left-4 z-10">
                  <div className="glass-effect px-4 py-2 rounded-xl text-white">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin size={16} />
                      {filteredLocations.length} локаций найдено
                    </div>
                  </div>
                </div>

                <YMaps query={{ lang: "ru_RU" }}>
                  <Map
                    state={{ center: mapCenter, zoom: selectedLocation ? 12 : 8 }}
                    width="100%"
                    height="100%"
                    options={{
                      suppressMapOpenBlock: true,
                      copyrightLogoVisible: false,
                      copyrightProvidersVisible: false
                    }}
                  >
                    {filteredLocations.map((location) => (
                      <Placemark
                        key={location.id}
                        geometry={[location.latitude, location.longitude]}
                        properties={{
                          iconCaption: location.name,
                          balloonContent: `
                            <div class="p-3 max-w-xs">
                              <div class="font-bold text-lg mb-2">${location.name}</div>
                              ${location.coverImage ? `<img src="${location.coverImage}" class="w-full h-24 object-cover rounded-lg mb-3" alt="${location.name}" />` : ''}
                              <div class="text-sm text-gray-600 mb-2">${location.description}</div>
                              ${location.address ? `<div class="text-xs text-gray-500 mb-2">${location.address}</div>` : ''}
                              <div class="flex items-center justify-between">
                                <div class="flex items-center gap-1">
                                  <span class="text-yellow-500">★</span>
                                  <span class="text-sm font-semibold">${location.rating}</span>
                                </div>
                                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">${getCategoryLabel(location.category)}</span>
                              </div>
                            </div>
                          `,
                        }}
                        options={{
                          preset: selectedLocation?.id === location.id ? "islands#redIcon" : "islands#blueIcon",
                          iconColor: selectedLocation?.id === location.id ? '#ec4899' : '#3b82f6'
                        }}
                        onClick={() => handleLocationClick(location)}
                      />
                    ))}
                  </Map>
                </YMaps>
              </div>
            </div>

              {/* Locations List */}
              <div 
                className="space-y-4 animate-fadeUp"
                id="locations-list"
                data-animate
                style={{ animationDelay: '0.2s' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Список локаций
                  </h2>
                  <div className="text-sm text-gray-500">
                    {filteredLocations.length} из {locations.length}
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto custom-scrollbar space-y-4">
                  {filteredLocations.map((location, i) => (
                    <Link
                      href={`/locations/${location.slug}`}
                      key={location.id}
                      id={`location-${i}`}
                      data-animate
                      className={`location-card group animate-on-scroll cursor-pointer block ${visibleItems.has(`location-${i}`) ? 'visible' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={`relative p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                        selectedLocation?.id === location.id 
                          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-lg' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl'
                      }`}>
                        {/* Background Image */}
                        {location.coverImage && (
                          <div 
                            className="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                            style={{ backgroundImage: `url(${location.coverImage})` }}
                          />
                        )}

                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                {categoryMap[location.category]?.icon || <MapPin size={16} />}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {location.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full">
                                    {getCategoryLabel(location.category)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                            {location.description}
                          </p>

                          {location.address && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                              <MapPin size={12} />
                              {location.address}
                            </div>
                          )}
                        </div>

                        {/* Shimmer Effect */}
                        <div className="shimmer-effect"></div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
          </div>
        </section>
      </main>
    </>
  );
}