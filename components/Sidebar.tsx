import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col gap-8 font-sans border-r border-slate-800 shadow-xl z-10 relative">
      <div className="text-3xl font-black text-white tracking-widest flex items-center gap-3 mt-4 ml-2">
        <span className="text-blue-500 bg-blue-500/10 p-2 rounded-xl">🐊</span> GATORR
      </div>
      <nav className="flex flex-col gap-3 px-2">
        <Link href="/dashboard" className="px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all font-medium">✨ Dashboard</Link>
        <Link href="/opportunities" className="px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all font-medium">🎯 Opportunities</Link>
        <Link href="/signals" className="px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all font-medium">🔍 Signal Search</Link>
        <Link href="/clusters" className="px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all font-medium">🧩 Insight Clusters</Link>
        <Link href="/sources" className="px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white hover:shadow-md hover:-translate-y-0.5 transition-all font-medium">📡 Source Policy</Link>
      </nav>
      <div className="mt-auto px-4 pb-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Workspace</p>
          <p className="text-sm text-white font-medium">Default Startup</p>
        </div>
      </div>
    </aside>
  );
}
