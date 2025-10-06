"use client";

import { FileText, Download, Calendar, Search } from "lucide-react";
import { useState, useEffect } from "react";

// Document type based on your Prisma model
interface Document {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface for UI purposes
interface ExtendedDocument extends Document {
  description?: string;
  fileSize?: string;
  category?: string;
  downloadCount?: number;
  isRequired?: boolean;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<ExtendedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/documents');
        
        if (!response.ok) {
          throw new Error('Ошибка загрузки документов');
        }
        
        const data = await response.json();
        
        // Transform data for UI (add missing fields with defaults)
        const transformedData = data.map((doc: Document) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
          updatedAt: new Date(doc.updatedAt),
          description: `Документ ${doc.title}`, // Default description
          fileSize: 'Неизвестно', // Default file size
          category: 'Документы', // Default category
          downloadCount: 0, // Default download count
          isRequired: false // Default required status
        }));
        
        setDocuments(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <FileText className="text-white" size={24} />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Загрузка документов...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ошибка загрузки</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900/20 transition-colors duration-300">
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
              className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-amber-500/10 hover:shadow-2xl dark:hover:shadow-amber-500/20 border border-gray-100 dark:border-gray-700 transition-all duration-500 overflow-hidden animate-fadeUp"
              style={{ animationDelay: `${i * 0.1}s` }}
            > 
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                        {doc.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>Обновлено {doc.updatedAt.toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shimmer-effect"
                    >
                      <Download size={16} />
                      <span>Скачать</span>
                    </a>
                    
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
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

          {filteredDocuments.length === 0 && !loading && (
            <div className="text-center py-16 animate-fadeUp">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-floating">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {documents.length === 0 ? 'Документы отсутствуют' : 'Документы не найдены'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
                {documents.length === 0 
                  ? 'В системе пока нет загруженных документов'
                  : 'Попробуйте изменить параметры поиска или выбрать другую категорию'
                }
              </p>
              {documents.length > 0 && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Все');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}