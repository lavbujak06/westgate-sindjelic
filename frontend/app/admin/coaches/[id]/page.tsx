'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';
import CreateButton from '@/components/CreateButton';
import toast from 'react-hot-toast';

export default function CoachEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('head_coach');
  const [teamSlug, setTeamSlug] = useState('senior-men');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`http://localhost:5001/api/coaches`)
        .then(res => res.json())
        .then(data => {
          const coach = data.find((c: any) => c.id === id);
          if (coach) {
            setName(coach.name);
            setRole(coach.role);
            setTeamSlug(coach.team_slug);
            setDisplayOrder(coach.display_order);
            setPreviewUrl(coach.image_url);
          }
        });
    }
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = previewUrl;

      // 1. Storage Logic (Same as your Account Settings)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `staff/${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
          .from('coach-photos')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabaseClient.storage.from('coach-photos').getPublicUrl(filePath);
        finalImageUrl = data.publicUrl;
      }

      // 2. Database Logic via Express Backend
      const url = isNew ? 'http://localhost:5001/api/coaches' : `http://localhost:5001/api/coaches/${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name, 
            role, 
            team_slug: teamSlug, 
            image_url: finalImageUrl, 
            display_order: Number(displayOrder) // Explicitly cast to Number
        }),
        credentials: 'include',
      });

      if (!res.ok) {
          // This helps you see the EXACT error message from your Express backend
          const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
          console.error("Detailed Backend Error:", errorData);
          throw new Error(errorData.error || 'Failed to save to database');
      }

      toast.success(isNew ? 'Coach Initialized' : 'Profile Updated');
      router.push('/admin/coaches');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {isNew ? 'Add New Staff' : 'Edit Staff Profile'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* IMAGE UPLOAD SECTION */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 group border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center overflow-hidden">
              {previewUrl || imageFile ? (
                <img src={imageFile ? URL.createObjectURL(imageFile) : previewUrl} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-slate-600 font-black uppercase">No Image</span>
              )}
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] font-black uppercase">
                Change <input type="file" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-600 outline-none" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Assigned Team</label>
                <select value={teamSlug} onChange={e => setTeamSlug(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none">
                  <option value="senior-men">Senior Men</option>
                  <option value="reserve-men">Reserve Men</option>
                  <option value="senior-women">Senior Women</option>
                  <option value="reserve-women">Reserve Women</option>
                  <option value="juniors">Juniors</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Staff Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm outline-none">
                  <option value="head_coach">Head Coach</option>
                  <option value="assistant_coach">Assistant Coach</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800">
            <CreateButton type="submit" disabled={loading}>{loading ? 'Processing...' : 'Save Member'}</CreateButton>
            <button type="button" onClick={() => router.push('/admin/coaches')} className="px-6 py-3 border border-slate-700 rounded-full text-[10px] font-black uppercase text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}