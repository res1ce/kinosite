import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function createItem(formData: FormData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim() || null;
  const amount = Number(formData.get("amount"));
  const currency = (String(formData.get("currency") || "RUB").trim() || "RUB").toUpperCase();
  if (!name || Number.isNaN(amount)) return;
  await prisma.priceItem.create({ data: { name, description, amount: Math.round(amount), currency } });
  revalidatePath("/prices");
  revalidatePath("/admin/prices");
}

async function deleteItem(id: string) {
  "use server";
  await prisma.priceItem.delete({ where: { id } });
  revalidatePath("/prices");
  revalidatePath("/admin/prices");
}

export default async function AdminPricesPage() {
  const items = await prisma.priceItem.findMany({ orderBy: { amount: "asc" } });
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Услуги</h1>
      <form action={createItem} className="grid gap-3 border rounded p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Наименование</span>
            <input className="border rounded px-3 py-2" name="name" required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">(Опционально) Сумма</span>
            <input className="border rounded px-3 py-2" name="amount" type="number" step="1" />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="text-sm">Описание</span>
          <input className="border rounded px-3 py-2" name="description" />
        </label>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>
      <ul className="grid gap-3">
        {items.map((i) => (
          <li key={i.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{i.name}</div>
              <div className="text-xs text-gray-600">{i.amount.toLocaleString("ru-RU")} {i.currency}</div>
            </div>
            <form action={deleteItem.bind(null, i.id)}>
              <button className="text-sm text-red-600">Удалить</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}


