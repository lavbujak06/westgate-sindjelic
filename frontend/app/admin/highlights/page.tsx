'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabaseClient } from '@/lib/supabaseClient';
import { Search, Plus, Video, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminHighlightsDashboard() {
  const [videos, setVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVideos = async () => {
    const { data } = await supabaseClient.from('highlights').select('*').order('created_at', { ascending: false });
    setVideos(data || []);
  };

  useEffect(() => { fetchVideos(); }, []);

  const groupedVideos = useMemo(() => {
    const filtered = videos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered.reduce((acc: any, item) => {
      const status = item.published ? 'Live Highlights' : 'Drafts / Hidden';
      if (!acc[status]) acc[status] = [];
      acc[status].push(item);
      return acc;
    }, {});
  }, [videos, searchQuery]);

  const handleTogglePublish = async (video: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/highlights/${video.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...video, published: !video.published }),
      credentials: 'include'
    });
    if (res.ok) {
      toast.success(video.published ? 'Hidden from site' : 'Published live');
      fetchVideos();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this highlight?')) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/highlights/${id}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) {
      toast.success('Highlight removed');
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white italic">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Video <span className="text-red-600">Center</span></h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Match Day Media Management</p>
          </div>
          <Link href="/admin/highlights/new" className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
            <Plus size={14}/> Add Highlight
          </Link>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search match titles..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-red-600 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-12">
          {Object.entries(groupedVideos).map(([status, items]: any) => (
            <div key={status}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{status}</h2>
                <div className="h-px flex-grow bg-slate-800/50"></div>
              </div>
              <div className="grid gap-3">
                {items.map((video: any) => (
                  <div key={video.id} className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 aspect-video rounded-lg bg-black flex items-center justify-center border border-slate-800 overflow-hidden">
                        <img src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`} className="w-full h-full object-cover opacity-60" />
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{video.title}</p>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">YT ID: {video.youtube_id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleTogglePublish(video)}
                        className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${video.published ? 'bg-green-900/20 text-green-500' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {video.published ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                        {video.published ? 'Live' : 'Draft'}
                      </button>
                      <button onClick={() => handleDelete(video.id)} className="bg-red-900/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/30"><Trash2 size={12}/></button>
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