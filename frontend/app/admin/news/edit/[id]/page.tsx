'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CreateButton from '@/components/CreateButton';

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id;

  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(`http://localhost:5001/api/news/${newsId}`);
      const data = await res.json();
      setForm({ title: data.title, content: data.content });
    }
    fetchNews();
  }, [newsId]);

  async function handleUpdate() {
    const res = await fetch(`http://localhost:5001/api/news/${newsId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include',
    });
    if (res.ok) { router.push('/admin/news'); } else { alert("Update failed"); }
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-8 border-b border-slate-800">
           <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Edit Entry <span className="text-red-600 font-mono text-sm ml-2">#{newsId?.slice(0,5)}</span></h1>
        </div>
        <div className="p-8 space-y-6 text-white">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Revised Headline</label>
            <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 outline-none focus:ring-1 focus:ring-red-600 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">Revised Content</label>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 h-48 outline-none focus:ring-1 focus:ring-red-600 text-sm" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <CreateButton onClick={handleUpdate}>Save Changes</CreateButton>
            <button onClick={() => router.push('/admin/news')} className="px-6 py-3 border border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 transition-colors">Discard</button>
          </div>
        </div>
      </div>
    </div>
  );
}