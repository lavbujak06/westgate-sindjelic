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
  const [showDeleteButon, setShowDeleteButton] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Synchronize local state with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setSurname(profile.surname || '');
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'name') setName(value);
    if (field === 'surname') setSurname(value);
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
  };

  const handleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      if (!user) return toast.error('User not logged in');

      setUploading(true);

      try {
        let logoUrl = profile?.logo || null;

        // --- STEP 1: UPLOAD FILE TO STORAGE ---
        if (logoFile) {
          const fileExt = logoFile.name.split('.').pop();
          const filePath = `${user.id}/logo.${fileExt}`;

          const { error: uploadError } = await supabaseClient.storage
            .from('logos')
            .upload(filePath, logoFile, { upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabaseClient.storage.from('logos').getPublicUrl(filePath);
          logoUrl = data.publicUrl;
        }

        // --- STEP 2: GET THE JWT TOKEN ---
        const { data: { session } } = await supabaseClient.auth.getSession();
        const token = session?.access_token;

        if (!token) throw new Error("No authentication token found");

        // --- STEP 3: CALL EXPRESS BACKEND ---
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // This allows requireUser to work
          },
          body: JSON.stringify({ 
            name, 
            surname, 
            logo: logoUrl
          }),
        });

        // --- STEP 4: CHECK FOR ERRORS ---
        const result = await response.json();

        if (!response.ok) {
          const msg = result.error || 'Update failed';
          // Map Zod errors based on keywords in the message
          if (msg.toLowerCase().includes("name")) setErrors({ name: msg });
          else if (msg.toLowerCase().includes("surname")) setErrors({ surname: msg });
          else toast.error(msg);
          return;
        }

        // Finalize the UI update
        await fetchUserProfile();
        toast.success('Profile updated');
        router.push('/');

      } catch (err: any) {
        console.error("Update Error:", err);
        toast.error(err.message || 'Update failed');
      } finally {
        setUploading(false);
        setLogoFile(null);
      }
    };

  const handleDeleteAccount = async () => {
    setUploading(true);
    try {
      // Get token for Express requireUser middleware
      const { data: { session } } = await supabaseClient.auth.getSession();
      const token = session?.access_token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete account');
      }

      // Account deleted successfully on backend
      await supabaseClient.auth.signOut();
      toast.success('Account permanently deleted');
      router.push('/');
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.message || 'Delete failed');
      setShowDeleteButton(false); 
    } finally {
      setUploading(false);
    }
  };

  
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
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">First Name</label>
                {errors.name && <span className="text-[9px] font-bold text-red-600 uppercase italic animate-pulse">{errors.name}</span>}
              </div>
              <input
                type="text"
                placeholder="Enter Name"
                className={`w-full bg-slate-950 border ${errors.name ? 'border-red-600' : 'border-slate-800'} rounded-xl p-4 text-sm focus:border-red-600 outline-none transition-all font-medium`}
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Name</label>
                {errors.surname && <span className="text-[9px] font-bold text-red-600 uppercase italic animate-pulse">{errors.surname}</span>}
              </div>
              <input
                type="text"
                placeholder="Enter Surname"
                className={`w-full bg-slate-950 border ${errors.surname ? 'border-red-600' : 'border-slate-800'} rounded-xl p-4 text-sm focus:border-red-600 outline-none transition-all font-medium`}
                value={surname}
                onChange={(e) => handleInputChange('surname', e.target.value)}
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

          <div className="pt-6 border-t border-slate-800 mt-4">
            <button 
              type="button"
              onClick={() => setShowDeleteButton(true)}
              className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 transition-colors"
            >
              Delete Account Permanently
            </button>
          </div>

          <button 
            type="button"
            onClick={() => router.push('/')}
            className="w-full text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors pt-2"
          >
            Cancel and Exit
          </button>
        </form>
      </div>

      {/* CONFIRMATION MODAL */}
      
      {showDeleteButon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-600/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Warning</h2>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed uppercase font-mono tracking-widest">
              This action is irreversible. All your data will be purged from the system.
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={handleDeleteAccount}
                disabled={uploading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center"
              >
                {uploading ? <Loader /> : 'Confirm Deletion'}
              </button>
              <button
                onClick={() => setShowDeleteButton(false)}
                className="w-full bg-slate-800 text-slate-400 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}