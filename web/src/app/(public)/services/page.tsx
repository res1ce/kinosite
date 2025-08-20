// page.tsx "Услуги"
import { CheckCircle2 } from "lucide-react";
import { prisma } from '@/lib/prisma'

export default async function ServicesPage() {
  const services = await prisma.priceItem.findMany({
    orderBy: { createdAt: 'asc' }
  });

  return (
    <main className="container mx-auto px-6 py-20 grid gap-10">
      <header className="section-hero">
        <h1 className="section-title">Услуги</h1>
        <p className="section-subtitle">Сопровождение проектов и консультации</p>
      </header>

      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <li key={service.id} className="service-card animate-fadeUp" style={{ animationDelay: `${i*0.05}s` }}>
            <h2 className="text-lg font-semibold flex items-center gap-2 text-[#6E0A6B]">
              <CheckCircle2 size={18} /> {service.name}
            </h2>
            {service.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{service.description}</p>
            )}
          </li>
        ))}
        {services.length === 0 && (
          <li className="col-span-full text-center text-gray-500 py-16">Услуги пока не добавлены</li>
        )}
      </ul>
    </main>
  );
}
