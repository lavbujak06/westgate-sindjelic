'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

const ADMIN_SESSION_DURATION = 45 * 60 * 1000; // 45 minutes

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

      const { data: adminData } = await supabaseClient
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();

      const isAdmin = !!adminData;

      // 🔐 Admin session validation (READ ONLY)
      if (isAdmin) {
        const adminLoginAt = sessionStorage.getItem('admin_login_at');

        // Only logout if the session EXISTS and is expired
        if (
          adminLoginAt &&
          Date.now() - Number(adminLoginAt) > ADMIN_SESSION_DURATION
        ) {
          await supabaseClient.auth.signOut();
          sessionStorage.removeItem('admin_login_at');
          setUser(null);
          setProfile(null);
          return;
        }
      }

      if (profileError || !profileData) {
        setProfile({
          id: user.id,
          name: isAdmin ? 'Admin' : 'User',
          surname: '',
          email: user.email,
          logo: null,
          created_at: user.created_at,
          is_admin: isAdmin,
        });
        return;
      }

      setProfile({
        ...profileData,
        is_admin: isAdmin,
      });

    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  // 🔐 Auth listener — this is where admin sessions START and END
  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: adminData } = await supabaseClient
            .from('admins')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (adminData) {
            sessionStorage.setItem(
              'admin_login_at',
              Date.now().toString()
            );
          }
        }

        if (event === 'SIGNED_OUT') {
          sessionStorage.removeItem('admin_login_at');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
