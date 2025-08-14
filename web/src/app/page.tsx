import Link from "next/link";
import { CalendarDays, MapPin, Ticket, Landmark } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-svh">
      <Hero />
      <Sections />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden text-white gradient-animated">
      <div className="container mx-auto px-6 py-24 grid lg:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight reveal">Забайкальская кинокомиссия — новости, услуги, локации</h1>
          <p className="mt-4 text-gray-300 reveal" style={{ transitionDelay: ".1s" }}>Помогаем организовывать съёмки, подбираем локации и сопровождаем проекты в регионе.</p>
          <div className="mt-8 flex gap-4">
            <Link href="/news" className="px-6 py-3 rounded shadow-md hover:shadow-lg transition-shadow btn-primary reveal" style={{ transitionDelay: ".2s" }}>Новости</Link>
            <Link href="/locations" className="px-6 py-3 rounded btn-ghost reveal" style={{ transitionDelay: ".3s" }}>Локации</Link>
          </div>
        </div>
        <div
          className="aspect-video rounded-lg ring-1 ring-white/10 bg-center bg-no-repeat bg-contain opacity-80 reveal"
          style={{ backgroundImage: "url('/uploads/logo.jpg')" , transitionDelay: ".2s" as any }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function Sections() {
  return (
    <div className="container mx-auto px-6 py-16 grid gap-8">
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard
          title="Новости"
          description="События и анонсы кинокомиссии"
          image="/window.svg"
          icon={<CalendarDays size={18} />}
          actions={<Link href="/news" className="px-4 py-2 rounded btn-outline">Смотреть все</Link>}
        />
        <FeatureCard
          title="Локации"
          description="Карта и каталог рекомендованных мест"
          image="/globe.svg"
          icon={<MapPin size={18} />}
          actions={<Link href="/locations" className="px-4 py-2 rounded btn-outline">Открыть карту</Link>}
        />
        <FeatureCard
          title="Услуги"
          description="Поддержка съёмок и консультации"
          image="/file.svg"
          icon={<Ticket size={18} />}
          actions={<Link href="/services" className="px-4 py-2 rounded btn-outline">Подробнее</Link>}
        />
        <FeatureCard
          title="Документы"
          description="Положения и бланки заявок"
          image="/next.svg"
          icon={<Landmark size={18} />}
          actions={<Link href="/documents" className="px-4 py-2 rounded btn-outline">Перейти</Link>}
        />
      </div>
    </div>
  );
}

function SectionCard({ id, title, description, children, className }: { id: string; title: string; description: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`grid gap-3 ${className || ""}`}>
      <div className="grid gap-1">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

function FeatureCard({ title, description, image, actions, icon }: { title: string; description: string; image: string; actions: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded overflow-hidden card-solid reveal hover-tilt">
      <div className="aspect-[4/3] md:aspect-[16/9] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${image})` }} />
      <div className="p-4 grid gap-3">
        <div className="grid gap-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">{icon}{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="flex gap-3 flex-wrap">{actions}</div>
      </div>
    </div>
  );
}
