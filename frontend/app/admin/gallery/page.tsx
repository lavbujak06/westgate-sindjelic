'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Upload, Trash2, ImageIcon, Loader2, Plus } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  team_slug: string;
}

// TEAMS CONFIGURATION
const TEAMS = [
  { id: 'senior-men', label: 'Senior Men' },
  { id: 'reserve-men', label: 'Reserve Men' },
  { id: 'senior-women', label: 'Senior Women' },
  { id: 'reserve-women', label: 'Reserve Women' },
  { id: 'juniors', label: 'Juniors Section' },
];

export default function AdminGalleryPage() {
  return (
    <div className="p-8 bg-[#020617] min-h-screen text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-16 border-b border-slate-800 pb-8">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter">
            Media <span className="text-red-600">Vault</span>
          </h1>
          <p className="text-slate-500 text-xs font-mono mt-2 uppercase tracking-[0.4em]">
            Centralized Match Day Photography Management
          </p>
        </header>

        {/* Render each team section */}
        <div className="space-y-24">
          {TEAMS.map((team) => (
            <GallerySection key={team.id} team_slug={team.id} label={team.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT FOR EACH TEAM SECTION ---
function GallerySection({ team_slug, label }: { team_slug: string; label: string }) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/${team_slug}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(`Failed to load ${team_slug}`);
    } finally {
      setLoading(false);
    }
  }, [team_slug]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('team_slug', team_slug);

    setUploading(true);
    const uploadToast = toast.loading(`Uploading to ${label}...`);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success(`${label} gallery updated!`, { id: uploadToast });
      fetchImages();
    } catch (err) {
      toast.error("Upload failed", { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo permanently?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 border-l-4 border-red-600 pl-6">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-slate-100">{label}</h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{images.length} Photos Archived</p>
        </div>

        {/* Floating Upload Button */}
        <label className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20">
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
          <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
        </label>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="h-40 flex items-center justify-center bg-slate-900/20 rounded-3xl border border-slate-800">
          <Loader2 className="animate-spin text-slate-700" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
              {/* Removed 'grayscale' class to show normal colors */}
              <img src={img.url} alt="" className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110" />
              
              {/* Delete Overlay - Slightly more transparent so you can still see the color behind it */}
              <div className="absolute inset-0 bg-red-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="bg-white text-red-600 p-3 rounded-xl hover:scale-110 transition-transform shadow-2xl"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-40 flex flex-col items-center justify-center bg-slate-900/10 rounded-3xl border border-dashed border-slate-800 opacity-40">
          <ImageIcon size={32} className="mb-2 text-slate-600" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No media found for {label}</p>
        </div>
      )}
    </section>
  );
}