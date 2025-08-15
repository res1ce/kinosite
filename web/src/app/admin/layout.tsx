import type { Metadata } from "next";

export const metadata: Metadata = { title: "Админка" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container mx-auto p-6 grid gap-6">
      <h1 className="text-2xl font-semibold text-center">Администрирование</h1>
      <div className="grid gap-6 reveal">
        {children}
      </div>
    </section>
  );
}


