import Sidebar from '@/components/Sidebar';

export default function ClustersView() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto w-full h-screen">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Insight Clusters</h1>
          <p className="text-slate-500 mt-2 text-lg">AI-grouped recurring themes, wishes, and pain points.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 mb-8">Top Growing Themes (7 Days)</h3>
            <div className="space-y-6">
              <ClusterBar theme="Pricing is too complex / Expensive" signals={42} max={50} color="bg-rose-500" />
              <ClusterBar theme="Need robust API access via GraphQL" signals={28} max={50} color="bg-blue-500" />
              <ClusterBar theme="Competitor Hubspot is down/laggy" signals={15} max={50} color="bg-amber-500" />
              <ClusterBar theme="No native mobile app available" signals={9} max={50} color="bg-indigo-500" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="text-9xl">🧩</span>
            </div>
            <div className="w-36 h-36 rounded-full border-8 border-slate-700/50 flex items-center justify-center mb-6 bg-slate-800 z-10 shadow-inner">
              <span className="text-5xl font-black text-blue-400">12</span>
            </div>
            <h3 className="text-2xl font-bold text-white z-10">Active Clusters</h3>
            <p className="text-slate-400 mt-3 font-medium z-10 leading-relaxed">Generated automatically from 1,248 public signals across the web.</p>
          </div>
        </section>

        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
           <h3 className="text-xl font-bold text-slate-800 mb-6">Cluster Analysis Detail</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-100 bg-slate-50 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-lg text-slate-800">Pricing is too complex</h4>
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded">High Urgency</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">Users are continuously complaining about the recent price hike from competitor X and confusing tier structures. This presents an opportunity to market a flat-rate alternative.</p>
                <button className="text-blue-600 text-sm font-bold hover:underline">View all 42 signals &rarr;</button>
              </div>

              <div className="border border-slate-100 bg-slate-50 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-lg text-slate-800">Need robust API access</h4>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">Feature Request</span>
                </div>
                <p className="text-sm text-slate-600 mb-4 line-clamp-3">Enterprise users are blocked by the rate limits and lack of GraphQL support in current market leaders. They are seeking migration paths.</p>
                <button className="text-blue-600 text-sm font-bold hover:underline">View all 28 signals &rarr;</button>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}

function ClusterBar({ theme, signals, max, color }: any) {
  const width = Math.round((signals / max) * 100);
  return (
    <div className="group cursor-default">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{theme}</span>
        <span className="text-sm font-black text-slate-400">{signals} mentions</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
        <div className={`${color} h-4 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}
