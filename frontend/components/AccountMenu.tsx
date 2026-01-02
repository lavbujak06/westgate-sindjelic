'use client';

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const AccountMenu = () => {
  const router = useRouter();
  const { user, profile, setUser, setProfile } = useUser();

  const handleSignOut = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setProfile(null);
      router.push('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <label className="cursor-pointer group">
        <input type="checkbox" className="hidden peer" />
        
        {/* Avatar Circle */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600/20 border border-white/20 hover:bg-red-600 transition-all duration-300">
          {profile?.logo ? (
            <img src={profile.logo} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : profile?.name ? (
            <div className="text-white font-bold">{profile.name[0].toUpperCase()}</div>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
        </div>

        {/* FIXED POPUP WINDOW: 
            - 'left-1/2 -translate-x-1/2' centers it on mobile 
            - 'md:left-auto md:right-0 md:translate-x-0' aligns it right on desktop
        */}
        <div className="hidden peer-checked:block absolute top-full mt-3 w-70 sm:w-64 
                        left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 
                        bg-white rounded-xl shadow-2xl border border-gray-200 z-100 
                        overflow-hidden text-black normal-case tracking-normal animate-in fade-in zoom-in-95 duration-200">
          
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Account</p>
            {profile ? (
              <div className="space-y-1">
                <p className="font-bold text-sm truncate">
                  {profile.name ? `${profile.name} ${profile.surname || ''}` : user?.email}
                </p>
                <p className="text-[10px] text-gray-500 italic">
                  Member since: {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm italic">Guest User</p>
            )}
          </div>

          <ul className="p-2 space-y-1">
            {!user && (
              <>
                <li>
                  <Link href="/login" className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold">
                    Log In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="flex items-center w-full px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 rounded-lg transition font-bold">
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                <li>
                  <Link href={profile?.is_admin ? "/admin/dashboard" : "/account"} 
                        className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 rounded-lg transition font-medium">
                    {profile?.is_admin ? "Admin Dashboard" : "Account Settings"}
                  </Link>
                </li>
                <li className="pt-2 mt-2 border-t border-gray-100">
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold">
                    Sign Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </label>
    </div>
  );
};

export default AccountMenu;