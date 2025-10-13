"use client";

import ContactModal from "@/components/ContactModal";
import { Users, Heart, MapPin, Calendar, Trophy, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  photo: string;
  description: string;
  order: number;
}

interface AboutPage {
  content: string;
}

interface SiteContent {
  feature1Number: string;
  feature1Label: string;
  feature2Number: string;
  feature2Label: string;
  feature3Number: string;
  feature3Label: string;
  contactPhone: string | null;
  contactEmail: string | null;
}

export default function AboutPage({
  aboutContent,
  teamMembers,
  siteContent
}: {
  aboutContent: AboutPage | null;
  teamMembers: TeamMember[];
  siteContent: SiteContent | null;
}) {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  const toggleMember = (id: string) => {
    setExpandedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const defaultStats = [
    { number: '15+', label: 'Лет опыта', icon: <Calendar size={20} /> },
    { number: '200+', label: 'Проектов', icon: <Trophy size={20} /> },
    { number: '250+', label: 'Локаций', icon: <MapPin size={20} /> },
  ];

  const stats = siteContent ? [
    { number: siteContent.feature1Number, label: siteContent.feature1Label, icon: <Calendar size={20} /> },
    { number: siteContent.feature2Number, label: siteContent.feature2Label, icon: <Trophy size={20} /> },
    { number: siteContent.feature3Number, label: siteContent.feature3Label, icon: <MapPin size={20} /> },
  ] : defaultStats;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-purple-600/20"></div>
        
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              Официальная кинокомиссия региона
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              О нашей 
              <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                миссии
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
              Развиваем киноиндустрию Забайкалья и создаем возможности для творческих проектов
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 rounded-xl mx-auto mb-3 animate-floating">
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/70 dark:text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      {aboutContent?.content && (
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
                Наши задачи и цели
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Узнайте больше о том, как мы развиваем кинематограф в регионе
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-purple-500/10 p-8 md:p-12">
              <article
                className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutContent.content }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div className="relative py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-purple-300 dark:to-purple-600"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 dark:bg-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-purple-300 dark:to-purple-600"></div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* Team Section */}
    {teamMembers.length > 0 && (
    <section id="team" className="container mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center mb-16">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
            Состав кинокомиссии
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
            Профессионалы, которые делают проекты реальностью
        </p>
        </div>

        <div className={`grid gap-8 max-w-7xl mx-auto ${
        teamMembers.length === 1 ? 'md:grid-cols-1 max-w-md' :
        teamMembers.length === 2 ? 'md:grid-cols-2 max-w-4xl' :
        'md:grid-cols-2 lg:grid-cols-3'
        }`}>
        {teamMembers.map((member) => {
            const isExpanded = expandedMembers.has(member.id);
            
            return (
            <div 
                key={member.id}
                className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl dark:shadow-purple-500/10 overflow-hidden hover:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-500"
            >
                {/* Photo Section - Fixed aspect ratio with proper object fit */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                {member.photo ? (
                    <img 
                    src={member.photo}
                    alt={member.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-24 h-24 text-purple-300 dark:text-purple-600" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {member.name}
                </h3>
                <div className="text-purple-600 dark:text-purple-400 font-medium mb-4 text-sm">{member.position}</div>
                </div>
            </div>
            );
        })}
        </div>
    </section>
    )}

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8">
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              Присоединяйтесь к нам
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Хотите уточнить
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                вопросы?
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto">
              Свяжитесь с нами и узнайте, как мы можем вам помочь
            </p>
            
            <ContactModal phone={siteContent?.contactPhone ?? ''} email={siteContent?.contactEmail ?? ''}>
              <button className="group inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
                <Sparkles size={20} />
                <span>Наши контакты</span>
              </button>
            </ContactModal>
          </div>
        </div>
      </section>
    </main>
  );
}