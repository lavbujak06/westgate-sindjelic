'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
import toast from 'react-hot-toast';
import { ArrowLeft, Image as ImageIcon, Link2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function NewsEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');

  useEffect(() => {
    if (!isNew) {
      fetch(`http://localhost:5001/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setPublished(data.published);
          setImageUrl(data.image_url || '');
        });
    }
  }, [id, isNew]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabaseClient.storage.from('news-images').upload(fileName, file);
    
    if (error) { toast.error("Upload failed"); } 
    else {
      const { data: urlData } = supabaseClient.storage.from('news-images').getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      toast.success("Image Uploaded");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isNew ? 'http://localhost:5001/api/news' : `http://localhost:5001/api/news/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, published, image_url: imageUrl }),
      credentials: 'include',
    });

    if (res.ok) {
      toast.success(isNew ? 'Article Published' : 'Article Updated');
      router.push('/admin/news');
    } else {
      toast.error("Save failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white italic">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-8 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {isNew ? 'Initialize Article' : 'Update Content'}
          </h1>
          <Link href="/admin/news" className="text-slate-500 hover:text-white"><ArrowLeft size={20}/></Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Headline</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-600 outline-none" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual Asset</label>
            <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-2">
              <button type="button" onClick={() => setUploadMode('url')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-2 ${uploadMode === 'url' ? 'bg-red-600 text-white' : 'text-slate-500'}`}><Link2 size={12}/> URL</button>
              <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-2 ${uploadMode === 'file' ? 'bg-red-600 text-white' : 'text-slate-500'}`}><Upload size={12}/> Upload</button>
            </div>
            {uploadMode === 'file' ? (
              <div className="relative w-full aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden">
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-slate-700" size={32}/>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
              </div>
            ) : (
              <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none" />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Content Body</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm min-h-37.5 focus:border-red-600 outline-none resize-none" required />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-5 h-5 accent-red-600" />
            <span className="text-[10px] font-black uppercase text-slate-400">Published & Live</span>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <CreateButton type="submit" disabled={loading}>{loading ? 'Processing...' : 'Save Article'}</CreateButton>
          </div>
        </form>
      </div>
    </div>
  );
}