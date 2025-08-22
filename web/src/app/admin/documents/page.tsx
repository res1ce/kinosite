import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import DocumentsClient from "./DocumentsClient";
import SectionTopbar from "@/components/SectionTopbar";

async function createDocument(formData: FormData) { "use server";
  const title = String(formData.get("title") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  if (!title || !fileUrl) return;
  await prisma.document.create({ data: { title, fileUrl } });
  revalidatePath("/documents"); revalidatePath("/admin/documents");
}
async function updateDocument(id: string, formData: FormData) { "use server";
  const title = String(formData.get("title") || "").trim();
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  if (!title || !fileUrl) return;
  await prisma.document.update({ where: { id }, data: { title, fileUrl } });
  revalidatePath("/documents"); revalidatePath("/admin/documents");
}
async function deleteDocument(id: string) { "use server";
  await prisma.document.delete({ where: { id } });
  revalidatePath("/documents"); revalidatePath("/admin/documents");
}

export default async function AdminDocumentsPage() {
  const [docs, count] = await Promise.all([
    prisma.document.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.document.count(),
  ]);
  return (
    <main className="grid gap-6">
      <SectionTopbar title="Документы" counters={[{ label: "Всего", value: count }, { label: "За месяц", value: docs.filter(d => (Date.now() - new Date(d.createdAt).getTime()) < 30*864e5).length }, { label: "Обновлено", value: docs.filter(d => d.updatedAt !== d.createdAt).length }, { label: "На сайте", value: count }]} />
      <DocumentsClient documents={docs} createDocument={createDocument} updateDocument={updateDocument} deleteDocument={deleteDocument} />
    </main>
  );
}
