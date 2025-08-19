import { prisma } from '@/lib/prisma'

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <main className="container mx-auto px-6 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Документы</h1>
      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between group"
            >
              <div>
                <h2 className="text-xl font-semibold group-hover:text-blue-600">
                  {doc.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(doc.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
            </a>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-center text-gray-500">Документы не найдены</p>
        )}
      </div>
    </main>
  );
}


