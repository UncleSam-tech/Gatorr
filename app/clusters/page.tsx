"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DetailModal from '@/components/DetailModal';

export default function ClustersView() {
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

  // Dynamically bucket the insights into clusters
  const clusters = results.reduce((acc, signal) => {
    const key = signal.signalType || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(signal);
    return acc;
  }, {} as Record<string, any[]>);

  const clusterEntries = Object.entries(clusters).sort((a, b) => (b[1] as any[]).length - (a[1] as any[]).length);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto w-full h-screen relative">
        <header className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Insight Clusters</h1>
          <p className="text-slate-500 mt-2 text-lg">AI-grouped recurring themes, wishes, and pain points.</p>
        </header>

        <form onSubmit={handleSearch} className="mb-8 flex items-center shadow-sm rounded-2xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all max-w-2xl">
           <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search concepts to generate clusters (e.g. data syncing)" 
              className="w-full text-base py-4 pl-6 pr-4 outline-none bg-transparent text-slate-900 placeholder-slate-400 font-medium"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-600 px-8 py-4 font-bold tracking-wide transition-colors h-full border-l border-slate-200"
            >
              {isLoading ? 'Clustering...' : 'Search'}
            </button>
        </form>

        {error && (
          <div className="max-w-2xl mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!hasSearched && !isLoading ? (
             <div className="flex flex-col items-center justify-center pt-24 text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.284 8.284 0 0 0 3 2.48Z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
               </svg>
               <p className="text-xl font-medium text-slate-400">Search to cluster and analyze conceptual themes.</p>
             </div>
        ) : isLoading ? (
             <div className="flex flex-col items-center justify-center pt-24">
               <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
               <p className="text-lg font-bold text-slate-600 animate-pulse">Building Insight Clusters...</p>
             </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm md:col-span-2">
                <h3 className="text-xl font-bold text-slate-800 mb-8">Active Extracted Themes (Query: {query})</h3>
                {clusterEntries.length === 0 ? (
                  <p className="text-slate-500 text-sm">No themes could be mapped from the search results.</p>
                ) : (
                  <div className="space-y-6">
                    {clusterEntries.map(([theme, items], index) => (
                      <ClusterBar 
                        key={index} 
                        theme={theme.toUpperCase()} 
                        signals={(items as any[]).length} 
                        max={results.length || 1} 
                        color={index === 0 ? "bg-rose-500" : index === 1 ? "bg-blue-500" : index === 2 ? "bg-amber-500" : "bg-indigo-500"} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="text-9xl">🧩</span>
                </div>
                <div className="w-36 h-36 rounded-full border-8 border-slate-700/50 flex items-center justify-center mb-6 bg-slate-800 z-10 shadow-inner">
                  <span className="text-5xl font-black text-blue-400">{clusterEntries.length}</span>
                </div>
                <h3 className="text-2xl font-bold text-white z-10">Active Clusters</h3>
                <p className="text-slate-400 mt-3 font-medium z-10 leading-relaxed">Generated automatically from {results.length} raw signals across the web.</p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
               <h3 className="text-xl font-bold text-slate-800 mb-6">Top Signal Breakdown</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {results.slice(0, 4).map((r, i) => (
                    <div key={i} className="border border-slate-100 bg-slate-50 rounded-2xl p-6 relative group overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <h4 className="font-bold text-lg text-slate-800">{r.domain}</h4>
                        <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-bold px-2 py-1 rounded tracking-wider">{r.signalType}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3 relative z-10 italic">"{r.snippet}"</p>
                      <button 
                        onClick={() => setSelectedSignal(r)}
                        className="text-blue-600 text-sm font-bold hover:underline relative z-10"
                      >
                        Deep Dive Signal &rarr;
                      </button>
                    </div>
                 ))}
               </div>
            </section>
          </div>
        )}
      </main>

      <DetailModal 
        isOpen={!!selectedSignal} 
        onClose={() => setSelectedSignal(null)} 
        data={selectedSignal} 
      />
    </div>
  );
}

function ClusterBar({ theme, signals, max, color }: any) {
  const width = Math.max(5, Math.round((signals / max) * 100));
  return (
    <div className="group cursor-default">
      <div className="flex justify-between items-end mb-2 px-1">
        <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-wide text-xs">{theme}</span>
        <span className="text-sm font-black text-slate-400">{signals} mapped signals</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
        <div className={`${color} h-4 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
}
