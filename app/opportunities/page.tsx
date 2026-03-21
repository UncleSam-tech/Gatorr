"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DetailModal from '@/components/DetailModal';

export default function OpportunitiesBoard() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const [selectedSignal, setSelectedSignal] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute discovery search.');
      }
      
      setResults(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    if (results.length === 0) return;
    
    const headers = ['Domain', 'Signal Type', 'Summary', 'Original Text', 'Acquisition Score', 'URL'];
    const csvContent = [
      headers.join(','),
      ...results.map(r => 
        [
          `"${r.domain}"`, 
          `"${r.signalType}"`, 
          `"${r.summary.replace(/"/g, '""')}"`, 
          `"${r.snippet.replace(/"/g, '""')}"`, 
          r.acquisitionScore, 
          `"${r.sourceUrl}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gatorr_export_${query.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Grouping logic for Kanban Lanes based on Scores
  const readyOutreach = results.filter(r => r.acquisitionScore >= 80);
  const triageReview = results.filter(r => r.acquisitionScore >= 50 && r.acquisitionScore < 80);
  const newInbox = results.filter(r => r.acquisitionScore < 50);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-hidden flex flex-col h-screen w-full relative">
        <header className="mb-8 pb-6 border-b border-slate-200 flex justify-between items-end flex-shrink-0">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Opportunity Board</h1>
            <p className="text-slate-500 mt-2 text-lg">Review, qualify, and action high-intent customer signals.</p>
          </div>
          <button 
            onClick={exportCSV}
            disabled={results.length === 0}
            className="bg-white border-2 border-slate-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </header>

        <form onSubmit={handleSearch} className="mb-8 flex-shrink-0 flex items-center shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all max-w-2xl">
           <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for intents to populate the board (e.g. Jira issues)" 
              className="w-full text-base py-4 pl-6 pr-4 outline-none bg-transparent text-slate-900 placeholder-slate-400 font-medium"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 px-8 py-4 font-bold tracking-wide transition-colors h-full border-l border-slate-200"
            >
              {isLoading ? 'Crawling...' : 'Search'}
            </button>
        </form>

        {error && (
          <div className="max-w-2xl mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center flex-shrink-0">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar pb-4 relative">
          {!hasSearched && !isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
               </svg>
               <p className="text-xl font-medium text-slate-400">Search to discover and triage opportunities.</p>
             </div>
          ) : isLoading ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
               <p className="text-lg font-bold text-slate-600 animate-pulse">Running Gemini Pipeline...</p>
             </div>
          ) : (
            <div className="flex gap-6 h-full min-w-max pb-2">
              <Lane title="New Inbox" count={newInbox.length}>
                {newInbox.map((r, i) => (
                   <OpportunityCard 
                     key={i}
                     theme={r.competitor ? `Competitor ${r.competitor} Mention` : 'Uncategorized Need'} 
                     domain={r.domain}
                     topPain={r.summary} 
                     latestTime="Just now"
                     score={r.acquisitionScore}
                     onClick={() => setSelectedSignal(r)}
                     type={r.signalType}
                   />
                ))}
              </Lane>

              <Lane title="Triage & Review" count={triageReview.length}>
                {triageReview.map((r, i) => (
                   <OpportunityCard 
                     key={i}
                     theme={r.signalType === 'switching' ? 'Switching Intent Detected' : r.signalType} 
                     domain={r.domain}
                     topPain={r.summary} 
                     latestTime="Just now"
                     score={r.acquisitionScore}
                     onClick={() => setSelectedSignal(r)}
                     type={r.signalType}
                   />
                ))}
              </Lane>

              <Lane title="Ready for Outreach" count={readyOutreach.length}>
                 {readyOutreach.map((r, i) => (
                   <OpportunityCard 
                     key={i}
                     theme="High-Value Prospect" 
                     domain={r.domain}
                     topPain={r.summary} 
                     latestTime="Just now"
                     score={r.acquisitionScore}
                     onClick={() => setSelectedSignal(r)}
                     type={r.signalType}
                   />
                ))}
              </Lane>

              <Lane title="Archived / Noise" count={0}>
                <div className="text-sm text-slate-400 font-medium text-center p-6 bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 mt-2">
                  No noise detected
                </div>
              </Lane>
            </div>
          )}
        </div>
      </main>
      
      <DetailModal 
        isOpen={!!selectedSignal} 
        onClose={() => setSelectedSignal(null)} 
        data={selectedSignal} 
      />
    </div>
  );
}

function Lane({ title, count, children }: { title: string, count: number, children: React.ReactNode }) {
  return (
    <div className="w-[320px] h-full flex flex-col bg-slate-100/70 rounded-3xl p-4 border border-slate-200/60 shadow-[inset_0_2px_10px_-5px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-5 px-3 pt-2 shrink-0">
        <h3 className="font-extrabold text-slate-800 tracking-wide text-sm">{title}</h3>
        <span className="bg-slate-200/80 text-slate-700 text-xs font-black px-3 py-1 rounded-full">{count}</span>
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto pb-4 px-1 hide-scrollbar flex-1">
        {children}
      </div>
    </div>
  );
}

function OpportunityCard({ theme, domain, topPain, latestTime, score, onClick, type }: any) {
  return (
    <div onClick={onClick} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] uppercase font-black tracking-widest text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md max-w-[150px] truncate">{domain}</span>
        <span className="text-xs text-slate-400 font-bold whitespace-nowrap">{latestTime}</span>
      </div>
      <h4 className="font-bold text-slate-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-wide text-xs">{theme}</h4>
      <p className="text-sm text-slate-600 mb-5 line-clamp-3 italic font-medium">"{topPain}"</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="bg-slate-50 px-3 py-1.5 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
           {type}
        </div>
        <div className="text-right flex flex-col items-center">
            <span className="text-[8px] uppercase font-bold text-slate-400">Score</span>
            <span className={`text-base font-black leading-none ${score >= 80 ? 'text-rose-500' : 'text-amber-500'}`}>{score}</span>
        </div>
      </div>
    </div>
  );
}
