'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { useUser } from '@/context/UserContext';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import '../globals.css';

export default function AccountSettings() {
  const { user, profile, fetchUserProfile } = useUser();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setSurname(profile.surname || '');
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setLogoFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!user) return toast.error('User not logged in');

    setUploading(true);

    try {
      let logoUrl = profile?.logo || null;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabaseClient.storage
          .from('logos')
          .upload(filePath, logoFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseClient.storage
          .from('logos')
          .getPublicUrl(filePath);

        logoUrl = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ name, surname, logo: logoUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await fetchUserProfile(); // refresh AccountMenu
      toast.success('Profile updated successfully!');
      router.push('/'); // redirect to homepage
    } catch (err: any) {
      console.error('Update failed:', err);
      toast.error('Update failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      setLogoFile(null);
    }
  };

  if (!profile) return <Loader />;

  return (
    <div className="account-settings">
      <h2>Account Settings</h2>

      <label>First Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Last Name</label>
      <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />

      <label>Profile Logo</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {profile.logo && !logoFile && (
        <img
          src={profile.logo}
          alt="Current logo"
          style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 5 }}
        />
      )}

      <button onClick={handleSave} disabled={uploading}>
        {uploading ? <Loader /> : 'Save Changes'}
      </button>
    </div>
  );
}