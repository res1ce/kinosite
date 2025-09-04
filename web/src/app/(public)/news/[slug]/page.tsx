'use client';

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Clock, Share, ArrowLeft, Eye, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data for demo
const mockNewsItem = {
  id: '1',
  slug: 'film-festival-2024',
  title: 'Забайкальский кинофестиваль 2024',
  shortDescription: 'Грандиозное событие года! Встречайте лучшие фильмы региона на главном кинофестивале Забайкалья.',
  content: `
    <h2>Долгожданное событие</h2>
    <p>Забайкальский кинофестиваль 2024 станет настоящим праздником для всех любителей кино. В этом году мы представим более 50 фильмов от талантливых режиссеров региона.</p>
    
    <h3>Программа фестиваля</h3>
    <p>Фестиваль пройдет в несколько этапов:</p>
    <ul>
      <li>Открытие и гала-премьера</li>
      <li>Показы конкурсных фильмов</li>
      <li>Мастер-классы от известных режиссеров</li>
      <li>Церемония награждения</li>
    </ul>
    
    <h3>Особенности этого года</h3>
    <p>Впервые в истории фестиваля будет представлена специальная программа документальных фильмов о природе Забайкалья. Также планируется проведение круглого стола по развитию региональной киноиндустрии.</p>
  `,
  date: new Date('2024-09-15'),
  location: 'Культурный центр, г. Чита',
  coverImageUrl: 'https://images.unsplash.com/photo-1489599500846-a62a3c6b0ff3?w=1200&q=80',
  category: 'Фестивали',
  galleryUrls: [
    'https://images.unsplash.com/photo-1489599500846-a62a3c6b0ff3?w=400&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80'
  ]
};

export default function NewsDetails({ params }: { params: Promise<{ slug: string }> }) {
  const [item, setItem] = useState(mockNewsItem);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(1247);

  useEffect(() => {
    // Имитация загрузки по slug
    // В реальном приложении здесь был бы запрос к API
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <style jsx global>{`
        .prose {
          max-width: none;
          color: rgb(55, 65, 81);
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
      `}</style>

      <main>
        {/* Enhanced Hero Section */}
        <section 
          className="relative h-[70vh] min-h-[500px] parallax-hero overflow-hidden"
          style={{ backgroundImage: `url(${item.coverImageUrl})` }}
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
              {/* Category & Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 animate-fadeUp">
                <span className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                  {item.category}
                </span>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {viewCount.toLocaleString()} просмотров
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    5 мин чтения
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                {item.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 text-white/90 mb-8 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  <span className="font-medium">
                    {item.date.toLocaleDateString("ru-RU", { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                {item.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="font-medium">{item.location}</span>
                  </div>
                )}
              </div>

              <p className="text-xl text-white/90 leading-relaxed max-w-3xl animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                {item.shortDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <article 
              className="prose prose-lg animate-fadeUp"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* Gallery */}
            {item.galleryUrls && item.galleryUrls.length > 0 && (
              <div className="mt-16 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
                  Галерея событий
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {item.galleryUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="group aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${url})` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Articles */}
        <section className="bg-gradient-to-r from-gray-50 to-purple-50/20 dark:from-gray-900 dark:to-purple-900/10 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-fadeUp">
              Похожие новости
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-fadeUp"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-3 group-hover:text-purple-600 transition-colors">
                      Связанная новость {i}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Краткое описание связанной новости для привлечения внимания читателей.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">15 сент 2024</span>
                      <ArrowRight size={16} className="text-purple-600 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}