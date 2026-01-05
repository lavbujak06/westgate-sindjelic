'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { LayoutGrid, Search, Plus, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function AdminNewsDashboard() {
  const [news, setNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async () => {
    const { data } = await supabaseClient.from('news').select('*').order('created_at', { ascending: false });
    setNews(data || []);
  };

  useEffect(() => { fetchNews(); }, []);

  const groupedNews = useMemo(() => {
    const filtered = news.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered.reduce((acc: any, item) => {
      const status = item.published ? 'Live Broadcasts' : 'Drafts';
      if (!acc[status]) acc[status] = [];
      acc[status].push(item);
      return acc;
    }, {});
  }, [news, searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this article?')) return;
    const res = await fetch(`http://localhost:5001/api/news/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      toast.success('Article removed');
      setNews(prev => prev.filter(n => n.id !== id));
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white italic">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">News <span className="text-red-600">Archive</span></h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Editorial Content Management</p>
          </div>
          <Link href="/admin/news/new" className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
            <Plus size={14}/> Create Entry
          </Link>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search headlines..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-red-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-12">
          {Object.entries(groupedNews).map(([status, items]: any) => (
            <div key={status}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{status}</h2>
                <div className="h-px flex-grow bg-slate-800/50"></div>
              </div>
              <div className="grid gap-3">
                {items.map((item: any) => (
                  <div key={item.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                        {item.image_url && <img src={item.image_url} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/news/${item.id}`} className="text-[9px] font-black uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700">Edit</Link>
                      <button onClick={() => handleDelete(item.id)} className="text-[9px] font-black uppercase tracking-widest bg-red-900/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/30"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}