import { placeholderPrices } from "@/lib/placeholders";

export default async function PricesPage() {
  const items = placeholderPrices;
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Стоимость услуг</h1>
      <ul className="grid gap-4 reveal">
        {items.map((i) => (
          <li key={i.id} className="rounded-xl p-5 flex items-center justify-between card-solid">
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-8 rounded bg-[var(--brand-primary)]" />
              <div>
                <div className="font-medium flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M8 6v12"/><path d="M16 10v8"/><path d="M12 13v5"/></svg>
                  {i.name}
                </div>
                {i.description && <div className="text-sm text-gray-600">{i.description}</div>}
              </div>
            </div>
            <div className="text-lg font-semibold whitespace-nowrap">{i.amount.toLocaleString("ru-RU")} {i.currency}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}


