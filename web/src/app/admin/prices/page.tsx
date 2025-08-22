import { getPriceItems, createPriceItem, updatePriceItem, deletePriceItem } from "@/app/api/prices/actions";
import { prisma } from "@/lib/prisma";
import SectionTopbar from "@/components/SectionTopbar";
import PricesClient from "./PricesClient";

export default async function AdminPricesPage() {
  const priceItems = await getPriceItems();
  const counters = [
    { label: "Всего услуг", value: priceItems.length },
    { label: "С описанием", value: priceItems.filter(i => i.description?.trim()).length },
    { label: "Обновлено за 30 дней", value: await prisma.priceItem.count({ where: { updatedAt: { gte: new Date(Date.now() - 30*864e5) } } }) },
    { label: "Черновиков", value: 0 },
  ];
  return (
    <main className="grid gap-6">
      <SectionTopbar title="Услуги" counters={counters} />
      <PricesClient priceItems={priceItems} createPriceItem={createPriceItem} updatePriceItem={updatePriceItem} deletePriceItem={deletePriceItem} />
    </main>
  );
}
