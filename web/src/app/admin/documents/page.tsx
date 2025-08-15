import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import FileUploader from "@/components/FileUploader";

async function createDocument(formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  
  if (!title || !fileUrl) return;
  
  await prisma.document.create({
    data: { title, fileUrl }
  });
  
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
}

async function updateDocument(id: string, formData: FormData) {
  "use server";
  const title = String(formData.get("title") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  
  if (!title || !fileUrl) return;
  
  await prisma.document.update({
    where: { id },
    data: { title, fileUrl }
  });
  
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
}

async function deleteDocument(id: string) {
  "use server";
  await prisma.document.delete({ where: { id } });
  revalidatePath("/documents");
  revalidatePath("/admin/documents");
}

export default async function AdminDocumentsPage() {
  const documents = await prisma.document.findMany({ orderBy: { createdAt: "desc" } });
  
  return (
    <main className="grid gap-8">
      <h1 className="text-xl font-semibold">Документы</h1>
      
      <form action={createDocument} className="grid gap-3 border rounded p-4">
        <div className="grid gap-1">
          <label className="text-sm">Название документа</label>
          <input className="border rounded px-3 py-2" name="title" required />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Файл</label>
          <FileUploader name="fileUrl" accept=".pdf,.doc,.docx" />
        </div>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded">Добавить</button>
        </div>
      </form>

      <ul className="grid gap-3">
        {documents.map((doc) => (
          <li key={doc.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{doc.title}</div>
              <a 
                href={doc.fileUrl} 
                download 
                className="text-sm text-blue-600 hover:underline"
              >
                Скачать
              </a>
            </div>
            <div className="flex gap-2">
              <form action={updateDocument.bind(null, doc.id)}>
                <button className="text-sm text-blue-600">Изменить</button>
              </form>
              <form action={deleteDocument.bind(null, doc.id)}>
                <button className="text-sm text-red-600">Удалить</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
