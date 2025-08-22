"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import DeleteButton from "@/components/DeleteButton";

interface PriceItem { id: string; name: string; description: string | null; updatedAt: string|Date; }

export default function PricesClient({
  priceItems, createPriceItem, updatePriceItem, deletePriceItem,
}: {
  priceItems: PriceItem[];
  createPriceItem: (fd: FormData) => Promise<void>;
  updatePriceItem: (id: string, fd: FormData) => Promise<void>;
  deletePriceItem: (id: string) => Promise<void>;
}) {
  const [q, setQ] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<PriceItem | null>(null);
  const filtered = useMemo(() => priceItems.filter(i => [i.name, i.description].join(" ").toLowerCase().includes(q.toLowerCase())), [priceItems, q]);

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 grid gap-4">
        <Toolbar onSearch={setQ} />
        <ul className="grid md:grid-cols-2 gap-4">
          {filtered.map((i) => (
            <li key={i.id} className="rounded-2xl border bg-white dark:bg-[#111] p-4 shadow-sm hover:shadow-xl transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold">{i.name}</div>
                  {i.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{i.description}</p>}
                  <div className="text-xs text-gray-500 mt-2">обновлено {new Date(i.updatedAt).toLocaleDateString("ru-RU")}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setEditId(i.id); setEditItem(i); }} className="px-3 py-1.5 rounded-md bg-[#6E0A6B]/10 text-[#6E0A6B] hover:bg-[#6E0A6B]/15 transition">Изм.</button>
                  <DeleteButton onDelete={() => deletePriceItem(i.id)} />
                </div>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="col-span-full rounded-xl border bg-white dark:bg-[#111] p-10 text-center text-gray-500">
              Ничего не найдено
            </li>
          )}
        </ul>
      </div>

      <Panel title={editId ? "Редактировать услугу" : "Добавить услугу"}>
        <form
          action={async (fd: FormData) => {
            if (editId) { await updatePriceItem(editId, fd); setEditId(null); setEditItem(null); }
            else { await createPriceItem(fd); }
          }}
          className="grid gap-4"
        >
          <Field label="Название">
            <input name="name" defaultValue={editItem?.name} required
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" />
          </Field>
          <Field label="Описание">
            <textarea name="description" rows={4} defaultValue={editItem?.description || ""}
              className="w-full rounded-lg border px-3 py-2 bg-white dark:bg_black/20 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-[#6E0A6B]/60" />
          </Field>
          <button className="px-4 py-2 rounded-lg bg-[#6E0A6B] text-white hover:brightness-110 active:scale-95 transition">
            {editId ? "Сохранить" : "Добавить"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setEditItem(null); }}
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
