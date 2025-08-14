import { prisma } from "@/lib/prisma";

export default async function PricesPage() {
  const items = await prisma.priceItem.findMany({ orderBy: { amount: "asc" } });
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Стоимость услуг</h1>
      <ul className="grid md:grid-cols-2 gap-4">
        {items.map((i) => (
          <li key={i.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              {i.description && <div className="text-sm text-gray-600">{i.description}</div>}
            </div>
            <div className="text-lg font-semibold">{i.amount.toLocaleString("ru-RU")} {i.currency}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}


