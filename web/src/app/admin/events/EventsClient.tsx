"use client";
import { useMemo, useState } from "react";
import Toolbar from "@/components/Toolbar";
import Panel from "@/components/Panel";
import EventForm from "@/components/EventForm";
import DeleteButton from "@/components/DeleteButton";

interface Event {
  id: string; title: string; slug: string;
  shortDescription: string; content: string;
  coverImageUrl: string | null; galleryUrls: string[] | null;
  date: Date; location: string | null;
  createdAt: string | Date; updatedAt: string | Date;
}

export default function EventsClient({
  events, createEvent, updateEvent, deleteEvent,
}: {
  events: Event[];
  createEvent: (fd: FormData) => Promise<void>;
  updateEvent: (id: string, fd: FormData) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const filtered = useMemo(
    () => events.filter(e => [e.title, e.shortDescription, e.location, e.slug].join(" ").toLowerCase().includes(query.toLowerCase())),
    [events, query]
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 grid gap-4">
        <Toolbar onSearch={setQuery} right={
          <span className="text-sm text-gray-500">Найдено: {filtered.length}</span>
        } />

        {/* Сетка карточек новостей */}
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((e) => (
            <div key={e.id} className="group rounded-2xl border bg-white dark:bg-[#111] overflow-hidden shadow-sm hover:shadow-xl transition">
              {/* Cover */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                     style={{ backgroundImage: `url(${e.coverImageUrl || "/window.svg"})` }} />
                <span className="absolute top-3 left-3 px-2 py-1 rounded-md text-[11px] bg-[#6E0A6B] text-white shadow">
                  {new Date(e.date).toLocaleDateString("ru-RU")}
                </span>
              </div>
              {/* Content */}
              <div className="p-4 grid gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug hover:text-[#6E0A6B] transition line-clamp-2">
                    {e.title}
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => { setEditId(e.id); setEditEvent(e); }}
                      className="px-3 py-1.5 rounded-md bg-[#6E0A6B]/10 text-[#6E0A6B] hover:bg-[#6E0A6B]/15 transition">
                      Изм.
                    </button>
                    <DeleteButton onDelete={() => deleteEvent(e.id)} />
                  </div>
                </div>
                {e.shortDescription && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{e.shortDescription}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {e.location && <span>📍 {e.location}</span>}
                  <span className="truncate">/{e.slug}</span>
                  <span className="opacity-70">обновлено {new Date(e.updatedAt).toLocaleDateString("ru-RU")}</span>
                </div>
                {Array.isArray(e.galleryUrls) && e.galleryUrls.length > 0 && (
                  <div className="pt-2 flex gap-2 overflow-auto">
                    {e.galleryUrls.slice(0, 6).map((u, i) => (
                      <img key={i} src={u} alt="" className="h-12 w-12 rounded-md object-cover ring-1 ring-black/5" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border bg-white dark:bg-[#111] p-10 text-center text-gray-500">
              Ничего не найдено
            </div>
          )}
        </div>
      </div>

      {/* Правая панель */}
      <Panel title={editId ? "Редактировать новость" : "Добавить новость"}>
        <EventForm
          event={editEvent ?? undefined}
          onSubmit={async (fd) => {
            if (editId) { await updateEvent(editId, fd); setEditId(null); setEditEvent(null); }
            else { await createEvent(fd); }
          }}
          onCancel={editId ? () => { setEditId(null); setEditEvent(null); } : undefined}
        />
      </Panel>
    </div>
  );
}
