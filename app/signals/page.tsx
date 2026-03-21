import Sidebar from '@/components/Sidebar';

export default function SignalSearch() {
  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto w-full h-screen">
        <header className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Signal Search</h1>
          <p className="text-slate-500 mt-2 text-lg">Filter, search, and export the raw data.</p>
        </header>

        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <input 
            type="text" 
            placeholder="Search keywords, competitors, or pain points..." 
            className="flex-1 min-w-[300px] bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 outline-none transition-all font-medium shadow-inner"
          />
          <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 font-bold outline-none cursor-pointer">
            <option>All Sources</option>
            <option>Reddit (Public)</option>
            <option>HackerNews</option>
            <option>Discourse</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3.5 font-bold outline-none cursor-pointer">
            <option>Any Intent</option>
            <option>High Intent (&gt;80)</option>
            <option>Medium Intent (&gt;50)</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5">
            Search
          </button>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
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
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-800 max-w-md truncate text-base">I'm so sick of paying $99/mo for features I don't use. Any good alternatives?</td>
                <td className="px-6 py-6"><span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">Switching</span></td>
                <td className="px-6 py-6"><span className="text-xl font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg">85</span></td>
                <td className="px-6 py-6 font-medium text-slate-500">reddit.com</td>
                <td className="px-8 py-6 text-right"><button className="text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Analyze</button></td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-800 max-w-md truncate text-base">How do I export my data from Toolify? Their UX is a nightmare.</td>
                <td className="px-6 py-6"><span className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">Complaint</span></td>
                <td className="px-6 py-6"><span className="text-xl font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg">62</span></td>
                <td className="px-6 py-6 font-medium text-slate-500">twitter.com</td>
                <td className="px-8 py-6 text-right"><button className="text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Analyze</button></td>
              </tr>
            </tbody>
          </table>
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-center">
            <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Load More Signals...</button>
          </div>
        </section>
      </main>
    </div>
  );
}
