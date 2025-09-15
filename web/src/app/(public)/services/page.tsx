// "use client";

// import { CheckCircle2, Star, Clock, Users, Phone, Mail, ArrowRight, Sparkles, Target, Award } from "lucide-react";
// import { useState } from "react";

// // Mock services data
// const mockServices = [
//   {
//     id: '1',
//     name: 'Организация съемок',
//     description: 'Полное сопровождение съемочного процесса от подготовки до постпродакшена',
//     price: 'от 50 000 ₽',
//     duration: '1-30 дней',
//     popularity: 95,
//     features: ['Подбор локаций', 'Получение разрешений', 'Координация с властями', 'Логистика'],
//     icon: <Target size={24} />
//   },
//   {
//     id: '2',
//     name: 'Консультации по локациям',
//     description: 'Профессиональные консультации по выбору оптимальных мест для съемок',
//     price: 'от 5 000 ₽',
//     duration: '1-3 дня',
//     popularity: 87,
//     features: ['Анализ сценария', 'Рекомендации локаций', 'Техническая оценка', 'Бюджетирование'],
//     icon: <Star size={24} />
//   },
//   {
//     id: '3',
//     name: 'Поддержка продакшена',
//     description: 'Техническая и организационная поддержка во время съемок',
//     price: 'от 15 000 ₽',
//     duration: '1-14 дней',
//     popularity: 78,
//     features: ['Координация на площадке', 'Решение вопросов', 'Связь с властями', 'Экстренная поддержка'],
//     icon: <Users size={24} />
//   },
//   {
//     id: '4',
//     name: 'Разрешения и документы',
//     description: 'Получение всех необходимых разрешений для съемок',
//     price: 'от 10 000 ₽',
//     duration: '3-14 дней',
//     popularity: 92,
//     features: ['Согласование с МВД', 'Разрешения властей', 'Страхование', 'Документооборот'],
//     icon: <CheckCircle2 size={24} />
//   },
//   {
//     id: '5',
//     name: 'Кастинг и актеры',
//     description: 'Подбор местных актеров и массовки для съемок',
//     price: 'от 20 000 ₽',
//     duration: '5-10 дней',
//     popularity: 83,
//     features: ['База актеров', 'Кастинг-сессии', 'Договоры', 'Координация графиков'],
//     icon: <Award size={24} />
//   },
//   {
//     id: '6',
//     name: 'Техническая поддержка',
//     description: 'Аренда оборудования и технического персонала',
//     price: 'от 30 000 ₽',
//     duration: '1-20 дней',
//     popularity: 76,
//     features: ['Аренда техники', 'Технический персонал', 'Транспорт', 'Генераторы'],
//     icon: <Sparkles size={24} />
//   }
// ];

// export default function ServicesPage() {
//   const [selectedCategory, setSelectedCategory] = useState('Все');
//   const [searchTerm, setSearchTerm] = useState('');

//   const categories = ['Все', 'Организационные', 'Консультационные', 'Технические'];

//   const filteredServices = mockServices.filter(service => {
//     const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   return (
//     <>
//       <style jsx global>{`
//         @keyframes fadeUp {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         @keyframes floating {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-8px); }
//         }

//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }

//         .animate-fadeUp {
//           animation: fadeUp 0.6s ease-out forwards;
//           opacity: 0;
//         }

//         .animate-floating {
//           animation: floating 3s ease-in-out infinite;
//         }

//         .shimmer-effect {
//           position: relative;
//           overflow: hidden;
//         }

//         .shimmer-effect::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
//           transform: translateX(-100%);
//           animation: shimmer 2s infinite;
//         }

//         .service-card {
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//         }

//         .service-card:hover {
//           transform: translateY(-8px) scale(1.02);
//         }
//       `}</style>

//       <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
//         {/* Hero Section */}
//         <section className="relative py-32 overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-teal-900 to-blue-900"></div>
//           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-transparent to-cyan-600/20"></div>
          
//           {/* Floating background elements */}
//           <div className="absolute top-20 left-20 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-floating"></div>
//           <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-floating" style={{ animationDelay: '2s' }}></div>
//           <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl animate-floating" style={{ animationDelay: '4s' }}></div>

//           <div className="relative z-10 container mx-auto px-6">
//             <div className="text-center max-w-4xl mx-auto">
//               <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-8 animate-fadeUp">
//                 <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
//                 Профессиональные услуги
//               </div>

//               <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fadeUp" style={{ animationDelay: '0.1s' }}>
//                 Наши 
//                 <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
//                   услуги
//                 </span>
//               </h1>

//               <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto animate-fadeUp" style={{ animationDelay: '0.2s' }}>
//                 Комплексное сопровождение киносъемок от идеи до реализации
//               </p>

//               {/* Stats */}
//               <div className="grid md:grid-cols-4 gap-6 mb-12 animate-fadeUp" style={{ animationDelay: '0.3s' }}>
//                 {[
//                   { number: '150+', label: 'Проектов', icon: <Target size={20} /> },
//                   { number: '24/7', label: 'Поддержка', icon: <Clock size={20} /> },
//                   { number: '15+', label: 'Лет опыта', icon: <Award size={20} /> },
//                   { number: '4.9', label: 'Рейтинг', icon: <Star size={20} /> }
//                 ].map((stat, i) => (
//                   <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-fadeUp" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
//                     <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mx-auto mb-3 animate-floating">
//                       <div className="text-white">{stat.icon}</div>
//                     </div>
//                     <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
//                     <div className="text-white/70 text-sm">{stat.label}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Services Grid */}
//         <section className="container mx-auto px-6 py-20">
//           <div className="text-center mb-16 animate-fadeUp">
//             <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
//               Что мы предлагаем
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Полный спектр услуг для успешной реализации вашего проекта
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {filteredServices.map((service, i) => (
//               <div 
//                 key={service.id}
//                 className="service-card group relative p-8 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl overflow-hidden animate-fadeUp"
//                 style={{ animationDelay: `${i * 0.1}s` }}
//               >
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full -translate-y-16 translate-x-16"></div>
                
//                 <div className="relative z-10">
//                   {/* Header */}
//                   <div className="flex items-start justify-between mb-6">
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 animate-floating">
//                         {service.icon}
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xs text-gray-500 mb-1">Популярность</div>
//                         <div className="flex items-center gap-1">
//                           <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000"
//                               style={{ width: `${service.popularity}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-xs font-semibold text-gray-600">{service.popularity}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Content */}
//                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
//                     {service.name}
//                   </h3>

//                   <p className="text-gray-600 mb-6 leading-relaxed">
//                     {service.description}
//                   </p>

//                   {/* Features */}
//                   <div className="space-y-2 mb-6">
//                     {service.features.map((feature, idx) => (
//                       <div key={idx} className="flex items-center gap-3">
//                         <CheckCircle2 size={16} className="text-green-500" />
//                         <span className="text-sm text-gray-700">{feature}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Footer */}
//                   <div className="flex items-center justify-between pt-6 border-t border-gray-100">
//                     <div>
//                       <div className="text-2xl font-bold text-green-600">{service.price}</div>
//                       <div className="text-xs text-gray-500">{service.duration}</div>
//                     </div>
                    
//                     <button className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 shimmer-effect">
//                       <span>Заказать</span>
//                       <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="shimmer-effect"></div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section className="relative py-20 overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 to-teal-900/10"></div>
          
//           <div className="relative container mx-auto px-6">
//             <div className="max-w-4xl mx-auto text-center">
//               <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent animate-fadeUp">
//                 Готовы начать проект?
//               </h2>
              
//               <p className="text-xl text-gray-600 mb-12 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
//                 Свяжитесь с нами для обсуждения деталей и получения персонального предложения
//               </p>
              
//               <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
//                 <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 shimmer-effect">
//                   <Phone size={20} />
//                   <span>Позвонить</span>
//                 </button>
                
//                 <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-green-600 text-green-600 font-bold rounded-2xl hover:bg-green-50 transform hover:scale-105 transition-all duration-300">
//                   <Mail size={20} />
//                   <span>Написать</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }