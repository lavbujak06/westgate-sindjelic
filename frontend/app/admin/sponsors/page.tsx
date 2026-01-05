'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Globe, AlertCircle, X, Loader2, Link2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface Sponsor {
  id: number;
  name: string;
  image_url: string;
  website_url: string;
}

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', image_url: '', website_url: '' });
  const [loading, setLoading] = useState(true);

  const fetchSponsors = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/sponsors', { credentials: 'include' });
      const data = await res.json();
      setSponsors(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSponsors(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('Image too large (Max 1MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.image_url.trim() || !formData.website_url.trim()) {
      setError('Required: Name, Image, and Website Link.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/api/sponsors', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Sponsor Added');
        setFormData({ name: '', image_url: '', website_url: '' });
        setIsModalOpen(false);
        fetchSponsors();
      }
    } catch (err) { setError('Server connection error.'); }
  };

  const deleteSponsor = async (id: number) => {
    if (!confirm('Permanently remove this partner?')) return;
    const res = await fetch(`http://localhost:5001/api/sponsors/${id}`, { 
      method: 'DELETE',
      credentials: 'include' 
    });
    if (res.ok) {
      toast.success('Sponsor Removed');
      fetchSponsors();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-8 md:p-12 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase italic">Partner <span className="text-red-600">Intelligence</span></h1>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-1">Manage global club sponsors</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
          >
            <Plus size={14} /> Add New Partner
          </button>
        </div>

        {/* SPONSOR LIST */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Active Sponsors</h2>
            <div className="h-px flex-grow bg-slate-800/50"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" /></div>
          ) : sponsors.length > 0 ? (
            <div className="grid gap-3">
              {sponsors.map((s) => (
                <div key={s.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center p-3 border border-slate-800 group-hover:border-red-600/50 transition-colors">
                      <img src={s.image_url} alt={s.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-base uppercase italic">{s.name}</p>
                      <a href={s.website_url} target="_blank" className="text-[10px] text-red-500 uppercase tracking-widest flex items-center gap-1 hover:underline mt-1">
                        <Globe size={10} /> {s.website_url.replace('https://', '').replace('http://', '')}
                      </a>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteSponsor(s.id)}
                    className="text-[10px] font-black uppercase tracking-widest bg-red-900/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-900/30 transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
              <p className="text-slate-600 font-black uppercase text-xs tracking-widest">No active partners found</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-slate-900 w-full max-w-md rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">New <span className="text-red-600">Partner</span></h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase border border-red-500/20">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Company Name</label>
                <input 
                  type="text"
                  placeholder="e.g. ADIDAS" 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all text-sm font-bold uppercase italic" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Logo Asset</label>
                <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button type="button" onClick={() => setUploadMode('url')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${uploadMode === 'url' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>
                    <Link2 size={12}/> Image URL
                  </button>
                  <button type="button" onClick={() => setUploadMode('file')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${uploadMode === 'file' ? 'bg-red-600 text-white' : 'text-slate-500'}`}>
                    <Upload size={12}/> File Upload
                  </button>
                </div>

                {uploadMode === 'url' ? (
                  <input 
                    placeholder="https://link-to-logo.png" 
                    className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm outline-none focus:border-red-600 transition-all" 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                  />
                ) : (
                  <div className="relative w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-red-600 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                    {formData.image_url && formData.image_url.startsWith('data:') ? (
                      <div className="flex flex-col items-center gap-2">
                        <img src={formData.image_url} className="h-10 object-contain rounded" />
                        <span className="text-[9px] text-red-500 font-bold uppercase">Image Selected</span>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-2">
                        <Upload size={20} />
                        Choose Logo File
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Website</label>
                <input 
                  type="text"
                  placeholder="https://..." 
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all text-sm" 
                  value={formData.website_url} 
                  onChange={e => setFormData({...formData, website_url: e.target.value})} 
                />
              </div>

              <button className="w-full bg-red-600 text-white font-black uppercase py-4 rounded-xl hover:bg-black transition-all text-[11px] tracking-widest shadow-xl shadow-red-600/20">
                Deploy Partner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}