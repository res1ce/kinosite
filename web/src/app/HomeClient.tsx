// app/page.tsx
'use client';

import Link from "next/link";
import { CalendarDays, MapPin, Landmark, Users } from "lucide-react";
import { useEffect, useState } from "react";
import ContactModal from "@/components/ContactModal";

interface SiteContent {
  heroText?: string;
  feature1Number?: string;
  feature1Label?: string;
  feature2Number?: string;
  feature2Label?: string;
  feature3Number?: string;
  feature3Label?: string;
  contactPhone?: string;
  contactEmail?: string;
  regionTitle?: string;
  regionDescription?: string;
  regionVideoUrl?: string;
}

interface VisibilityState {
  [key: string]: boolean;
}

// Hook for scroll animations
function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return { scrollY, isVisible };
}

export default function Home({ site }: { site: SiteContent | null }) {
  const { scrollY, isVisible } = useScrollAnimation();

  const heroText = site?.heroText || "Организуем съёмки, подбираем локации и сопровождаем проекты в регионе.";

  const features = [
    { number: site?.feature1Number || "250+", label: site?.feature1Label || "Локаций в каталоге" },
    { number: site?.feature2Number || "50+", label: site?.feature2Label || "Партнёрских проектов" },
    { number: site?.feature3Number || "15 лет", label: site?.feature3Label || "поддержки киноиндустрии" },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0) scale(1);
          }
        }

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInDown {
          animation: slideInDown 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-rotateIn {
          animation: rotateIn 0.8s ease-out forwards;
          opacity: 0;
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

        .parallax-slow {
          transform: translateY(${scrollY * 0.1}px);
        }

        .parallax-fast {
          transform: translateY(${scrollY * 0.3}px);
        }

        .scale-on-scroll {
          transform: scale(${1 + scrollY * 0.0001});
        }

        .hover-glow:hover {
          filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
        }
      `}</style>
      
      <main className="min-h-screen font-sans overflow-hidden">
        <Hero heroText={heroText} scrollY={scrollY} />
        <Features items={features} isVisible={isVisible} />
        {site?.regionVideoUrl && (
          <RegionVideo 
            title={site.regionTitle} 
            description={site.regionDescription} 
            videoUrl={site.regionVideoUrl} 
            isVisible={isVisible} 
          />
        )}
        <Services isVisible={isVisible} />
        <CTA site={site} isVisible={isVisible} />
      </main>
    </>
  );
}

function Hero({ heroText, scrollY}: { heroText: string; scrollY: number;}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background with Parallax */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 scale-on-scroll"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-purple-600/30"></div>
        
        {/* Enhanced Floating Elements with Parallax */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse parallax-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse parallax-fast" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl animate-floating" style={{ animationDelay: '3s' }}></div>
        
        {/* Grid Pattern with Animation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse opacity-50" style={{ transform: `translateX(${scrollY * 0.05}px)` }}></div>
      </div>

      {/* Content with Enhanced Animations */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <div className="space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-slideInDown shimmer-effect">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Официальная кинокoмиссия Забайкальского края
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            <span className="block text-white animate-fadeInLeft">Забайкальская</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-fadeInRight" style={{ animationDelay: '0.2s' }}>
              кино<span className="text-white">комиссия</span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            {heroText}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Link href="/news" className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden shimmer-effect hover-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center gap-2">
                <CalendarDays size={20} className="animate-floating" />
                Новости и события
              </span>
            </Link>
            
            <Link href="/locations" className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shimmer-effect hover-glow">
              <span className="flex items-center gap-2">
                <MapPin size={20} className="animate-floating" style={{ animationDelay: '0.5s' }} />
                Локации региона
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center animate-floating">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

function Features({ items, isVisible }: { items: { number: string; label: string }[]; isVisible: VisibilityState }) {
  return (
    <section className="py-32 pb-48 relative bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
      
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative container mx-auto px-6">
        <div 
          id="features-header"
          data-animate
          className={`text-center mb-20 animate-on-scroll ${isVisible['features-header'] ? 'visible' : ''}`}
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6 shimmer-effect">
            Наши достижения
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full transform scale-0 animate-scaleIn" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={item.label}
              id={`feature-${i}`}
              data-animate
              className={`group relative p-10 rounded-3xl bg-white shadow-xl hover:shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-500 animate-on-scroll shimmer-effect hover-glow ${isVisible[`feature-${i}`] ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg animate-rotateIn group-hover:animate-floating">
                  <span className="text-white font-bold text-lg">★</span>
                </div>
                
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-scaleIn" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                  {item.number}
                </div>
                
                <div className="text-lg font-semibold text-gray-700 leading-snug animate-fadeInUp" style={{ animationDelay: `${i * 0.1 + 0.5}s` }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionVideo({ 
  title, 
  description, 
  videoUrl, 
  isVisible 
}: { 
  title?: string; 
  description?: string; 
  videoUrl: string; 
  isVisible: VisibilityState;
}) {
  // Функция для преобразования обычных URL в embed
  const getEmbedUrl = (url: string): string => {
    try {
      // Rutube
      if (url.includes('rutube.ru')) {
        // Если уже embed URL
        if (url.includes('/play/embed/')) return url;
        
        // Преобразуем обычный URL в embed
        const match = url.match(/\/video\/([a-zA-Z0-9]+)/);
        if (match) {
          return `https://rutube.ru/play/embed/${match[1]}`;
        }
      }
      
      // VK Video
      if (url.includes('vk.com/video')) {
        // Если уже embed URL
        if (url.includes('video_ext.php')) return url;
        
        // Преобразуем обычный URL в embed
        const match = url.match(/video(-?\d+)_(\d+)/);
        if (match) {
          return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}`;
        }
      }
      
      // YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // Если уже embed URL
        if (url.includes('/embed/')) return url;
        
        // Преобразуем обычный URL в embed
        let videoId = '';
        if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/watch')) {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          videoId = urlParams.get('v') || '';
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Если URL уже правильный или неизвестный формат
      return url;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section className="py-32 relative bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Темный фон вместо светлого */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative container mx-auto px-6">
        <div 
          id="region-header"
          data-animate
          className={`text-center mb-16 animate-on-scroll ${isVisible['region-header'] ? 'visible' : ''}`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {title || "Забайкальский край"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            {description || "Откройте для себя уникальную природу и культуру региона"}
          </p>
        </div>
        
        <div 
          id="region-video"
          data-animate
          className={`max-w-5xl mx-auto animate-on-scroll ${isVisible['region-video'] ? 'visible' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group hover:shadow-3xl transition-all duration-500">
            <div className="aspect-video bg-black">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                title={title || "Видео о регионе"}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ isVisible }: { isVisible: VisibilityState }) {
  const services = [
    { 
      title: "Новости", 
      description: "События и анонсы кинокомиссии", 
      icon: <CalendarDays size={28} />, 
      href: "/news",
      gradient: "from-blue-500 to-cyan-500",
      hoverGradient: "group-hover:from-cyan-500 group-hover:to-blue-500"
    },
    { 
      title: "Локации", 
      description: "Каталог и карта лучших мест", 
      icon: <MapPin size={28} />, 
      href: "/locations",
      gradient: "from-emerald-500 to-teal-500",
      hoverGradient: "group-hover:from-teal-500 group-hover:to-emerald-500"
    },
    { 
      title: "О нас", 
      description: "Наша миссия и достижения", 
      icon: <Landmark size={28} />, 
      href: "/about",
      gradient: "from-purple-500 to-pink-500",
      hoverGradient: "group-hover:from-pink-500 group-hover:to-purple-500"
    },
    { 
      title: "Наша команда", 
      description: "Профессионалы киноиндустрии", 
      icon: <Users size={28} />, 
      href: "/about#team",
      gradient: "from-violet-500 to-indigo-500",
      hoverGradient: "group-hover:from-indigo-500 group-hover:to-violet-500"
    },
    // { 
    //   title: "Услуги", 
    //   description: "Поддержка съёмок и консультации", 
    //   icon: <Ticket size={28} />, 
    //   href: "/services",
    //   gradient: "from-purple-500 to-pink-500",
    //   hoverGradient: "group-hover:from-pink-500 group-hover:to-purple-500"
    // },
    { 
      title: "Документы", 
      description: "Положения и бланки заявок", 
      icon: <Landmark size={28} />, 
      href: "/documents",
      gradient: "from-amber-500 to-orange-500",
      hoverGradient: "group-hover:from-orange-500 group-hover:to-amber-500"
    },
  ];

  return (
    <section className="py-32 relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%227%22 cy=%227%22 r=%221%22/%3E%3Ccircle cx=%2253%22 cy=%227%22 r=%221%22/%3E%3Ccircle cx=%227%22 cy=%2253%22 r=%221%22/%3E%3Ccircle cx=%2253%22 cy=%2253%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>

      {/* Animated background elements */}
      <div className="absolute top-32 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-floating"></div>
      <div className="absolute bottom-32 right-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative container mx-auto px-6">
        <div 
          id="services-header"
          data-animate
          className={`text-center mb-20 animate-on-scroll ${isVisible['services-header'] ? 'visible' : ''}`}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Что мы предлагаем
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Узнайте о том как развивается киноиндустрия в Забайкальском крае
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <Link
              key={service.title}
              href={service.href}
              id={`service-${i}`}
              data-animate
              className={`group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 animate-on-scroll shimmer-effect hover-glow ${isVisible[`service-${i}`] ? 'visible' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} ${service.hoverGradient} transition-all duration-300 mb-6 shadow-lg group-hover:shadow-xl animate-rotateIn group-hover:animate-floating`} style={{ animationDelay: `${i * 0.1 + 0.2}s` }}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors animate-fadeInLeft" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                  {service.title}
                </h3>
                
                <p className="text-white/70 group-hover:text-white/90 transition-colors mb-6 leading-relaxed animate-fadeInRight" style={{ animationDelay: `${i * 0.1 + 0.4}s` }}>
                  {service.description}
                </p>
                
                <div className="flex items-center text-white/80 group-hover:text-white transition-colors font-medium animate-fadeInUp" style={{ animationDelay: `${i * 0.1 + 0.5}s` }}>
                  <span className="mr-2">Подробнее</span>
                  <div className="transform group-hover:translate-x-1 transition-transform animate-floating">
                    →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA({ site, isVisible }: { site: SiteContent | null; isVisible: VisibilityState }) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20"></div>
      
      {/* Enhanced Floating Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse animate-floating"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse animate-floating" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl animate-floating" style={{ animationDelay: '5s' }}></div>
      
      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <div 
          id="cta-content"
          data-animate
          className={`animate-on-scroll ${isVisible['cta-content'] ? 'visible' : ''}`}
        >
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-slideInDown shimmer-effect">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            Открыты для сотрудничества
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            Присоединяйтесь к 
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-fadeInLeft" style={{ animationDelay: '0.4s' }}>
              киноиндустрии
            </span>
            <span className="block text-4xl md:text-5xl font-light text-white/80 mt-2 animate-fadeInRight" style={{ animationDelay: '0.6s' }}>
              Забайкалья
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Мы открыты для новых партнёров и идей. Оставьте заявку и начните сотрудничество с ведущей кинокомиссией региона.
          </p>
          
          <div className="animate-rotateIn" style={{ animationDelay: '1s' }}>
            <ContactModal phone={site?.contactPhone || "+7 (999) 123-45-67"} email={site?.contactEmail || "info@kino.ru"}>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-500 overflow-hidden shimmer-effect hover-glow animate-floating">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative flex items-center gap-3">
                  <span>Связаться с нами</span>
                  <div className="transform group-hover:rotate-45 transition-transform duration-300">
                    ✦
                  </div>
                </span>
              </button>
            </ContactModal>
          </div>
        </div>
      </div>
    </section>
  );
}