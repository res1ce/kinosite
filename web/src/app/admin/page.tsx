import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Мероприятия" href="/admin/events" description="Добавление и редактирование" />
        <Card title="Кинотеатры" href="/admin/cinemas" description="Партнёры на карте" />
        <Card title="Цены" href="/admin/prices" description="Редактор прайс-листа" />
        <Card title="Страницы" href="/admin/pages" description="О нас, Антикоррупция, Прокурор" />
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


