'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

interface UserContextType {
  user: any;
  profile: any;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(user);

      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
