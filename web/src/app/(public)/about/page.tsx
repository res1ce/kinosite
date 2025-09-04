"use client";

import { Users, Target, Award, Star, Heart, MapPin, Calendar, Trophy, Sparkles } from "lucide-react";
import { useState } from "react";

// Mock about data
const mockAboutContent = `
  <h2>История создания</h2>
  <p>Забайкальская кинокомиссия была основана в 2009 году с целью развития киноиндустрии в регионе и привлечения съемочных групп со всей России и зарубежья. За 15 лет работы мы стали ведущей региональной кинокомиссией, способствуя созданию более 200 кинопроектов.</p>
  
  <h3>Наша миссия</h3>
  <p>Мы стремимся показать красоту и уникальность Забайкальского края через кинематограф, поддерживая как начинающих, так и опытных режиссеров в реализации их творческих проектов. Наша работа способствует развитию туризма и экономики региона.</p>
  
  <h3>Достижения</h3>
  <p>За годы работы кинокомиссия получила множество наград и признаний:</p>
  <ul>
    <li>Лауреат премии "Лучшая региональная кинокомиссия" 2022 года</li>
    <li>Поддержано более 50 международных проектов</li>
    <li>Создан каталог из 250+ уникальных локаций</li>
    <li>Организовано 15+ кинофестивалей и мероприятий</li>
  </ul>
  
  <h3>Команда</h3>
  <p>В нашей команде работают опытные специалисты в области кинопроизводства, локация-менеджеры, юристы и координаторы. Каждый член команды обладает глубокими знаниями региона и многолетним опытом работы с съемочными группами.</p>
`;

const teamMembers = [
  {
    name: 'Александр Петров',
    position: 'Директор кинокомиссии',
    experience: '15 лет',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    description: 'Основатель кинокомиссии, продюсер более 80 проектов'
  },
  {
    name: 'Елена Сидорова',
    position: 'Локация-менеджер',
    experience: '12 лет',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b300?w=300&q=80',
    description: 'Эксперт по локациям, знает каждый уголок региона'
  },
  {
    name: 'Дмитрий Козлов',
    position: 'Координатор проектов',
    experience: '8 лет',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    description: 'Специалист по организации съемок и логистике'
  },
  {
    name: 'Анна Волкова',
    position: 'Юрист',
    experience: '10 лет',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80',
    description: 'Эксперт по правовым вопросам в сфере кино'
  }
];

const achievements = [
  {
    year: '2009',
    title: 'Основание кинокомиссии',
    description: 'Создание первой региональной кинокомиссии в Забайкалье'
  },
  {
    year: '2015',
    title: 'Международное признание',
    description: 'Первый международный проект и выход на мировой рынок'
  },
  {
    year: '2020',
    title: '100-й проект',
    description: 'Достижение знакового рубежа в 100 поддержанных проектов'
  },
  {
    year: '2022',
    title: 'Лауреат премии',
    description: 'Получение премии "Лучшая региональная кинокомиссия"'
  },
  {
    year: '2024',
    title: 'Цифровая трансформация',
    description: 'Запуск онлайн-платформы для работы с клиентами'
  }
];

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState(null);

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
              Развиваем киноиндустрию Забайкалья и создаем возможности для творческих проектов
            </p>

            {/* Key Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              {[
                { number: '15+', label: 'Лет опыта', icon: <Calendar size={20} /> },
                { number: '200+', label: 'Проектов', icon: <Trophy size={20} /> },
                { number: '250+', label: 'Локаций', icon: <MapPin size={20} /> },
                { number: '4.9', label: 'Рейтинг', icon: <Star size={20} /> }
              ].map((stat, i) => (
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
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fadeUp">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Наша история и ценности
            </h2>
            <p className="text-xl text-gray-600">
              Узнайте больше о том, как мы развиваем кинематограф в регионе
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
            <article
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: mockAboutContent }}
            />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 to-indigo-900/5"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16 animate-fadeUp">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Ключевые вехи
            </h2>
            <p className="text-xl text-gray-600">
              Важные моменты в истории нашей кинокомиссии
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {achievements.map((achievement, i) => (
              <div 
                key={achievement.year}
                className={`flex items-center gap-8 mb-12 animate-fadeUp ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <div className="flex-1">
                  <div className={`bg-white rounded-2xl shadow-lg p-6 ${i % 2 === 0 ? 'ml-8' : 'mr-8'}`}>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold animate-floating">
                        {achievement.year.slice(-2)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{achievement.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-fadeUp">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Наша команда
          </h2>
          <p className="text-xl text-gray-600">
            Профессионалы, которые делают проекты реальностью
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div 
              key={member.name}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fadeUp"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => setSelectedMember(selectedMember === member.name ? null : member.name)}
            >
              <div className="relative h-64 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${member.photo})` }}
                />
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
                  selectedMember === member.name ? 'opacity-100' : 'line-clamp-2'
                }`}>
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

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
              Готовы создать что-то 
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                невероятное?
              </span>
            </h2>
            
            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              Свяжитесь с нами и узнайте, как мы можем помочь воплотить вашу творческую идею в жизнь
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              <button className="px-12 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-500 shimmer-effect">
                <span className="flex items-center justify-center gap-3">
                  <Sparkles size={20} />
                  <span>Начать проект</span>
                </span>
              </button>
              
              <button className="px-12 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-3xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center gap-3">
                  <Users size={20} />
                  <span>Встретиться с командой</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}