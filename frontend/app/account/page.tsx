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
        .update({ name, surname, logo: logoUrl })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile();
      toast.success('Profile updated successfully!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Update failed');
    } finally {
      setUploading(false);
      setLogoFile(null);
    }
  };

  if (!profile) return <Loader />;

  return (
    <div className="page-wrapper">
      <div className="form-wrapper">
        <form className="form" onSubmit={handleSave}>
          <p className="form-title">Account Settings</p>

          {/* IMAGE UPLOAD */}
          <div className="input-container">
            {!profile.logo && !logoFile ? (
              <label className="custum-file-upload">
                <div className="icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M10 1L3 8v12a3 3 0 003 3h1M10 1h8a3 3 0 013 3v5M10 1v7H3m13 7.5A2.5 2.5 0 1116.5 13 2.5 2.5 0 0119 15.5V17h1a2 2 0 010 4H13a2 2 0 010-4h1v-1.5A2.5 2.5 0 0116.5 13" />
                  </svg>
                </div>
                <div className="text">
                  <span>Click to upload image</span>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="avatar-preview">
                <img
                  src={logoFile ? URL.createObjectURL(logoFile) : profile.logo}
                  alt="Profile logo"
                />
                <label className="change-photo">
                  Change photo
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
            )}
          </div>

          {/* NAME */}
          <div className="input-container">
            <input
              type="text"
              placeholder="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* SURNAME */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Last name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <button type="submit" className="submit" disabled={uploading}>
            {uploading ? <Loader /> : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
