'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
      // No token manual extraction needed! 
      // credentials: 'include' tells the browser to send the cookies automatically.
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
      setUser(data.user);
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