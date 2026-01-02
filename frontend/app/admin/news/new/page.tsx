'use client';
import { useState } from 'react';
import CreateButton from '@/components/CreateButton';
import Link from 'next/link';

export default function NewNewsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:5001/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, published }),
      credentials: 'include',
    });
    if (!res.ok) { setLoading(false); alert('Failed to create'); return; }
    window.location.href = '/admin/news';
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-8 border-b border-slate-800">
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
             <span className="w-1.5 h-6 bg-red-600"></span> Initialize Article
           </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-white">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Headlines</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-red-600 outline-none" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Full Content</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm min-h-[180px] focus:ring-1 focus:ring-red-600 outline-none resize-none" 
              required 
            />
          </div>
          <div className="flex items-center gap-4 py-2">
             <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="w-5 h-5 accent-red-600" />
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Ready for Broadcast</span>
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <CreateButton type="submit" disabled={loading}>{loading ? 'Deploying...' : 'Publish Entry'}</CreateButton>
            <Link href="/admin/news" className="px-6 py-3 border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-colors flex items-center">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}