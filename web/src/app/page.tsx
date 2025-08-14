import Link from "next/link";

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
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-6 py-24 grid lg:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">Кинокомпания — мероприятия, партнёрства, социальные проекты</h1>
          <p className="mt-4 text-gray-300">Организуем показ фильмов, фестивали и спецпоказы. Работаем по стандартам госсектора.</p>
          <div className="mt-8 flex gap-4">
            <Link href="#events" className="bg-white text-black px-5 py-2 rounded">Мероприятия</Link>
            <Link href="#cinemas" className="ring-1 ring-white/30 px-5 py-2 rounded">Партнёрские кинотеатры</Link>
          </div>
        </div>
        <div className="aspect-video rounded-lg ring-1 ring-white/10 bg-[url('/window.svg')] bg-center bg-no-repeat opacity-80" aria-hidden="true" />
      </div>
    </section>
  );
}

function Sections() {
  return (
    <div className="container mx-auto px-6 py-12 grid gap-16">
      <SectionCard id="events" title="Проведённые мероприятия" description="Фотографии, описание, полные отчёты">
        <Link href="/events" className="text-black bg-gray-100 px-4 py-2 rounded">Смотреть все</Link>
      </SectionCard>
      <SectionCard id="cinemas" title="Кинотеатры-партнёры" description="На карте с переходом на сайты">
        <Link href="/cinemas" className="text-black bg-gray-100 px-4 py-2 rounded">Открыть карту</Link>
      </SectionCard>
      <SectionCard id="prices" title="Стоимость услуг" description="Прозрачный прайс-лист">
        <Link href="/prices" className="text-black bg-gray-100 px-4 py-2 rounded">Подробнее</Link>
      </SectionCard>
      <SectionCard id="about" title="О нас" description="Миссия, команда, реквизиты">
        <Link href="/about" className="text-black bg-gray-100 px-4 py-2 rounded">Читать</Link>
      </SectionCard>
      <SectionCard id="state" title="Госсекция" description="Противодействие коррупции, Прокурор разъясняет и др.">
        <div className="flex gap-3 flex-wrap">
          <Link href="/pages/anti-corruption" className="underline">Противодействие коррупции</Link>
          <Link href="/pages/prosecutor" className="underline">Прокурор разъясняет</Link>
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id} className="grid gap-3">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}
