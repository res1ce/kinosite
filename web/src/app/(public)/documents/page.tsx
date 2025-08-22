// page.tsx "Документы"
import { prisma } from '@/lib/prisma'

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <section className="py-20 container mx-auto px-6 animate-fadeUp">
      <h2 className="section-title text-center mb-12">Документы</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <a key={doc.id} href={doc.fileUrl} target="_blank" className="doc-card group">
            <div className="doc-card__icon">📄</div>
            <div>
              <h3 className="font-medium text-lg group-hover:text-[#6E0A6B] transition">
                {doc.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{doc.title}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
