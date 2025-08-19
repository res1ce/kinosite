"use client";
import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import DeleteButton from "@/components/DeleteButton";

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function DocumentsClient({
  documents,
  createDocument,
  updateDocument,
  deleteDocument,
}: {
  documents: Document[];
  createDocument: (formData: FormData) => Promise<void>;
  updateDocument: (id: string, formData: FormData) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editDocument, setEditDocument] = useState<Document | null>(null);

  const handleEdit = (document: Document) => {
    setEditId(document.id);
    setEditDocument(document);
  };

  const handleCancel = () => {
    setEditId(null);
    setEditDocument(null);
  };

  return (
    <div className="grid gap-8">
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Добавить новый документ</h2>
        <form action={createDocument} className="space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">Название документа</label>
            <input 
              className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              name="title" 
              required 
              placeholder="Введите название документа"
            />
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-700">Файл</label>
            <FileUploader name="fileUrl" accept=".pdf,.doc,.docx" />
            <p className="text-sm text-gray-500">Поддерживаемые форматы: PDF, DOC, DOCX</p>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Добавить документ
            </button>
          </div>
        </form>
      </div>

      <ul className="grid gap-3">
        {documents.map((doc) => (
          <li key={doc.id} className="border rounded p-4">
            {editId === doc.id ? (
              <form
                action={async (formData: FormData) => {
                  // Если новый файл не был выбран, используем текущий URL
                  const newFileUrl = formData.get("fileUrl");
                  if (!newFileUrl && editDocument?.fileUrl) {
                    formData.set("fileUrl", editDocument.fileUrl);
                  }
                  await updateDocument(doc.id, formData);
                  handleCancel();
                }}
                className="grid gap-3"
              >
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Название документа</label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="title"
                    defaultValue={editDocument?.title}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Файл (необязательно)</label>
                  <FileUploader name="fileUrl" accept=".pdf,.doc,.docx" />
                  {editDocument?.fileUrl && (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-500 mb-1">Текущий файл:</div>
                      <a
                        href={editDocument.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="18" x2="12" y2="12"/>
                          <line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                        Посмотреть документ
                      </a>
                    </div>
                  )}
                  <p className="text-sm text-gray-500">Поддерживаемые форматы: PDF, DOC, DOCX</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit" 
                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">{doc.title}</div>
                  <div className="flex items-center gap-4">
                    <a
                      href={doc.fileUrl}
                      download
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Скачать
                    </a>
                    <span className="text-sm text-gray-500">
                      {new Date(doc.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Изменить
                  </button>
                  <DeleteButton onDelete={() => deleteDocument(doc.id)} />
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
