import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import DocumentsClient from "./DocumentsClient";
import BackButton from "@/components/BackButton";

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
    <main className="container mx-auto py-6 px-4">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-bold mb-8">Документы</h1>
      <DocumentsClient
        documents={documents}
        createDocument={createDocument}
        updateDocument={updateDocument}
        deleteDocument={deleteDocument}
      />
    </main>
  );
}
