import Sidebar from '@/components/Sidebar';

export default function OpportunitiesBoard() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-x-auto h-screen w-full">
        <header className="mb-10 pb-6 border-b border-slate-200 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Opportunity Board</h1>
            <p className="text-slate-500 mt-2 text-lg">Review, qualify, and action high-intent customer signals.</p>
          </div>
          <button className="bg-white border-2 border-slate-200 hover:border-blue-500 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
            Export CSV
          </button>
        </header>

        <div className="flex gap-6 h-[calc(100vh-200px)] min-w-[1200px]">
          {/* Column 1: New Signals */}
          <Lane title="New Inbox" count={12}>
            <OpportunityCard 
              theme="Pricing Complaints - Competitor X" 
              signals={4} 
              topPain="Too expensive for our stage." 
              latestTime="2h ago"
              score={88}
            />
            <OpportunityCard 
              theme="Missing SSO Integration" 
              signals={2} 
              topPain="Need SAML to adopt." 
              latestTime="1d ago"
              score={75}
            />
          </Lane>

          {/* Column 2: Reviewing */}
          <Lane title="Triage & Review" count={5}>
            <OpportunityCard 
              theme="Mobile App Request" 
              signals={8} 
              topPain="Field team can't use the web app easily." 
              latestTime="3h ago"
              score={95}
            />
          </Lane>

          {/* Column 3: Qualified / Ready for Outreach */}
          <Lane title="Ready for Outreach" count={3}>
            <OpportunityCard 
              theme="Alternative to Toolify" 
              signals={15} 
              topPain="Toolify is getting too slow and buggy." 
              latestTime="10m ago"
              score={98}
            />
          </Lane>

          {/* Column 4: Archived */}
          <Lane title="Archived / Noise" count={142}>
            <div className="text-sm text-slate-400 font-medium text-center p-6 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
              Archived items hidden
            </div>
          </Lane>
        </div>
      </main>
    </div>
  );
}

function Lane({ title, count, children }: { title: string, count: number, children: React.ReactNode }) {
  return (
    <div className="w-[320px] min-w-[320px] flex flex-col bg-slate-100/70 rounded-3xl p-4 border border-slate-200/60 shadow-[inset_0_2px_10px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-5 px-3 pt-2">
        <h3 className="font-extrabold text-slate-800 tracking-wide text-sm">{title}</h3>
        <span className="bg-slate-200/80 text-slate-700 text-xs font-black px-3 py-1 rounded-full">{count}</span>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pb-4 px-1 hide-scrollbar">
        {children}
      </div>
    </div>
  );
}

function OpportunityCard({ theme, signals, topPain, latestTime, score }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all cursor-grab active:cursor-grabbing group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">Cluster Theme</span>
        <span className="text-xs text-slate-400 font-bold">{latestTime}</span>
      </div>
      <h4 className="font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors">{theme}</h4>
      <p className="text-sm text-slate-600 mb-5 line-clamp-2 italic font-medium">"{topPain}"</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-hidden">
          <div className="flex -space-x-2">
            {[...Array(Math.min(3, signals))].map((_, i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] text-slate-600 font-bold shadow-sm">{i + 1}</div>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-bold whitespace-nowrap hidden sm:inline-block">+{signals} Signals</span>
        </div>
        <div className="text-right flex flex-col items-center">
            <span className="text-[8px] uppercase font-bold text-slate-400">Score</span>
            <span className={`text-base font-black leading-none ${score >= 90 ? 'text-rose-500' : 'text-amber-500'}`}>{score}</span>
        </div>
      </div>
    </div>
  );
}
