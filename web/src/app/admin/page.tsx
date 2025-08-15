import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Новости" href="/admin/events" description="Добавление и редактирование новостей" />
        <Card title="Локации" href="/admin/locations" description="Добавление и редактирование каталога локаций" />
        <Card title="Услуги" href="/admin/prices" description="Добавление и редактирование списка услуг" />
        <Card title="О нас" href="/admin/pages/about" description="Добавление и редактирование информации на странице о нас" />
        <Card title="Документы" href="/admin/documents" description="Добавление и редактирование информации в документах" />
      </div>
    </div>
  );
}

function Card({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="border rounded p-4 hover:bg-gray-50 focus-visible:outline-dashed focus-visible:outline-2">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}


