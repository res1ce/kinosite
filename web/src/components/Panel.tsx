// components/admin/Panel.tsx — липкая правая панель «Создать/Редактировать»
export default function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="md:sticky md:top-24 rounded-2xl border bg-white dark:bg-[#111] p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </aside>
  );
}
