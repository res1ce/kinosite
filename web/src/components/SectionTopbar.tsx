"use client";
export default function SectionTopbar({
  title, counters, actions,
}: {
  title: string;
  counters: { label: string; value: number }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6E0A6B] via-purple-600 to-indigo-600 text-white p-8 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">{title}</h1>
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {counters.map((c, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm px-6 py-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-xs text-white/80 font-medium uppercase tracking-wide mb-1">{c.label}</div>
                <div className="text-2xl font-bold">{c.value.toLocaleString("ru-RU")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}