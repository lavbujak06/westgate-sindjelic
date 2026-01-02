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
      // 1. Check Supabase first
      const { data: { user: supabaseUser } } = await supabaseClient.auth.getUser();

      // 🛡️ THE GUARD CLAUSE
      // If there is no Supabase user, STOP HERE. 
      // Don't call the backend, don't trigger a fetch error.
      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        return; 
      }

      // 2. Only if we have a user, we ask the backend for the extra profile info
      const res = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      // If the backend call fails (e.g., cookie expired), clear state
      if (!res.ok) {
        setUser(null);
        setProfile(null);
        return;
      }

      const data = await res.json();
      setUser(data.user || supabaseUser);
      setProfile(data.profile);

    } catch (err) {
      // This will now only trigger if the server is actually down 
      // AND you are supposedly logged in.
      console.warn('Session check handled:', err);
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