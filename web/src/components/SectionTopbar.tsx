// components/admin/SectionTopbar.tsx
"use client";
export default function SectionTopbar({
  title, counters, actions,
}: {
  title: string;
  counters: { label: string; value: number }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#6E0A6B] text-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
        {actions}
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {counters.map((c, i) => (
          <div key={i} className="rounded-xl bg-white/5 px-4 py-3 border border-white/10">
            <div className="text-xs text-white/70">{c.label}</div>
            <div className="text-lg font-semibold">{c.value.toLocaleString("ru-RU")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
