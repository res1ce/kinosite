// documents DocumentsClient.tsx
"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import FileUploader from "@/components/FileUploader";
import DeleteButton from "@/components/DeleteButton";

interface Document { 
  id: string; 
  title: string; 
  fileUrl: string; 
  createdAt: string | Date; 
  updatedAt: string | Date; 
}

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

  const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return { icon: "M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z", color: "from-red-500 to-red-600" };
      case 'doc':
      case 'docx': return { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "from-blue-500 to-blue-600" };
      default: return { icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", color: "from-gray-500 to-gray-600" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Documents List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <Toolbar 
                onSearch={setQ} 
                right={
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Найдено: {filtered.length}</span>
                  </div>
                } 
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((document) => {
                const fileType = getFileType(document.fileUrl);
                return (
                  <div key={document.id} className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fileType.color} flex items-center justify-center flex-shrink-0`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fileType.icon} />
                            </svg>
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-orange-600 transition-colors truncate">
                            {document.title}
                          </h3>
                        </div>
                        
                        <div className="mb-3">
                          <a 
                            className="text-xs text-orange-600 dark:text-orange-400 hover:underline break-all font-medium" 
                            href={document.fileUrl} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Открыть файл
                          </a>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>обновлено {new Date(document.updatedAt).toLocaleDateString("ru-RU")}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <button 
                          onClick={() => { setEditId(document.id); setDoc(document); }} 
                          className="px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 transition-all duration-200 text-sm font-medium"
                        >
                          Изм.
                        </button>
                        <DeleteButton onDelete={() => deleteDocument(document.id)} />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filtered.length === 0 && (
                <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    Документы не найдены
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    Попробуйте изменить поисковый запрос или загрузите новый документ
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editId ? "Редактировать документ" : "Добавить документ"}
              </h2>
            </div>
            
            <form
              action={async (fd: FormData) => {
                if (editId) { 
                  if (!fd.get("fileUrl") && doc?.fileUrl) fd.set("fileUrl", doc.fileUrl); 
                  await updateDocument(editId, fd); 
                  setEditId(null); 
                  setDoc(null); 
                } else { 
                  await createDocument(fd); 
                }
              }}
              className="space-y-6"
            >
              <Field label="Название документа">
                <input 
                  name="title" 
                  required 
                  defaultValue={doc?.title}
                  placeholder="Введите название документа..."
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-900/50 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500" 
                />
              </Field>
              
              <Field label="Файл документа">
                <div className="space-y-3">
                  <FileUploader 
                    name="fileUrl" 
                    accept=".pdf,.doc,.docx" 
                    variant="amber" 
                  />
                  {doc?.fileUrl && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Текущий файл:</span>
                      </div>
                      <a 
                        className="text-amber-600 dark:text-amber-400 hover:underline mt-1 inline-block text-sm font-medium break-all" 
                        href={doc.fileUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.fileUrl.split('/').pop() || 'Открыть файл'}
                      </a>
                    </div>
                  )}
                </div>
              </Field>
              
              <div className="space-y-3">
                <button 
                  type="submit"
                  className="w-full group relative px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editId ? "M5 13l4 4L19 7" : "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"} />
                    </svg>
                    <span>{editId ? "Сохранить изменения" : "Загрузить документ"}</span>
                  </div>
                </button>
                
                {editId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditId(null); setDoc(null); }}
                    className="w-full px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    Отмена
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        {label}
      </label>
      {children}
    </div>
  );
}