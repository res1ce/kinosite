// app/page.tsx
import Link from "next/link";
import { CalendarDays, MapPin, Ticket, Landmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ContactModal from "@/components/ContactModal";

export default async function Home() {
  const site = await prisma.siteContent.findUnique({ where: { slug: "main" } });

  const heroText =
    site?.heroText ||
    "Организуем съёмки, подбираем локации и сопровождаем проекты в регионе.";

  const features = [
    { number: site?.feature1Number || "250+", label: site?.feature1Label || "Локаций в каталоге" },
    { number: site?.feature2Number || "50+", label: site?.feature2Label || "Партнёрских проектов" },
    { number: site?.feature3Number || "15 лет", label: site?.feature3Label || "поддержки киноиндустрии" },
  ];

  return (
    <main className="min-h-svh font-sans">
      <Hero heroText={heroText} />
      <Features items={features} />
      <Services />
      <CTA />
    </main>
  );
}

function Hero({ heroText }: { heroText: string }) {
  return (
    <section className="relative overflow-hidden text-white min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B9EE0] via-purple-700 to-black animate-gradientShift opacity-90" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>
      <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight animate-fadeUp">
          Забайкальская <span className="text-[#6E0A6B] drop-shadow-lg">кино</span>комиссия
        </h1>
        <p className="mt-6 text-lg text-gray-200 animate-fadeUp delay-200">
          {heroText}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6 animate-fadeUp delay-400">
          <Link href="/news" className="px-8 py-4 rounded-xl bg-[#6E0A6B] text-white font-medium shadow-lg hover:scale-105 transition-transform">
            Новости
          </Link>
          <Link href="/locations" className="px-8 py-4 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition">
            Локации
          </Link>
        </div>
      </div>
    </section>
  );
}

function Features({ items }: { items: { number: string; label: string }[] }) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
        {items.map((s, i) => (
          <div
            key={s.label}
            className="p-8 rounded-2xl bg-white dark:bg-[#111]/80 shadow-xl border border-gray-200 dark:border-white/10 hover:scale-105 transition-transform animate-fadeUp"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="text-5xl font-extrabold text-[#6E0A6B]">{s.number}</div>
            <div className="mt-3 text-gray-600 dark:text-gray-300 text-lg font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const services = [
    { title: "Новости", description: "События и анонсы кинокомиссии", icon: <CalendarDays size={24} />, href: "/news" },
    { title: "Локации", description: "Каталог и карта лучших мест", icon: <MapPin size={24} />, href: "/locations" },
    { title: "Услуги", description: "Поддержка съёмок и консультации", icon: <Ticket size={24} />, href: "/services" },
    { title: "Документы", description: "Положения и бланки заявок", icon: <Landmark size={24} />, href: "/documents" },
  ];
  return (
    <section className="py-24 bg-gradient-to-br from-[#6E0A6B]/5 via-purple-200/10 to-transparent dark:from-[#6E0A6B]/20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 animate-fadeUp">Что мы предлагаем</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="p-8 rounded-2xl bg-white dark:bg-[#111]/80 shadow-lg border border-gray-200 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all animate-fadeUp"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="text-[#6E0A6B] mb-4">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{s.description}</p>
              <Link href={s.href} className="inline-block px-4 py-2 rounded-lg border border-[#6E0A6B] text-[#6E0A6B] font-medium hover:bg-[#6E0A6B] hover:text-white transition">
                Подробнее
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function CTA() {
  const site = await prisma.siteContent.findUnique({ where: { slug: "main" } });
  return (
    <section className="relative py-32 text-center text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6E0A6B] via-purple-800 to-[#6E0A6B] animate-gradientShift" />
      <div className="relative z-10 container mx-auto px-6 max-w-2xl">
        <h2 className="text-5xl font-bold mb-6 animate-fadeUp">
          Присоединяйтесь к киноиндустрии Забайкалья
        </h2>
        <p className="text-lg text-gray-200 mb-8 animate-fadeUp delay-200">
          Мы открыты для новых партнёров и идей. Оставьте заявку и начните сотрудничество.
        </p>
        <ContactModal
          phone={site?.contactPhone || "+7 (999) 123-45-67"}
          email={site?.contactEmail || "info@kino.ru"}
          variant="cta"
        />
      </div>
    </section>
  );
}
