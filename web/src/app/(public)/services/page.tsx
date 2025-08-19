import { CheckCircle2 } from "lucide-react";
import { prisma } from '@/lib/prisma'

export default async function ServicesPage() {
  const services = await prisma.priceItem.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  });

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Услуги</h1>
      <ul className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <li key={service.id} className="card-solid p-5 rounded-xl reveal">
            <h2 className="font-medium text-lg flex items-center gap-2">
              <CheckCircle2 size={18} /> {service.name}
            </h2>
            {service.description && (
              <p className="text-sm text-gray-600">{service.description}</p>
            )}
          </li>
        ))}
        {services.length === 0 && (
          <li className="col-span-2 text-center text-gray-500 py-8">
            Услуги пока не добавлены
          </li>
        )}
      </ul>
    </main>
  );
}


