import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto w-full h-screen">
        <header className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h1>
            <p className="text-slate-500 mt-2 text-lg">Customer acquisition opportunities discovered across the open web.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 hover:shadow-blue-600/40">
            + Manual Ingestion
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Signals" value="1,248" trend="+12% this week" />
          <StatCard title="High-Intent Opportunities" value="86" trend="+4 today" />
          <StatCard title="Top Competitor Keyword" value="ToolifyPro" trend="42 mentions" />
          <StatCard title="Active Clusters" value="12" trend="3 new themes" />
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">High-Value Validation Signals</h2>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium outline-none cursor-pointer">
              <option>Highest Score First</option>
              <option>Newest First</option>
            </select>
          </div>
          <div className="space-y-4">
            <SignalRow 
              pain="User hates current tool UX." 
              intent="Actively seeking alternatives." 
              score={85} 
              source="reddit.com/r/SaaS"
              time="2 hours ago"
            />
            <SignalRow 
              pain="Pricing is absolutely insane for the features." 
              intent="Will cancel next month." 
              score={92} 
              source="news.ycombinator.com"
              time="4 hours ago"
            />
            <SignalRow 
              pain="I wish someone built a tool that handles data sync automatically." 
              intent="Wish statement." 
              score={78} 
              source="twitter.com"
              time="1 day ago"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors transform hover:-translate-y-1 hover:shadow-md cursor-pointer group">
      <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 group-hover:text-blue-500 transition-colors">{title}</h3>
      <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-sm text-emerald-500 font-bold mt-3 bg-emerald-50 inline-block px-2 py-1 rounded-md">{trend}</p>
    </div>
  );
}

function SignalRow({ pain, intent, score, source, time }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-white transition-all cursor-pointer border border-slate-100 hover:border-slate-300 hover:shadow-md group">
      <div className="flex-1 pr-6">
        <p className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{pain}</p>
        <p className="text-sm text-slate-500 font-medium">{intent}</p>
      </div>
      <div className="flex flex-col items-center justify-center px-6 border-l border-r border-slate-200">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Acquisition</span>
        <span className={`text-2xl font-black ${score >= 80 ? 'text-rose-500' : 'text-amber-500'}`}>{score}</span>
      </div>
      <div className="text-right text-sm text-slate-400 font-medium min-w-[140px] pl-6 flex flex-col justify-center">
        <p className="text-slate-600 truncate">{source}</p>
        <p className="text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}
