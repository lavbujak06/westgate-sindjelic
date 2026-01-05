'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AccountSettings() {
  const { user, profile, loading, fetchUserProfile } = useUser(); // Added loading here
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Synchronize local state with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setSurname(profile.surname || '');
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('User not logged in');

    setUploading(true);

    try {
      let logoUrl = profile?.logo || null;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${user.id}/logo.${fileExt}`;

        const { error: uploadError } = await supabaseClient.storage
          .from('logos')
          .upload(filePath, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabaseClient.storage
          .from('logos')
          .getPublicUrl(filePath);

        logoUrl = data.publicUrl;
      }

      const { error } = await supabaseClient
        .from('profiles')
        .update({ 
          name, 
          surname, 
          logo: logoUrl 
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile();
      toast.success('Profile updated successfully!');
      router.push('/');
    } catch (err: any) {
      console.error("Full Error Object:", err);
      toast.error(err.message || 'Update failed');
    } finally {
      setUploading(false);
      setLogoFile(null);
    }
  };

  // UPDATED GUARD: Checks loading first, then profile.
  // This prevents the "Admin privileges confirmed" error because it waits 
  // for the context to finish its backend fetch.
  if (loading || !profile) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in duration-500">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">
            Profile <span className="text-red-600">Settings</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em] mt-2">
            Update Member Credentials
          </p>
        </div>

        <form onSubmit={handleSave} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
          
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative w-24 h-24 group">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-800 group-hover:border-red-600 transition-colors bg-slate-950 flex items-center justify-center">
                {logoFile || profile.logo ? (
                  <img
                    src={logoFile ? URL.createObjectURL(logoFile) : profile.logo}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-700 text-xs font-black uppercase tracking-widest">No Img</span>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity text-[10px] font-black uppercase tracking-widest text-white">
                Change
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">First Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-600 outline-none transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Last Name</label>
              <input
                type="text"
                placeholder="Enter Surname"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm focus:border-red-600 outline-none transition-all font-medium"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-red-600 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50 h-13 flex items-center justify-center"
          >
            {uploading ? <Loader /> : 'Save Changes'}
          </button>

          <button 
            type="button"
            onClick={() => router.push('/')}
            className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors pt-2"
          >
            Cancel and Exit
          </button>
        </form>
      </div>
    </div>
  );
}