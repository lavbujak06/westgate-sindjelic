'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
import toast from 'react-hot-toast';
import { ArrowLeft, Image as ImageIcon, Link2, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function NewsEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  
  // Image states matching CoachEditor logic
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');

  useEffect(() => {
    if (!isNew) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setPublished(data.published);
          setPreviewUrl(data.image_url || '');
          // If the existing data has a URL, default to URL mode for editing
          if (data.image_url) setUploadMode('url');
        });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = previewUrl;

      // 1. Storage Logic (Mirrored from CoachEditorPage)
      if (uploadMode === 'file' && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
          .from('news-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabaseClient.storage.from('news-images').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      // 2. Database Logic
      const url = isNew ? `${process.env.NEXT_PUBLIC_API_URL}/api/news` : `${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          published, 
          image_url: finalImageUrl 
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(errorData.error || 'Failed to save article');
      }

      toast.success(isNew ? 'Article Published' : 'Article Updated');
      router.push('/admin/news');
    } catch (err: any) {
      toast.error(err.message);
      console.error("News Save Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white italic">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-8 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            {isNew ? 'Initialize Article' : 'Update Content'}
          </h1>
          <Link href="/admin/news" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20}/>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Headline */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Headline</label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-600 outline-none transition-all" 
              placeholder="Enter article title..."
              required 
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Visual Asset</label>
            
            <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 mb-4">
              <button 
                type="button" 
                onClick={() => setUploadMode('file')} 
                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-2 transition-all ${uploadMode === 'file' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Upload size={12}/> Local Upload
              </button>
              <button 
                type="button" 
                onClick={() => setUploadMode('url')} 
                className={`flex-1 py-2 text-[9px] font-black uppercase rounded-lg flex items-center justify-center gap-2 transition-all ${uploadMode === 'url' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Link2 size={12}/> Web Link
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div className="relative w-full aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden group hover:border-red-600/50 transition-all">
                {imageFile || previewUrl ? (
                  <>
                    <img 
                      src={imageFile ? URL.createObjectURL(imageFile) : previewUrl} 
                      className="w-full h-full object-cover" 
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[10px] font-black uppercase bg-white text-black px-4 py-2 rounded-full">Change Image</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="text-slate-700 mx-auto" size={40}/>
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Click to browse storage</p>
                  </div>
                )}
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                />
              </div>
            ) : (
              <input 
                value={previewUrl} 
                onChange={e => setPreviewUrl(e.target.value)} 
                placeholder="Paste image URL (https://...)" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none focus:border-red-600 transition-all" 
              />
            )}
          </div>

          {/* Content Body */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Content Body</label>
            <textarea 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm min-h-[150px] focus:border-red-600 outline-none resize-none transition-all italic not-italic" 
              placeholder="Write your article here..."
              required 
            />
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
            <input 
              type="checkbox" 
              checked={published} 
              onChange={e => setPublished(e.target.checked)} 
              className="w-5 h-5 accent-red-600 cursor-pointer" 
            />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Set as Published & Live</span>
          </div>

          {/* Submit Action */}
          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <CreateButton type="submit" disabled={loading}>
              {loading ? 'Processing Article...' : isNew ? 'Create Article' : 'Save Changes'}
            </CreateButton>
          </div>
        </form>
      </div>
    </div>
  );
}