"use client";

import { FileText, Download, Calendar, Search, Filter, Archive, Shield, Award, Users } from "lucide-react";
import { useState } from "react";

// Mock documents data
const mockDocuments = [
  {
    id: '1',
    title: 'Положение о кинокомиссии',
    description: 'Основной документ, регламентирующий деятельность кинокомиссии региона',
    fileUrl: '/documents/regulations.pdf',
    fileSize: '2.4 МБ',
    category: 'Положения',
    updatedAt: '2024-08-15',
    downloadCount: 1247,
    isRequired: true
  },
  {
    id: '2',
    title: 'Заявка на съемки',
    description: 'Форма заявки для получения разрешения на киносъемки',
    fileUrl: '/documents/application.docx',
    fileSize: '1.2 МБ',
    category: 'Заявки',
    updatedAt: '2024-09-01',
    downloadCount: 892,
    isRequired: true
  },
  {
    id: '3',
    title: 'Прайс-лист услуг',
    description: 'Актуальные расценки на услуги кинокомиссии',
    fileUrl: '/documents/prices.pdf',
    fileSize: '856 КБ',
    category: 'Прайсы',
    updatedAt: '2024-08-30',
    downloadCount: 654,
    isRequired: false
  },
  {
    id: '4',
    title: 'Договор на услуги',
    description: 'Типовой договор на оказание услуг кинокомиссии',
    fileUrl: '/documents/contract.pdf',
    fileSize: '1.8 МБ',
    category: 'Договоры',
    updatedAt: '2024-07-20',
    downloadCount: 423,
    isRequired: false
  },
  {
    id: '5',
    title: 'Техническое задание',
    description: 'Шаблон технического задания для съемочных проектов',
    fileUrl: '/documents/technical.docx',
    fileSize: '965 КБ',
    category: 'Шаблоны',
    updatedAt: '2024-08-10',
    downloadCount: 332,
    isRequired: false
  },
  {
    id: '6',
    title: 'Согласие на обработку данных',
    description: 'Форма согласия на обработку персональных данных',
    fileUrl: '/documents/privacy.pdf',
    fileSize: '654 КБ',
    category: 'Согласия',
    updatedAt: '2024-06-15',
    downloadCount: 789,
    isRequired: true
  }
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['Все', 'Положения', 'Заявки', 'Прайсы', 'Договоры', 'Шаблоны', 'Согласия'];

  const categoryIcons = {
    'Положения': <Shield size={16} />,
    'Заявки': <FileText size={16} />,
    'Прайсы': <Award size={16} />,
    'Договоры': <Users size={16} />,
    'Шаблоны': <Archive size={16} />,
    'Согласия': <Shield size={16} />,
    'Все': <FileText size={16} />
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-600/20 via-transparent to-orange-600/20"></div>
        
        {/* Floating background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-floating"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-yellow-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fadeUp">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              Документооборот и формы
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
              Документы и 
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                формы
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
              Все необходимые документы для работы с кинокомиссией
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  placeholder="Поиск документов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-amber-400 transition-all duration-300"
                />
              </div>
              
              <div className="relative">
                
                {isFilterOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-20">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full text-left px-6 py-3 hover:bg-gray-100 transition-colors ${
                          selectedCategory === category ? 'bg-amber-100 text-amber-700' : ''
                        }`}
                      >
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="container mx-auto px-6 py-20">

        {/* Documents List */}
        <div className="space-y-6">
          {filteredDocuments.map((doc, i) => (
            <div 
              key={doc.id}
              className="group relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 overflow-hidden animate-fadeUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            > 

              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>Обновлено {new Date(doc.updatedAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Archive size={14} />
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shimmer-effect"
                    >
                      <Download size={16} />
                      <span>Скачать</span>
                    </a>
                    
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      <FileText size={16} />
                      <span>Просмотр</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="shimmer-effect"></div>
            </div>
          ))}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16 animate-fadeUp">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-floating">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Документы не найдены
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Попробуйте изменить параметры поиска или выбрать другую категорию
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Все');
                }}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}