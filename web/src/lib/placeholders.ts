export type PlaceholderEvent = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string | null;
  galleryUrls?: string[] | null;
  date: string;
  location?: string | null;
};

export const placeholderEvents: PlaceholderEvent[] = [
  {
    id: "e1",
    title: "Фестиваль короткометражного кино",
    slug: "festival-korotkometrazhnogo-kino",
    shortDescription: "Показы лучших короткометражек региона с обсуждениями и мастер-классами.",
    content: "<p>Провели серию показов и дискуссий с участием режиссёров. Участники отметили высокий уровень отбора работ.</p>",
    coverImageUrl: "/window.svg",
    galleryUrls: ["/vercel.svg", "/next.svg"],
    date: new Date().toISOString(),
    location: "Чита",
  },
  {
    id: "e2",
    title: "Социальный показ для школьников",
    slug: "sotsialnyy-pokaz-dlya-shkolnikov",
    shortDescription: "Просветительский проект по медиаграмотности и кинопроизводству.",
    content: "<p>Сделали четыре тематических блока и ответили на вопросы зрителей. Расширили программу по просьбам педагогов.</p>",
    coverImageUrl: "/globe.svg",
    galleryUrls: ["/file.svg"],
    date: new Date().toISOString(),
    location: "Забайкальский край",
  },
  {
    id: "e3",
    title: "Премьерный показ регионального кино",
    slug: "premernye-pokazy-regionalnogo-kino",
    shortDescription: "Поддержка молодых режиссёров края и обсуждение проектов с экспертами.",
    content: "<p>Организовали премьеру с участием прессы. Получили высокие оценки и договорились о прокате.</p>",
    coverImageUrl: "/window.svg",
    galleryUrls: [],
    date: new Date().toISOString(),
    location: "Чита",
  },
];

// Кинокомиссия: новости (переиспользуем события как новости)
export const placeholderNews: PlaceholderEvent[] = placeholderEvents;

// Кинокомиссия: локации для съёмок
export const placeholderLocations = [
  { id: "l1", slug: "ploshchad-lenina", name: "Площадь Ленина", description: "Центральная площадь города с монументальной архитектурой.", content: "<p>Подходит для массовых сцен и торжественных эпизодов.</p>", website: null, latitude: 52.034, longitude: 113.499, address: "Чита, центр", logoUrl: "/next.svg" },
  { id: "l2", slug: "zabaikalskaya-step", name: "Забайкальская степь", description: "Просторные пейзажи, холмы и степные дороги.", content: "<p>Идеально для дорожных сцен, исторических постановок.</p>", website: null, latitude: 51.900, longitude: 113.300, address: "Окрестности Читы", logoUrl: "/vercel.svg" },
  { id: "l3", slug: "rechka-inga", name: "Речка Инга", description: "Живописная река, березовые рощи.", content: "<p>Места для камерных сцен и натурных съемок.</p>", website: null, latitude: 52.060, longitude: 113.520, address: "Чита, юг", logoUrl: "/globe.svg" },
];

export const placeholderPrices = [
  { id: "p1", name: "Организация показа", description: "Полный цикл подготовки и проведения", amount: 50000, currency: "RUB" },
  { id: "p2", name: "Аренда оборудования", description: "Звук, свет, экран", amount: 30000, currency: "RUB" },
  { id: "p3", name: "PR-поддержка", description: "Афиши, соцсети, SMM", amount: 20000, currency: "RUB" },
  { id: "p4", name: "Фото/видео отчёт", description: "Фоторепортаж + ролик", amount: 25000, currency: "RUB" },
];

export const placeholderPages: Record<string, { title: string; content: string }> = {
  about: {
    title: "О нас",
    content: "<p>Мы кинокомиссия Забайкальского края. Помогаем организовывать съёмки, подбираем локации и сопровождаем проекты в регионе</p>",
  },
  documents: {
    title: "Документы",
    content: "<p>Положения, регламенты, бланки заявок и прочие документы кино-комиссии будут опубликованы здесь.</p>",
  },
};


