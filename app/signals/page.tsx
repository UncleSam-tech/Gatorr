"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DetailModal from '@/components/DetailModal';

export default function SignalSearch() {
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
        <header className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Signal Search</h1>
          <p className="text-slate-500 mt-2 text-lg">Filter, search, and export the raw data.</p>
        </header>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Search keywords, competitors, or pain points..." 
            className="flex-1 min-w-[300px] bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition-all font-medium shadow-inner placeholder-slate-400"
          />
          <select disabled className="bg-slate-50 border border-slate-200 text-slate-400 rounded-xl p-3.5 font-bold outline-none cursor-not-allowed hidden sm:block">
            <option>All Sources</option>
          </select>
          <select disabled className="bg-slate-50 border border-slate-200 text-slate-400 rounded-xl p-3.5 font-bold outline-none cursor-not-allowed hidden sm:block">
            <option>Any Intent</option>
          </select>
          <button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {!hasSearched ? (
          <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 mb-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="text-xl font-medium text-slate-400">Search to populate the raw signal table.</p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-bold text-slate-600 animate-pulse">Running Gemini AI & Crawling Engines...</p>
          </div>
        ) : (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 font-black uppercase tracking-widest text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5">Original Text</th>
                  <th className="px-6 py-5">Intent Classification</th>
                  <th className="px-6 py-5">Acquisition Score</th>
                  <th className="px-6 py-5">Source</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-500 font-medium">No signals found for this query.</td>
                  </tr>
                ) : (
                  results.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 font-bold text-slate-800 max-w-md truncate text-base">{r.snippet}</td>
                      <td className="px-6 py-6">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {r.signalType}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-xl font-black px-3 py-1.5 rounded-lg ${r.acquisitionScore >= 80 ? 'text-rose-500 bg-rose-50' : 'text-amber-500 bg-amber-50'}`}>
                          {r.acquisitionScore}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-medium text-slate-500">{r.domain}</td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedSignal(r)}
                          className="text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="bg-slate-50 p-4 flex justify-between items-center text-sm font-bold text-slate-500">
              <span>{results.length} Signals Extracted</span>
            </div>
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
