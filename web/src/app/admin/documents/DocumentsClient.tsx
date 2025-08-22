"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import FileUploader from "@/components/FileUploader";
import DeleteButton from "@/components/DeleteButton";

interface Document { id: string; title: string; fileUrl: string; createdAt: string|Date; updatedAt: string|Date; }

export default function DocumentsClient({
  documents, createDocument, updateDocument, deleteDocument,
}: {
  documents: Document[];
  createDocument: (fd: FormData) => Promise<void>;
  updateDocument: (id: string, fd: FormData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}) {
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [doc, setDoc] = useState<Document | null>(null);

  const filtered = useMemo(
    () => documents.filter(d => [d.title, d.fileUrl].join(" ").toLowerCase().includes(q.toLowerCase())),
    [documents, q]
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 grid gap-4">
        <Toolbar onSearch={setQ} right={<span className="text-sm text-gray-500">Найдено: {filtered.length}</span>} />
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((d) => (
            <li key={d.id} className="rounded-2xl border bg-white dark:bg-[#111] p-4 shadow-sm hover:shadow-xl transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{d.title}</div>
                  <a className="text-xs text-[#6E0A6B] hover:underline break-all" href={d.fileUrl} target="_blank">Открыть</a>
                  <div className="text-xs text-gray-500 mt-1">обновлено {new Date(d.updatedAt).toLocaleDateString("ru-RU")}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditId(d.id); setDoc(d); }} className="px-3 py-1.5 rounded-md bg-[#6E0A6B]/10 text-[#6E0A6B] hover:bg-[#6E0A6B]/15 transition">Изм.</button>
                  <DeleteButton onDelete={() => deleteDocument(d.id)} />
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="col-span-full rounded-xl border bg-white dark:bg-[#111] p-10 text-center text-gray-500">Ничего не найдено</li>
          )}
        </ul>
      </div>

      <Panel title={editId ? "Редактировать документ" : "Добавить документ"}>
        <form
          action={async (fd: FormData) => {
            if (editId) { if (!fd.get("fileUrl") && doc?.fileUrl) fd.set("fileUrl", doc.fileUrl); await updateDocument(editId, fd); setEditId(null); setDoc(null); }
            else { await createDocument(fd); }
          }}
          className="grid gap-4"
        >
          <Field label="Название">
            <input name="title" required defaultValue={doc?.title}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" />
          </Field>
          <Field label="Файл">
            <FileUploader name="fileUrl" accept=".pdf,.doc,.docx" />
            {doc?.fileUrl && <a className="text-xs text-[#6E0A6B] hover:underline mt-2 inline-block" href={doc.fileUrl} target="_blank">Текущий файл</a>}
          </Field>
          <button className="px-4 py-2 rounded-lg bg-[#6E0A6B] text-white hover:brightness-110 active:scale-95 transition">
            {editId ? "Сохранить" : "Добавить"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setDoc(null); }}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-black/30 hover:bg-gray-200 transition">
              Отмена
            </button>
          )}
        </form>
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
