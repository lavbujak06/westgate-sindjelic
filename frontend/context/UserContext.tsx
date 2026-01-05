'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface UserContextType {
  user: any;
  profile: any;
  loading: boolean; // Added to prevent race conditions
  fetchUserProfile: () => Promise<void>;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      // 1. Check Supabase first
      const { data: { user: supabaseUser } } = await supabaseClient.auth.getUser();

      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return; 
      }

      // 2. Ask backend for profile info
      const res = await fetch('http://localhost:5001/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        // Sign out fully if backend rejects session
        setUser(null);
        setProfile(null);
        await supabaseClient.auth.signOut();
        return;
      } else {
        // Your working fix: Keep the supabaseUser while waiting for JSON
        setUser(supabaseUser);
      }

      const data = await res.json();
      setUser(data.user || supabaseUser);
      setProfile(data.profile);

    } catch (err) {
      console.warn('Session check handled:', err);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
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
  }, [fetchUserProfile]);

  return (
    <UserContext.Provider value={{ user, profile, loading, fetchUserProfile, setUser, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};