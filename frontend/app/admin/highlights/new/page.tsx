'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Video, Save, Youtube } from 'lucide-react';

export default function NewHighlightPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    youtube_id: '',
    published: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation to extract ID if user pastes full URL
    let finalId = formData.youtube_id;
    if (finalId.includes('v=')) {
      finalId = finalId.split('v=')[1].split('&')[0];
    } else if (finalId.includes('be/')) {
      finalId = finalId.split('be/')[1].split('?')[0];
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, youtube_id: finalId }),
        credentials: 'include',
      });

      if (res.ok) {
        toast.success('Highlight broadcasted successfully');
        router.push('/admin/highlights');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to create highlight');
      }
    } catch (error) {
      toast.error('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white italic">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/admin/highlights" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Producer</span>
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">New <span className="text-red-600">Highlight</span></h1>
            <p className="text-slate-500 text-[9px] font-mono uppercase tracking-[0.3em]">Entry Terminal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 border border-slate-800 p-10 rounded-[32px]">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Highlight Headline</label>
            <input 
              required
              type="text" 
              placeholder="E.G. VS CITY - MATCH HIGHLIGHTS"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-red-600 outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* YouTube ID Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">YouTube Video ID or URL</label>
            <div className="relative">
              <Youtube className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                required
                type="text" 
                placeholder="dQw4w9WgXcQ or full link"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm focus:border-red-600 outline-none transition-all"
                value={formData.youtube_id}
                onChange={(e) => setFormData({...formData, youtube_id: e.target.value})}
              />
            </div>
            <p className="text-[9px] text-slate-600 uppercase tracking-tight ml-1 italic">We'll automatically extract the ID if you paste the full link.</p>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center justify-between p-6 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${formData.published ? 'bg-red-600/20 text-red-600' : 'bg-slate-800 text-slate-500'}`}>
                <Video size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest">Publish Immediately</p>
                <p className="text-[9px] text-slate-500 uppercase">Make this live on the home page gallery</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setFormData({...formData, published: !formData.published})}
              className={`w-14 h-8 rounded-full transition-all relative ${formData.published ? 'bg-red-600' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (
              <>
                <Save size={18} />
                Confirm Entry
              </>
            )}
          </button>
        </form>

        {/* Preview Hint */}
        {formData.youtube_id && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center mb-4">Thumbnail Preview</p>
            <div className="aspect-video w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-800 bg-black">
               <img 
                 src={`https://img.youtube.com/vi/${formData.youtube_id.includes('v=') ? formData.youtube_id.split('v=')[1].split('&')[0] : formData.youtube_id}/maxresdefault.jpg`}
                 onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/020617/white?text=Invalid+ID")}
                 className="w-full h-full object-cover"
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}