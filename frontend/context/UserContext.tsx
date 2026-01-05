'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

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

      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        return; 
      }

      // 2. Ask backend for profile info
      const res = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        // If backend rejects the session, wipe everything.
        setUser(null);
        setProfile(null);
        
        // Clean up the browser local storage to match the deleted cookies
        await supabaseClient.auth.signOut();
        return;
      }

      const data = await res.json();
      setUser(data.user || supabaseUser);
      setProfile(data.profile);

    } catch (err) {
      console.warn('Session check handled:', err);
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    // 🔄 ADDED: AUTH STATE LISTENER
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchUserProfile();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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