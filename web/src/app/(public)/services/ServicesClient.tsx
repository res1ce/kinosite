"use client";

import { CheckCircle2, Target, Star, Users, Award, Sparkles } from "lucide-react";
import ContactModal from "@/components/ContactModal";

interface Service {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  iconType: string | null;
  order: number;
}

interface SiteContent {
  contactPhone: string | null;
  contactEmail: string | null;
}

function getIcon(iconType: string | null) {
  switch (iconType) {
    case 'target': return <Target size={24} />;
    case 'star': return <Star size={24} />;
    case 'users': return <Users size={24} />;
    case 'checkCircle': return <CheckCircle2 size={24} />;
    case 'award': return <Award size={24} />;
    case 'sparkles': return <Sparkles size={24} />;
    default: return <Star size={24} />;
  }
}

export default function ServicesClient({ 
  services, 
  siteContent 
}: { 
  services: Service[];
  siteContent: SiteContent | null;
}) {
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

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }

        .service-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
        }
      `}</style>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-green-900/20 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-teal-900 to-blue-900"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-cyan-600/20"></div>
          
          {/* Floating background elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-floating"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

          <div className="relative z-10 container mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fadeUp">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Профессиональные услуги
              </div>

              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                Наши 
                <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  услуги
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                Комплексное сопровождение киносъемок от идеи до реализации
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16 animate-fadeUp">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-6">
              Что мы предлагаем
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Полный спектр услуг для успешной реализации вашего проекта
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h6a2 2 0 012 2v6a2 2 0 01-2 2h-6m0-8v8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Услуги пока не добавлены
              </h3>
              <p className="text-gray-400 dark:text-gray-500">
                Администратор скоро добавит информацию об услугах
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <div 
                  key={service.id}
                  className="service-card group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-green-500/10 border border-gray-100 dark:border-gray-700 hover:shadow-2xl dark:hover:shadow-green-500/20 overflow-hidden animate-fadeUp transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20 rounded-full -translate-y-16 translate-x-16"></div>
                  
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 animate-floating mb-6">
                      {getIcon(service.iconType)}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                    )}

                    {/* Features */}
                    {service.features.length > 0 && (
                      <div className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle2 size={18} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-teal-900/10 dark:from-green-900/20 dark:to-teal-900/20"></div>
          
          <div className="relative container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent animate-fadeUp">
                Готовы начать проект?
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
                Свяжитесь с нами для обсуждения деталей и получения персонального предложения
              </p>
              
              <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                <ContactModal 
                  phone={siteContent?.contactPhone || "+7 (999) 123-45-67"} 
                  email={siteContent?.contactEmail || "info@kino.ru"}
                >
                  <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300">
                    <span>Связаться с нами</span>
                    <div className="transform group-hover:rotate-45 transition-transform duration-300">
                      ✦
                    </div>
                  </button>
                </ContactModal>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}