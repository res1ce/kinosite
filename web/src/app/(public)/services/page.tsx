import { CheckCircle2 } from "lucide-react";

export default function ServicesPage() {
  const services = [
    { id: "s1", title: "Содействие в организации съёмок", desc: "Помощь со съёмочными процессами на территории края" },
    { id: "s2", title: "Подбор локаций", desc: "Консультации и список рекомендованных локаций" },
    { id: "s3", title: "Взаимодействие с администрациями", desc: "Оформление разрешений и координация" },
  ];
  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Услуги</h1>
      <ul className="grid md:grid-cols-2 gap-4">
        {services.map((s) => (
          <li key={s.id} className="card-solid p-5 rounded-xl reveal">
            <h2 className="font-medium text-lg flex items-center gap-2"><CheckCircle2 size={18} /> {s.title}</h2>
            <p className="text-sm text-gray-600">{s.desc}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}


