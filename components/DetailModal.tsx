"use client";

import React, { useEffect } from 'react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

export default function DetailModal({ isOpen, onClose, data }: DetailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      ></div>
      
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {data.domain?.charAt(0).toUpperCase() || 'W'}
            </span>
            <h3 className="text-xl font-bold text-slate-800">{data.domain || 'Source'}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Extracted Pain Point</h4>
            <p className="text-2xl font-bold text-slate-900 leading-snug">{data.summary || data.title}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Acquisition Score</span>
               <span className={`text-2xl font-black ${(data.acquisitionScore || 0) >= 80 ? 'text-rose-500' : 'text-amber-500'}`}>
                 {data.acquisitionScore || '-'}
               </span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Intent Score</span>
               <span className={`text-2xl font-black ${(data.intentScore || 0) >= 50 ? 'text-blue-600' : 'text-slate-600'}`}>
                 {data.intentScore || '-'}
               </span>
            </div>
             <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Pain Score</span>
               <span className="text-2xl font-black text-indigo-500">
                 {data.painScore || '-'}
               </span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Classification</span>
               <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                 {data.signalType || 'General'}
               </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">Original Context</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative">
              <span className="absolute text-6xl text-slate-200 opacity-50 font-serif leading-none -top-2 left-2">"</span>
              <p className="text-slate-700 italic relative z-10 pr-2 pl-4 leading-relaxed font-medium">
                {data.snippet || 'No snippet available.'}
              </p>
            </div>
          </div>
        </div>

        <footer className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            Close
          </button>
          
          <a shrink-0
            href={data.sourceUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            View Original Source
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}
