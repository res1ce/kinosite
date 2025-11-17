'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Phone, Mail, Check } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AccessibilityToggle from "@/components/AccessibilityToggle";

interface SiteContent {
  id: string;
  slug: string;
  heroText: string;
  feature1Number: string;
  feature1Label: string;
  feature2Number: string;
  feature2Label: string;
  feature3Number: string;
  feature3Label: string;
  footerDescription: string;
  footerContacts: string;
  contactPhone: string;
  contactEmail: string;
}

const defaultSite = {
  contactPhone: "+7 (999) 123-45-67",
  contactEmail: "info@kino.ru",
  footerDescription: "Помощь в организации съёмок и продвижении региона.",
  footerContacts: "Чита, Забайкальский край\ninfo@kino.ru"
};

function ContactModal({ 
  phone, 
  email, 
  children,
  className = ""
}: { 
  phone: string; 
  email: string; 
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const copyToClipboard = async (text: string, type: 'phone' | 'email') => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    } catch (err) {
      console.error('Не удалось скопировать: ', err);
    }
  };

  const modal = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999
      }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 animate-scaleIn border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Наши контакты
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Нажмите, чтобы скопировать
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => copyToClipboard(phone, 'phone')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6">
                {copiedPhone ? (
                  <Check size={20} className="animate-bounce" />
                ) : (
                  <Phone size={20} />
                )}
              </div>
              <span className="flex-1 text-left">
                {copiedPhone ? "Скопировано!" : phone}
              </span>
            </button>

            <button
              onClick={() => copyToClipboard(email, 'email')}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-6 h-6">
                {copiedEmail ? (
                  <Check size={20} className="animate-bounce" />
                ) : (
                  <Mail size={20} />
                )}
              </div>
              <span className="flex-1 text-left">
                {copiedEmail ? "Скопировано!" : email}
              </span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Работаем ежедневно с 9:00 до 18:00
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>
      {mounted && isOpen && createPortal(modal, document.body)}
    </>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/site-content');
        if (response.ok) {
          const data = await response.json();
          setSiteContent(data);
        }
      } catch (error) {
        console.error('Error fetching site content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteContent();
  }, []);

  const nav = [
    { title: "Новости", href: "/news" },
    { title: "Локации", href: "/locations" },
    { title: "Услуги", href: "/services" },
    { title: "Наша команда", href: "/staff" },
    { title: "Документы", href: "/documents" },
    { title: "О нас", href: "/about" },
  ];

  const site = siteContent || defaultSite;
  const footerDescription = site.footerDescription || defaultSite.footerDescription;
  const footerContacts = site.footerContacts || defaultSite.footerContacts;
  const contactPhone = site.contactPhone || defaultSite.contactPhone;
  const contactEmail = site.contactEmail || defaultSite.contactEmail;
  
  const contactLines = footerContacts.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
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

        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }

        .animate-slideInDown {
          animation: slideInDown 0.5s ease-out;
        }

        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
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

        .hover-glow:hover {
          filter: drop-shadow(0 0 20px rgba(147, 51, 234, 0.5));
        }

        .section-hero {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          background: linear-gradient(135deg, #7c3aed, #ec4899, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .section-subtitle {
          font-size: 1.25rem;
          color: rgb(156, 163, 175);
          max-width: 600px;
          margin: 0 auto;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dark,
        html[data-theme="dark"] {
          color-scheme: dark;
        }

        .dark body,
        html[data-theme="dark"] body {
          background: #0b0b0b;
          color: #e7e7e7;
        }
      `}</style>

      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-2xl border-b border-gray-200/20 dark:border-white/20' 
            : 'backdrop-blur-sm bg-white/70 dark:bg-black/40 shadow-sm'
        }`}>
          <div className="container mx-auto px-6 flex items-center justify-between h-20">
            <Link
              href="/"
              className="group relative font-bold text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 animate-slideInDown"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Кинокомиссия
              </div>
              Кинокомиссия
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {nav.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative px-4 py-2 font-semibold text-gray-700 dark:text-gray-200 transition-all duration-300 hover:text-purple-600 dark:hover:text-purple-400 animate-slideInDown"
                  style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                >
                  {item.title}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4 animate-slideInDown" style={{ animationDelay: '0.8s' }}>
              {/* Accessibility Toggle Button */}
              <AccessibilityToggle variant="desktop" />
              
              {/* Theme Toggle Button */}
              <ThemeToggle variant="desktop" />

              <ContactModal 
                phone={contactPhone} 
                email={contactEmail}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden shimmer-effect"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2">
                  <Phone size={16} />
                  Связаться
                </span>
              </ContactModal>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {/* Mobile Accessibility Toggle */}
              <AccessibilityToggle variant="mobile" />
              
              {/* Mobile Theme Toggle */}
              <ThemeToggle variant="mobile" />

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-t border-gray-200/20 dark:border-white/20 animate-slideInDown">
              <nav className="container mx-auto px-6 py-6 space-y-4">
                {nav.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block p-4 font-semibold text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 animate-fadeUp"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="pt-4 animate-fadeUp" style={{ animationDelay: '0.6s' }}>
                  <ContactModal
                    phone={contactPhone}
                    email={contactEmail}
                    className="w-full group relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden shimmer-effect"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      <Phone size={16} />
                      Связаться
                    </span>
                  </ContactModal>
                </div>
              </nav>
            </div>
          )}
        </header>

        <div className="flex-1 pt-20">{children}</div>

        <footer className="relative mt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20"></div>
          
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-floating"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 container mx-auto px-6 py-16">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 bg-white/20 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/60">Загрузка контактов...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-12 mb-12">
                <div className="space-y-4 animate-fadeUp">
                  <h3 className="text-2xl font-bold text-white mb-4">Кинокомиссия</h3>
                  <p className="text-white/80 leading-relaxed">{footerDescription}</p>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-floating">
                      <span className="text-white font-bold">🎬</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-floating" style={{ animationDelay: '1s' }}>
                      <span className="text-white font-bold">📍</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Навигация</h3>
                  <ul className="space-y-3">
                    {nav.map((item, i) => (
                      <li key={item.href}>
                        <Link 
                          href={item.href} 
                          className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 animate-fadeUp"
                          style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                        >
                          <div className="w-1 h-1 bg-purple-400 rounded-full group-hover:w-2 transition-all duration-300"></div>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 animate-fadeUp" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
                  <div className="space-y-3">
                    {contactLines.map((line, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fadeUp" style={{ animationDelay: `${idx * 0.1 + 0.5}s` }}>
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-sm font-medium">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-white/20 text-center animate-fadeUp" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/70 text-sm">
                  © {new Date().getFullYear()} Забайкальская кинокомиссия
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}