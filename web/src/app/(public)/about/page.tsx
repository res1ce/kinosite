"use client";

import ContactModal from "@/components/ContactModal";
import { Users, Target, Award, Star, Heart, MapPin, Calendar, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  experience: string;
  photo: string;
  description: string;
  order: number;
}

interface AboutPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
}

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

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [aboutContent, setAboutContent] = useState<string>('');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch team members
        const teamResponse = await fetch('/api/team');
        if (!teamResponse.ok) throw new Error('Ошибка загрузки команды');
        const teamData = await teamResponse.json();
        setTeamMembers(teamData);

        // Fetch about page content
        const aboutResponse = await fetch('/api/pages/about');
        if (aboutResponse.ok) {
          const aboutData = await aboutResponse.json();
          setAboutContent(aboutData.content || '');
        }

        // Fetch site content for hero stats
        const siteResponse = await fetch('/api/site-content');
        if (siteResponse.ok) {
          const siteData = await siteResponse.json();
          setSiteContent(siteData);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Default stats if no site content is available
  const defaultStats = [
    { number: '15+', label: 'Лет опыта', icon: <Calendar size={20} /> },
    { number: '200+', label: 'Проектов', icon: <Trophy size={20} /> },
    { number: '250+', label: 'Локаций', icon: <MapPin size={20} /> },
  ];

  // Use site content stats if available, otherwise use defaults
  const stats = siteContent ? [
    { 
      number: siteContent.feature1Number, 
      label: siteContent.feature1Label, 
      icon: <Calendar size={20} /> 
    },
    { 
      number: siteContent.feature2Number, 
      label: siteContent.feature2Label, 
      icon: <Trophy size={20} /> 
    },
    { 
      number: siteContent.feature3Number, 
      label: siteContent.feature3Label, 
      icon: <MapPin size={20} /> 
    },
  ] : defaultStats;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <Users className="text-white" size={24} />
            </div>
            <p className="text-lg text-gray-600">Загрузка страницы...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-purple-600/20"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-violet-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fadeUp">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              15 лет в киноиндустрии
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
              О нашей 
              <span className="block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                миссии
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              {siteContent?.heroText || 'Развиваем киноиндустрию Забайкалья и создаем возможности для творческих проектов'}
            </p>

            {/* Key Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              {stats.map((stat, i) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-fadeUp" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mx-auto mb-3 animate-floating">
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      {aboutContent && (
        <section className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fadeUp">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                Наши задачи и цели
              </h2>
              <p className="text-xl text-gray-600">
                Узнайте больше о том, как мы развиваем кинематограф в регионе
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
              <article
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: aboutContent }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="container mx-auto px-6 py-20">
          <div className="text-center mb-16 animate-fadeUp">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Наша команда
            </h2>
            <p className="text-xl text-gray-600">
              Профессионалы, которые делают проекты реальностью
            </p>
          </div>

          <div className={`grid gap-8 ${
            teamMembers.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
            teamMembers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            teamMembers.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {teamMembers.map((member, i) => (
              <div 
                key={member.id}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fadeUp cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              >
                <div className="relative h-64 overflow-hidden">
                  {member.photo ? (
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${member.photo})` }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center">
                      <Users className="w-16 h-16 text-purple-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-sm font-medium opacity-90">{member.experience} опыта</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {member.name}
                  </h3>
                  <div className="text-purple-600 font-medium mb-3">{member.position}</div>
                  <p className={`text-gray-600 text-sm leading-relaxed transition-all duration-300 ${
                    selectedMember === member.id ? 'opacity-100' : 'line-clamp-2'
                  }`}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900"></div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fadeUp">
              <Heart className="w-4 h-4 mr-2 text-pink-400" />
              Присоединяйтесь к нам
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
              Хотите уточнить какие-либо
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                вопросы?
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              Свяжитесь с нами и узнайте, как мы можем вам помочь
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              <ContactModal phone={siteContent?.contactPhone ?? ''} email={siteContent?.contactEmail ?? ''}>
                <button className="px-12 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-500 shimmer-effect">
                  <span className="flex items-center justify-center gap-3">
                    <Sparkles size={20} />
                    <span>Наши контакты</span>
                  </span>
                </button>
              </ContactModal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}