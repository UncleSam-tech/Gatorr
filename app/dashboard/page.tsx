"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DetailModal from '@/components/DetailModal';

export default function Dashboard() {
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

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto w-full h-screen">
        <header className="flex justify-between items-end mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Engine</h1>
            <p className="text-slate-500 mt-2 text-lg">Discover customer pain points and acquisition opportunities dynamically.</p>
          </div>
        </header>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-3xl mx-auto flex items-center shadow-[0_4px_20px_-5px_rgba(6,81,237,0.15)] rounded-2xl bg-white border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <div className="pl-6 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for competitors (e.g. salesforce alternatives or notion issues)" 
              className="w-full text-lg py-5 pl-4 pr-6 outline-none bg-transparent text-slate-900 placeholder-slate-300 font-medium"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-5 font-bold tracking-wide transition-colors h-full"
            >
              {isLoading ? 'Crawling...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <p className="text-xl font-medium text-slate-400">Run a search to actively crawl and extract intelligence.</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-bold text-slate-600 animate-pulse">Running Gemini AI & Crawling Engines...</p>
          </div>
        ) : (
          <section className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">High-Value Validation Signals</h2>
              <span className="text-slate-500 font-medium">{results.length} insights mapped</span>
            </div>
            
            {results.length === 0 ? (
              <p className="text-slate-500 text-center py-10">No actionable signals discovered in this run.</p>
            ) : (
              <div className="space-y-4">
                {results.map((r, i) => (
                  <SignalRow 
                    key={i}
                    pain={r.summary} 
                    intent={r.signalType} 
                    score={r.acquisitionScore} 
                    source={r.domain}
                    time="Just now"
                    onClick={() => setSelectedSignal(r)}
                  />
                ))}
              </div>
            )}
          </section>
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

function SignalRow({ pain, intent, score, source, time, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl hover:bg-white transition-all cursor-pointer border border-slate-100 hover:border-slate-300 hover:shadow-md group"
    >
      <div className="flex-1 pr-6">
        <p className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{pain}</p>
        <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">{intent}</p>
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
