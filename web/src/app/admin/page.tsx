import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl md:text-3xl font-bold">Добро пожаловать 👋</h1>
      <p className="text-gray-600 dark:text-gray-400">Управляйте контентом сайта в разделах ниже.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Новости"   href="/admin/events"    description="Добавление и редактирование новостей" />
        <Card title="Локации"   href="/admin/locations" description="Каталог локаций и галереи" />
        <Card title="Услуги"    href="/admin/prices"    description="Список услуг" />
        <Card title="О нас"     href="/admin/pages/about" description="Контент страницы «О нас»" />
        <Card title="Документы" href="/admin/documents" description="Файлы и ссылки на документы" />
      </div>
    </div>
  );
}

function Card({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border shadow-sm bg-white dark:bg-[#111] p-5 transition
                 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-[#6E0A6B]/60"
    >
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg
                         bg-[#6E0A6B]/10 text-[#6E0A6B] group-hover:scale-110 transition">
          →
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </Link>
  );
}
