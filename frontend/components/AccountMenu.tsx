'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabaseClient';

const AccountMenu = () => {
  const router = useRouter();
  const { user, profile, setUser, setProfile } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  // 🛡️ REPLICATING ADMINGUARD LOGIC
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Check the 'admins' table just like your Guard does
      const { data, error } = await supabaseClient
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (data && !error) {
        console.log("AccountMenu: ✅ Admin privileges confirmed via 'admins' table.");
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    verifyAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <label className="cursor-pointer group">
        <input type="checkbox" className="hidden peer" />
        
        {/* AVATAR: Red Glow for Admin */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 ${
          isAdmin 
            ? 'bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.6)]' 
            : 'bg-slate-800 border-white/10 hover:bg-red-600'
        }`}>
          {profile?.logo ? (
            <img src={profile.logo} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="text-white font-black text-xs uppercase">
              {isAdmin ? 'ADM' : (profile?.name ? profile.name[0] : 'U')}
            </div>
          )}
        </div>

        {/* Dropdown Window */}
        <div className="hidden peer-checked:block absolute top-full mt-3 w-64 
                        left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 
                        bg-[#0a0f1d] border border-slate-800 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          
          <div className={`p-4 border-b border-slate-800 ${isAdmin ? 'bg-red-950/40' : 'bg-slate-900/50'}`}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">
              {isAdmin ? 'SYSTEM AUTHORITY' : 'AUTHENTICATED USER'}
            </p>
            <h4 className={`font-black text-sm uppercase tracking-tighter ${isAdmin ? 'text-white' : 'text-slate-200'}`}>
              {isAdmin ? 'ADMINISTRATOR' : (profile?.name ? `${profile.name} ${profile.surname || ''}` : 'MEMBER')}
            </h4>
          </div>

          <ul className="p-2 space-y-1">
            {user ? (
              <>
                {isAdmin ? (
                  <li>
                    <Link 
                      href="/admin/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-900/40 transition-all mb-1"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link 
                      href="/account" 
                      className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                    >
                      ⚙️ Account Settings
                    </Link>
                  </li>
                )}
                <li className="pt-2 mt-2 border-t border-slate-800">
                  <button 
                    onClick={handleSignOut} 
                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="flex items-center px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all text-center justify-center">
                  Identify (Log In)
                </Link>
              </li>
            )}
          </ul>
        </div>
      </label>
    </div>
  );
};

export default AccountMenu;