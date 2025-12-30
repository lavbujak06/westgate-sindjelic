'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient'; // 👈 Added import

interface UserContextType {
  user: any;
  profile: any;
  fetchUserProfile: () => Promise<void>;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const fetchUserProfile = async () => {
    try {
      // 1. First, check if Supabase Client has a local user
      const { data: { user: supabaseUser } } = await supabaseClient.auth.getUser();

      // 2. Then, fetch full profile data from your Backend
      const res = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        setProfile(null);
        return;
      }

      const data = await res.json();
      // Combine Supabase data with your custom backend data
      setUser(data.user || supabaseUser);
      setProfile(data.profile);

    } catch (err) {
      console.error('Session check failed:', err);
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, fetchUserProfile, setUser, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};